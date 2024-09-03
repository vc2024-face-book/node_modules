"use strict";
/**
 * Functions which touch the filesystem
 * @module
 */
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
exports.readMkDocsYml = exports.findPython = exports.findMike = exports.whichNpm = exports.readJson = exports.readJson5 = exports.readPackageJson = exports.findMkDocsYml = exports.stringifyJson = exports.stringifyJson5 = exports.stringifyYaml = exports.findPkgDir = void 0;
exports.findInPkgDir = findInPkgDir;
exports.safeWriteFile = safeWriteFile;
const support_1 = require("@appium/support");
const JSON5 = __importStar(require("json5"));
const lodash_1 = __importDefault(require("lodash"));
const node_path_1 = __importDefault(require("node:path"));
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const read_pkg_1 = __importDefault(require("read-pkg"));
const yaml_1 = __importDefault(require("yaml"));
const constants_1 = require("./constants");
const error_1 = require("./error");
const logger_1 = require("./logger");
const teen_process_1 = require("teen_process");
const log = (0, logger_1.getLogger)('fs');
/**
 * Finds path to closest `package.json`
 *
 * Caches result
 */
exports.findPkgDir = lodash_1.default.memoize(pkg_dir_1.default);
/**
 * Stringifies a thing into a YAML
 * @param value Something to yamlify
 * @returns Some nice YAML 4 u
 */
exports.stringifyYaml = lodash_1.default.partialRight(yaml_1.default.stringify, { indent: 2 }, undefined);
/**
 * Stringifies something into JSON5.  I think the only difference between this and `JSON.stringify`
 * is that if an object has a `toJSON5()` method, it will be used.
 * @param value Something to stringify
 * @returns JSON5 string
 */
exports.stringifyJson5 = lodash_1.default.partialRight(JSON5.stringify, {
    indent: 2,
});
/**
 * Pretty-stringifies a JSON value
 * @param value Something to stringify
 * @returns JSON string
 */
exports.stringifyJson = lodash_1.default.partialRight(JSON.stringify, 2, undefined);
/**
 * Reads a YAML file, parses it and caches the result
 */
const readYaml = lodash_1.default.memoize(async (filepath) => yaml_1.default.parse(await support_1.fs.readFile(filepath, 'utf8'), {
    prettyErrors: false,
    logLevel: 'silent',
}));
/**
 * Finds a file from `cwd`. Searches up to the package root (dir containing `package.json`).
 *
 * @param filename Filename to look for
 * @param cwd Dir it should be in
 * @returns
 */
async function findInPkgDir(filename, cwd = process.cwd()) {
    const pkgDir = await (0, exports.findPkgDir)(cwd);
    if (!pkgDir) {
        return;
    }
    return node_path_1.default.join(pkgDir, filename);
}
/**
 * Finds an `mkdocs.yml`, expected to be a sibling of `package.json`
 *
 * Caches the result.
 * @param cwd - Current working directory
 * @returns Path to `mkdocs.yml`
 */
exports.findMkDocsYml = lodash_1.default.memoize(lodash_1.default.partial(findInPkgDir, constants_1.NAME_MKDOCS_YML));
async function _readPkgJson(cwd, normalize) {
    const pkgDir = await (0, exports.findPkgDir)(cwd);
    if (!pkgDir) {
        throw new error_1.DocutilsError(`Could not find a ${constants_1.NAME_PACKAGE_JSON} near ${cwd}; please create it before using this utility`);
    }
    const pkgPath = node_path_1.default.join(pkgDir, constants_1.NAME_PACKAGE_JSON);
    log.debug('Found `package.json` at %s', pkgPath);
    if (normalize) {
        const pkg = await (0, read_pkg_1.default)({ cwd: pkgDir, normalize });
        return { pkg, pkgPath };
    }
    else {
        const pkg = await (0, read_pkg_1.default)({ cwd: pkgDir });
        return { pkg, pkgPath };
    }
}
/**
 * Given a directory to start from, reads a `package.json` file and returns its path and contents
 */
exports.readPackageJson = lodash_1.default.memoize(_readPkgJson);
/**
 * Reads a JSON5 file and parses it
 */
exports.readJson5 = lodash_1.default.memoize(async (filepath) => JSON5.parse(await support_1.fs.readFile(filepath, 'utf8')));
/**
 * Reads a JSON file and parses it
 */
