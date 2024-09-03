"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_TEST_PACKAGE_ID = exports.SERVER_PACKAGE_ID = exports.INSTRUMENTATION_TARGET = exports.UiAutomator2Server = void 0;
const lodash_1 = __importDefault(require("lodash"));
const driver_1 = require("appium/driver");
const asyncbox_1 = require("asyncbox");
const appium_uiautomator2_server_1 = require("appium-uiautomator2-server");
const support_1 = require("appium/support");
const bluebird_1 = __importDefault(require("bluebird"));
const axios_1 = __importDefault(require("axios"));
const REQD_PARAMS = ['adb', 'tmpDir', 'host', 'systemPort', 'devicePort', 'disableWindowAnimation'];
const SERVER_LAUNCH_TIMEOUT = 30000;
const SERVER_INSTALL_RETRIES = 20;
const SERVICES_LAUNCH_TIMEOUT = 30000;
const SERVER_PACKAGE_ID = 'io.appium.uiautomator2.server';
exports.SERVER_PACKAGE_ID = SERVER_PACKAGE_ID;
const SERVER_TEST_PACKAGE_ID = `${SERVER_PACKAGE_ID}.test`;
exports.SERVER_TEST_PACKAGE_ID = SERVER_TEST_PACKAGE_ID;
const INSTRUMENTATION_TARGET = `${SERVER_TEST_PACKAGE_ID}/androidx.test.runner.AndroidJUnitRunner`;
exports.INSTRUMENTATION_TARGET = INSTRUMENTATION_TARGET;
class UIA2Proxy extends driver_1.JWProxy {
    async proxyCommand(url, method, body = null) {
        if (this.didInstrumentationExit) {
            throw new driver_1.errors.InvalidContextError(`'${method} ${url}' cannot be proxied to UiAutomator2 server because ` +
                'the instrumentation process is not running (probably crashed). ' +
                'Check the server log and/or the logcat output for more details');
        }
        return await super.proxyCommand(url, method, body);
    }
}
class UiAutomator2Server {
    constructor(log, opts = {}) {
        for (let req of REQD_PARAMS) {
            if (!opts || !support_1.util.hasValue(opts[req])) {
                throw new Error(`Option '${req}' is required!`);
            }
            this[req] = opts[req];
        }
        this.log = log;
        this.disableSuppressAccessibilityService = opts.disableSuppressAccessibilityService;
        const proxyOpts = {
            log,
            server: this.host,
            port: this.systemPort,
            keepAlive: true,
        };
        if (opts.readTimeout && opts.readTimeout > 0) {
            proxyOpts.timeout = opts.readTimeout;
        }
        this.jwproxy = new UIA2Proxy(proxyOpts);
        this.proxyReqRes = this.jwproxy.proxyReqRes.bind(this.jwproxy);
        this.proxyCommand = this.jwproxy.command.bind(this.jwproxy);
        this.jwproxy.didInstrumentationExit = false;
        this.instrumentationProcess = null;
    }
    /**
     * @param {string} appPath
     * @param {string} appId
     * @returns {Promise<{installState: import('appium-adb').InstallState, appPath: string; appId: string}>}
     */
    async prepareServerPackage(appPath, appId) {
        const resultInfo = {
            installState: this.adb.APP_INSTALL_STATE.NOT_INSTALLED,
            appPath,
            appId,
        };
        if (appId === SERVER_TEST_PACKAGE_ID && await this.adb.isAppInstalled(appId)) {
            // There is no point in getting the state for the test server,
            // since it does not contain any version info
            resultInfo.installState = this.adb.APP_INSTALL_STATE.SAME_VERSION_INSTALLED;
        }
        else if (appId === SERVER_PACKAGE_ID) {
            resultInfo.installState = await this.adb.getApplicationInstallState(resultInfo.appPath, appId);
        }
        return resultInfo;
    }
    /**
     * @typedef {Object} PackageInfo
     * @property {import('appium-adb/build/lib/tools/apk-utils').InstallState} installState
     * @property {string} appPath
     * @property {string} appId
     */
    /**
     * Checks if server components must be installed from the device under test
     * in scope of the current driver session.
     *
     * For example, if one of servers on the device under test was newer than servers current UIA2 driver wants to
     * use for the session, the UIA2 driver should uninstall the installed ones in order to avoid
     * version mismatch between the UIA2 drier and servers on the device under test.
     * Also, if the device under test has missing servers, current UIA2 driver should uninstall all
     * servers once in order to install proper servers freshly.
     *
     * @param {PackageInfo[]} packagesInfo
     * @returns {boolean} true if any of components is already installed and the other is not installed
     *                    or the installed one has a newer version.
     */
    shouldUninstallServerPackages(packagesInfo = []) {
        const isAnyComponentInstalled = packagesInfo.some(({ installState }) => installState !== this.adb.APP_INSTALL_STATE.NOT_INSTALLED);
        const isAnyComponentNotInstalledOrNewer = packagesInfo.some(({ installState }) => [
            this.adb.APP_INSTALL_STATE.NOT_INSTALLED,
            this.adb.APP_INSTALL_STATE.NEWER_VERSION_INSTALLED,
        ].includes(installState));
        return isAnyComponentInstalled && isAnyComponentNotInstalledOrNewer;
    }
    /**
     * Checks if server components should be installed on the device under test in scope of the current driver session.
     *
     * @param {PackageInfo[]} packagesInfo
     * @returns {boolean} true if any of components is not installed or older than currently installed in order to
     *                    install or upgrade the servers on the device under test.
     */
    shouldInstallServerPackages(packagesInfo = []) {
        return packagesInfo.some(({ installState }) => [
            this.adb.APP_INSTALL_STATE.NOT_INSTALLED,
            this.adb.APP_INSTALL_STATE.OLDER_VERSION_INSTALLED,
        ].includes(installState));
    }
    /**
     * Installs the apks on to the device or emulator.
     *
     * @param {number} installTimeout - Installation timeout
     */
    async installServerApk(installTimeout = SERVER_INSTALL_RETRIES * 1000) {
        const packagesInfo = await bluebird_1.default.all([
            {
                appPath: appium_uiautomator2_server_1.SERVER_APK_PATH,
                appId: SERVER_PACKAGE_ID,
            }, {
                appPath: appium_uiautomator2_server_1.TEST_APK_PATH,
                appId: SERVER_TEST_PACKAGE_ID,
            },
        ].map(({ appPath, appId }) => this.prepareServerPackage(appPath, appId)));
        this.log.debug(`Server packages status: ${JSON.stringify(packagesInfo)}`);
        const shouldUninstallServerPackages = this.shouldUninstallServerPackages(packagesInfo);
        // Install must always follow uninstall. Also, perform the install if
        // any of server packages is not installed or is outdated
        const shouldInstallServerPackages = shouldUninstallServerPackages || this.shouldInstallServerPackages(packagesInfo);
        this.log.info(`Server packages are ${shouldInstallServerPackages ? '' : 'not '}going to be (re)installed`);
        if (shouldInstallServerPackages && shouldUninstallServerPackages) {
            this.log.info('Full packages reinstall is going to be performed');
        }
        if (shouldUninstallServerPackages) {
            const silentUninstallPkg = async (pkgId) => {
                try {
                    await this.adb.uninstallApk(pkgId);
                }
                catch (err) {
                    this.log.info(`Cannot uninstall '${pkgId}': ${err.message}`);
                }
            };
            await bluebird_1.default.all(packagesInfo.map(({ appId }) => silentUninstallPkg(appId)));
        }
        if (shouldInstallServerPackages) {
            const installPkg = async (pkgPath) => {
                await this.adb.install(pkgPath, {
                    noIncremental: true,
                    replace: true,
                    timeout: installTimeout,
                    timeoutCapName: 'uiautomator2ServerInstallTimeout'
                });
            };
            await bluebird_1.default.all(packagesInfo.map(({ appPath }) => installPkg(appPath)));
        }
        await this.verifyServicesAvailability();
    }
    async verifyServicesAvailability() {
        this.log.debug(`Waiting up to ${SERVICES_LAUNCH_TIMEOUT}ms for services to be available`);
        let isPmServiceAvailable = false;
        let pmOutput = '';
        let pmError = null;
        try {
            await (0, asyncbox_1.waitForCondition)(async () => {
                if (!isPmServiceAvailable) {
                    pmError = null;
                    pmOutput = '';
                    try {
                        pmOutput = await this.adb.shell(['pm', 'list', 'instrumentation']);
                    }
                    catch (e) {
                        pmError = e;
                    }
                    if (pmOutput.includes('Could not access the Package Manager')) {
                        pmError = new Error(`Problem running Package Manager: ${pmOutput}`);
                        pmOutput = ''; // remove output, so it is not printed below
                    }
                    else if (pmOutput.includes(INSTRUMENTATION_TARGET)) {
                        pmOutput = ''; // remove output, so it is not printed below
                        this.log.debug(`Instrumentation target '${INSTRUMENTATION_TARGET}' is available`);
                        // eslint-disable-next-line require-atomic-updates
                        isPmServiceAvailable = true;
                    }
                    else if (!pmError) {
                        pmError = new Error('The instrumentation target is not listed by Package Manager');
                    }
                }
                return isPmServiceAvailable;
            }, {
                waitMs: SERVICES_LAUNCH_TIMEOUT,
                intervalMs: 1000,
            });
        }
        catch (err) {
            // @ts-ignore It is ok if the attribute does not exist
            this.log.error(`Unable to find instrumentation target '${INSTRUMENTATION_TARGET}': ${(pmError || {}).message}`);
            if (pmOutput) {
                this.log.debug('Available targets:');
                for (const line of pmOutput.split('\n')) {
                    this.log.debug(`    ${line.replace('instrumentation:', '')}`);
                }
            }
        }
    }
    async startSession(caps) {
        await this.cleanupAutomationLeftovers();
        if (caps.skipServerInstallation) {
            this.log.info(`'skipServerInstallation' is set. Attempting to use UIAutomator2 server from the device`);
        }
        else {
            this.log.info(`Starting UIAutomator2 server ${appium_uiautomator2_server_1.version}`);
            this.log.info(`Using UIAutomator2 server from '${appium_uiautomator2_server_1.SERVER_APK_PATH}' and test from '${appium_uiautomator2_server_1.TEST_APK_PATH}'`);
        }
        const timeout = caps.uiautomator2ServerLaunchTimeout || SERVER_LAUNCH_TIMEOUT;
        const timer = new support_1.timing.Timer().start();
        let retries = 0;
        const maxRetries = 2;
        const delayBetweenRetries = 3000;
        while (retries < maxRetries) {
            this.log.info(`Waiting up to ${timeout}ms for UiAutomator2 to be online...`);
            this.jwproxy.didInstrumentationExit = false;
            try {
                await this.stopInstrumentationProcess();
            }
            catch (ign) { }
            await this.startInstrumentationProcess();
            if (!this.jwproxy.didInstrumentationExit) {
                try {
                    await (0, asyncbox_1.waitForCondition)(async () => {
                        try {
                            await this.jwproxy.command('/status', 'GET');
                            return true;
                        }
                        catch (err) {
                            // short circuit to retry or fail fast
                            return this.jwproxy.didInstrumentationExit;
                        }
                    }, {
                        waitMs: timeout,
                        intervalMs: 1000,
                    });
                }
                catch (err) {
                    this.log.errorAndThrow(`The instrumentation process cannot be initialized within ${timeout}ms timeout. `
                        + 'Make sure the application under test does not crash and investigate the logcat output. '
                        + `You could also try to increase the value of 'uiautomator2ServerLaunchTimeout' capability`);
                }
            }
            if (!this.jwproxy.didInstrumentationExit) {
                break;
            }
            retries++;
            if (retries >= maxRetries) {
                this.log.errorAndThrow('The instrumentation process cannot be initialized. '
                    + 'Make sure the application under test does not crash and investigate the logcat output.');
            }
            this.log.warn(`The instrumentation process has been unexpectedly terminated. `
                + `Retrying UiAutomator2 startup (#${retries} of ${maxRetries - 1})`);
            await this.cleanupAutomationLeftovers(true);
            await bluebird_1.default.delay(delayBetweenRetries);
        }
        this.log.debug(`The initialization of the instrumentation process took `
            + `${timer.getDuration().asMilliSeconds.toFixed(0)}ms`);
        await this.jwproxy.command('/session', 'POST', {
            capabilities: {
                firstMatch: [caps],
                alwaysMatch: {},
            }
        });
    }
    async startInstrumentationProcess() {
        const cmd = ['am', 'instrument', '-w'];
        if (this.disableWindowAnimation) {
            cmd.push('--no-window-animation');
        }
        if (lodash_1.default.isBoolean(this.disableSuppressAccessibilityService)) {
            cmd.push('-e', 'DISABLE_SUPPRESS_ACCESSIBILITY_SERVICES', `${this.disableSuppressAccessibilityService}`);
        }
        // Disable Google analytics to prevent possible fatal exception
        cmd.push('-e', 'disableAnalytics', 'true');
        cmd.push(INSTRUMENTATION_TARGET);
        this.instrumentationProcess = this.adb.createSubProcess(['shell', ...cmd]);
        for (const streamName of ['stderr', 'stdout']) {
            this.instrumentationProcess.on(`line-${streamName}`, (line) => this.log.debug(`[Instrumentation] ${line}`));
        }
        this.instrumentationProcess.once('exit', (code, signal) => {
            this.log.debug(`[Instrumentation] The process has exited with code ${code}, signal ${signal}`);
            this.jwproxy.didInstrumentationExit = true;
        });
        await this.instrumentationProcess.start(0);
    }
    async stopInstrumentationProcess() {
        if (!this.instrumentationProcess) {
            return;
        }
        try {
            if (this.instrumentationProcess.isRunning) {
                await this.instrumentationProcess.stop();
            }
        }
        finally {
            this.instrumentationProcess.removeAllListeners();
            this.instrumentationProcess = null;
        }
    }
    async deleteSession() {
        this.log.debug('Deleting UiAutomator2 server session');
        // rely on jwproxy's intelligence to know what we're talking about and
        // delete the current session
        try {
            await this.jwproxy.command('/', 'DELETE');
        }
        catch (err) {
            this.log.warn(`Did not get confirmation UiAutomator2 deleteSession worked; ` +
                `Error was: ${err}`);
        }
        try {
            await this.stopInstrumentationProcess();
        }
        catch (err) {
            this.log.warn(`Could not stop the instrumentation process. Original error: ${err.message}`);
        }
    }
    async cleanupAutomationLeftovers(strictCleanup = false) {
        this.log.debug(`Performing ${strictCleanup ? 'strict' : 'shallow'} cleanup of automation leftovers`);
        const axiosTimeout = 500;
        const waitStop = async () => {
            // Wait for the process stop by sending a status request to the port.
            // We observed the process stop could be delayed, thus causing unexpected crashes
            // in the middle of the session preparation process. It caused an invalid session error response
            // by the uia2 server, but that was because the process stop's delay.
            const timeout = 3000;
            try {
                await (0, asyncbox_1.waitForCondition)(async () => {
                    try {
                        await (0, axios_1.default)({
                            url: `http://${this.host}:${this.systemPort}/status`,
                            timeout: axiosTimeout,
                        });
                    }
                    catch (err) {
                        return true;
                    }
                }, {
                    waitMs: timeout,
                    intervalMs: 100,
                });
            }
            catch (err) {
                this.log.warn(`The ${SERVER_TEST_PACKAGE_ID} process might fail to stop within ${timeout}ms timeout.`);
            }
        };
        try {
            const { value } = (await (0, axios_1.default)({
                url: `http://${this.host}:${this.systemPort}/sessions`,
                timeout: axiosTimeout,
            })).data;
            const activeSessionIds = value.map(({ id }) => id).filter(Boolean);
            if (activeSessionIds.length) {
                this.log.debug(`The following obsolete sessions are still running: ${JSON.stringify(activeSessionIds)}`);
                this.log.debug(`Cleaning up ${support_1.util.pluralize('obsolete session', activeSessionIds.length, true)}`);
                await bluebird_1.default.all(activeSessionIds
                    .map((id) => axios_1.default.delete(`http://${this.host}:${this.systemPort}/session/${id}`)));
                // Let all sessions to be properly terminated before continuing
                await bluebird_1.default.delay(1000);
            }
            else {
                this.log.debug('No obsolete sessions have been detected');
            }
        }
        catch (e) {
            this.log.debug(`No obsolete sessions have been detected (${e.message})`);
        }
        try {
            await bluebird_1.default.all([
                this.adb.forceStop(SERVER_PACKAGE_ID),
                this.adb.forceStop(SERVER_TEST_PACKAGE_ID)
            ]);
        }
        catch (ignore) { }
        if (strictCleanup) {
            // https://github.com/appium/appium/issues/10749
            try {
                await this.adb.killProcessesByName('uiautomator');
            }
            catch (ignore) { }
        }
        await waitStop();
    }
}
exports.UiAutomator2Server = UiAutomator2Server;
exports.default = UiAutomator2Server;
//# sourceMappingURL=uiautomator2.js.map