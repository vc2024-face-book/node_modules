#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
/**
 * Main CLI entry point for `@appium/docutils`
 * @module
 */
const logger_1 = require("../logger");
const support_1 = require("@appium/support");
const lodash_1 = __importDefault(require("lodash"));
const read_pkg_1 = require("read-pkg");
const helpers_1 = require("yargs/helpers");
const yargs_1 = __importDefault(require("yargs/yargs"));
const constants_1 = require("../constants");
const error_1 = require("../error");
const command_1 = require("./command");
const config_1 = require("./config");
const pkg = (0, read_pkg_1.sync)({ cwd: support_1.fs.findRoot(__dirname) });
const log = (0, logger_1.getLogger)('cli');
const IMPLICATIONS_FAILED_REGEX = /implications\s+failed:\n\s*(.+)\s->\s(.+)$/i;
async function main(argv = (0, helpers_1.hideBin)(process.argv)) {
    const config = await (0, config_1.findConfig)(argv);
    const y = (0, yargs_1.default)(argv);
    return await y
        .scriptName(constants_1.NAME_BIN)
        .command(command_1.build)
        .command(command_1.init)
        .command(command_1.validate)
        .options({
        verbose: {
            type: 'boolean',
            describe: 'Alias for --log-level=debug',
        },
        'log-level': {
            alias: 'L',
            choices: ['debug', 'info', 'warn', 'error', 'silent'],
            describe: 'Sets the log level',
            default: constants_1.DEFAULT_LOG_LEVEL,
            coerce: lodash_1.default.identity,
        },
        config: {
            alias: 'c',
            type: 'string',
            describe: 'Path to config file',
            normalize: true,
            nargs: 1,
            requiresArg: true,
            defaultDescription: '(discovered automatically)',
        },
        'no-config': {
            type: 'boolean',
            describe: 'Disable config file discovery',
        },
    })
        .middleware(
    /**
     * Writes a startup message
     */
    () => {
        log.info(`${pkg.name} @ v${pkg.version} (Node.js ${process.version})`);
    })
        .epilog(`Please report bugs at ${pkg.bugs?.url}`)
        .fail(
    /**
     * Custom failure handler so we can log nicely.
     */
    (msg, error) => {
        /**
         * yargs' default output if an "implication" fails (e.g., arg _A_ requires arg _B_) leaves much to be desired.
         *
         * @remarks Unfortunately, we do not have access to the parsed arguments object, since it may have failed parsing.
         * @param msg Implication failure message
         * @returns Whether the message was an implication failure
         */
        const handleImplicationFailure = (msg) => {
            let match;
            if (!(match = msg?.match(IMPLICATIONS_FAILED_REGEX))) {
                return false;
            }
            const [, arg, missingArg] = match;
            log.error(`Argument "--${arg}" requires "--${missingArg}"; note that "--${arg}" may be enabled by default`);
            return true;
        };
        // if it is a DocutilsError, it has nothing to do with the CLI
        if (error instanceof error_1.DocutilsError) {
            log.error(error.message);
        }
        else {
            y.showHelp();
            if (!handleImplicationFailure(msg)) {
                log.error(`\n\n${msg ?? error.message}`);
            }
        }
        y.exit(1, error);
    })
        .config(config)
        // at least one command is required (but not for --version or --help)
        .demandCommand(1)
        // fail if unknown option or command is provided
        .strict()
        .parseAsync();
}
if (require.main === module) {
    // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
    main().catch((err) => {
        log.error('Caught otherwise-unhandled rejection (this is probably a bug):', err);
    });
}
//# sourceMappingURL=index.js.map