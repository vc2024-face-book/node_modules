"use strict";
/**
 * It's a logger.
 *
 * Since this is a CLI app only, it doesn't necessarily make sense to consume `@appium/support`'s logger.
 *
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLogger = void 0;
exports.isLogLevelString = isLogLevelString;
exports.getLogger = getLogger;
// eslint-disable-next-line @typescript-eslint/no-var-requires -- Consola 3 import call is ESM
const { ConsolaInstance, createConsola, LogLevel } = require('consola');
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("./constants");
/**
 * The global log level
 *
 * "Global" inasmuch as any logger created from the root logger will use this level.
 */
let globalLevel = constants_1.LogLevelMap[constants_1.DEFAULT_LOG_LEVEL];
/**
 * Type guard to see if a string is a recognized log level
 * @param level any value
 */
function isLogLevelString(level) {
    return level in constants_1.LogLevelMap;
}
/**
 * The logger from which all loggers are created. This one uses a unique tag.
 */
const rootLogger = createConsola({
    defaults: { tag: 'docutils' },
    fancy: true,
    level: globalLevel,
    formatOptions: {
        colors: true,
        date: false,
    },
});
// this prevents logging before `initLogger` is called
rootLogger.pauseLogs();
/**
 * A map of tags to loggers
 */
const loggers = new Map();
function getLogger(tag, parent = rootLogger) {
    if (loggers.has(tag)) {
        const logger = loggers.get(tag)?.deref();
        if (logger) {
            return logger;
        }
    }
    const logger = parent.withTag(tag);
    logger.level = globalLevel;
    loggers.set(tag, new WeakRef(logger));
    return logger;
}
/**
 * Initialize the logging system.
 *
 * This should only be called once. The loglevel cannot be changed once it is set.
 *
 * @remarks Child loggers seem to inherit the "paused" state of the parent, so when this is called, we must resume all of them.
 */
exports.initLogger = lodash_1.default.once((level) => {
    globalLevel = isLogLevelString(level) ? constants_1.LogLevelMap[level] : level;
    rootLogger.level = globalLevel;
    rootLogger.resumeLogs();
    for (const ref of loggers.values()) {
        const logger = ref.deref();
        if (logger) {
            logger.level = globalLevel;
            logger.resumeLogs();
        }
    }
});
//# sourceMappingURL=logger.js.map