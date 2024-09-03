"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NO_SESSION_ID_COMMANDS = exports.METHOD_MAP = exports.ALL_COMMANDS = void 0;
exports.routeToCommandName = routeToCommandName;

require("source-map-support/register");

var _lodash = _interopRequireDefault(require("lodash"));

var _appiumSupport = require("appium-support");

var _constants = require("../constants");

const SET_ALERT_TEXT_PAYLOAD_PARAMS = {
  validate: jsonObj => !_appiumSupport.util.hasValue(jsonObj.value) && !_appiumSupport.util.hasValue(jsonObj.text) && 'either "text" or "value" must be set',
  optional: ['value', 'text'],
  makeArgs: jsonObj => [jsonObj.value || jsonObj.text]
};
const METHOD_MAP = {
  '/status': {
    GET: {
      command: 'getStatus'
    }
  },
  '/session': {
    POST: {
      command: 'createSession',
      payloadParams: {
        validate: jsonObj => !jsonObj.capabilities && !jsonObj.desiredCapabilities && 'we require one of "desiredCapabilities" or "capabilities" object',
        optional: ['desiredCapabilities', 'requiredCapabilities', 'capabilities']
      }
    }
  },
  '/sessions': {
    GET: {
      command: 'getSessions'
    }
  },
  '/session/:sessionId': {
    GET: {
      command: 'getSession'
    },
    DELETE: {
      command: 'deleteSession'
    }
  },
  '/session/:sessionId/timeouts': {
    GET: {
      command: 'getTimeouts'
    },
    POST: {
      command: 'timeouts',
      payloadParams: {
        validate: (jsonObj, protocolName) => {
          if (protocolName === _constants.PROTOCOLS.W3C) {
            if (!_appiumSupport.util.hasValue(jsonObj.script) && !_appiumSupport.util.hasValue(jsonObj.pageLoad) && !_appiumSupport.util.hasValue(jsonObj.implicit)) {
              return 'W3C protocol expects any of script, pageLoad or implicit to be set';
            }
          } else {
            if (!_appiumSupport.util.hasValue(jsonObj.type) || !_appiumSupport.util.hasValue(jsonObj.ms)) {
              return 'MJSONWP protocol requires type and ms';
            }
          }
        },
        optional: ['type', 'ms', 'script', 'pageLoad', 'implicit']
      }
    }
  },
  '/session/:sessionId/timeouts/async_script': {
    POST: {
      command: 'asyncScriptTimeout',
      payloadParams: {
        required: ['ms']
      }
    }
  },
  '/session/:sessionId/timeouts/implicit_wait': {
    POST: {
      command: 'implicitWait',
      payloadParams: {
        required: ['ms']
      }
    }
  },
  '/session/:sessionId/window_handle': {
    GET: {
      command: 'getWindowHandle'
    }
  },
  '/session/:sessionId/window/handle': {
    GET: {
      command: 'getWindowHandle'
    }
  },
  '/session/:sessionId/window_handles': {
    GET: {
      command: 'getWindowHandles'
    }
  },
  '/session/:sessionId/window/handles': {
    GET: {
      command: 'getWindowHandles'
    }
  },
  '/session/:sessionId/url': {
    GET: {
      command: 'getUrl'
    },
    POST: {
      command: 'setUrl',
      payloadParams: {
        required: ['url']
      }
    }
  },
  '/session/:sessionId/forward': {
    POST: {
      command: 'forward'
    }
  },
  '/session/:sessionId/back': {
    POST: {
      command: 'back'
    }
  },
  '/session/:sessionId/refresh': {
    POST: {
      command: 'refresh'
    }
  },
  '/session/:sessionId/execute': {
    POST: {
      command: 'execute',
      payloadParams: {
        required: ['script', 'args']
      }
    }
  },
  '/session/:sessionId/execute_async': {
    POST: {
      command: 'executeAsync',
      payloadParams: {
        required: ['script', 'args']
      }
    }
  },
  '/session/:sessionId/screenshot': {
    GET: {
      command: 'getScreenshot'
    }
  },
  '/session/:sessionId/ime/available_engines': {
    GET: {
      command: 'availableIMEEngines'
    }
  },
  '/session/:sessionId/ime/active_engine': {
    GET: {
      command: 'getActiveIMEEngine'
    }
  },
  '/session/:sessionId/ime/activated': {
    GET: {
      command: 'isIMEActivated'
    }
  },
  '/session/:sessionId/ime/deactivate': {
    POST: {
      command: 'deactivateIMEEngine'
    }
  },
  '/session/:sessionId/ime/activate': {
    POST: {
      command: 'activateIMEEngine',
      payloadParams: {
        required: ['engine']
      }
    }
  },
  '/session/:sessionId/frame': {
    POST: {
      command: 'setFrame',
      payloadParams: {
        required: ['id']
      }
    }
  },
  '/session/:sessionId/frame/parent': {
    POST: {}
  },
  '/session/:sessionId/window': {
    GET: {
      command: 'getWindowHandle'
    },
    POST: {
      command: 'setWindow',
      payloadParams: {
        optional: ['name', 'handle'],
        makeArgs: jsonObj => {
          if (_appiumSupport.util.hasValue(jsonObj.handle) && !_appiumSupport.util.hasValue(jsonObj.name)) {
            return [jsonObj.handle, jsonObj.handle];
          }

          if (_appiumSupport.util.hasValue(jsonObj.name) && !_appiumSupport.util.hasValue(jsonObj.handle)) {
            return [jsonObj.name, jsonObj.name];
          }

          return [jsonObj.name, jsonObj.handle];
        },
        validate: jsonObj => !_appiumSupport.util.hasValue(jsonObj.name) && !_appiumSupport.util.hasValue(jsonObj.handle) && 'we require one of "name" or "handle" to be set'
      }
    },
    DELETE: {
      command: 'closeWindow'
    }
  },
  '/session/:sessionId/window/:windowhandle/size': {
    GET: {
      command: 'getWindowSize'
    },
    POST: {}
  },
  '/session/:sessionId/window/:windowhandle/position': {
    POST: {},
    GET: {}
  },
  '/session/:sessionId/window/:windowhandle/maximize': {
    POST: {
      command: 'maximizeWindow'
    }
  },
  '/session/:sessionId/cookie': {
    GET: {
      command: 'getCookies'
    },
    POST: {
      command: 'setCookie',
      payloadParams: {
        required: ['cookie']
      }
    },
    DELETE: {
      command: 'deleteCookies'
    }
  },
  '/session/:sessionId/cookie/:name': {
    GET: {
      command: 'getCookie'
    },
    DELETE: {
      command: 'deleteCookie'
    }
  },
  '/session/:sessionId/source': {
    GET: {
      command: 'getPageSource'
    }
  },
  '/session/:sessionId/title': {
    GET: {
      command: 'title'
    }
  },
  '/session/:sessionId/element': {
    POST: {
      command: 'findElement',
      payloadParams: {
        required: ['using', 'value']
      }
    }
  },
  '/session/:sessionId/elements': {
    POST: {
      command: 'findElements',
      payloadParams: {
        required: ['using', 'value']
      }
    }
  },
  '/session/:sessionId/element/active': {
    GET: {
      command: 'active'
    },
    POST: {
      command: 'active'
    }
  },
  '/session/:sessionId/element/:elementId': {
    GET: {}
  },
  '/session/:sessionId/element/:elementId/element': {
    POST: {
      command: 'findElementFromElement',
      payloadParams: {
        required: ['using', 'value']
      }
    }
  },
  '/session/:sessionId/element/:elementId/elements': {
    POST: {
      command: 'findElementsFromElement',
      payloadParams: {
        required: ['using', 'value']
      }
    }
  },
  '/session/:sessionId/element/:elementId/click': {
    POST: {
      command: 'click'
    }
  },
  '/session/:sessionId/element/:elementId/submit': {
    POST: {
      command: 'submit'
    }
  },
  '/session/:sessionId/element/:elementId/text': {
    GET: {
      command: 'getText'
    }
  },
  '/session/:sessionId/element/:elementId/value': {
    POST: {
      command: 'setValue',
      payloadParams: {
        validate: jsonObj => !_appiumSupport.util.hasValue(jsonObj.value) && !_appiumSupport.util.hasValue(jsonObj.text) && 'we require one of "text" or "value" params',
        optional: ['value', 'text'],
        makeArgs: jsonObj => [jsonObj.value || jsonObj.text]
      }
    }
  },
  '/session/:sessionId/keys': {
    POST: {
      command: 'keys',
      payloadParams: {
        required: ['value']
      }
    }
  },
  '/session/:sessionId/element/:elementId/name': {
    GET: {
      command: 'getName'
    }
  },
  '/session/:sessionId/element/:elementId/clear': {
    POST: {
      command: 'clear'
    }
  },
  '/session/:sessionId/element/:elementId/selected': {
    GET: {
      command: 'elementSelected'
    }
  },
  '/session/:sessionId/element/:elementId/enabled': {
    GET: {
      command: 'elementEnabled'
    }
  },
  '/session/:sessionId/element/:elementId/attribute/:name': {
    GET: {
      command: 'getAttribute'
    }
  },
  '/session/:sessionId/element/:elementId/equals/:otherId': {
    GET: {
      command: 'equalsElement'
    }
  },
  '/session/:sessionId/element/:elementId/displayed': {
    GET: {
      command: 'elementDisplayed'
    }
  },
  '/session/:sessionId/element/:elementId/location': {
    GET: {
      command: 'getLocation'
    }
  },
  '/session/:sessionId/element/:elementId/location_in_view': {
    GET: {
      command: 'getLocationInView'
    }
  },
  '/session/:sessionId/element/:elementId/size': {
    GET: {
      command: 'getSize'
    }
  },
  '/session/:sessionId/element/:elementId/css/:propertyName': {
    GET: {
      command: 'getCssProperty'
    }
  },
  '/session/:sessionId/orientation': {
    GET: {
      command: 'getOrientation'
    },
    POST: {
      command: 'setOrientation',
      payloadParams: {
        required: ['orientation']
      }
    }
  },
  '/session/:sessionId/rotation': {
    GET: {
      command: 'getRotation'
    },
    POST: {
      command: 'setRotation',
      payloadParams: {
        required: ['x', 'y', 'z']
      }
    }
  },
  '/session/:sessionId/moveto': {
    POST: {
      command: 'moveTo',
      payloadParams: {
        optional: ['element', 'xoffset', 'yoffset']
      }
    }
  },
  '/session/:sessionId/click': {
    POST: {
      command: 'clickCurrent',
      payloadParams: {
        optional: ['button']
      }
    }
  },
  '/session/:sessionId/buttondown': {
    POST: {
      command: 'buttonDown',
      payloadParams: {
        optional: ['button']
      }
    }
  },
  '/session/:sessionId/buttonup': {
    POST: {
      command: 'buttonUp',
      payloadParams: {
        optional: ['button']
      }
    }
  },
  '/session/:sessionId/doubleclick': {
    POST: {
      command: 'doubleClick'
    }
  },
  '/session/:sessionId/touch/click': {
    POST: {
      command: 'click',
      payloadParams: {
        required: ['element']
      }
    }
  },
  '/session/:sessionId/touch/down': {
    POST: {
      command: 'touchDown',
      payloadParams: {
        required: ['x', 'y']
      }
    }
  },
  '/session/:sessionId/touch/up': {
    POST: {
      command: 'touchUp',
      payloadParams: {
        required: ['x', 'y']
      }
    }
  },
  '/session/:sessionId/touch/move': {
    POST: {
      command: 'touchMove',
      payloadParams: {
        required: ['x', 'y']
      }
    }
  },
  '/session/:sessionId/touch/scroll': {
    POST: {}
  },
  '/session/:sessionId/touch/doubleclick': {
    POST: {}
  },
  '/session/:sessionId/actions': {
    POST: {
      command: 'performActions',
      payloadParams: {
        required: ['actions']
      }
    },
    DELETE: {
      command: 'releaseActions'
    }
  },
  '/session/:sessionId/touch/longclick': {
    POST: {
      command: 'touchLongClick',
      payloadParams: {
        required: ['elements']
      }
    }
  },
  '/session/:sessionId/touch/flick': {
    POST: {
      command: 'flick',
      payloadParams: {
        optional: ['element', 'xspeed', 'yspeed', 'xoffset', 'yoffset', 'speed']
      }
    }
  },
  '/session/:sessionId/location': {
    GET: {
      command: 'getGeoLocation'
    },
    POST: {
      command: 'setGeoLocation',
      payloadParams: {
        required: ['location']
      }
    }
  },
  '/session/:sessionId/local_storage': {
    GET: {},
    POST: {},
    DELETE: {}
  },
  '/session/:sessionId/local_storage/key/:key': {
    GET: {},
    DELETE: {}
  },
  '/session/:sessionId/local_storage/size': {
    GET: {}
  },
  '/session/:sessionId/session_storage': {
    GET: {},
    POST: {},
    DELETE: {}
  },
  '/session/:sessionId/session_storage/key/:key': {
    GET: {},
    DELETE: {}
  },
  '/session/:sessionId/session_storage/size': {
    GET: {}
  },
  '/session/:sessionId/se/log': {
    POST: {
      command: 'getLog',
      payloadParams: {
        required: ['type']
      }
    }
  },
  '/session/:sessionId/se/log/types': {
    GET: {
      command: 'getLogTypes'
    }
  },
  '/session/:sessionId/log': {
    POST: {
      command: 'getLog',
      payloadParams: {
        required: ['type']
      }
    }
  },
  '/session/:sessionId/log/types': {
    GET: {
      command: 'getLogTypes'
    }
  },
  '/session/:sessionId/application_cache/status': {
    GET: {}
  },
  '/session/:sessionId/context': {
    GET: {
      command: 'getCurrentContext'
    },
    POST: {
      command: 'setContext',
      payloadParams: {
        required: ['name']
      }
    }
  },
  '/session/:sessionId/contexts': {
    GET: {
      command: 'getContexts'
    }
  },
  '/session/:sessionId/element/:elementId/pageIndex': {
    GET: {
      command: 'getPageIndex'
    }
  },
  '/session/:sessionId/network_connection': {
    GET: {
      command: 'getNetworkConnection'
    },
    POST: {
      command: 'setNetworkConnection',
      payloadParams: {
        unwrap: 'parameters',
        required: ['type']
      }
    }
  },
  '/session/:sessionId/touch/perform': {
    POST: {
      command: 'performTouch',
      payloadParams: {
        wrap: 'actions',
        required: ['actions']
      }
    }
  },
  '/session/:sessionId/touch/multi/perform': {
    POST: {
      command: 'performMultiAction',
      payloadParams: {
        required: ['actions'],
        optional: ['elementId']
      }
    }
  },
  '/session/:sessionId/receive_async_response': {
    POST: {
      command: 'receiveAsyncResponse',
      payloadParams: {
        required: ['status', 'value']
      }
    }
  },
  '/session/:sessionId/appium/device/shake': {
    POST: {
      command: 'mobileShake'
    }
  },
  '/session/:sessionId/appium/device/system_time': {
    GET: {
      command: 'getDeviceTime',
      payloadParams: {
        optional: ['format']
      }
    },
    POST: {
      command: 'getDeviceTime',
      payloadParams: {
        optional: ['format']
      }
    }
  },
  '/session/:sessionId/appium/device/lock': {
    POST: {
      command: 'lock',
      payloadParams: {
        optional: ['seconds']
      }
    }
  },
  '/session/:sessionId/appium/device/unlock': {
    POST: {
      command: 'unlock'
    }
  },
  '/session/:sessionId/appium/device/is_locked': {
    POST: {
      command: 'isLocked'
    }
  },
  '/session/:sessionId/appium/start_recording_screen': {
    POST: {
      command: 'startRecordingScreen',
      payloadParams: {
        optional: ['options']
      }
    }
  },
  '/session/:sessionId/appium/stop_recording_screen': {
    POST: {
      command: 'stopRecordingScreen',
      payloadParams: {
        optional: ['options']
      }
    }
  },
  '/session/:sessionId/appium/performanceData/types': {
    POST: {
      command: 'getPerformanceDataTypes'
    }
  },
  '/session/:sessionId/appium/getPerformanceData': {
    POST: {
      command: 'getPerformanceData',
      payloadParams: {
        required: ['packageName', 'dataType'],
        optional: ['dataReadTimeout']
      }
    }
  },
  '/session/:sessionId/appium/device/press_keycode': {
    POST: {
      command: 'pressKeyCode',
      payloadParams: {
        required: ['keycode'],
        optional: ['metastate', 'flags']
      }
    }
  },
  '/session/:sessionId/appium/device/long_press_keycode': {
    POST: {
      command: 'longPressKeyCode',
      payloadParams: {
        required: ['keycode'],
        optional: ['metastate', 'flags']
      }
    }
  },
  '/session/:sessionId/appium/device/finger_print': {
    POST: {
      command: 'fingerprint',
      payloadParams: {
        required: ['fingerprintId']
      }
    }
  },
  '/session/:sessionId/appium/device/send_sms': {
    POST: {
      command: 'sendSMS',
      payloadParams: {
        required: ['phoneNumber', 'message']
      }
    }
  },
  '/session/:sessionId/appium/device/gsm_call': {
    POST: {
      command: 'gsmCall',
      payloadParams: {
        required: ['phoneNumber', 'action']
      }
    }
  },
  '/session/:sessionId/appium/device/gsm_signal': {
    POST: {
      command: 'gsmSignal',
      payloadParams: {
        validate: jsonObj => !_appiumSupport.util.hasValue(jsonObj.signalStrength) && !_appiumSupport.util.hasValue(jsonObj.signalStrengh) && 'we require one of "signalStrength" or "signalStrengh" params',
        optional: ['signalStrength', 'signalStrengh'],
        makeArgs: jsonObj => [_appiumSupport.util.hasValue(jsonObj.signalStrength) ? jsonObj.signalStrength : jsonObj.signalStrengh]
      }
    }
  },
  '/session/:sessionId/appium/device/gsm_voice': {
    POST: {
      command: 'gsmVoice',
      payloadParams: {
        required: ['state']
      }
    }
  },
  '/session/:sessionId/appium/device/power_capacity': {
    POST: {
      command: 'powerCapacity',
      payloadParams: {
        required: ['percent']
      }
    }
  },
  '/session/:sessionId/appium/device/power_ac': {
    POST: {
      command: 'powerAC',
      payloadParams: {
        required: ['state']
      }
    }
  },
  '/session/:sessionId/appium/device/network_speed': {
    POST: {
      command: 'networkSpeed',
      payloadParams: {
        required: ['netspeed']
      }
    }
  },
  '/session/:sessionId/appium/device/keyevent': {
    POST: {
      command: 'keyevent',
      payloadParams: {
        required: ['keycode'],
        optional: ['metastate']
      }
    }
  },
  '/session/:sessionId/appium/device/rotate': {
    POST: {
      command: 'mobileRotation',
      payloadParams: {
        required: ['x', 'y', 'radius', 'rotation', 'touchCount', 'duration'],
        optional: ['element']
      }
    }
  },
  '/session/:sessionId/appium/device/current_activity': {
    GET: {
      command: 'getCurrentActivity'
    }
  },
  '/session/:sessionId/appium/device/current_package': {
    GET: {
      command: 'getCurrentPackage'
    }
  },
  '/session/:sessionId/appium/device/install_app': {
    POST: {
      command: 'installApp',
      payloadParams: {
        required: ['appPath'],
        optional: ['options']
      }
    }
  },
  '/session/:sessionId/appium/device/activate_app': {
    POST: {
      command: 'activateApp',
      payloadParams: {
        required: [['appId'], ['bundleId']],
        optional: ['options']
      }
    }
  },
  '/session/:sessionId/appium/device/remove_app': {
    POST: {
      command: 'removeApp',
      payloadParams: {
        required: [['appId'], ['bundleId']],
        optional: ['options']
      }
    }
  },
  '/session/:sessionId/appium/device/terminate_app': {
    POST: {
      command: 'terminateApp',
      payloadParams: {
        required: [['appId'], ['bundleId']],
        optional: ['options']
      }
    }
  },
  '/session/:sessionId/appium/device/app_installed': {
    POST: {
      command: 'isAppInstalled',
      payloadParams: {
        required: [['appId'], ['bundleId']]
      }
    }
  },
  '/session/:sessionId/appium/device/app_state': {
    GET: {
      command: 'queryAppState',
      payloadParams: {
        required: [['appId'], ['bundleId']]
      }
    },
    POST: {
      command: 'queryAppState',
      payloadParams: {
        required: [['appId'], ['bundleId']]
      }
    }
  },
  '/session/:sessionId/appium/device/hide_keyboard': {
    POST: {
      command: 'hideKeyboard',
      payloadParams: {
        optional: ['strategy', 'key', 'keyCode', 'keyName']
      }
    }
  },
  '/session/:sessionId/appium/device/is_keyboard_shown': {
    GET: {
      command: 'isKeyboardShown'
    }
  },
  '/session/:sessionId/appium/device/push_file': {
    POST: {
      command: 'pushFile',
      payloadParams: {
        required: ['path', 'data']
      }
    }
  },
  '/session/:sessionId/appium/device/pull_file': {
    POST: {
      command: 'pullFile',
      payloadParams: {
        required: ['path']
      }
    }
  },
  '/session/:sessionId/appium/device/pull_folder': {
    POST: {
      command: 'pullFolder',
      payloadParams: {
        required: ['path']
      }
    }
  },
  '/session/:sessionId/appium/device/toggle_airplane_mode': {
    POST: {
      command: 'toggleFlightMode'
    }
  },
  '/session/:sessionId/appium/device/toggle_data': {
    POST: {
      command: 'toggleData'
    }
  },
  '/session/:sessionId/appium/device/toggle_wifi': {
    POST: {
      command: 'toggleWiFi'
    }
  },
  '/session/:sessionId/appium/device/toggle_location_services': {
    POST: {
      command: 'toggleLocationServices'
    }
  },
  '/session/:sessionId/appium/device/open_notifications': {
    POST: {
      command: 'openNotifications'
    }
  },
  '/session/:sessionId/appium/device/start_activity': {
    POST: {
      command: 'startActivity',
      payloadParams: {
        required: ['appPackage', 'appActivity'],
        optional: ['appWaitPackage', 'appWaitActivity', 'intentAction', 'intentCategory', 'intentFlags', 'optionalIntentArguments', 'dontStopAppOnReset']
      }
    }
  },
  '/session/:sessionId/appium/device/system_bars': {
    GET: {
      command: 'getSystemBars'
    }
  },
  '/session/:sessionId/appium/device/display_density': {
    GET: {
      command: 'getDisplayDensity'
    }
  },
  '/session/:sessionId/appium/simulator/touch_id': {
    POST: {
      command: 'touchId',
      payloadParams: {
        required: ['match']
      }
    }
  },
  '/session/:sessionId/appium/simulator/toggle_touch_id_enrollment': {
    POST: {
      command: 'toggleEnrollTouchId',
      payloadParams: {
        optional: ['enabled']
      }
    }
  },
  '/session/:sessionId/appium/app/launch': {
    POST: {
      command: 'launchApp'
    }
  },
  '/session/:sessionId/appium/app/close': {
    POST: {
      command: 'closeApp'
    }
  },
  '/session/:sessionId/appium/app/reset': {
    POST: {
      command: 'reset'
    }
  },
  '/session/:sessionId/appium/app/background': {
    POST: {
      command: 'background',
      payloadParams: {
        required: ['seconds']
      }
    }
  },
  '/session/:sessionId/appium/app/end_test_coverage': {
    POST: {
      command: 'endCoverage',
      payloadParams: {
        required: ['intent', 'path']
      }
    }
  },
  '/session/:sessionId/appium/app/strings': {
    POST: {
      command: 'getStrings',
      payloadParams: {
        optional: ['language', 'stringFile']
      }
    }
  },
  '/session/:sessionId/appium/element/:elementId/value': {
    POST: {
      command: 'setValueImmediate',
      payloadParams: {
        validate: jsonObj => !_appiumSupport.util.hasValue(jsonObj.value) && !_appiumSupport.util.hasValue(jsonObj.text) && 'we require one of "text" or "value" params',
        optional: ['value', 'text'],
        makeArgs: jsonObj => [jsonObj.value || jsonObj.text]
      }
    }
  },
  '/session/:sessionId/appium/element/:elementId/replace_value': {
    POST: {
      command: 'replaceValue',
      payloadParams: {
        validate: jsonObj => !_appiumSupport.util.hasValue(jsonObj.value) && !_appiumSupport.util.hasValue(jsonObj.text) && 'we require one of "text" or "value" params',
        optional: ['value', 'text'],
        makeArgs: jsonObj => {
          var _ref, _jsonObj$value;

          return [(_ref = (_jsonObj$value = jsonObj.value) !== null && _jsonObj$value !== void 0 ? _jsonObj$value : jsonObj.text) !== null && _ref !== void 0 ? _ref : ''];
        }
      }
    }
  },
  '/session/:sessionId/appium/settings': {
    POST: {
      command: 'updateSettings',
      payloadParams: {
        required: ['settings']
      }
    },
    GET: {
      command: 'getSettings'
    }
  },
  '/session/:sessionId/appium/receive_async_response': {
    POST: {
      command: 'receiveAsyncResponse',
      payloadParams: {
        required: ['response']
      }
    }
  },
  '/session/:sessionId/appium/execute_driver': {
    POST: {
      command: 'executeDriverScript',
      payloadParams: {
        required: ['script'],
        optional: ['type', 'timeout']
      }
    }
  },
  '/session/:sessionId/appium/events': {
    POST: {
      command: 'getLogEvents',
      payloadParams: {
        optional: ['type']
      }
    }
  },
  '/session/:sessionId/appium/log_event': {
    POST: {
      command: 'logCustomEvent',
      payloadParams: {
        required: ['vendor', 'event']
      }
    }
  },
  '/session/:sessionId/alert_text': {
    GET: {
      command: 'getAlertText'
    },
    POST: {
      command: 'setAlertText',
      payloadParams: SET_ALERT_TEXT_PAYLOAD_PARAMS
    }
  },
  '/session/:sessionId/accept_alert': {
    POST: {
      command: 'postAcceptAlert'
    }
  },
  '/session/:sessionId/dismiss_alert': {
    POST: {
      command: 'postDismissAlert'
    }
  },
  '/session/:sessionId/alert/text': {
    GET: {
      command: 'getAlertText'
    },
    POST: {
      command: 'setAlertText',
      payloadParams: SET_ALERT_TEXT_PAYLOAD_PARAMS
    }
  },
  '/session/:sessionId/alert/accept': {
    POST: {
      command: 'postAcceptAlert'
    }
  },
  '/session/:sessionId/alert/dismiss': {
    POST: {
      command: 'postDismissAlert'
    }
  },
  '/session/:sessionId/element/:elementId/rect': {
    GET: {
      command: 'getElementRect'
    }
  },
  '/session/:sessionId/execute/sync': {
    POST: {
      command: 'execute',
      payloadParams: {
        required: ['script', 'args']
      }
    }
  },
  '/session/:sessionId/execute/async': {
    POST: {
      command: 'executeAsync',
      payloadParams: {
        required: ['script', 'args']
      }
    }
  },
  '/session/:sessionId/screenshot/:elementId': {
    GET: {
      command: 'getElementScreenshot'
    }
  },
  '/session/:sessionId/element/:elementId/screenshot': {
    GET: {
      command: 'getElementScreenshot'
    }
  },
  '/session/:sessionId/window/rect': {
    GET: {
      command: 'getWindowRect'
    },
    POST: {
      command: 'setWindowRect',
      payloadParams: {
        required: ['x', 'y', 'width', 'height']
      }
    }
  },
  '/session/:sessionId/window/maximize': {
    POST: {
      command: 'maximizeWindow'
    }
  },
  '/session/:sessionId/window/minimize': {
    POST: {
      command: 'minimizeWindow'
    }
  },
  '/session/:sessionId/window/fullscreen': {
    POST: {
      command: 'fullScreenWindow'
    }
  },
  '/session/:sessionId/element/:elementId/property/:name': {
    GET: {
      command: 'getProperty'
    }
  },
  '/session/:sessionId/appium/device/set_clipboard': {
    POST: {
      command: 'setClipboard',
      payloadParams: {
        required: ['content'],
        optional: ['contentType', 'label']
      }
    }
  },
  '/session/:sessionId/appium/device/get_clipboard': {
    POST: {
      command: 'getClipboard',
      payloadParams: {
        optional: ['contentType']
      }
    }
  },
  '/session/:sessionId/appium/compare_images': {
    POST: {
      command: 'compareImages',
      payloadParams: {
        required: ['mode', 'firstImage', 'secondImage'],
        optional: ['options']
      }
    }
  },
  '/session/:sessionId/:vendor/cdp/execute': {
    POST: {
      command: 'executeCdp',
      payloadParams: {
        required: ['cmd', 'params']
      }
    }
  },
  '/session/:sessionId/webauthn/authenticator': {
    POST: {
      command: 'addVirtualAuthenticator',
      payloadParams: {
        required: ['protocol', 'transport'],
        optional: ['hasResidentKey', 'hasUserVerification', 'isUserConsenting', 'isUserVerified']
      }
    }
  },
  '/session/:sessionId/webauthn/authenticator/:authenticatorId': {
    DELETE: {
      command: 'removeVirtualAuthenticator'
    }
  },
  '/session/:sessionId/webauthn/authenticator/:authenticatorId/credential': {
    POST: {
      command: 'addAuthCredential',
      payloadParams: {
        required: ['credentialId', 'isResidentCredential', 'rpId', 'privateKey'],
        optional: ['userHandle', 'signCount']
      }
    }
  },
  '/session/:sessionId/webauthn/authenticator/:authenticatorId/credentials': {
    GET: {
      command: 'getAuthCredential'
    },
    DELETE: {
      command: 'removeAllAuthCredentials'
    }
  },
  '/session/:sessionId/webauthn/authenticator/:authenticatorId/credentials/:credentialId': {
    DELETE: {
      command: 'removeAuthCredential'
    }
  },
  '/session/:sessionId/webauthn/authenticator/:authenticatorId/uv': {
    POST: {
      command: 'setUserAuthVerified',
      payloadParams: {
        required: ['isUserVerified']
      }
    }
  }
};
exports.METHOD_MAP = METHOD_MAP;
let ALL_COMMANDS = [];
exports.ALL_COMMANDS = ALL_COMMANDS;

