declare const _default: {
    '/session/:sessionId/context': {
        GET: {
            command: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
        POST: {
            command: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
        };
    };
    '/session/:sessionId/contexts': {
        GET: {
            command: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
    };
    '/session/:sessionId/appium/device/shake': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/lock': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/unlock': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/is_locked': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/start_recording_screen': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/stop_recording_screen': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/performanceData/types': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/getPerformanceData': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/press_keycode': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/long_press_keycode': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/keyevent': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/rotation': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
                default: number;
            }[];
            support: {
                ios: {
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/current_activity': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/current_package': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/install_app': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/activate_app': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/remove_app': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/terminate_app': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/app_installed': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/app_state': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/hide_keyboard': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/is_keyboard_shown': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/push_file': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/pull_file': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
    };
    '/session/:sessionId/appium/device/pull_folder': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/toggle_airplane_mode': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/toggle_data': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/toggle_wifi': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/toggle_location_services': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/network_speed': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/open_notifications': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/start_activity': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: ({
                name: string;
                type: string;
                description: string;
                required: boolean;
                default?: undefined;
            } | {
                name: string;
                type: string;
                description: string;
                required: boolean;
                default: string;
            })[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/system_bars': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/system_time': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/display_density': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/simulator/touch_id': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/simulator/toggle_touch_id_enrollment': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
                default: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/app/launch': {
        POST: {
            command: string;
            description: string;
            ref: string;
            deprecated: string;
            parameters: never[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/app/close': {
        POST: {
            command: string;
            description: string;
            ref: string;
            deprecated: string;
            parameters: never[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/app/background': {
        POST: {
            command: string;
            description: string;
            ref: string;
            deprecated: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
                default: string;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/app/end_test_coverage': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/app/strings': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/element/:elementId/value': {
        POST: {
            command: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/element/:elementId/replace_value': {
        POST: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/settings': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                android: {
                    UiAutomator: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/receive_async_response': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/gsm_call': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/gsm_signal': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/power_capacity': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/power_ac': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/gsm_voice': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/send_sms': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/finger_print': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/set_clipboard': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/device/get_clipboard': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                ios: {
                    XCUITest: string;
                };
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/perform': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            examples: string[][];
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/multi/perform': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                    UIAutomation: string;
                };
                windows: {
                    Windows: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/execute_driver': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
    };
    '/session/:sessionId/appium/events': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/log_event': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/appium/compare_images': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: ({
                name: string;
                type: string;
                description: string;
                required: boolean;
                default: string;
            } | {
                name: string;
                type: string;
                description: string;
                required: boolean;
                default?: undefined;
            } | {
                name: string;
                type: string;
                description: string;
                required: boolean;
                default: {};
            })[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
    };
    '/session/:sessionId/timeouts/implicit_wait': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/element/:elementId/location_in_view': {
        GET: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/keys': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/ime/available_engines': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/ime/active_engine': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/ime/activated': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/ime/deactivate': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/ime/activate': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/timeouts/async_script': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/element/:elementId/submit': {
        POST: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            support: {
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/element/:elementId/size': {
        GET: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/element/:elementId/location': {
        GET: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/click': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/down': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/up': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/move': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/longclick': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/touch/flick': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
            };
        };
    };
    '/session/:sessionId/orientation': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/log': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
    '/session/:sessionId/log/types': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            support: {
                android: {
                    UiAutomator: string;
                };
                ios: {
                    XCUITest: string;
                };
            };
        };
    };
};
export default _default;
//# sourceMappingURL=appium.d.ts.map