exports.readJson = lodash_1.default.memoize(async (filepath) => JSON.parse(await support_1.fs.readFile(filepath, 'utf8')));
/**
 * Writes a file, but will not overwrite an existing file unless `overwrite` is true
 *
 * Will stringify JSON objects
 * @param filepath - Path to file
 * @param content - File contents
 * @param overwrite - If `true`, overwrite existing files
 */
function safeWriteFile(filepath, content, overwrite = false) {
    const data = lodash_1.default.isString(content) ? content : JSON.stringify(content, undefined, 2);
    return support_1.fs.writeFile(filepath, data, {
        encoding: 'utf8',
        flag: overwrite ? 'w' : 'wx',
    });
}
/**
 * `which` with memoization
 */
const cachedWhich = lodash_1.default.memoize(support_1.fs.which);
/**
 * Finds `npm` executable
 */
exports.whichNpm = lodash_1.default.partial(cachedWhich, constants_1.NAME_NPM, { nothrow: true });
/**
 * Finds `python` executable
 */
const whichPython = lodash_1.default.partial(cachedWhich, constants_1.NAME_PYTHON, { nothrow: true });
/**
 * Finds `python3` executable
 */
const whichPython3 = lodash_1.default.partial(cachedWhich, `${constants_1.NAME_PYTHON}3`, { nothrow: true });
/**
 * `mike` cannot be invoked via `python -m`, so we need to find the script.
 */
exports.findMike = lodash_1.default.partial(async () => {
    // see if it's in PATH
    let mikePath = await cachedWhich(constants_1.NAME_MIKE, { nothrow: true });
    if (mikePath) {
        return mikePath;
    }
    // if it isn't, it may be in a user dir
    const pythonPath = await (0, exports.findPython)();
    if (!pythonPath) {
        return;
    }
    try {
        // the user dir can be found this way.
        // usually it's something like ~/.local
        const { stdout } = await (0, teen_process_1.exec)(pythonPath, ['-m', 'site', '--user-base']);
        if (stdout) {
            mikePath = node_path_1.default.join(stdout.trim(), 'bin', 'mike');
            if (await support_1.fs.isExecutable(mikePath)) {
                return mikePath;
            }
        }
    }
    catch { }
});
/**
 * Finds the `python3` or `python` executable in the user's `PATH`.
 *
 * `python3` is preferred over `python`, since the latter could be Python 2.
 */
exports.findPython = lodash_1.default.memoize(async () => (await whichPython3()) ?? (await whichPython()));
/**
 * Reads an `mkdocs.yml` file, merges inherited configs, and returns the result. The result is cached.
 *
 * **IMPORTANT**: The paths of `site_dir` and `docs_dir` are resolved to absolute paths, since they
 * are expressed as relative paths, and each inherited config file can live in different paths.
 * @param filepath Patgh to an `mkdocs.yml` file
 * @returns Parsed `mkdocs.yml` file
 */
exports.readMkDocsYml = lodash_1.default.memoize(async (filepath, cwd = process.cwd()) => {
    let mkDocsYml = (await readYaml(filepath));
    if (mkDocsYml.site_dir) {
        mkDocsYml.site_dir = node_path_1.default.resolve(cwd, node_path_1.default.dirname(filepath), mkDocsYml.site_dir);
    }
    if (mkDocsYml.INHERIT) {
        let inheritPath = node_path_1.default.resolve(node_path_1.default.dirname(filepath), mkDocsYml.INHERIT);
        while (inheritPath) {
            const inheritYml = (await readYaml(inheritPath));
            if (inheritYml.site_dir) {
                inheritYml.site_dir = node_path_1.default.resolve(node_path_1.default.dirname(inheritPath), inheritYml.site_dir);
                log.debug('Resolved site_dir to %s', inheritYml.site_dir);
            }
            if (inheritYml.docs_dir) {
                inheritYml.docs_dir = node_path_1.default.resolve(node_path_1.default.dirname(inheritPath), inheritYml.docs_dir);
                log.debug('Resolved docs_dir to %s', inheritYml.docs_dir);
            }
            mkDocsYml = lodash_1.default.defaultsDeep(mkDocsYml, inheritYml);
            inheritPath = inheritYml.INHERIT
                ? node_path_1.default.resolve(node_path_1.default.dirname(inheritPath), inheritYml.INHERIT)
                : undefined;
        }
    }
    return mkDocsYml;
});
//# sourceMappingURL=fs.js.map