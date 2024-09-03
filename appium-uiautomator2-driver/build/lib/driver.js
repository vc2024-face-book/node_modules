"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidUiautomator2Driver = void 0;
const appium_adb_1 = require("appium-adb");
const appium_android_driver_1 = __importStar(require("appium-android-driver"));
const io_appium_settings_1 = require("io.appium.settings");
const driver_1 = require("appium/driver");
const support_1 = require("appium/support");
const asyncbox_1 = require("asyncbox");
const bluebird_1 = __importDefault(require("bluebird"));
const lodash_1 = __importDefault(require("lodash"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const portscanner_1 = require("portscanner");
const constraints_1 = __importDefault(require("./constraints"));
const extensions_1 = require("./extensions");
const method_map_1 = require("./method-map");
const helpers_1 = require("./helpers");
const uiautomator2_1 = require("./uiautomator2");
const actions_1 = require("./commands/actions");
const alert_1 = require("./commands/alert");
const app_management_1 = require("./commands/app-management");
const app_strings_1 = require("./commands/app-strings");
const battery_1 = require("./commands/battery");
const clipboard_1 = require("./commands/clipboard");
const element_1 = require("./commands/element");
const execute_1 = require("./commands/execute");
const find_1 = require("./commands/find");
const gestures_1 = require("./commands/gestures");
const keyboard_1 = require("./commands/keyboard");
const misc_1 = require("./commands/misc");
const navigation_1 = require("./commands/navigation");
const screenshot_1 = require("./commands/screenshot");
const viewport_1 = require("./commands/viewport");
// The range of ports we can use on the system for communicating to the
// UiAutomator2 HTTP server on the device
const DEVICE_PORT_RANGE = [8200, 8299];
// The guard is needed to avoid dynamic system port allocation conflicts for
// parallel driver sessions
const DEVICE_PORT_ALLOCATION_GUARD = support_1.util.getLockFileGuard(node_path_1.default.resolve(node_os_1.default.tmpdir(), 'uia2_device_port_guard'), { timeout: 25, tryRecovery: true });
// This is the port that UiAutomator2 listens to on the device. We will forward
// one of the ports above on the system to this port on the device.
const DEVICE_PORT = 6790;
// This is the port that the UiAutomator2 MJPEG server listens to on the device.
// We will forward one of the ports above on the system to this port on the
// device.
const MJPEG_SERVER_DEVICE_PORT = 7810;
const LOCALHOST_IP4 = '127.0.0.1';
// NO_PROXY contains the paths that we never want to proxy to UiAutomator2 server.
// TODO:  Add the list of paths that we never want to proxy to UiAutomator2 server.
// TODO: Need to segregate the paths better way using regular expressions wherever applicable.
// (Not segregating right away because more paths to be added in the NO_PROXY list)
const NO_PROXY = [
    ['DELETE', new RegExp('^/session/[^/]+/actions')],
    ['GET', new RegExp('^/session/(?!.*/)')],
    ['GET', new RegExp('^/session/[^/]+/alert_[^/]+')],
    ['GET', new RegExp('^/session/[^/]+/alert/[^/]+')],
    ['GET', new RegExp('^/session/[^/]+/appium/[^/]+/current_activity')],
    ['GET', new RegExp('^/session/[^/]+/appium/[^/]+/current_package')],
    ['GET', new RegExp('^/session/[^/]+/appium/app/[^/]+')],
    ['GET', new RegExp('^/session/[^/]+/appium/device/[^/]+')],
    ['GET', new RegExp('^/session/[^/]+/appium/settings')],
    ['GET', new RegExp('^/session/[^/]+/context')],
    ['GET', new RegExp('^/session/[^/]+/contexts')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/attribute')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/displayed')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/enabled')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/location_in_view')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/name')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/screenshot')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/selected')],
    ['GET', new RegExp('^/session/[^/]+/ime/[^/]+')],
    ['GET', new RegExp('^/session/[^/]+/location')],
    ['GET', new RegExp('^/session/[^/]+/network_connection')],
    ['GET', new RegExp('^/session/[^/]+/screenshot')],
    ['GET', new RegExp('^/session/[^/]+/timeouts')],
    ['GET', new RegExp('^/session/[^/]+/url')],
    ['POST', new RegExp('^/session/[^/]+/[^/]+_alert$')],
    ['POST', new RegExp('^/session/[^/]+/actions')],
    ['POST', new RegExp('^/session/[^/]+/alert/[^/]+')],
    ['POST', new RegExp('^/session/[^/]+/app/[^/]')],
    ['POST', new RegExp('^/session/[^/]+/appium/[^/]+/start_activity')],
    ['POST', new RegExp('^/session/[^/]+/appium/app/[^/]+')],
    ['POST', new RegExp('^/session/[^/]+/appium/compare_images')],
    ['POST', new RegExp('^/session/[^/]+/appium/device/(?!set_clipboard)[^/]+')],
    ['POST', new RegExp('^/session/[^/]+/appium/element/[^/]+/replace_value')],
    ['POST', new RegExp('^/session/[^/]+/appium/element/[^/]+/value')],
    ['POST', new RegExp('^/session/[^/]+/appium/getPerformanceData')],
    ['POST', new RegExp('^/session/[^/]+/appium/performanceData/types')],
    ['POST', new RegExp('^/session/[^/]+/appium/settings')],
    ['POST', new RegExp('^/session/[^/]+/appium/execute_driver')],
    ['POST', new RegExp('^/session/[^/]+/appium/start_recording_screen')],
    ['POST', new RegExp('^/session/[^/]+/appium/stop_recording_screen')],
    ['POST', new RegExp('^/session/[^/]+/appium/.*event')],
    ['POST', new RegExp('^/session/[^/]+/context')],
    ['POST', new RegExp('^/session/[^/]+/element')],
    ['POST', new RegExp('^/session/[^/]+/ime/[^/]+')],
    ['POST', new RegExp('^/session/[^/]+/keys')],
    ['POST', new RegExp('^/session/[^/]+/location')],
    ['POST', new RegExp('^/session/[^/]+/network_connection')],
    ['POST', new RegExp('^/session/[^/]+/timeouts')],
    ['POST', new RegExp('^/session/[^/]+/url')],
    // MJSONWP commands
    ['GET', new RegExp('^/session/[^/]+/log/types')],
    ['POST', new RegExp('^/session/[^/]+/execute')],
    ['POST', new RegExp('^/session/[^/]+/execute_async')],
    ['POST', new RegExp('^/session/[^/]+/log')],
    // W3C commands
    // For Selenium v4 (W3C does not have this route)
    ['GET', new RegExp('^/session/[^/]+/se/log/types')],
    ['GET', new RegExp('^/session/[^/]+/window/rect')],
    ['POST', new RegExp('^/session/[^/]+/execute/async')],
    ['POST', new RegExp('^/session/[^/]+/execute/sync')],
    // For Selenium v4 (W3C does not have this route)
    ['POST', new RegExp('^/session/[^/]+/se/log')],
];
// This is a set of methods and paths that we never want to proxy to Chromedriver.
const CHROME_NO_PROXY = [
    ['GET', new RegExp('^/session/[^/]+/appium')],
    ['GET', new RegExp('^/session/[^/]+/context')],
    ['GET', new RegExp('^/session/[^/]+/element/[^/]+/rect')],
    ['GET', new RegExp('^/session/[^/]+/orientation')],
    ['POST', new RegExp('^/session/[^/]+/appium')],
    ['POST', new RegExp('^/session/[^/]+/context')],
    ['POST', new RegExp('^/session/[^/]+/orientation')],
    // this is needed to make the mobile: commands working in web context
    ['POST', new RegExp('^/session/[^/]+/execute$')],
    ['POST', new RegExp('^/session/[^/]+/execute/sync')],
    // MJSONWP commands
    ['GET', new RegExp('^/session/[^/]+/log/types$')],
    ['POST', new RegExp('^/session/[^/]+/log$')],
    // W3C commands
    // For Selenium v4 (W3C does not have this route)
    ['GET', new RegExp('^/session/[^/]+/se/log/types$')],
    // For Selenium v4 (W3C does not have this route)
    ['POST', new RegExp('^/session/[^/]+/se/log$')],
];
const MEMOIZED_FUNCTIONS = ['getStatusBarHeight', 'getDevicePixelRatio'];
class AndroidUiautomator2Driver extends appium_android_driver_1.default {
    constructor(opts = {}, shouldValidateCaps = true) {
        // `shell` overwrites adb.shell, so remove
        // @ts-expect-error FIXME: what is this?
        delete opts.shell;
        super(opts, shouldValidateCaps);
        this.mobileGetActionHistory = actions_1.mobileGetActionHistory;
        this.mobileScheduleAction = actions_1.mobileScheduleAction;
        this.mobileUnscheduleAction = actions_1.mobileUnscheduleAction;
        this.performActions = actions_1.performActions;
        this.releaseActions = actions_1.releaseActions;
        this.getAlertText = alert_1.getAlertText;
        this.mobileAcceptAlert = alert_1.mobileAcceptAlert;
        this.mobileDismissAlert = alert_1.mobileDismissAlert;
        this.postAcceptAlert = alert_1.postAcceptAlert;
        this.postDismissAlert = alert_1.postDismissAlert;
        this.mobileInstallMultipleApks = app_management_1.mobileInstallMultipleApks;
        this.mobileBackgroundApp = app_management_1.mobileBackgroundApp;
        this.mobileGetAppStrings = app_strings_1.mobileGetAppStrings;
        this.mobileGetBatteryInfo = battery_1.mobileGetBatteryInfo;
        this.active = element_1.active;
        this.getAttribute = element_1.getAttribute;
        this.elementEnabled = element_1.elementEnabled;
        this.elementDisplayed = element_1.elementDisplayed;
        this.elementSelected = element_1.elementSelected;
        this.getName = element_1.getName;
        this.getLocation = element_1.getLocation;
        this.getSize = element_1.getSize;
        this.getElementRect = element_1.getElementRect;
        this.getElementScreenshot = element_1.getElementScreenshot;
        this.getText = element_1.getText;
        this.setValueImmediate = element_1.setValueImmediate;
        this.doSetElementValue = element_1.doSetElementValue;
        this.click = element_1.click;
        this.clear = element_1.clear;
        this.mobileReplaceElementValue = element_1.mobileReplaceElementValue;
        this.executeMobile = execute_1.executeMobile;
        this.mobileCommandsMapping = execute_1.mobileCommandsMapping;
        this.doFindElementOrEls = find_1.doFindElementOrEls;
        this.mobileClickGesture = gestures_1.mobileClickGesture;
        this.mobileDoubleClickGesture = gestures_1.mobileDoubleClickGesture;
        this.mobileDragGesture = gestures_1.mobileDragGesture;
        this.mobileFlingGesture = gestures_1.mobileFlingGesture;
        this.mobileLongClickGesture = gestures_1.mobileLongClickGesture;
        this.mobilePinchCloseGesture = gestures_1.mobilePinchCloseGesture;
        this.mobilePinchOpenGesture = gestures_1.mobilePinchOpenGesture;
        this.mobileScroll = gestures_1.mobileScroll;
        this.mobileScrollBackTo = gestures_1.mobileScrollBackTo;
        this.mobileScrollGesture = gestures_1.mobileScrollGesture;
        this.mobileSwipeGesture = gestures_1.mobileSwipeGesture;
        this.pressKeyCode = keyboard_1.pressKeyCode;
        this.longPressKeyCode = keyboard_1.longPressKeyCode;
        this.mobilePressKey = keyboard_1.mobilePressKey;
        this.mobileType = keyboard_1.mobileType;
        this.doSendKeys = keyboard_1.doSendKeys;
        this.keyevent = keyboard_1.keyevent;
        this.getPageSource = misc_1.getPageSource;
        this.getOrientation = misc_1.getOrientation;
        this.setOrientation = misc_1.setOrientation;
        this.openNotifications = misc_1.openNotifications;
        this.suspendChromedriverProxy = misc_1.suspendChromedriverProxy;
        this.mobileGetDeviceInfo = misc_1.mobileGetDeviceInfo;
        this.getClipboard = clipboard_1.getClipboard;
        this.mobileGetClipboard = clipboard_1.mobileGetClipboard;
        this.setClipboard = clipboard_1.setClipboard;
        this.mobileSetClipboard = clipboard_1.mobileSetClipboard;
        this.setUrl = navigation_1.setUrl;
        this.mobileDeepLink = navigation_1.mobileDeepLink;
        this.back = navigation_1.back;
        this.mobileScreenshots = screenshot_1.mobileScreenshots;
        this.mobileViewportScreenshot = screenshot_1.mobileViewportScreenshot;
        this.getScreenshot = screenshot_1.getScreenshot;
        this.getViewportScreenshot = screenshot_1.getViewportScreenshot;
        this.getStatusBarHeight = viewport_1.getStatusBarHeight;
        this.getDevicePixelRatio = viewport_1.getDevicePixelRatio;
        this.getDisplayDensity = viewport_1.getDisplayDensity;
        this.getViewPortRect = viewport_1.getViewPortRect;
        this.getWindowRect = viewport_1.getWindowRect;
        this.getWindowSize = viewport_1.getWindowSize;
        this.mobileViewPortRect = viewport_1.mobileViewPortRect;
        this.locatorStrategies = [
            'xpath',
            'id',
            'class name',
            'accessibility id',
            'css selector',
            '-android uiautomator',
        ];
        this.desiredCapConstraints = lodash_1.default.cloneDeep(constraints_1.default);
        this.jwpProxyActive = false;
        this.jwpProxyAvoid = NO_PROXY;
        this._originalIme = null;
        this.settings = new driver_1.DeviceSettings({ ignoreUnimportantViews: false, allowInvisibleElements: false }, this.onSettingsUpdate.bind(this));
        // handle webview mechanics from AndroidDriver
        this.sessionChromedrivers = {};
        this.caps = {};
        this.opts = opts;
        // memoize functions here, so that they are done on a per-instance basis
        for (const fn of MEMOIZED_FUNCTIONS) {
            this[fn] = lodash_1.default.memoize(this[fn]);
        }
    }
    validateDesiredCaps(caps) {
        return super.validateDesiredCaps(caps);
    }
    async createSession(w3cCaps1, w3cCaps2, w3cCaps3, driverData) {
        try {
            // TODO handle otherSessionData for multiple sessions
            const [sessionId, caps] = (await driver_1.BaseDriver.prototype.createSession.call(this, w3cCaps1, w3cCaps2, w3cCaps3, driverData));
            const startSessionOpts = {
                ...caps,
                platform: 'LINUX',
                webStorageEnabled: false,
                takesScreenshot: true,
                javascriptEnabled: true,
                databaseEnabled: false,
                networkConnectionEnabled: true,
                locationContextEnabled: false,
                warnings: {},
                desired: caps,
            };
            const defaultOpts = {
                fullReset: false,
                autoLaunch: true,
                adbPort: appium_adb_1.DEFAULT_ADB_PORT,
                androidInstallTimeout: 90000,
            };
            lodash_1.default.defaults(this.opts, defaultOpts);
            this.opts.adbPort = this.opts.adbPort || appium_adb_1.DEFAULT_ADB_PORT;
            // get device udid for this session
            const { udid, emPort } = await this.getDeviceInfoFromCaps();
            this.opts.udid = udid;
            // @ts-expect-error do not put random stuff on opts
            this.opts.emPort = emPort;
            // now that we know our java version and device info, we can create our
            // ADB instance
            this.adb = await this.createADB();
            if (this.isChromeSession) {
                this.log.info(`We're going to run a Chrome-based session`);
                const { pkg, activity: defaultActivity } = appium_android_driver_1.utils.getChromePkg(this.opts.browserName);
                let activity = defaultActivity;
                if (await this.adb.getApiLevel() >= 24) {
                    try {
                        activity = await this.adb.resolveLaunchableActivity(pkg);
                    }
                    catch (e) {
                        this.log.warn(`Using the default ${pkg} activity ${activity}. Original error: ${e.message}`);
                    }
                }
                this.opts.appPackage = this.caps.appPackage = pkg;
                this.opts.appActivity = this.caps.appActivity = activity;
                this.log.info(`Chrome-type package and activity are ${pkg} and ${activity}`);
            }
            if (this.opts.app) {
                // find and copy, or download and unzip an app url or path
                this.opts.app = await this.helpers.configureApp(this.opts.app, [
                    extensions_1.APK_EXTENSION,
                    extensions_1.APKS_EXTENSION,
                ]);
                await this.checkAppPresent();
            }
            else if (this.opts.appPackage) {
                // the app isn't an actual app file but rather something we want to
                // assume is on the device and just launch via the appPackage
                this.log.info(`Starting '${this.opts.appPackage}' directly on the device`);
            }
            else {
                this.log.info(`Neither 'app' nor 'appPackage' was set. Starting UiAutomator2 ` +
                    'without the target application');
            }
            const result = await this.startUiAutomator2Session(startSessionOpts);
            if (this.opts.mjpegScreenshotUrl) {
                this.log.info(`Starting MJPEG stream reading URL: '${this.opts.mjpegScreenshotUrl}'`);
                this.mjpegStream = new support_1.mjpeg.MJpegStream(this.opts.mjpegScreenshotUrl);
                await this.mjpegStream.start();
            }
            return [sessionId, result];
        }
        catch (e) {
            await this.deleteSession();
            throw e;
        }
    }
    async getDeviceDetails() {
        const [pixelRatio, statBarHeight, viewportRect, { apiVersion, platformVersion, manufacturer, model, realDisplaySize, displayDensity },] = await bluebird_1.default.all([
            this.getDevicePixelRatio(),
            this.getStatusBarHeight(),
            this.getViewPortRect(),
            this.mobileGetDeviceInfo(),
        ]);
        return {
            pixelRatio,
            statBarHeight,
            viewportRect,
            deviceApiLevel: lodash_1.default.parseInt(apiVersion),
            platformVersion,
            deviceManufacturer: manufacturer,
            deviceModel: model,
            deviceScreenSize: realDisplaySize,
            deviceScreenDensity: displayDensity,
        };
    }
    get driverData() {
        // TODO fill out resource info here
        return {};
    }
    async getSession() {
        const sessionData = await driver_1.BaseDriver.prototype.getSession.call(this);
        this.log.debug('Getting session details from server to mix in');
        const uia2Data = (await this.uiautomator2.jwproxy.command('/', 'GET', {}));
        return { ...sessionData, ...uia2Data };
    }
    async allocateSystemPort() {
        const forwardPort = async (localPort) => {
            this.log.debug(`Forwarding UiAutomator2 Server port ${DEVICE_PORT} to local port ${localPort}`);
            if ((await (0, portscanner_1.checkPortStatus)(localPort, LOCALHOST_IP4)) === 'open') {
                throw this.log.errorAndThrow(`UiAutomator2 Server cannot start because the local port #${localPort} is busy. ` +
                    `Make sure the port you provide via 'systemPort' capability is not occupied. ` +
                    `This situation might often be a result of an inaccurate sessions management, e.g. ` +
                    `old automation sessions on the same device must always be closed before starting new ones.`);
            }
            await this.adb.forwardPort(localPort, DEVICE_PORT);
        };
        if (this.opts.systemPort) {
            this.systemPort = this.opts.systemPort;
            return await forwardPort(this.systemPort);
        }
        await DEVICE_PORT_ALLOCATION_GUARD(async () => {
            const [startPort, endPort] = DEVICE_PORT_RANGE;
            try {
                this.systemPort = await (0, portscanner_1.findAPortNotInUse)(startPort, endPort);
            }
            catch (e) {
                throw this.log.errorAndThrow(`Cannot find any free port in range ${startPort}..${endPort}}. ` +
                    `Please set the available port number by providing the systemPort capability or ` +
                    `double check the processes that are locking ports within this range and terminate ` +
                    `these which are not needed anymore`);
            }
            await forwardPort(this.systemPort);
        });
    }
    async releaseSystemPort() {
        if (!this.systemPort || !this.adb) {
            return;
        }
        if (this.opts.systemPort) {
            // We assume if the systemPort is provided manually then it must be unique,
            // so there is no need for the explicit synchronization
            await this.adb.removePortForward(this.systemPort);
        }
        else {
            await DEVICE_PORT_ALLOCATION_GUARD(async () => await this.adb.removePortForward(this.systemPort));
        }
    }
    async allocateMjpegServerPort() {
        if (this.opts.mjpegServerPort) {
            this.log.debug(`MJPEG broadcasting requested, forwarding MJPEG server port ${MJPEG_SERVER_DEVICE_PORT} ` +
                `to local port ${this.opts.mjpegServerPort}`);
            await this.adb.forwardPort(this.opts.mjpegServerPort, MJPEG_SERVER_DEVICE_PORT);
        }
    }
    async releaseMjpegServerPort() {
        if (this.opts.mjpegServerPort) {
            await this.adb.removePortForward(this.opts.mjpegServerPort);
        }
    }
    async performSessionPreExecSetup() {
        const apiLevel = await this.adb.getApiLevel();
        if (apiLevel < 21) {
            throw this.log.errorAndThrow('UIAutomator2 is only supported since Android 5.0 (Lollipop). ' +
                'You could still use other supported backends in order to automate older Android versions.');
        }
        const preflightPromises = [];
        if (apiLevel >= 28) {
            // Android P
            preflightPromises.push((async () => {
                this.log.info('Relaxing hidden api policy');
                try {
                    await this.adb.setHiddenApiPolicy('1', !!this.opts.ignoreHiddenApiPolicyError);
                }
                catch (err) {
                    throw this.log.errorAndThrow('Hidden API policy (https://developer.android.com/guide/app-compatibility/restrictions-non-sdk-interfaces) cannot be enabled. ' +
                        'This might be happening because the device under test is not configured properly. ' +
                        'Please check https://github.com/appium/appium/issues/13802 for more details. ' +
                        'You could also set the "appium:ignoreHiddenApiPolicyError" capability to true in order to ' +
                        'ignore this error, which might later lead to unexpected crashes or behavior of ' +
                        `the automation server. Original error: ${err.message}`);
                }
            })());
        }
        if (support_1.util.hasValue(this.opts.gpsEnabled)) {
            preflightPromises.push((async () => {
                this.log.info(`Trying to ${this.opts.gpsEnabled ? 'enable' : 'disable'} gps location provider`);
                await this.adb.toggleGPSLocationProvider(Boolean(this.opts.gpsEnabled));
            })());
        }
        if (this.opts.hideKeyboard) {
            preflightPromises.push((async () => {
                this._originalIme = await this.adb.defaultIME();
            })());
        }
        let appInfo;
        preflightPromises.push((async () => {
            // get appPackage et al from manifest if necessary
            appInfo = await this.getLaunchInfo();
        })());
        // start settings app, set the language/locale, start logcat etc...
        preflightPromises.push(this.initDevice());
        await bluebird_1.default.all(preflightPromises);
        this.opts = { ...this.opts, ...(appInfo ?? {}) };
        return appInfo;
    }
    async performSessionExecution(capsWithSessionInfo) {
        await bluebird_1.default.all([
            // Prepare the device by forwarding the UiAutomator2 port
            // This call mutates this.systemPort if it is not set explicitly
            this.allocateSystemPort(),
            // Prepare the device by forwarding the UiAutomator2 MJPEG server port (if
            // applicable)
            this.allocateMjpegServerPort(),
        ]);
        const [uiautomator2,] = await bluebird_1.default.all([
            // set up the modified UiAutomator2 server etc
            this.initUiAutomator2Server(),
            (async () => {
                // Should be after installing io.appium.settings
                if (this.opts.disableWindowAnimation && await this.adb.getApiLevel() < 26) {
                    // API level 26 is Android 8.0.
                    // Granting android.permission.SET_ANIMATION_SCALE is necessary to handle animations under API level 26
                    // Read https://github.com/appium/appium/pull/11640#issuecomment-438260477
                    // `--no-window-animation` works over Android 8 to disable all of animations
                    if (await this.adb.isAnimationOn()) {
                        this.log.info('Disabling animation via io.appium.settings');
                        await this.settingsApp.setAnimationState(false);
                        this._wasWindowAnimationDisabled = true;
                    }
                    else {
                        this.log.info('Window animation is already disabled');
                    }
                }
            })(),
            // set up app under test
            // prepare our actual AUT, get it on the device, etc...
            this.initAUT(),
        ]);
        // launch UiAutomator2 and wait till its online and we have a session
        await uiautomator2.startSession(capsWithSessionInfo);
        // now that everything has started successfully, turn on proxying so all
        // subsequent session requests go straight to/from uiautomator2
        this.jwpProxyActive = true;
    }
    async performSessionPostExecSetup() {
        // Unlock the device after the session is started.
        if (!this.opts.skipUnlock) {
            // unlock the device to prepare it for testing
            await this.unlock();
        }
        else {
            this.log.debug(`'skipUnlock' capability set, so skipping device unlock`);
        }
        if (this.isChromeSession) {
            // start a chromedriver session
            await this.startChromeSession();
        }
        else if (this.opts.autoLaunch && this.opts.appPackage) {
            await this.ensureAppStarts();
        }
        // if the initial orientation is requested, set it
        if (support_1.util.hasValue(this.opts.orientation)) {
            this.log.debug(`Setting initial orientation to '${this.opts.orientation}'`);
            await this.setOrientation(this.opts.orientation);
        }
        // if we want to immediately get into a webview, set our context
        // appropriately
        if (this.opts.autoWebview) {
            const viewName = this.defaultWebviewName();
            const timeout = this.opts.autoWebviewTimeout || 2000;
            this.log.info(`Setting auto webview to context '${viewName}' with timeout ${timeout}ms`);
            await (0, asyncbox_1.retryInterval)(timeout / 500, 500, this.setContext.bind(this), viewName);
        }
    }
    async startUiAutomator2Session(caps) {
        const appInfo = await this.performSessionPreExecSetup();
        // set actual device name, udid, platform version, screen size, screen density, model and manufacturer details
        const sessionInfo = {
            deviceName: this.adb.curDeviceId,
            deviceUDID: this.opts.udid,
        };
        const capsWithSessionInfo = {
            ...caps,
            ...sessionInfo,
        };
        // Adding AUT package name in the capabilities if package name not exist in caps
        if (!capsWithSessionInfo.appPackage && appInfo) {
            capsWithSessionInfo.appPackage = appInfo.appPackage;
        }
        await this.performSessionExecution(capsWithSessionInfo);
        const deviceInfoPromise = (async () => {
            try {
                return await this.getDeviceDetails();
            }
            catch (e) {
                this.log.warn(`Cannot fetch device details. Original error: ${e.message}`);
                return {};
            }
        })();
        await this.performSessionPostExecSetup();
        return { ...capsWithSessionInfo, ...(await deviceInfoPromise) };
    }
    async initUiAutomator2Server() {
        // broken out for readability
        const uiautomator2Opts = {
            // @ts-expect-error FIXME: maybe `address` instead of `host`?
            host: this.opts.remoteAdbHost || this.opts.host || LOCALHOST_IP4,
            systemPort: this.systemPort,
            devicePort: DEVICE_PORT,
            adb: this.adb,
            apk: this.opts.app,
            tmpDir: this.opts.tmpDir,
            appPackage: this.opts.appPackage,
            appActivity: this.opts.appActivity,
            disableWindowAnimation: !!this.opts.disableWindowAnimation,
            disableSuppressAccessibilityService: this.opts.disableSuppressAccessibilityService,
            readTimeout: this.opts.uiautomator2ServerReadTimeout,
        };
        // now that we have package and activity, we can create an instance of
        // uiautomator2 with the appropriate options
        this.uiautomator2 = new uiautomator2_1.UiAutomator2Server(this.log, uiautomator2Opts);
        this.proxyReqRes = this.uiautomator2.proxyReqRes.bind(this.uiautomator2);
        this.proxyCommand = this.uiautomator2.proxyCommand.bind(this.uiautomator2);
        if (this.opts.skipServerInstallation) {
            this.log.info(`'skipServerInstallation' is set. Skipping UIAutomator2 server installation.`);
        }
        else {
            await this.uiautomator2.installServerApk(this.opts.uiautomator2ServerInstallTimeout);
            try {
                await this.adb.addToDeviceIdleWhitelist(io_appium_settings_1.SETTINGS_HELPER_ID, uiautomator2_1.SERVER_PACKAGE_ID, uiautomator2_1.SERVER_TEST_PACKAGE_ID);
            }
            catch (e) {
                const err = e;
                this.log.warn(`Cannot add server packages to the Doze whitelist. Original error: ` +
                    (err.stderr || err.message));
            }
        }
        return this.uiautomator2;
    }
    async initAUT() {
        // Uninstall any uninstallOtherPackages which were specified in caps
        if (this.opts.uninstallOtherPackages) {
            await this.uninstallOtherPackages(appium_android_driver_1.utils.parseArray(this.opts.uninstallOtherPackages), [io_appium_settings_1.SETTINGS_HELPER_ID, uiautomator2_1.SERVER_PACKAGE_ID, uiautomator2_1.SERVER_TEST_PACKAGE_ID]);
        }
        // Install any "otherApps" that were specified in caps
        if (this.opts.otherApps) {
            let otherApps;
            try {
                otherApps = appium_android_driver_1.utils.parseArray(this.opts.otherApps);
            }
            catch (e) {
                throw this.log.errorAndThrow(`Could not parse "otherApps" capability: ${e.message}`);
            }
            otherApps = await bluebird_1.default.all(otherApps.map((app) => this.helpers.configureApp(app, [extensions_1.APK_EXTENSION, extensions_1.APKS_EXTENSION])));
            await this.installOtherApks(otherApps);
        }
        if (this.opts.app) {
            if ((this.opts.noReset && !(await this.adb.isAppInstalled(this.opts.appPackage))) ||
                !this.opts.noReset) {
                if (!this.opts.noSign &&
                    !(await this.adb.checkApkCert(this.opts.app, this.opts.appPackage, {
                        requireDefaultCert: false,
                    }))) {
                    await (0, helpers_1.signApp)(this.adb, this.opts.app);
                }
                if (!this.opts.skipUninstall) {
                    await this.adb.uninstallApk(this.opts.appPackage);
                }
                await this.installAUT();
            }
            else {
                this.log.debug('noReset has been requested and the app is already installed. Doing nothing');
            }
        }
        else {
            if (this.opts.fullReset) {
                throw this.log.errorAndThrow('Full reset requires an app capability, use fastReset if app is not provided');
            }
            this.log.debug('No app capability. Assuming it is already on the device');
            if (this.opts.fastReset && this.opts.appPackage) {
                await this.resetAUT();
            }
        }
    }
    async ensureAppStarts() {
        // make sure we have an activity and package to wait for
        const appWaitPackage = this.opts.appWaitPackage || this.opts.appPackage;
        const appWaitActivity = this.opts.appWaitActivity || this.opts.appActivity;
        this.log.info(`Starting '${this.opts.appPackage}/${this.opts.appActivity} ` +
            `and waiting for '${appWaitPackage}/${appWaitActivity}'`);
        if (this.opts.noReset &&
            !this.opts.forceAppLaunch &&
            (await this.adb.processExists(this.opts.appPackage))) {
            this.log.info(`'${this.opts.appPackage}' is already running and noReset is enabled. ` +
                `Set forceAppLaunch capability to true if the app must be forcefully restarted on session startup.`);
            return;
        }
        await this.adb.startApp({
            pkg: this.opts.appPackage,
            activity: this.opts.appActivity,
            action: this.opts.intentAction || 'android.intent.action.MAIN',
            category: this.opts.intentCategory || 'android.intent.category.LAUNCHER',
            flags: this.opts.intentFlags || '0x10200000', // FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            waitPkg: this.opts.appWaitPackage,
            waitActivity: this.opts.appWaitActivity,
            waitForLaunch: this.opts.appWaitForLaunch,
            waitDuration: this.opts.appWaitDuration,
            optionalIntentArguments: this.opts.optionalIntentArguments,
            stopApp: this.opts.forceAppLaunch || !this.opts.dontStopAppOnReset,
            retry: true,
            user: this.opts.userProfile,
        });
    }
    async deleteSession() {
        this.log.debug('Deleting UiAutomator2 session');
        const screenRecordingStopTasks = [
            async () => {
                if (!lodash_1.default.isEmpty(this._screenRecordingProperties)) {
                    await this.stopRecordingScreen();
                }
            },
            async () => {
                if (await this.mobileIsMediaProjectionRecordingRunning()) {
                    await this.mobileStopMediaProjectionRecording();
                }
            },
            async () => {
                if (!lodash_1.default.isEmpty(this._screenStreamingProps)) {
                    await this.mobileStopScreenStreaming();
                }
            },
        ];
        try {
            await this.stopChromedriverProxies();
        }
        catch (err) {
            this.log.warn(`Unable to stop ChromeDriver proxies: ${err.message}`);
        }
        if (this.jwpProxyActive) {
            try {
                await this.uiautomator2.deleteSession();
            }
            catch (err) {
                this.log.warn(`Unable to proxy deleteSession to UiAutomator2: ${err.message}`);
            }
            this.jwpProxyActive = false;
        }
        if (this.adb) {
            await bluebird_1.default.all(screenRecordingStopTasks.map((task) => {
                (async () => {
                    try {
                        await task();
                    }
                    catch (ign) { }
                })();
            }));
            if (this.opts.appPackage) {
                if (!this.isChromeSession &&
                    ((!this.opts.dontStopAppOnReset && !this.opts.noReset) ||
                        (this.opts.noReset && this.opts.shouldTerminateApp))) {
                    try {
                        await this.adb.forceStop(this.opts.appPackage);
                    }
                    catch (err) {
                        this.log.warn(`Unable to force stop app: ${err.message}`);
                    }
                }
                if (this.opts.fullReset && !this.opts.skipUninstall) {
                    this.log.debug(`Capability 'fullReset' set to 'true', Uninstalling '${this.opts.appPackage}'`);
                    try {
                        await this.adb.uninstallApk(this.opts.appPackage);
                    }
                    catch (err) {
                        this.log.warn(`Unable to uninstall app: ${err.message}`);
                    }
                }
            }
            // This value can be true if test target device is <= 26
            if (this._wasWindowAnimationDisabled) {
                this.log.info('Restoring window animation state');
                await this.settingsApp.setAnimationState(true);
            }
            if (this._originalIme) {
                try {
                    await this.adb.setIME(this._originalIme);
                }
                catch (e) {
                    this.log.warn(`Cannot restore the original IME: ${e.message}`);
                }
            }
            try {
                await this.releaseSystemPort();
            }
            catch (error) {
                this.log.warn(`Unable to remove system port forward: ${error.message}`);
                // Ignore, this block will also be called when we fall in catch block
                // and before even port forward.
            }
            try {
                await this.releaseMjpegServerPort();
            }
            catch (error) {
                this.log.warn(`Unable to remove MJPEG server port forward: ${error.message}`);
                // Ignore, this block will also be called when we fall in catch block
                // and before even port forward.
            }
            if ((await this.adb.getApiLevel()) >= 28) {
                // Android P
                this.log.info('Restoring hidden api policy to the device default configuration');
                await this.adb.setDefaultHiddenApiPolicy(!!this.opts.ignoreHiddenApiPolicyError);
            }
        }
        if (this.mjpegStream) {
            this.log.info('Closing MJPEG stream');
            this.mjpegStream.stop();
        }
        await super.deleteSession();
    }
    async checkAppPresent() {
        this.log.debug('Checking whether app is actually present');
        if (!this.opts.app || !(await support_1.fs.exists(this.opts.app))) {
            throw this.log.errorAndThrow(`Could not find app apk at '${this.opts.app}'`);
        }
    }
    async onSettingsUpdate() {
        // intentionally do nothing here, since commands.updateSettings proxies
        // settings to the uiauto2 server already
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    proxyActive(sessionId) {
        // we always have an active proxy to the UiAutomator2 server
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canProxy(sessionId) {
        // we can always proxy to the uiautomator2 server
        return true;
    }
    getProxyAvoidList() {
        // we are maintaining two sets of NO_PROXY lists, one for chromedriver(CHROME_NO_PROXY)
        // and one for uiautomator2(NO_PROXY), based on current context will return related NO_PROXY list
        if (support_1.util.hasValue(this.chromedriver)) {
            // if the current context is webview(chromedriver), then return CHROME_NO_PROXY list
            this.jwpProxyAvoid = CHROME_NO_PROXY;
        }
        else {
            this.jwpProxyAvoid = NO_PROXY;
        }
        if (this.opts.nativeWebScreenshot) {
            this.jwpProxyAvoid = [
                ...this.jwpProxyAvoid,
                ['GET', new RegExp('^/session/[^/]+/screenshot')],
            ];
        }
        return this.jwpProxyAvoid;
    }
    async updateSettings(settings) {
        await this.settings.update(settings);
        await this.uiautomator2.jwproxy.command('/appium/settings', 'POST', { settings });
    }
    async getSettings() {
        const driverSettings = this.settings.getSettings();
        const serverSettings = (await this.uiautomator2.jwproxy.command('/appium/settings', 'GET'));
        return { ...driverSettings, ...serverSettings };
    }
}
exports.AndroidUiautomator2Driver = AndroidUiautomator2Driver;
AndroidUiautomator2Driver.newMethodMap = method_map_1.newMethodMap;
//# sourceMappingURL=driver.js.map