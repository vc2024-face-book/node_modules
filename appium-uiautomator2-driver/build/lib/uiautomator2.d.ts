export default UiAutomator2Server;
export class UiAutomator2Server {
    constructor(log: any, opts?: {});
    /** @type {string} */
    host: string;
    /** @type {number} */
    systemPort: number;
    /** @type {import('appium-adb').ADB} */
    adb: import("appium-adb").ADB;
    /** @type {boolean} */
    disableWindowAnimation: boolean;
    /** @type {boolean|undefined} */
    disableSuppressAccessibilityService: boolean | undefined;
    /** @type {import('teen_process').SubProcess|null} */
    instrumentationProcess: import("teen_process").SubProcess | null;
    log: any;
    jwproxy: UIA2Proxy;
    proxyReqRes: any;
    proxyCommand: any;
    /**
     * @param {string} appPath
     * @param {string} appId
     * @returns {Promise<{installState: import('appium-adb').InstallState, appPath: string; appId: string}>}
     */
    prepareServerPackage(appPath: string, appId: string): Promise<{
        installState: import("appium-adb").InstallState;
        appPath: string;
        appId: string;
    }>;
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
    shouldUninstallServerPackages(packagesInfo?: {
        installState: import("appium-adb/build/lib/tools/apk-utils").InstallState;
        appPath: string;
        appId: string;
    }[]): boolean;
    /**
     * Checks if server components should be installed on the device under test in scope of the current driver session.
     *
     * @param {PackageInfo[]} packagesInfo
     * @returns {boolean} true if any of components is not installed or older than currently installed in order to
     *                    install or upgrade the servers on the device under test.
     */
    shouldInstallServerPackages(packagesInfo?: {
        installState: import("appium-adb/build/lib/tools/apk-utils").InstallState;
        appPath: string;
        appId: string;
    }[]): boolean;
    /**
     * Installs the apks on to the device or emulator.
     *
     * @param {number} installTimeout - Installation timeout
     */
    installServerApk(installTimeout?: number): Promise<void>;
    verifyServicesAvailability(): Promise<void>;
    startSession(caps: any): Promise<void>;
    startInstrumentationProcess(): Promise<void>;
    stopInstrumentationProcess(): Promise<void>;
    deleteSession(): Promise<void>;
    cleanupAutomationLeftovers(strictCleanup?: boolean): Promise<void>;
}
export const INSTRUMENTATION_TARGET: "io.appium.uiautomator2.server.test/androidx.test.runner.AndroidJUnitRunner";
export const SERVER_PACKAGE_ID: "io.appium.uiautomator2.server";
export const SERVER_TEST_PACKAGE_ID: "io.appium.uiautomator2.server.test";
declare class UIA2Proxy extends JWProxy {
    /** @type {boolean} */
    didInstrumentationExit: boolean;
    proxyCommand(url: any, method: any, body?: null): Promise<any>;
}
import { JWProxy } from 'appium/driver';
//# sourceMappingURL=uiautomator2.d.ts.map