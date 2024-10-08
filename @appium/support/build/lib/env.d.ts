/**
 * Resolves `true` if an `appium` dependency can be found somewhere in the given `cwd`.
 *
 * @param {string} cwd
 * @returns {Promise<boolean>}
 */
export function hasAppiumDependency(cwd: string): Promise<boolean>;
/**
 * Path to the default `APPIUM_HOME` dir (`~/.appium`).
 * @type {string}
 */
export const DEFAULT_APPIUM_HOME: string;
/**
 * Basename of extension manifest file.
 * @type {string}
 */
export const MANIFEST_BASENAME: string;
/**
 * Relative path to extension manifest file from `APPIUM_HOME`.
 * @type {string}
 */
export const MANIFEST_RELATIVE_PATH: string;
/**
 * Given `cwd`, use `npm` to find the closest package _or workspace root_, and return the path if the root depends upon `appium`.
 *
 * Looks at `dependencies` and `devDependencies` for `appium`.
 */
export const findAppiumDependencyPackage: ((cwd?: string | undefined, acceptableVersionRange?: string | semver.Range | undefined) => Promise<string | undefined>) & _.MemoizedFunction;
/**
 * Read a `package.json` in dir `cwd`.  If none found, return `undefined`.
 */
export const readPackageInDir: ((cwd: string) => Promise<import("read-pkg").NormalizedPackageJson | undefined>) & _.MemoizedFunction;
/**
 * Determines location of Appium's "home" dir
 *
 * - If `APPIUM_HOME` is set in the environment, use that
 * - If we find a `package.json` in or above `cwd` and it has an `appium` dependency, use that.
 *
 * All returned paths will be absolute.
 */
export const resolveAppiumHome: ((cwd?: string | undefined) => Promise<string>) & _.MemoizedFunction;
/**
 * Figure out manifest path based on `appiumHome`.
 *
 * The assumption is that, if `appiumHome` has been provided, it was resolved via {@link resolveAppiumHome `resolveAppiumHome()`}!  If unsure,
 * don't pass a parameter and let `resolveAppiumHome()` handle it.
 */
export const resolveManifestPath: ((appiumHome?: string | undefined) => Promise<string>) & _.MemoizedFunction;
export type NormalizedPackageJson = import("read-pkg").NormalizedPackageJson;
import semver from 'semver';
import _ from 'lodash';
//# sourceMappingURL=env.d.ts.map