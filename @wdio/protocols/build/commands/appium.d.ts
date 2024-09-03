import type { Context, StringsReturn, SettingsReturn, ProtocolCommandResponse } from '../types.js';
export default interface AppiumCommands {
    /**
     * Appium Protocol Command
     *
     * No description available, please see reference link.
     * @ref https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#webviews-and-other-contexts
     *
     */
    getContext(): Promise<Context>;
    /**
     * Appium Protocol Command
     *
     * No description available, please see reference link.
     * @ref https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#webviews-and-other-contexts
     *
     */
    switchContext(name: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * No description available, please see reference link.
     * @ref https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#webviews-and-other-contexts
     *
     */
    getContexts(): Promise<Context[]>;
    /**
     * Appium Protocol Command
     *
     * Perform a shake action on the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/interactions/shake/
     *
     */
    shake(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Lock the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/interactions/lock/
     *
     */
    lock(seconds?: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Unlock the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/interactions/unlock/
     *
     */
    unlock(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Check whether the device is locked or not.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/interactions/is-locked/
     *
     */
    isLocked(): Promise<boolean>;
    /**
     * Appium Protocol Command
     *
     * Start recording the screen.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/recording-screen/start-recording-screen/
     *
     */
    startRecordingScreen(options?: object): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Stop recording screen
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/recording-screen/stop-recording-screen/
     *
     */
    stopRecordingScreen(remotePath?: string, username?: string, password?: string, method?: string): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Returns the information types of the system state which is supported to read as like cpu, memory, network traffic, and battery.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/performance-data/performance-data-types/
     *
     */
    getPerformanceDataTypes(): Promise<string[]>;
    /**
     * Appium Protocol Command
     *
     * Returns the information of the system state which is supported to read as like cpu, memory, network traffic, and battery.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/performance-data/get-performance-data/
     *
     */
    getPerformanceData(packageName: string, dataType: string, dataReadTimeout?: number): Promise<string[]>;
    /**
     * Appium Protocol Command
     *
     * Press a particular key on the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/keys/press-keycode/
     *
     */
    pressKeyCode(keycode: number, metastate?: number, flags?: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Press and hold a particular key code on the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/keys/long-press-keycode/
     *
     */
    longPressKeyCode(keycode: number, metastate?: number, flags?: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Send a key code to the device.
     * @ref https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     *
     */
    sendKeyEvent(keycode: string, metastate?: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Rotate the device in three dimensions.
     * @ref https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md#device-rotation
     *
     */
    rotateDevice(x: number, y: number, z: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Get the name of the current Android activity.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/activity/current-activity/
     *
     */
    getCurrentActivity(): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Get the name of the current Android package.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/activity/current-package/
     *
     */
    getCurrentPackage(): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Install the given app onto the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/install-app/
     *
     */
    installApp(appPath: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Activate the given app onto the device
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/activate-app/
     *
     */
    activateApp(appId: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Remove an app from the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/remove-app/
     *
     */
    removeApp(appId: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Terminate the given app on the device
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/terminate-app/
     *
     */
    terminateApp(appId: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Check whether the specified app is installed on the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/is-app-installed/
     *
     */
    isAppInstalled(appId: string): Promise<boolean>;
    /**
     * Appium Protocol Command
     *
     * Get the given app status on the device
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/app-state/
     *
     */
    queryAppState(appId: string): Promise<number>;
    /**
     * Appium Protocol Command
     *
     * Hide soft keyboard.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/keys/hide-keyboard/
     *
     */
    hideKeyboard(strategy?: string, key?: string, keyCode?: string, keyName?: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Whether or not the soft keyboard is shown.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/keys/is-keyboard-shown/
     *
     */
    isKeyboardShown(): Promise<boolean>;
    /**
     * Appium Protocol Command
     *
     * Place a file onto the device in a particular place.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/files/push-file/
     *
     */
    pushFile(path: string, data: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Retrieve a file from the device's file system.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/files/pull-file/
     *
     */
    pullFile(path: string): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Retrieve a folder from the device's file system.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/files/pull-folder/
     *
     */
    pullFolder(path: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Toggle airplane mode on device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/toggle-airplane-mode/
     *
     */
    toggleAirplaneMode(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Switch the state of data service.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/toggle-data/
     *
     */
    toggleData(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Switch the state of the wifi service.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/toggle-wifi/
     *
     */
    toggleWiFi(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Switch the state of the location service.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/toggle-location-services/
     *
     */
    toggleLocationServices(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Set network speed (Emulator only)
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/network-speed/
     *
     */
    toggleNetworkSpeed(netspeed: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Open Android notifications (Emulator only).
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/system/open-notifications/
     *
     */
    openNotifications(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Start an Android activity by providing package name and activity name.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/activity/start-activity/
     *
     */
    startActivity(appPackage: string, appActivity: string, appWaitPackage?: string, appWaitActivity?: string, intentAction?: string, intentCategory?: string, intentFlags?: string, optionalIntentArguments?: string, dontStopAppOnReset?: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Retrieve visibility and bounds information of the status and navigation bars.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/system/system-bars/
     *
     */
    getSystemBars(): Promise<object[]>;
    /**
     * Appium Protocol Command
     *
     * Get the time on the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/system/system-time/
     *
     */
    getDeviceTime(): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Get display density from device.
     * @ref https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     *
     */
    getDisplayDensity(): Promise<any>;
    /**
     * Appium Protocol Command
     *
     * Simulate a [touch id](https://support.apple.com/en-ca/ht201371) event (iOS Simulator only). To enable this feature, the `allowTouchIdEnroll` desired capability must be set to true and the Simulator must be [enrolled](https://support.apple.com/en-ca/ht201371). When you set allowTouchIdEnroll to true, it will set the Simulator to be enrolled by default. The enrollment state can be [toggled](https://appium.github.io/appium.io/docs/en/commands/device/simulator/toggle-touch-id-enrollment/index.html). This call will only work if Appium process or its parent application (e.g. Terminal.app or Appium.app) has access to Mac OS accessibility in System Preferences > Security & Privacy > Privacy > Accessibility list.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/simulator/touch-id/
     *
     */
    touchId(match: boolean): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Toggle the simulator being [enrolled](https://support.apple.com/en-ca/ht201371) to accept touchId (iOS Simulator only). To enable this feature, the `allowTouchIdEnroll` desired capability must be set to true. When `allowTouchIdEnroll` is set to true the Simulator will be enrolled by default, and the 'Toggle Touch ID Enrollment' changes the enrollment state. This call will only work if the Appium process or its parent application (e.g., Terminal.app or Appium.app) has access to Mac OS accessibility in System Preferences > Security & Privacy > Privacy > Accessibility list.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/simulator/toggle-touch-id-enrollment/
     *
     */
    toggleEnrollTouchId(enabled?: boolean): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Launch an app on device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/launch-app/
     * @deprecated For iOS, utilize `driver.execute('mobile: launchApp', { ... })`, and for Android, make use of `driver.execute('mobile: activateApp', { ... })`.
     *
     */
    launchApp(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Close an app on device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/close-app/
     * @deprecated Use `driver.execute('mobile: terminateApp', { ... })` instead
     *
     */
    closeApp(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Send the currently running app for this session to the background.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/background-app/
     * @deprecated Use `driver.execute('mobile: backgroundApp', { ... })` instead
     *
     */
    background(seconds: (number | null)): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Get test coverage data.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/end-test-coverage/
     *
     */
    endCoverage(intent: string, path: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Get app strings.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/app/get-app-strings/
     *
     */
    getStrings(language?: string, stringFile?: string): Promise<StringsReturn>;
    /**
     * Appium Protocol Command
     *
     * No description available, please see reference link.
     * @ref https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     *
     */
    setValueImmediate(elementId: string, text: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Replace the value to element directly.
     * @ref https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     *
     */
    replaceValue(elementId: string, value: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Retrieve the current settings on the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/session/settings/get-settings/
     *
     */
    getSettings(): Promise<SettingsReturn>;
    /**
     * Appium Protocol Command
     *
     * Update the current setting on the device.
     * @ref https://appium.github.io/appium.io/docs/en/commands/session/settings/update-settings/
     *
     */
    updateSettings(settings: object): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Callback url for asynchronous execution of JavaScript.
     * @ref https://github.com/appium/appium-base-driver/blob/master/docs/mjsonwp/protocol-methods.md#appium-extension-endpoints
     *
     */
    receiveAsyncResponse(response: object): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Make GSM call (Emulator only).
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/gsm-call/
     *
     */
    gsmCall(phoneNumber: string, action: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Set GSM signal strength (Emulator only).
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/gsm-signal/
     *
     */
    gsmSignal(signalStrength: string, signalStrengh?: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Set the battery percentage (Emulator only).
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/emulator/power_capacity/
     *
     */
    powerCapacity(percent: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Set the state of the battery charger to connected or not (Emulator only).
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/emulator/power_ac/
     *
     */
    powerAC(state: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Set GSM voice state (Emulator only).
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/gsm-voice/
     *
     */
    gsmVoice(state: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Simulate an SMS message (Emulator only).
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/network/send-sms/
     *
     */
    sendSms(phoneNumber: string, message: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Authenticate users by using their finger print scans on supported emulators.
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/authentication/finger-print/
     *
     */
    fingerPrint(fingerprintId: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Set the content of the system clipboard
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/clipboard/set-clipboard/
     *
     */
    setClipboard(content: string, contentType?: string, label?: string): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Get the content of the system clipboard
     * @ref https://appium.github.io/appium.io/docs/en/commands/device/clipboard/get-clipboard/
     *
     */
    getClipboard(contentType?: string): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * This functionality is only available from within a native context. 'Touch Perform' works similarly to the other singular touch interactions, except that this allows you to chain together more than one touch action as one command. This is useful because Appium commands are sent over the network and there's latency between commands. This latency can make certain touch interactions impossible because some interactions need to be performed in one sequence. Vertical, for example, requires pressing down, moving to a different y coordinate, and then releasing. For it to work, there can't be a delay between the interactions.
     * @ref https://appium.github.io/appium.io/docs/en/commands/interactions/touch/touch-perform/
     *
     * @example
     * ```js
     * // do a horizontal swipe by percentage
     * const startPercentage = 10;
     * const endPercentage = 90;
     * const anchorPercentage = 50;
     *
     * const { width, height } = driver.getWindowSize();
     * const anchor = height// anchorPercentage / 100;
     * const startPoint = width// startPercentage / 100;
     * const endPoint = width// endPercentage / 100;
     * driver.touchPerform([
     *   {
     *     action: 'press',
     *     options: {
     *       x: startPoint,
     *       y: anchor,
     *     },
     *   },
     *   {
     *     action: 'wait',
     *     options: {
     *       ms: 100,
     *     },
     *   },
     *   {
     *     action: 'moveTo',
     *     options: {
     *       x: endPoint,
     *       y: anchor,
     *     },
     *   },
     *   {
     *     action: 'release',
     *     options: {},
     *   },
     * ]);
     * ```
     */
    touchPerform(actions: object[]): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * This functionality is only available from within a native context. Perform a multi touch action sequence.
     * @ref https://appium.github.io/appium.io/docs/en/commands/interactions/touch/multi-touch-perform/
     *
     */
    multiTouchPerform(actions: object[]): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * This command enables you to specify a WebdriverIO script as a string and transmit it to the Appium server for local execution on the server itself. This approach helps minimize potential latency associated with each command. ***To utilize this command with Appium 2.0, you must have the [`execute-driver-plugin`](https://github.com/appium/appium/tree/master/packages/execute-driver-plugin) plugin installed.***
     * @ref https://github.com/appium/appium/blob/master/docs/en/commands/session/execute-driver.md
     *
     */
    executeDriverScript(script: string, type?: string, timeout?: number): Promise<ProtocolCommandResponse>;
    /**
     * Appium Protocol Command
     *
     * Get events stored in appium server.
     * @ref https://github.com/appium/appium/blob/master/docs/en/commands/session/events/get-events.md
     *
     */
    getEvents(type: string[]): Promise<ProtocolCommandResponse>;
    /**
     * Appium Protocol Command
     *
     * Store a custom event.
     * @ref https://github.com/appium/appium/blob/master/docs/en/commands/session/events/log-event.md
     *
     */
    logEvent(vendor: string, event: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * This feature conducts image comparisons utilizing the capabilities of the OpenCV framework. Please note that for this functionality to work, both the OpenCV framework and the opencv4nodejs module must be installed on the machine where the Appium server is operational. ***Furthermore, you'll need to have the [`images-plugin`](https://github.com/appium/appium/tree/master/packages/images-plugin) plugin installed to use this feature with Appium 2.0.***
     * @ref https://appium.github.io/appium.io/docs/en/writing-running-appium/image-comparison/
     *
     */
    compareImages(mode: string, firstImage: string, secondImage: string, options: object): Promise<ProtocolCommandResponse>;
    /**
     * Appium Protocol Command
     *
     * Set the amount of time the driver should wait when searching for elements. When searching for a single element, the driver should poll the page until an element is found or the timeout expires, whichever occurs first. When searching for multiple elements, the driver should poll the page until at least one element is found or the timeout expires, at which point it should return an empty list. If this command is never sent, the driver should default to an implicit wait of 0ms.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    implicitWait(ms: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Determine an element's location on the screen once it has been scrolled into view.<br /><br />__Note:__ This is considered an internal command and should only be used to determine an element's location for correctly generating native events.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    getLocationInView(elementId: string): Promise<ProtocolCommandResponse>;
    /**
     * Appium Protocol Command
     *
     * Send a sequence of key strokes to the active element
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    sendKeys(value: string[]): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * List all available engines on the machine. To use an engine, it has to be present in this list.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    availableIMEEngines(): Promise<string[]>;
    /**
     * Appium Protocol Command
     *
     * Get the name of the active IME engine. The name string is platform specific.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    getActiveIMEEngine(): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Indicates whether IME input is active at the moment
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    isIMEActivated(): Promise<boolean>;
    /**
     * Appium Protocol Command
     *
     * De-activates the currently-active IME engine.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    deactivateIMEEngine(): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Make an engines that is available
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    activateIMEEngine(engine: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Set the amount of time, in milliseconds, that asynchronous scripts executed by `/session/:sessionId/execute_async` are permitted to run before they are aborted and a `Timeout` error is returned to the client.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    asyncScriptTimeout(ms: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Submit a form element.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    submit(elementId: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Determine an element's size in pixels. The size will be returned as a JSON object with `width` and `height` properties.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    getElementSize(elementId: string): Promise<ProtocolCommandResponse>;
    /**
     * Appium Protocol Command
     *
     * Determine an element's location on the page. The point `(0, 0)` refers to the upper-left corner of the page. The element's coordinates are returned as a JSON object with `x` and `y` properties.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    getElementLocation(elementId: string): Promise<ProtocolCommandResponse>;
    /**
     * Appium Protocol Command
     *
     * Single tap on the touch enabled device.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    touchClick(element: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Finger down on the screen.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    touchDown(x: number, y: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Finger up on the screen.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    touchUp(x: number, y: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Finger move on the screen.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    touchMove(x: number, y: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Long press on the touch screen using finger motion events.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    touchLongClick(element: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Flick on the touch screen using finger motion events. This flick command starts at a particular screen location.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    touchFlick(xoffset?: number, yoffset?: number, element?: string, speed?: number, xspeed?: number, yspeed?: number): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Get the current device orientation.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    getOrientation(): Promise<string>;
    /**
     * Appium Protocol Command
     *
     * Set the device orientation
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    setOrientation(orientation: string): Promise<void>;
    /**
     * Appium Protocol Command
     *
     * Get the log for a given log type. Log buffer is reset after each request.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    getLogs(type: string): Promise<object[]>;
    /**
     * Appium Protocol Command
     *
     * Get available log types.
     * @ref https://github.com/appium/appium/blob/master/packages/base-driver/docs/mjsonwp/protocol-methods.md#webdriver-endpoints
     *
     */
    getLogTypes(): Promise<string[]>;
}
//# sourceMappingURL=appium.d.ts.map