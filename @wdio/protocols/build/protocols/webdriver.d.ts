declare const _default: {
    '/session': {
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
    '/session/:sessionId': {
        DELETE: {
            command: string;
            description: string;
            ref: string;
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
        };
    };
    '/status': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
    };
    '/session/:sessionId/timeouts': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
            returns: {
                type: string;
                name: string;
                description: string;
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/url': {
        GET: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
            returns: {
                type: string;
                name: string;
                description: string;
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
            exampleReferences: string[];
            alternativeCommands: string[];
        };
    };
    '/session/:sessionId/back': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/forward': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/refresh': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/title': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/window': {
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
            exampleReferences: string[];
        };
        DELETE: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/window/new': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/window/handles': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/print': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/frame': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/frame/parent': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/window/rect': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
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
            alternativeCommands: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/window/maximize': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/window/minimize': {
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
        };
    };
    '/session/:sessionId/window/fullscreen': {
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
        };
    };
    '/session/:sessionId/element': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/shadow/:shadowId/element': {
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
            alternativeCommands: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/elements': {
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
            alternativeCommands: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/shadow/:shadowId/elements': {
        POST: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            alternativeCommands: string[];
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
            exampleReferences: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
    };
    '/session/:sessionId/element/:elementId/element': {
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
            alternativeCommands: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/elements': {
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
            alternativeCommands: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/shadow': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/active': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/selected': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/displayed': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/attribute/:name': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/property/:name': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/css/:propertyName': {
        GET: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            alternativeCommands: string[];
            returns: {
                type: string;
                name: string;
                description: string;
            };
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/text': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/name': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/rect': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/enabled': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/click': {
        POST: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/clear': {
        POST: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/element/:elementId/value': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/source': {
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
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/execute/sync': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/execute/async': {
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
            alternativeCommands: string[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/cookie': {
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
            exampleReferences: string[];
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
            exampleReferences: string[];
        };
        DELETE: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/cookie/:name': {
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
            exampleReferences: string[];
        };
        DELETE: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/actions': {
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
        };
        DELETE: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
        };
    };
    '/session/:sessionId/alert/dismiss': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
            exampleReferences: string[];
        };
    };
    '/session/:sessionId/alert/accept': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: never[];
        };
    };
    '/session/:sessionId/alert/text': {
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
            exampleReferences: string[];
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
        };
    };
    '/session/:sessionId/screenshot': {
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
        };
    };
    '/session/:sessionId/element/:elementId/screenshot': {
        GET: {
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
            returns: {
                type: string;
                name: string;
                description: string;
            };
        };
    };
    '/session/:sessionId/element/:elementId/computedrole': {
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
        };
    };
    '/session/:sessionId/element/:elementId/computedlabel': {
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
        };
    };
    '/session/:sessionId/permissions': {
        POST: {
            command: string;
            description: string;
            ref: string;
            examples: string[][];
            parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
            }[];
        };
    };
    '/session/:sessionId/reporting/generate_test_report': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: ({
                name: string;
                type: string;
                description: string;
                required: boolean;
            } | {
                name: string;
                type: string;
                description: string;
                required?: undefined;
            })[];
        };
    };
    '/session/:sessionId/sensor': {
        POST: {
            command: string;
            description: string;
            ref: string;
            parameters: ({
                name: string;
                type: string;
                description: string;
                required: boolean;
            } | {
                name: string;
                type: string;
                description: string;
                required?: undefined;
            })[];
        };
    };
    '/session/:sessionId/sensor/:type': {
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
        };
        POST: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: ({
                name: string;
                type: string;
                description: string;
                required: boolean;
            } | {
                name: string;
                type: string;
                description: string;
                required?: undefined;
            })[];
        };
        DELETE: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
        };
    };
    '/session/:sessionId/time_zone': {
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
        };
    };
    '/session/:sessionId/webauthn/authenticator': {
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
    '/session/:sessionId/webauthn/authenticator/:authenticatorId': {
        DELETE: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
        };
    };
    '/session/:sessionId/webauthn/authenticator/:authenticatorId/credential': {
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
        };
    };
    '/session/:sessionId/webauthn/authenticator/:authenticatorId/credentials': {
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
        };
        DELETE: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
        };
    };
    '/session/:sessionId/webauthn/authenticator/:authenticatorId/credentials/:credentialId': {
        DELETE: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
        };
    };
    '/session/:sessionId/webauthn/authenticator/:authenticatorId/uv': {
        POST: {
            command: string;
            description: string;
            ref: string;
            variables: {
                name: string;
                description: string;
            }[];
            parameters: never[];
        };
    };
};
export default _default;
//# sourceMappingURL=webdriver.d.ts.map