for (let v of _lodash.default.values(METHOD_MAP)) {
  for (let m of _lodash.default.values(v)) {
    if (m.command) {
      ALL_COMMANDS.push(m.command);
    }
  }
}

const RE_ESCAPE = /[-[\]{}()+?.,\\^$|#\s]/g;
const RE_PARAM = /([:*])(\w+)/g;

class Route {
  constructor(route) {
    this.paramNames = [];
    let reStr = route.replace(RE_ESCAPE, '\\$&');
    reStr = reStr.replace(RE_PARAM, (_, mode, name) => {
      this.paramNames.push(name);
      return mode === ':' ? '([^/]*)' : '(.*)';
    });
    this.routeRegexp = new RegExp(`^${reStr}$`);
  }

  parse(url) {
    let matches = url.match(this.routeRegexp);
    if (!matches) return;
    let i = 0;
    let params = {};

    while (i < this.paramNames.length) {
      const paramName = this.paramNames[i++];
      params[paramName] = matches[i];
    }

    return params;
  }

}

function routeToCommandName(endpoint, method, basePath = _constants.DEFAULT_BASE_PATH) {
  let dstRoute = null;

  if (endpoint.includes('?')) {
    endpoint = endpoint.slice(0, endpoint.indexOf('?'));
  }

  const actualEndpoint = endpoint === '/' ? '' : _lodash.default.startsWith(endpoint, '/') ? endpoint : `/${endpoint}`;

  for (let currentRoute of _lodash.default.keys(METHOD_MAP)) {
    const route = new Route(`${basePath}${currentRoute}`);

    if (route.parse(`${basePath}/session/ignored-session-id${actualEndpoint}`) || route.parse(`${basePath}${actualEndpoint}`) || route.parse(actualEndpoint)) {
      dstRoute = currentRoute;
      break;
    }
  }

  if (!dstRoute) return;

  const methods = _lodash.default.get(METHOD_MAP, dstRoute);

  method = _lodash.default.toUpper(method);

  if (_lodash.default.has(methods, method)) {
    const dstMethod = _lodash.default.get(methods, method);

    if (dstMethod.command) {
      return dstMethod.command;
    }
  }
}

const NO_SESSION_ID_COMMANDS = ['createSession', 'getStatus', 'getSessions'];
exports.NO_SESSION_ID_COMMANDS = NO_SESSION_ID_COMMANDS;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9wcm90b2NvbC9yb3V0ZXMuanMiXSwibmFtZXMiOlsiU0VUX0FMRVJUX1RFWFRfUEFZTE9BRF9QQVJBTVMiLCJ2YWxpZGF0ZSIsImpzb25PYmoiLCJ1dGlsIiwiaGFzVmFsdWUiLCJ2YWx1ZSIsInRleHQiLCJvcHRpb25hbCIsIm1ha2VBcmdzIiwiTUVUSE9EX01BUCIsIkdFVCIsImNvbW1hbmQiLCJQT1NUIiwicGF5bG9hZFBhcmFtcyIsImNhcGFiaWxpdGllcyIsImRlc2lyZWRDYXBhYmlsaXRpZXMiLCJERUxFVEUiLCJwcm90b2NvbE5hbWUiLCJQUk9UT0NPTFMiLCJXM0MiLCJzY3JpcHQiLCJwYWdlTG9hZCIsImltcGxpY2l0IiwidHlwZSIsIm1zIiwicmVxdWlyZWQiLCJoYW5kbGUiLCJuYW1lIiwidW53cmFwIiwid3JhcCIsInNpZ25hbFN0cmVuZ3RoIiwic2lnbmFsU3RyZW5naCIsIkFMTF9DT01NQU5EUyIsInYiLCJfIiwidmFsdWVzIiwibSIsInB1c2giLCJSRV9FU0NBUEUiLCJSRV9QQVJBTSIsIlJvdXRlIiwiY29uc3RydWN0b3IiLCJyb3V0ZSIsInBhcmFtTmFtZXMiLCJyZVN0ciIsInJlcGxhY2UiLCJtb2RlIiwicm91dGVSZWdleHAiLCJSZWdFeHAiLCJwYXJzZSIsInVybCIsIm1hdGNoZXMiLCJtYXRjaCIsImkiLCJwYXJhbXMiLCJsZW5ndGgiLCJwYXJhbU5hbWUiLCJyb3V0ZVRvQ29tbWFuZE5hbWUiLCJlbmRwb2ludCIsIm1ldGhvZCIsImJhc2VQYXRoIiwiREVGQVVMVF9CQVNFX1BBVEgiLCJkc3RSb3V0ZSIsImluY2x1ZGVzIiwic2xpY2UiLCJpbmRleE9mIiwiYWN0dWFsRW5kcG9pbnQiLCJzdGFydHNXaXRoIiwiY3VycmVudFJvdXRlIiwia2V5cyIsIm1ldGhvZHMiLCJnZXQiLCJ0b1VwcGVyIiwiaGFzIiwiZHN0TWV0aG9kIiwiTk9fU0VTU0lPTl9JRF9DT01NQU5EUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FB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dGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgdXRpbCB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCB7IFBST1RPQ09MUywgREVGQVVMVF9CQVNFX1BBVEggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5cbmNvbnN0IFNFVF9BTEVSVF9URVhUX1BBWUxPQURfUEFSQU1TID0ge1xuICB2YWxpZGF0ZTogKGpzb25PYmopID0+ICghdXRpbC5oYXNWYWx1ZShqc29uT2JqLnZhbHVlKSAmJiAhdXRpbC5oYXNWYWx1ZShqc29uT2JqLnRleHQpKSAmJlxuICAgICAgJ2VpdGhlciBcInRleHRcIiBvciBcInZhbHVlXCIgbXVzdCBiZSBzZXQnLFxuICBvcHRpb25hbDogWyd2YWx1ZScsICd0ZXh0J10sXG4gIC8vIFByZWZlciAndmFsdWUnIHNpbmNlIGl0J3MgbW9yZSBiYWNrd2FyZC1jb21wYXRpYmxlLlxuICBtYWtlQXJnczogKGpzb25PYmopID0+IFtqc29uT2JqLnZhbHVlIHx8IGpzb25PYmoudGV4dF0sXG59O1xuXG4vLyBkZWZpbmUgdGhlIHJvdXRlcywgbWFwcGluZyBvZiBIVFRQIG1ldGhvZHMgdG8gcGFydGljdWxhciBkcml2ZXIgY29tbWFuZHMsXG4vLyBhbmQgYW55IHBhcmFtZXRlcnMgdGhhdCBhcmUgZXhwZWN0ZWQgaW4gYSByZXF1ZXN0XG4vLyBwYXJhbWV0ZXJzIGNhbiBiZSBgcmVxdWlyZWRgIG9yIGBvcHRpb25hbGBcbmNvbnN0IE1FVEhPRF9NQVAgPSB7XG4gICcvc3RhdHVzJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRTdGF0dXMnfVxuICB9LFxuICAnL3Nlc3Npb24nOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdjcmVhdGVTZXNzaW9uJywgcGF5bG9hZFBhcmFtczoge1xuICAgICAgdmFsaWRhdGU6IChqc29uT2JqKSA9PiAoIWpzb25PYmouY2FwYWJpbGl0aWVzICYmICFqc29uT2JqLmRlc2lyZWRDYXBhYmlsaXRpZXMpICYmICd3ZSByZXF1aXJlIG9uZSBvZiBcImRlc2lyZWRDYXBhYmlsaXRpZXNcIiBvciBcImNhcGFiaWxpdGllc1wiIG9iamVjdCcsXG4gICAgICBvcHRpb25hbDogWydkZXNpcmVkQ2FwYWJpbGl0aWVzJywgJ3JlcXVpcmVkQ2FwYWJpbGl0aWVzJywgJ2NhcGFiaWxpdGllcyddfX1cbiAgfSxcbiAgJy9zZXNzaW9ucyc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0U2Vzc2lvbnMnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZCc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0U2Vzc2lvbid9LFxuICAgIERFTEVURToge2NvbW1hbmQ6ICdkZWxldGVTZXNzaW9uJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvdGltZW91dHMnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFRpbWVvdXRzJ30sIC8vIFczQyByb3V0ZVxuICAgIFBPU1Q6IHtjb21tYW5kOiAndGltZW91dHMnLCBwYXlsb2FkUGFyYW1zOiB7XG4gICAgICB2YWxpZGF0ZTogKGpzb25PYmosIHByb3RvY29sTmFtZSkgPT4ge1xuICAgICAgICBpZiAocHJvdG9jb2xOYW1lID09PSBQUk9UT0NPTFMuVzNDKSB7XG4gICAgICAgICAgaWYgKCF1dGlsLmhhc1ZhbHVlKGpzb25PYmouc2NyaXB0KSAmJiAhdXRpbC5oYXNWYWx1ZShqc29uT2JqLnBhZ2VMb2FkKSAmJiAhdXRpbC5oYXNWYWx1ZShqc29uT2JqLmltcGxpY2l0KSkge1xuICAgICAgICAgICAgcmV0dXJuICdXM0MgcHJvdG9jb2wgZXhwZWN0cyBhbnkgb2Ygc2NyaXB0LCBwYWdlTG9hZCBvciBpbXBsaWNpdCB0byBiZSBzZXQnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXV0aWwuaGFzVmFsdWUoanNvbk9iai50eXBlKSB8fCAhdXRpbC5oYXNWYWx1ZShqc29uT2JqLm1zKSkge1xuICAgICAgICAgICAgcmV0dXJuICdNSlNPTldQIHByb3RvY29sIHJlcXVpcmVzIHR5cGUgYW5kIG1zJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcHRpb25hbDogWyd0eXBlJywgJ21zJywgJ3NjcmlwdCcsICdwYWdlTG9hZCcsICdpbXBsaWNpdCddLFxuICAgIH19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3RpbWVvdXRzL2FzeW5jX3NjcmlwdCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2FzeW5jU2NyaXB0VGltZW91dCcsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydtcyddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvdGltZW91dHMvaW1wbGljaXRfd2FpdCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2ltcGxpY2l0V2FpdCcsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydtcyddfX1cbiAgfSxcbiAgLy8gSlNPTldQXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3dpbmRvd19oYW5kbGUnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFdpbmRvd0hhbmRsZSd9XG4gIH0sXG4gIC8vIFczQ1xuICAnL3Nlc3Npb24vOnNlc3Npb25JZC93aW5kb3cvaGFuZGxlJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRXaW5kb3dIYW5kbGUnfVxuICB9LFxuICAvLyBKU09OV1BcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvd2luZG93X2hhbmRsZXMnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFdpbmRvd0hhbmRsZXMnfVxuICB9LFxuICAvLyBXM0NcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvd2luZG93L2hhbmRsZXMnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFdpbmRvd0hhbmRsZXMnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC91cmwnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFVybCd9LFxuICAgIFBPU1Q6IHtjb21tYW5kOiAnc2V0VXJsJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3VybCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZm9yd2FyZCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2ZvcndhcmQnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9iYWNrJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnYmFjayd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3JlZnJlc2gnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdyZWZyZXNoJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZXhlY3V0ZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2V4ZWN1dGUnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsnc2NyaXB0JywgJ2FyZ3MnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2V4ZWN1dGVfYXN5bmMnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdleGVjdXRlQXN5bmMnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsnc2NyaXB0JywgJ2FyZ3MnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3NjcmVlbnNob3QnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFNjcmVlbnNob3QnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9pbWUvYXZhaWxhYmxlX2VuZ2luZXMnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2F2YWlsYWJsZUlNRUVuZ2luZXMnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9pbWUvYWN0aXZlX2VuZ2luZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0QWN0aXZlSU1FRW5naW5lJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvaW1lL2FjdGl2YXRlZCc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnaXNJTUVBY3RpdmF0ZWQnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9pbWUvZGVhY3RpdmF0ZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2RlYWN0aXZhdGVJTUVFbmdpbmUnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9pbWUvYWN0aXZhdGUnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdhY3RpdmF0ZUlNRUVuZ2luZScsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydlbmdpbmUnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2ZyYW1lJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnc2V0RnJhbWUnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsnaWQnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2ZyYW1lL3BhcmVudCc6IHtcbiAgICBQT1NUOiB7fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC93aW5kb3cnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFdpbmRvd0hhbmRsZSd9LFxuICAgIFBPU1Q6IHtjb21tYW5kOiAnc2V0V2luZG93JywgcGF5bG9hZFBhcmFtczoge1xuICAgICAgb3B0aW9uYWw6IFsnbmFtZScsICdoYW5kbGUnXSxcbiAgICAgIC8vIFJldHVybiBib3RoIHZhbHVlcyB0byBtYXRjaCBXM0MgYW5kIEpTT05XUCBwcm90b2NvbHNcbiAgICAgIG1ha2VBcmdzOiAoanNvbk9iaikgPT4ge1xuICAgICAgICBpZiAodXRpbC5oYXNWYWx1ZShqc29uT2JqLmhhbmRsZSkgJiYgIXV0aWwuaGFzVmFsdWUoanNvbk9iai5uYW1lKSkge1xuICAgICAgICAgIHJldHVybiBbanNvbk9iai5oYW5kbGUsIGpzb25PYmouaGFuZGxlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbC5oYXNWYWx1ZShqc29uT2JqLm5hbWUpICYmICF1dGlsLmhhc1ZhbHVlKGpzb25PYmouaGFuZGxlKSkge1xuICAgICAgICAgIHJldHVybiBbanNvbk9iai5uYW1lLCBqc29uT2JqLm5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbanNvbk9iai5uYW1lLCBqc29uT2JqLmhhbmRsZV07XG4gICAgICB9LFxuICAgICAgdmFsaWRhdGU6IChqc29uT2JqKSA9PiAoIXV0aWwuaGFzVmFsdWUoanNvbk9iai5uYW1lKSAmJiAhdXRpbC5oYXNWYWx1ZShqc29uT2JqLmhhbmRsZSkpXG4gICAgICAgICYmICd3ZSByZXF1aXJlIG9uZSBvZiBcIm5hbWVcIiBvciBcImhhbmRsZVwiIHRvIGJlIHNldCcsXG4gICAgfX0sXG4gICAgREVMRVRFOiB7Y29tbWFuZDogJ2Nsb3NlV2luZG93J31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvd2luZG93Lzp3aW5kb3doYW5kbGUvc2l6ZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0V2luZG93U2l6ZSd9LFxuICAgIFBPU1Q6IHt9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3dpbmRvdy86d2luZG93aGFuZGxlL3Bvc2l0aW9uJzoge1xuICAgIFBPU1Q6IHt9LFxuICAgIEdFVDoge31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvd2luZG93Lzp3aW5kb3doYW5kbGUvbWF4aW1pemUnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdtYXhpbWl6ZVdpbmRvdyd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2Nvb2tpZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0Q29va2llcyd9LFxuICAgIFBPU1Q6IHtjb21tYW5kOiAnc2V0Q29va2llJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ2Nvb2tpZSddfX0sXG4gICAgREVMRVRFOiB7Y29tbWFuZDogJ2RlbGV0ZUNvb2tpZXMnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9jb29raWUvOm5hbWUnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldENvb2tpZSd9LFxuICAgIERFTEVURToge2NvbW1hbmQ6ICdkZWxldGVDb29raWUnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9zb3VyY2UnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFBhZ2VTb3VyY2UnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC90aXRsZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAndGl0bGUnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9lbGVtZW50Jzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZmluZEVsZW1lbnQnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsndXNpbmcnLCAndmFsdWUnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnRzJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZmluZEVsZW1lbnRzJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3VzaW5nJywgJ3ZhbHVlJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9lbGVtZW50L2FjdGl2ZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnYWN0aXZlJ30sIC8vIFczQzogaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmRyaXZlci93ZWJkcml2ZXItc3BlYy5odG1sI2Rmbi1nZXQtYWN0aXZlLWVsZW1lbnRcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2FjdGl2ZSd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZCc6IHtcbiAgICBHRVQ6IHt9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZC9lbGVtZW50Jzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZmluZEVsZW1lbnRGcm9tRWxlbWVudCcsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWyd1c2luZycsICd2YWx1ZSddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL2VsZW1lbnRzJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZmluZEVsZW1lbnRzRnJvbUVsZW1lbnQnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsndXNpbmcnLCAndmFsdWUnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZC9jbGljayc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2NsaWNrJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL3N1Ym1pdCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3N1Ym1pdCd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZC90ZXh0Jzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRUZXh0J31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL3ZhbHVlJzoge1xuICAgIFBPU1Q6IHtcbiAgICAgIGNvbW1hbmQ6ICdzZXRWYWx1ZScsXG4gICAgICBwYXlsb2FkUGFyYW1zOiB7XG4gICAgICAgIHZhbGlkYXRlOiAoanNvbk9iaikgPT4gKCF1dGlsLmhhc1ZhbHVlKGpzb25PYmoudmFsdWUpICYmICF1dGlsLmhhc1ZhbHVlKGpzb25PYmoudGV4dCkpICYmXG4gICAgICAgICAgICAnd2UgcmVxdWlyZSBvbmUgb2YgXCJ0ZXh0XCIgb3IgXCJ2YWx1ZVwiIHBhcmFtcycsXG4gICAgICAgIG9wdGlvbmFsOiBbJ3ZhbHVlJywgJ3RleHQnXSxcbiAgICAgICAgLy8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgYXJndW1lbnQgY29uc3RydWN0b3IgYmVjYXVzZSBvZiB0aGUgc3BlY2lhbFxuICAgICAgICAvLyBsb2dpYyBoZXJlLiBCYXNpY2FsbHkgd2Ugd2FudCB0byBhY2NlcHQgZWl0aGVyIGEgdmFsdWUgKG9sZCBKU09OV1ApXG4gICAgICAgIC8vIG9yIGEgdGV4dCAobmV3IFczQykgcGFyYW1ldGVyLCBidXQgb25seSBzZW5kIG9uZSBvZiB0aGVtIHRvIHRoZVxuICAgICAgICAvLyBjb21tYW5kIChub3QgYm90aCkuIFByZWZlciAndmFsdWUnIHNpbmNlIGl0J3MgbW9yZVxuICAgICAgICAvLyBiYWNrd2FyZC1jb21wYXRpYmxlLlxuICAgICAgICBtYWtlQXJnczogKGpzb25PYmopID0+IFtqc29uT2JqLnZhbHVlIHx8IGpzb25PYmoudGV4dF0sXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9rZXlzJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAna2V5cycsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWyd2YWx1ZSddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL25hbWUnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldE5hbWUnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9lbGVtZW50LzplbGVtZW50SWQvY2xlYXInOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdjbGVhcid9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZC9zZWxlY3RlZCc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZWxlbWVudFNlbGVjdGVkJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL2VuYWJsZWQnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2VsZW1lbnRFbmFibGVkJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL2F0dHJpYnV0ZS86bmFtZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0QXR0cmlidXRlJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL2VxdWFscy86b3RoZXJJZCc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZXF1YWxzRWxlbWVudCd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZC9kaXNwbGF5ZWQnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2VsZW1lbnREaXNwbGF5ZWQnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9lbGVtZW50LzplbGVtZW50SWQvbG9jYXRpb24nOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldExvY2F0aW9uJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL2xvY2F0aW9uX2luX3ZpZXcnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldExvY2F0aW9uSW5WaWV3J31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL3NpemUnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFNpemUnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9lbGVtZW50LzplbGVtZW50SWQvY3NzLzpwcm9wZXJ0eU5hbWUnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldENzc1Byb3BlcnR5J31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvb3JpZW50YXRpb24nOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldE9yaWVudGF0aW9uJ30sXG4gICAgUE9TVDoge2NvbW1hbmQ6ICdzZXRPcmllbnRhdGlvbicsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydvcmllbnRhdGlvbiddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvcm90YXRpb24nOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFJvdGF0aW9uJ30sXG4gICAgUE9TVDoge2NvbW1hbmQ6ICdzZXRSb3RhdGlvbicsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWyd4JywgJ3knLCAneiddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvbW92ZXRvJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnbW92ZVRvJywgcGF5bG9hZFBhcmFtczoge29wdGlvbmFsOiBbJ2VsZW1lbnQnLCAneG9mZnNldCcsICd5b2Zmc2V0J119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9jbGljayc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2NsaWNrQ3VycmVudCcsIHBheWxvYWRQYXJhbXM6IHtvcHRpb25hbDogWydidXR0b24nXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2J1dHRvbmRvd24nOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdidXR0b25Eb3duJywgcGF5bG9hZFBhcmFtczoge29wdGlvbmFsOiBbJ2J1dHRvbiddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYnV0dG9udXAnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdidXR0b25VcCcsIHBheWxvYWRQYXJhbXM6IHtvcHRpb25hbDogWydidXR0b24nXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2RvdWJsZWNsaWNrJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZG91YmxlQ2xpY2snfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC90b3VjaC9jbGljayc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2NsaWNrJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ2VsZW1lbnQnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3RvdWNoL2Rvd24nOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICd0b3VjaERvd24nLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsneCcsICd5J119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC90b3VjaC91cCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3RvdWNoVXAnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsneCcsICd5J119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC90b3VjaC9tb3ZlJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAndG91Y2hNb3ZlJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3gnLCAneSddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvdG91Y2gvc2Nyb2xsJzoge1xuICAgIFBPU1Q6IHt9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3RvdWNoL2RvdWJsZWNsaWNrJzoge1xuICAgIFBPU1Q6IHt9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FjdGlvbnMnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdwZXJmb3JtQWN0aW9ucycsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydhY3Rpb25zJ119fSxcbiAgICBERUxFVEU6IHtjb21tYW5kOiAncmVsZWFzZUFjdGlvbnMnfSxcbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvdG91Y2gvbG9uZ2NsaWNrJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAndG91Y2hMb25nQ2xpY2snLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsnZWxlbWVudHMnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3RvdWNoL2ZsaWNrJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZmxpY2snLCBwYXlsb2FkUGFyYW1zOiB7b3B0aW9uYWw6IFsnZWxlbWVudCcsICd4c3BlZWQnLCAneXNwZWVkJywgJ3hvZmZzZXQnLCAneW9mZnNldCcsICdzcGVlZCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvbG9jYXRpb24nOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldEdlb0xvY2F0aW9uJ30sXG4gICAgUE9TVDoge2NvbW1hbmQ6ICdzZXRHZW9Mb2NhdGlvbicsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydsb2NhdGlvbiddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvbG9jYWxfc3RvcmFnZSc6IHtcbiAgICBHRVQ6IHt9LFxuICAgIFBPU1Q6IHt9LFxuICAgIERFTEVURToge31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvbG9jYWxfc3RvcmFnZS9rZXkvOmtleSc6IHtcbiAgICBHRVQ6IHt9LFxuICAgIERFTEVURToge31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvbG9jYWxfc3RvcmFnZS9zaXplJzoge1xuICAgIEdFVDoge31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvc2Vzc2lvbl9zdG9yYWdlJzoge1xuICAgIEdFVDoge30sXG4gICAgUE9TVDoge30sXG4gICAgREVMRVRFOiB7fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9zZXNzaW9uX3N0b3JhZ2Uva2V5LzprZXknOiB7XG4gICAgR0VUOiB7fSxcbiAgICBERUxFVEU6IHt9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3Nlc3Npb25fc3RvcmFnZS9zaXplJzoge1xuICAgIEdFVDoge31cbiAgfSxcbiAgLy8gU2VsZW5pdW0gNCBjbGllbnRzXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3NlL2xvZyc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2dldExvZycsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWyd0eXBlJ119fVxuICB9LFxuICAvLyBTZWxlbml1bSA0IGNsaWVudHNcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvc2UvbG9nL3R5cGVzJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRMb2dUeXBlcyd9XG4gIH0sXG4gIC8vIG1qc29ud2lyZSwgYXBwaXVtIGNsaWVudHNcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvbG9nJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZ2V0TG9nJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3R5cGUnXX19XG4gIH0sXG4gIC8vIG1qc29ud2lyZSwgYXBwaXVtIGNsaWVudHNcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvbG9nL3R5cGVzJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRMb2dUeXBlcyd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGxpY2F0aW9uX2NhY2hlL3N0YXR1cyc6IHtcbiAgICBHRVQ6IHt9XG4gIH0sXG5cbiAgLy9cbiAgLy8gbWpzb253aXJlXG4gIC8vXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2NvbnRleHQnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldEN1cnJlbnRDb250ZXh0J30sXG4gICAgUE9TVDoge2NvbW1hbmQ6ICdzZXRDb250ZXh0JywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ25hbWUnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2NvbnRleHRzJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRDb250ZXh0cyd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZC9wYWdlSW5kZXgnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFBhZ2VJbmRleCd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL25ldHdvcmtfY29ubmVjdGlvbic6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0TmV0d29ya0Nvbm5lY3Rpb24nfSxcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3NldE5ldHdvcmtDb25uZWN0aW9uJywgcGF5bG9hZFBhcmFtczoge3Vud3JhcDogJ3BhcmFtZXRlcnMnLCByZXF1aXJlZDogWyd0eXBlJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC90b3VjaC9wZXJmb3JtJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAncGVyZm9ybVRvdWNoJywgcGF5bG9hZFBhcmFtczoge3dyYXA6ICdhY3Rpb25zJywgcmVxdWlyZWQ6IFsnYWN0aW9ucyddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvdG91Y2gvbXVsdGkvcGVyZm9ybSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3BlcmZvcm1NdWx0aUFjdGlvbicsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydhY3Rpb25zJ10sIG9wdGlvbmFsOiBbJ2VsZW1lbnRJZCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvcmVjZWl2ZV9hc3luY19yZXNwb25zZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3JlY2VpdmVBc3luY1Jlc3BvbnNlJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3N0YXR1cycsICd2YWx1ZSddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9zaGFrZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ21vYmlsZVNoYWtlJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9zeXN0ZW1fdGltZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0RGV2aWNlVGltZScsIHBheWxvYWRQYXJhbXM6IHtvcHRpb25hbDogWydmb3JtYXQnXX19LFxuICAgIFBPU1Q6IHtjb21tYW5kOiAnZ2V0RGV2aWNlVGltZScsIHBheWxvYWRQYXJhbXM6IHtvcHRpb25hbDogWydmb3JtYXQnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvbG9jayc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2xvY2snLCBwYXlsb2FkUGFyYW1zOiB7b3B0aW9uYWw6IFsnc2Vjb25kcyddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS91bmxvY2snOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICd1bmxvY2snfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL2lzX2xvY2tlZCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2lzTG9ja2VkJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL3N0YXJ0X3JlY29yZGluZ19zY3JlZW4nOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdzdGFydFJlY29yZGluZ1NjcmVlbicsIHBheWxvYWRQYXJhbXM6IHtvcHRpb25hbDogWydvcHRpb25zJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vc3RvcF9yZWNvcmRpbmdfc2NyZWVuJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnc3RvcFJlY29yZGluZ1NjcmVlbicsIHBheWxvYWRQYXJhbXM6IHtvcHRpb25hbDogWydvcHRpb25zJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vcGVyZm9ybWFuY2VEYXRhL3R5cGVzJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZ2V0UGVyZm9ybWFuY2VEYXRhVHlwZXMnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZ2V0UGVyZm9ybWFuY2VEYXRhJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZ2V0UGVyZm9ybWFuY2VEYXRhJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3BhY2thZ2VOYW1lJywgJ2RhdGFUeXBlJ10sIG9wdGlvbmFsOiBbJ2RhdGFSZWFkVGltZW91dCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9wcmVzc19rZXljb2RlJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAncHJlc3NLZXlDb2RlJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ2tleWNvZGUnXSwgb3B0aW9uYWw6IFsnbWV0YXN0YXRlJywgJ2ZsYWdzJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL2xvbmdfcHJlc3Nfa2V5Y29kZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2xvbmdQcmVzc0tleUNvZGUnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsna2V5Y29kZSddLCBvcHRpb25hbDogWydtZXRhc3RhdGUnLCAnZmxhZ3MnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvZmluZ2VyX3ByaW50Jzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZmluZ2VycHJpbnQnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsnZmluZ2VycHJpbnRJZCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9zZW5kX3Ntcyc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3NlbmRTTVMnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsncGhvbmVOdW1iZXInLCAnbWVzc2FnZSddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9nc21fY2FsbCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2dzbUNhbGwnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsncGhvbmVOdW1iZXInLCAnYWN0aW9uJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL2dzbV9zaWduYWwnOiB7XG4gICAgUE9TVDoge1xuICAgICAgY29tbWFuZDogJ2dzbVNpZ25hbCcsXG4gICAgICBwYXlsb2FkUGFyYW1zOiB7XG4gICAgICAgIHZhbGlkYXRlOiAoanNvbk9iaikgPT4gKCF1dGlsLmhhc1ZhbHVlKGpzb25PYmouc2lnbmFsU3RyZW5ndGgpICYmICF1dGlsLmhhc1ZhbHVlKGpzb25PYmouc2lnbmFsU3RyZW5naCkpICYmXG4gICAgICAgICAgICAnd2UgcmVxdWlyZSBvbmUgb2YgXCJzaWduYWxTdHJlbmd0aFwiIG9yIFwic2lnbmFsU3RyZW5naFwiIHBhcmFtcycsXG4gICAgICAgIG9wdGlvbmFsOiBbJ3NpZ25hbFN0cmVuZ3RoJywgJ3NpZ25hbFN0cmVuZ2gnXSxcbiAgICAgICAgLy8gYmFja3dhcmQtY29tcGF0aWJsZS4gc29uT2JqLnNpZ25hbFN0cmVuZ3RoIGNhbiBiZSAwXG4gICAgICAgIG1ha2VBcmdzOiAoanNvbk9iaikgPT4gW3V0aWwuaGFzVmFsdWUoanNvbk9iai5zaWduYWxTdHJlbmd0aCkgPyBqc29uT2JqLnNpZ25hbFN0cmVuZ3RoIDoganNvbk9iai5zaWduYWxTdHJlbmdoXVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9nc21fdm9pY2UnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdnc21Wb2ljZScsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydzdGF0ZSddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9wb3dlcl9jYXBhY2l0eSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3Bvd2VyQ2FwYWNpdHknLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsncGVyY2VudCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9wb3dlcl9hYyc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3Bvd2VyQUMnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsnc3RhdGUnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvbmV0d29ya19zcGVlZCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ25ldHdvcmtTcGVlZCcsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWyduZXRzcGVlZCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9rZXlldmVudCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2tleWV2ZW50JywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ2tleWNvZGUnXSwgb3B0aW9uYWw6IFsnbWV0YXN0YXRlJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL3JvdGF0ZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ21vYmlsZVJvdGF0aW9uJywgcGF5bG9hZFBhcmFtczoge1xuICAgICAgcmVxdWlyZWQ6IFsneCcsICd5JywgJ3JhZGl1cycsICdyb3RhdGlvbicsICd0b3VjaENvdW50JywgJ2R1cmF0aW9uJ10sXG4gICAgICBvcHRpb25hbDogWydlbGVtZW50J10gfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9jdXJyZW50X2FjdGl2aXR5Jzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRDdXJyZW50QWN0aXZpdHknfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL2N1cnJlbnRfcGFja2FnZSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0Q3VycmVudFBhY2thZ2UnfVxuICB9LFxuICAvL3JlZ2lvbiBBcHBsaWNhdGlvbnMgTWFuYWdlbWVudFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL2luc3RhbGxfYXBwJzoge1xuICAgIFBPU1Q6IHtcbiAgICAgIGNvbW1hbmQ6ICdpbnN0YWxsQXBwJyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgcmVxdWlyZWQ6IFsnYXBwUGF0aCddLFxuICAgICAgICBvcHRpb25hbDogWydvcHRpb25zJ11cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvYWN0aXZhdGVfYXBwJzoge1xuICAgIFBPU1Q6IHtcbiAgICAgIGNvbW1hbmQ6ICdhY3RpdmF0ZUFwcCcsXG4gICAgICBwYXlsb2FkUGFyYW1zOiB7XG4gICAgICAgIHJlcXVpcmVkOiBbWydhcHBJZCddLCBbJ2J1bmRsZUlkJ11dLFxuICAgICAgICBvcHRpb25hbDogWydvcHRpb25zJ11cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvcmVtb3ZlX2FwcCc6IHtcbiAgICBQT1NUOiB7XG4gICAgICBjb21tYW5kOiAncmVtb3ZlQXBwJyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgcmVxdWlyZWQ6IFtbJ2FwcElkJ10sIFsnYnVuZGxlSWQnXV0sXG4gICAgICAgIG9wdGlvbmFsOiBbJ29wdGlvbnMnXVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS90ZXJtaW5hdGVfYXBwJzoge1xuICAgIFBPU1Q6IHtcbiAgICAgIGNvbW1hbmQ6ICd0ZXJtaW5hdGVBcHAnLFxuICAgICAgcGF5bG9hZFBhcmFtczoge1xuICAgICAgICByZXF1aXJlZDogW1snYXBwSWQnXSwgWydidW5kbGVJZCddXSxcbiAgICAgICAgb3B0aW9uYWw6IFsnb3B0aW9ucyddXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL2FwcF9pbnN0YWxsZWQnOiB7XG4gICAgUE9TVDoge1xuICAgICAgY29tbWFuZDogJ2lzQXBwSW5zdGFsbGVkJyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgcmVxdWlyZWQ6IFtbJ2FwcElkJ10sIFsnYnVuZGxlSWQnXV1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvYXBwX3N0YXRlJzoge1xuICAgIEdFVDoge1xuICAgICAgY29tbWFuZDogJ3F1ZXJ5QXBwU3RhdGUnLFxuICAgICAgcGF5bG9hZFBhcmFtczoge1xuICAgICAgICByZXF1aXJlZDogW1snYXBwSWQnXSwgWydidW5kbGVJZCddXVxuICAgICAgfVxuICAgIH0sXG4gICAgUE9TVDoge1xuICAgICAgY29tbWFuZDogJ3F1ZXJ5QXBwU3RhdGUnLFxuICAgICAgcGF5bG9hZFBhcmFtczoge1xuICAgICAgICByZXF1aXJlZDogW1snYXBwSWQnXSwgWydidW5kbGVJZCddXVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLy9lbmRyZWdpb25cbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS9oaWRlX2tleWJvYXJkJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnaGlkZUtleWJvYXJkJywgcGF5bG9hZFBhcmFtczoge29wdGlvbmFsOiBbJ3N0cmF0ZWd5JywgJ2tleScsICdrZXlDb2RlJywgJ2tleU5hbWUnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvaXNfa2V5Ym9hcmRfc2hvd24nOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2lzS2V5Ym9hcmRTaG93bid9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvcHVzaF9maWxlJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAncHVzaEZpbGUnLCBwYXlsb2FkUGFyYW1zOiB7cmVxdWlyZWQ6IFsncGF0aCcsICdkYXRhJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL3B1bGxfZmlsZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3B1bGxGaWxlJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3BhdGgnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvcHVsbF9mb2xkZXInOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdwdWxsRm9sZGVyJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3BhdGgnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvdG9nZ2xlX2FpcnBsYW5lX21vZGUnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICd0b2dnbGVGbGlnaHRNb2RlJ31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2RldmljZS90b2dnbGVfZGF0YSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3RvZ2dsZURhdGEnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL3RvZ2dsZV93aWZpJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAndG9nZ2xlV2lGaSd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvdG9nZ2xlX2xvY2F0aW9uX3NlcnZpY2VzJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAndG9nZ2xlTG9jYXRpb25TZXJ2aWNlcyd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2Uvb3Blbl9ub3RpZmljYXRpb25zJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnb3Blbk5vdGlmaWNhdGlvbnMnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL3N0YXJ0X2FjdGl2aXR5Jzoge1xuICAgIFBPU1Q6IHtcbiAgICAgIGNvbW1hbmQ6ICdzdGFydEFjdGl2aXR5JyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgcmVxdWlyZWQ6IFsnYXBwUGFja2FnZScsICdhcHBBY3Rpdml0eSddLFxuICAgICAgICBvcHRpb25hbDogWydhcHBXYWl0UGFja2FnZScsICdhcHBXYWl0QWN0aXZpdHknLCAnaW50ZW50QWN0aW9uJyxcbiAgICAgICAgICAnaW50ZW50Q2F0ZWdvcnknLCAnaW50ZW50RmxhZ3MnLCAnb3B0aW9uYWxJbnRlbnRBcmd1bWVudHMnLCAnZG9udFN0b3BBcHBPblJlc2V0J11cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2Uvc3lzdGVtX2JhcnMnOiB7XG4gICAgR0VUOiB7Y29tbWFuZDogJ2dldFN5c3RlbUJhcnMnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZGV2aWNlL2Rpc3BsYXlfZGVuc2l0eSc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0RGlzcGxheURlbnNpdHknfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vc2ltdWxhdG9yL3RvdWNoX2lkJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAndG91Y2hJZCcsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydtYXRjaCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL3NpbXVsYXRvci90b2dnbGVfdG91Y2hfaWRfZW5yb2xsbWVudCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3RvZ2dsZUVucm9sbFRvdWNoSWQnLCBwYXlsb2FkUGFyYW1zOiB7b3B0aW9uYWw6IFsnZW5hYmxlZCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2FwcC9sYXVuY2gnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdsYXVuY2hBcHAnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vYXBwL2Nsb3NlJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnY2xvc2VBcHAnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vYXBwL3Jlc2V0Jzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAncmVzZXQnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vYXBwL2JhY2tncm91bmQnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdiYWNrZ3JvdW5kJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3NlY29uZHMnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9hcHAvZW5kX3Rlc3RfY292ZXJhZ2UnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdlbmRDb3ZlcmFnZScsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydpbnRlbnQnLCAncGF0aCddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2FwcC9zdHJpbmdzJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZ2V0U3RyaW5ncycsIHBheWxvYWRQYXJhbXM6IHtvcHRpb25hbDogWydsYW5ndWFnZScsICdzdHJpbmdGaWxlJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZWxlbWVudC86ZWxlbWVudElkL3ZhbHVlJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnc2V0VmFsdWVJbW1lZGlhdGUnLCBwYXlsb2FkUGFyYW1zOiB7XG4gICAgICB2YWxpZGF0ZTogKGpzb25PYmopID0+ICghdXRpbC5oYXNWYWx1ZShqc29uT2JqLnZhbHVlKSAmJiAhdXRpbC5oYXNWYWx1ZShqc29uT2JqLnRleHQpKSAmJlxuICAgICAgICAgICd3ZSByZXF1aXJlIG9uZSBvZiBcInRleHRcIiBvciBcInZhbHVlXCIgcGFyYW1zJyxcbiAgICAgIG9wdGlvbmFsOiBbJ3ZhbHVlJywgJ3RleHQnXSxcbiAgICAgIC8vIFdlIHdhbnQgdG8gZWl0aGVyIGEgdmFsdWUgKG9sZCBKU09OV1ApIG9yIGEgdGV4dCAobmV3IFczQykgcGFyYW1ldGVyLFxuICAgICAgLy8gYnV0IG9ubHkgc2VuZCBvbmUgb2YgdGhlbSB0byB0aGUgY29tbWFuZCAobm90IGJvdGgpLlxuICAgICAgLy8gUHJlZmVyICd2YWx1ZScgc2luY2UgaXQncyBtb3JlIGJhY2t3YXJkLWNvbXBhdGlibGUuXG4gICAgICBtYWtlQXJnczogKGpzb25PYmopID0+IFtqc29uT2JqLnZhbHVlIHx8IGpzb25PYmoudGV4dF0sXG4gICAgfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2VsZW1lbnQvOmVsZW1lbnRJZC9yZXBsYWNlX3ZhbHVlJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAncmVwbGFjZVZhbHVlJywgcGF5bG9hZFBhcmFtczoge1xuICAgICAgdmFsaWRhdGU6IChqc29uT2JqKSA9PiAoIXV0aWwuaGFzVmFsdWUoanNvbk9iai52YWx1ZSkgJiYgIXV0aWwuaGFzVmFsdWUoanNvbk9iai50ZXh0KSkgJiZcbiAgICAgICAgICAnd2UgcmVxdWlyZSBvbmUgb2YgXCJ0ZXh0XCIgb3IgXCJ2YWx1ZVwiIHBhcmFtcycsXG4gICAgICBvcHRpb25hbDogWyd2YWx1ZScsICd0ZXh0J10sXG4gICAgICAvLyBXZSB3YW50IHRvIGVpdGhlciBhIHZhbHVlIChvbGQgSlNPTldQKSBvciBhIHRleHQgKG5ldyBXM0MpIHBhcmFtZXRlcixcbiAgICAgIC8vIGJ1dCBvbmx5IHNlbmQgb25lIG9mIHRoZW0gdG8gdGhlIGNvbW1hbmQgKG5vdCBib3RoKS5cbiAgICAgIC8vIFByZWZlciAndmFsdWUnIHNpbmNlIGl0J3MgbW9yZSBiYWNrd2FyZC1jb21wYXRpYmxlLlxuICAgICAgbWFrZUFyZ3M6IChqc29uT2JqKSA9PiBbanNvbk9iai52YWx1ZSA/PyBqc29uT2JqLnRleHQgPz8gJyddLFxuICAgIH19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9zZXR0aW5ncyc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3VwZGF0ZVNldHRpbmdzJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3NldHRpbmdzJ119fSxcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0U2V0dGluZ3MnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vcmVjZWl2ZV9hc3luY19yZXNwb25zZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3JlY2VpdmVBc3luY1Jlc3BvbnNlJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3Jlc3BvbnNlJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hcHBpdW0vZXhlY3V0ZV9kcml2ZXInOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdleGVjdXRlRHJpdmVyU2NyaXB0JywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3NjcmlwdCddLCBvcHRpb25hbDogWyd0eXBlJywgJ3RpbWVvdXQnXX19XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9ldmVudHMnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdnZXRMb2dFdmVudHMnLCBwYXlsb2FkUGFyYW1zOiB7b3B0aW9uYWw6IFsndHlwZSddfX1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2xvZ19ldmVudCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ2xvZ0N1c3RvbUV2ZW50JywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3ZlbmRvcicsICdldmVudCddfX1cbiAgfSxcblxuXG4gIC8qXG4gICAqIFRoZSBXM0Mgc3BlYyBoYXMgc29tZSBjaGFuZ2VzIHRvIHRoZSB3aXJlIHByb3RvY29sLlxuICAgKiBodHRwczovL3czYy5naXRodWIuaW8vd2ViZHJpdmVyL3dlYmRyaXZlci1zcGVjLmh0bWxcbiAgICogQmVnaW4gdG8gYWRkIHRob3NlIGNoYW5nZXMgaGVyZSwga2VlcGluZyB0aGUgb2xkIHZlcnNpb25cbiAgICogc2luY2UgY2xpZW50cyBzdGlsbCBpbXBsZW1lbnQgdGhlbS5cbiAgICovXG4gIC8vIG9sZCBhbGVydHNcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYWxlcnRfdGV4dCc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0QWxlcnRUZXh0J30sXG4gICAgUE9TVDoge1xuICAgICAgY29tbWFuZDogJ3NldEFsZXJ0VGV4dCcsXG4gICAgICBwYXlsb2FkUGFyYW1zOiBTRVRfQUxFUlRfVEVYVF9QQVlMT0FEX1BBUkFNUyxcbiAgICB9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FjY2VwdF9hbGVydCc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3Bvc3RBY2NlcHRBbGVydCd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2Rpc21pc3NfYWxlcnQnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdwb3N0RGlzbWlzc0FsZXJ0J31cbiAgfSxcbiAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmRyaXZlci93ZWJkcml2ZXItc3BlYy5odG1sI3VzZXItcHJvbXB0c1xuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9hbGVydC90ZXh0Jzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRBbGVydFRleHQnfSxcbiAgICBQT1NUOiB7XG4gICAgICBjb21tYW5kOiAnc2V0QWxlcnRUZXh0JyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IFNFVF9BTEVSVF9URVhUX1BBWUxPQURfUEFSQU1TLFxuICAgIH1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYWxlcnQvYWNjZXB0Jzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAncG9zdEFjY2VwdEFsZXJ0J31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYWxlcnQvZGlzbWlzcyc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ3Bvc3REaXNtaXNzQWxlcnQnfVxuICB9LFxuICAvLyBodHRwczovL3czYy5naXRodWIuaW8vd2ViZHJpdmVyL3dlYmRyaXZlci1zcGVjLmh0bWwjZ2V0LWVsZW1lbnQtcmVjdFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9lbGVtZW50LzplbGVtZW50SWQvcmVjdCc6IHtcbiAgICBHRVQ6IHtjb21tYW5kOiAnZ2V0RWxlbWVudFJlY3QnfVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9leGVjdXRlL3N5bmMnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdleGVjdXRlJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3NjcmlwdCcsICdhcmdzJ119fVxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC9leGVjdXRlL2FzeW5jJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZXhlY3V0ZUFzeW5jJywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3NjcmlwdCcsICdhcmdzJ119fVxuICB9LFxuICAvLyBQcmUtVzNDIGVuZHBvaW50IGZvciBlbGVtZW50IHNjcmVlbnNob3RcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvc2NyZWVuc2hvdC86ZWxlbWVudElkJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRFbGVtZW50U2NyZWVuc2hvdCd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2VsZW1lbnQvOmVsZW1lbnRJZC9zY3JlZW5zaG90Jzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRFbGVtZW50U2NyZWVuc2hvdCd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3dpbmRvdy9yZWN0Jzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRXaW5kb3dSZWN0J30sXG4gICAgUE9TVDoge2NvbW1hbmQ6ICdzZXRXaW5kb3dSZWN0JywgcGF5bG9hZFBhcmFtczoge3JlcXVpcmVkOiBbJ3gnLCAneScsICd3aWR0aCcsICdoZWlnaHQnXX19LFxuICB9LFxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC93aW5kb3cvbWF4aW1pemUnOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdtYXhpbWl6ZVdpbmRvdyd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3dpbmRvdy9taW5pbWl6ZSc6IHtcbiAgICBQT1NUOiB7Y29tbWFuZDogJ21pbmltaXplV2luZG93J31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvd2luZG93L2Z1bGxzY3JlZW4nOiB7XG4gICAgUE9TVDoge2NvbW1hbmQ6ICdmdWxsU2NyZWVuV2luZG93J31cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvZWxlbWVudC86ZWxlbWVudElkL3Byb3BlcnR5LzpuYW1lJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRQcm9wZXJ0eSd9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2Uvc2V0X2NsaXBib2FyZCc6IHtcbiAgICBQT1NUOiB7XG4gICAgICBjb21tYW5kOiAnc2V0Q2xpcGJvYXJkJyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgcmVxdWlyZWQ6IFsnY29udGVudCddLFxuICAgICAgICBvcHRpb25hbDogW1xuICAgICAgICAgICdjb250ZW50VHlwZScsXG4gICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL2FwcGl1bS9kZXZpY2UvZ2V0X2NsaXBib2FyZCc6IHtcbiAgICBQT1NUOiB7XG4gICAgICBjb21tYW5kOiAnZ2V0Q2xpcGJvYXJkJyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgb3B0aW9uYWw6IFtcbiAgICAgICAgICAnY29udGVudFR5cGUnLFxuICAgICAgICBdXG4gICAgICB9LFxuICAgIH1cbiAgfSxcbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvYXBwaXVtL2NvbXBhcmVfaW1hZ2VzJzoge1xuICAgIFBPU1Q6IHtcbiAgICAgIGNvbW1hbmQ6ICdjb21wYXJlSW1hZ2VzJyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgcmVxdWlyZWQ6IFsnbW9kZScsICdmaXJzdEltYWdlJywgJ3NlY29uZEltYWdlJ10sXG4gICAgICAgIG9wdGlvbmFsOiBbJ29wdGlvbnMnXVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG5cbiAgLy8gY2hyb21pdW0gZGV2dG9vbHNcbiAgLy8gaHR0cHM6Ly9jaHJvbWl1bS5nb29nbGVzb3VyY2UuY29tL2Nocm9taXVtL3NyYy8rL21hc3Rlci9jaHJvbWUvdGVzdC9jaHJvbWVkcml2ZXIvc2VydmVyL2h0dHBfaGFuZGxlci5jY1xuICAnL3Nlc3Npb24vOnNlc3Npb25JZC86dmVuZG9yL2NkcC9leGVjdXRlJzoge1xuICAgIFBPU1Q6IHtjb21tYW5kOiAnZXhlY3V0ZUNkcCcsIHBheWxvYWRQYXJhbXM6IHtyZXF1aXJlZDogWydjbWQnLCAncGFyYW1zJ119fVxuICB9LFxuXG4gIC8vcmVnaW9uIFdlYmF1dGhuXG4gIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi93ZWJhdXRobi0yLyNzY3RuLWF1dG9tYXRpb24tYWRkLXZpcnR1YWwtYXV0aGVudGljYXRvclxuXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3dlYmF1dGhuL2F1dGhlbnRpY2F0b3InOiB7XG4gICAgUE9TVDoge1xuICAgICAgY29tbWFuZDogJ2FkZFZpcnR1YWxBdXRoZW50aWNhdG9yJyxcbiAgICAgIHBheWxvYWRQYXJhbXM6IHtcbiAgICAgICAgcmVxdWlyZWQ6IFsncHJvdG9jb2wnLCAndHJhbnNwb3J0J10sXG4gICAgICAgIG9wdGlvbmFsOiBbJ2hhc1Jlc2lkZW50S2V5JywgJ2hhc1VzZXJWZXJpZmljYXRpb24nLCAnaXNVc2VyQ29uc2VudGluZycsICdpc1VzZXJWZXJpZmllZCddLFxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC93ZWJhdXRobi9hdXRoZW50aWNhdG9yLzphdXRoZW50aWNhdG9ySWQnOiB7XG4gICAgREVMRVRFOiB7XG4gICAgICBjb21tYW5kOiAncmVtb3ZlVmlydHVhbEF1dGhlbnRpY2F0b3InXG4gICAgfVxuICB9LFxuXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3dlYmF1dGhuL2F1dGhlbnRpY2F0b3IvOmF1dGhlbnRpY2F0b3JJZC9jcmVkZW50aWFsJzoge1xuICAgIFBPU1Q6IHtcbiAgICAgIGNvbW1hbmQ6ICdhZGRBdXRoQ3JlZGVudGlhbCcsXG4gICAgICBwYXlsb2FkUGFyYW1zOiB7XG4gICAgICAgIHJlcXVpcmVkOiBbJ2NyZWRlbnRpYWxJZCcsICdpc1Jlc2lkZW50Q3JlZGVudGlhbCcsICdycElkJywgJ3ByaXZhdGVLZXknXSxcbiAgICAgICAgb3B0aW9uYWw6IFsndXNlckhhbmRsZScsICdzaWduQ291bnQnXSxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgJy9zZXNzaW9uLzpzZXNzaW9uSWQvd2ViYXV0aG4vYXV0aGVudGljYXRvci86YXV0aGVudGljYXRvcklkL2NyZWRlbnRpYWxzJzoge1xuICAgIEdFVDoge2NvbW1hbmQ6ICdnZXRBdXRoQ3JlZGVudGlhbCd9LFxuICAgIERFTEVURToge2NvbW1hbmQ6ICdyZW1vdmVBbGxBdXRoQ3JlZGVudGlhbHMnfSxcbiAgfSxcblxuICAnL3Nlc3Npb24vOnNlc3Npb25JZC93ZWJhdXRobi9hdXRoZW50aWNhdG9yLzphdXRoZW50aWNhdG9ySWQvY3JlZGVudGlhbHMvOmNyZWRlbnRpYWxJZCc6IHtcbiAgICBERUxFVEU6IHtjb21tYW5kOiAncmVtb3ZlQXV0aENyZWRlbnRpYWwnfVxuICB9LFxuXG4gICcvc2Vzc2lvbi86c2Vzc2lvbklkL3dlYmF1dGhuL2F1dGhlbnRpY2F0b3IvOmF1dGhlbnRpY2F0b3JJZC91dic6IHtcbiAgICBQT1NUOiB7XG4gICAgICBjb21tYW5kOiAnc2V0VXNlckF1dGhWZXJpZmllZCcsXG4gICAgICBwYXlsb2FkUGFyYW1zOiB7XG4gICAgICAgIHJlcXVpcmVkOiBbJ2lzVXNlclZlcmlmaWVkJ11cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy9lbmRyZWdpb25cblxufTtcblxuLy8gZHJpdmVyIGNvbW1hbmQgbmFtZXNcbmxldCBBTExfQ09NTUFORFMgPSBbXTtcbmZvciAobGV0IHYgb2YgXy52YWx1ZXMoTUVUSE9EX01BUCkpIHtcbiAgZm9yIChsZXQgbSBvZiBfLnZhbHVlcyh2KSkge1xuICAgIGlmIChtLmNvbW1hbmQpIHtcbiAgICAgIEFMTF9DT01NQU5EUy5wdXNoKG0uY29tbWFuZCk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFJFX0VTQ0FQRSA9IC9bLVtcXF17fSgpKz8uLFxcXFxeJHwjXFxzXS9nO1xuY29uc3QgUkVfUEFSQU0gPSAvKFs6Kl0pKFxcdyspL2c7XG5cbmNsYXNzIFJvdXRlIHtcbiAgY29uc3RydWN0b3IgKHJvdXRlKSB7XG4gICAgdGhpcy5wYXJhbU5hbWVzID0gW107XG5cbiAgICBsZXQgcmVTdHIgPSByb3V0ZS5yZXBsYWNlKFJFX0VTQ0FQRSwgJ1xcXFwkJicpO1xuICAgIHJlU3RyID0gcmVTdHIucmVwbGFjZShSRV9QQVJBTSwgKF8sIG1vZGUsIG5hbWUpID0+IHtcbiAgICAgIHRoaXMucGFyYW1OYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgcmV0dXJuIG1vZGUgPT09ICc6JyA/ICcoW14vXSopJyA6ICcoLiopJztcbiAgICB9KTtcbiAgICB0aGlzLnJvdXRlUmVnZXhwID0gbmV3IFJlZ0V4cChgXiR7cmVTdHJ9JGApO1xuICB9XG5cbiAgcGFyc2UgKHVybCkge1xuICAgIC8vaWYgKHVybC5pbmRleE9mKCd0aW1lb3V0cycpICE9PSAtMSAmJiB0aGlzLnJvdXRlUmVnZXhwLnRvU3RyaW5nKCkuaW5kZXhPZigndGltZW91dHMnKSAhPT0gLTEpIHtcbiAgICAvL2RlYnVnZ2VyO1xuICAgIC8vfVxuICAgIGxldCBtYXRjaGVzID0gdXJsLm1hdGNoKHRoaXMucm91dGVSZWdleHApO1xuICAgIGlmICghbWF0Y2hlcykgcmV0dXJuOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGN1cmx5XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICB3aGlsZSAoaSA8IHRoaXMucGFyYW1OYW1lcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhcmFtTmFtZSA9IHRoaXMucGFyYW1OYW1lc1tpKytdO1xuICAgICAgcGFyYW1zW3BhcmFtTmFtZV0gPSBtYXRjaGVzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJvdXRlVG9Db21tYW5kTmFtZSAoZW5kcG9pbnQsIG1ldGhvZCwgYmFzZVBhdGggPSBERUZBVUxUX0JBU0VfUEFUSCkge1xuICBsZXQgZHN0Um91dGUgPSBudWxsO1xuXG4gIC8vIHJlbW92ZSBhbnkgcXVlcnkgc3RyaW5nXG4gIGlmIChlbmRwb2ludC5pbmNsdWRlcygnPycpKSB7XG4gICAgZW5kcG9pbnQgPSBlbmRwb2ludC5zbGljZSgwLCBlbmRwb2ludC5pbmRleE9mKCc/JykpO1xuICB9XG5cbiAgY29uc3QgYWN0dWFsRW5kcG9pbnQgPSBlbmRwb2ludCA9PT0gJy8nID8gJycgOlxuICAgIChfLnN0YXJ0c1dpdGgoZW5kcG9pbnQsICcvJykgPyBlbmRwb2ludCA6IGAvJHtlbmRwb2ludH1gKTtcblxuICBmb3IgKGxldCBjdXJyZW50Um91dGUgb2YgXy5rZXlzKE1FVEhPRF9NQVApKSB7XG4gICAgY29uc3Qgcm91dGUgPSBuZXcgUm91dGUoYCR7YmFzZVBhdGh9JHtjdXJyZW50Um91dGV9YCk7XG4gICAgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCB0aGUgYWN0dWFsIHNlc3Npb24gaWQgZm9yIG1hdGNoaW5nXG4gICAgaWYgKHJvdXRlLnBhcnNlKGAke2Jhc2VQYXRofS9zZXNzaW9uL2lnbm9yZWQtc2Vzc2lvbi1pZCR7YWN0dWFsRW5kcG9pbnR9YCkgfHxcbiAgICAgICAgcm91dGUucGFyc2UoYCR7YmFzZVBhdGh9JHthY3R1YWxFbmRwb2ludH1gKSB8fCByb3V0ZS5wYXJzZShhY3R1YWxFbmRwb2ludCkpIHtcbiAgICAgIGRzdFJvdXRlID0gY3VycmVudFJvdXRlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmICghZHN0Um91dGUpIHJldHVybjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjdXJseVxuXG4gIGNvbnN0IG1ldGhvZHMgPSBfLmdldChNRVRIT0RfTUFQLCBkc3RSb3V0ZSk7XG4gIG1ldGhvZCA9IF8udG9VcHBlcihtZXRob2QpO1xuICBpZiAoXy5oYXMobWV0aG9kcywgbWV0aG9kKSkge1xuICAgIGNvbnN0IGRzdE1ldGhvZCA9IF8uZ2V0KG1ldGhvZHMsIG1ldGhvZCk7XG4gICAgaWYgKGRzdE1ldGhvZC5jb21tYW5kKSB7XG4gICAgICByZXR1cm4gZHN0TWV0aG9kLmNvbW1hbmQ7XG4gICAgfVxuICB9XG59XG5cbi8vIGRyaXZlciBjb21tYW5kcyB0aGF0IGRvIG5vdCByZXF1aXJlIGEgc2Vzc2lvbiB0byBhbHJlYWR5IGV4aXN0XG5jb25zdCBOT19TRVNTSU9OX0lEX0NPTU1BTkRTID0gWydjcmVhdGVTZXNzaW9uJywgJ2dldFN0YXR1cycsICdnZXRTZXNzaW9ucyddO1xuXG5leHBvcnQgeyBNRVRIT0RfTUFQLCBBTExfQ09NTUFORFMsIE5PX1NFU1NJT05fSURfQ09NTUFORFMsIHJvdXRlVG9Db21tYW5kTmFtZSB9O1xuIl0sImZpbGUiOiJsaWIvcHJvdG9jb2wvcm91dGVzLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uIn0=
