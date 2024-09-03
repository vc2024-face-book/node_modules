"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveManifestPath = exports.resolveAppiumHome = exports.readPackageInDir = exports.findAppiumDependencyPackage = exports.MANIFEST_RELATIVE_PATH = exports.MANIFEST_BASENAME = exports.DEFAULT_APPIUM_HOME = void 0;
exports.hasAppiumDependency = hasAppiumDependency;
// @ts-check
const lodash_1 = __importDefault(require("lodash"));
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const read_pkg_1 = __importDefault(require("read-pkg"));
const semver_1 = __importDefault(require("semver"));
/**
 * Path to the default `APPIUM_HOME` dir (`~/.appium`).
 * @type {string}
 */
exports.DEFAULT_APPIUM_HOME = path_1.default.resolve((0, os_1.homedir)(), '.appium');
/**
 * Basename of extension manifest file.
 * @type {string}
 */
exports.MANIFEST_BASENAME = 'extensions.yaml';
/**
 * Relative path to extension manifest file from `APPIUM_HOME`.
 * @type {string}
 */
exports.MANIFEST_RELATIVE_PATH = path_1.default.join('node_modules', '.cache', 'appium', exports.MANIFEST_BASENAME);
/**
 * Resolves `true` if an `appium` dependency can be found somewhere in the given `cwd`.
 *
 * @param {string} cwd
 * @returns {Promise<boolean>}
 */
async function hasAppiumDependency(cwd) {
    return Boolean(await (0, exports.findAppiumDependencyPackage)(cwd));
}
/**
 * Given `cwd`, use `npm` to find the closest package _or workspace root_, and return the path if the root depends upon `appium`.
 *
 * Looks at `dependencies` and `devDependencies` for `appium`.
 */
exports.findAppiumDependencyPackage = lodash_1.default.memoize(
/**
 * @param {string} [cwd]
 * @param {string|semver.Range} [acceptableVersionRange='>=2.0.0-beta'] The expected
 * semver-compatible range for the Appium dependency. Packages that have 'appium' dependency
 * not satisfying this range will be skipped.
 * @returns {Promise<string|undefined>}
 */
async function findAppiumDependencyPackage(cwd = process.cwd(), acceptableVersionRange = '>=2.0.0-beta') {
    /**
     * Tries to read `package.json` in `root` and resolves the identity if it depends on `appium`;
     * otherwise resolves `undefined`.
     * @param {string} root
     * @returns {Promise<string|undefined>}
     */
    const readPkg = async (root) => {
        try {
            const pkg = await (0, exports.readPackageInDir)(root);
            const version = semver_1.default.minVersion(String(pkg?.dependencies?.appium ??
                pkg?.devDependencies?.appium ??
                pkg?.peerDependencies?.appium));
            return version && semver_1.default.satisfies(version, acceptableVersionRange) ? root : undefined;
        }
        catch { }
    };
    let currentDir = path_1.default.resolve(cwd);
    let isAtFsRoot = false;
    while (!isAtFsRoot) {
        const result = await readPkg(currentDir);
        if (result) {
            return result;
        }
        currentDir = path_1.default.dirname(currentDir);
        isAtFsRoot = currentDir.length <= path_1.default.dirname(currentDir).length;
    }
});
/**
 * Read a `package.json` in dir `cwd`.  If none found, return `undefined`.
 */
exports.readPackageInDir = lodash_1.default.memoize(
/**
 *
 * @param {string} cwd - Directory ostensibly having a `package.json`
 * @returns {Promise<import('read-pkg').NormalizedPackageJson|undefined>}
 */
async function _readPackageInDir(cwd) {
    return await (0, read_pkg_1.default)({ cwd, normalize: true });
});
/**
 * Determines location of Appium's "home" dir
 *
 * - If `APPIUM_HOME` is set in the environment, use that
 * - If we find a `package.json` in or above `cwd` and it has an `appium` dependency, use that.
 *
 * All returned paths will be absolute.
 */
exports.resolveAppiumHome = lodash_1.default.memoize(
/**
 * @param {string} [cwd] - Current working directory.  _Must_ be absolute, if specified.
 * @returns {Promise<string>}
 */
async function _resolveAppiumHome(cwd = process.cwd()) {
    if (!path_1.default.isAbsolute(cwd)) {
        throw new TypeError('`cwd` parameter must be an absolute path');
    }
    if (process.env.APPIUM_HOME) {
        return path_1.default.resolve(cwd, process.env.APPIUM_HOME);
    }
    return await (0, exports.findAppiumDependencyPackage)(cwd) ?? exports.DEFAULT_APPIUM_HOME;
});
/**
 * Figure out manifest path based on `appiumHome`.
 *
 * The assumption is that, if `appiumHome` has been provided, it was resolved via {@link resolveAppiumHome `resolveAppiumHome()`}!  If unsure,
 * don't pass a parameter and let `resolveAppiumHome()` handle it.
 */
exports.resolveManifestPath = lodash_1.default.memoize(
/**
 * @param {string} [appiumHome] - Appium home directory
 * @returns {Promise<string>}
 */
async function _resolveManifestPath(appiumHome) {
    // can you "await" in a default parameter? is that a good idea?
    appiumHome = appiumHome ?? (await (0, exports.resolveAppiumHome)());
    return path_1.default.join(appiumHome, exports.MANIFEST_RELATIVE_PATH);
});
/**
 * @typedef {import('read-pkg').NormalizedPackageJson} NormalizedPackageJson
 */
//# sourceMappingURL=env.js.map