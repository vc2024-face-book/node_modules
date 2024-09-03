/**
 * Functions which touch the filesystem
 * @module
 */
import _ from 'lodash';
import { NormalizedPackageJson, PackageJson } from 'read-pkg';
import { JsonValue } from 'type-fest';
import { MkDocsYml } from './model';
/**
 * Finds path to closest `package.json`
 *
 * Caches result
 */
export declare const findPkgDir: {
    (cwd?: string): Promise<string | undefined>;
    sync: (cwd?: string) => string | undefined;
} & _.MemoizedFunction;
/**
 * Stringifies a thing into a YAML
 * @param value Something to yamlify
 * @returns Some nice YAML 4 u
 */
export declare const stringifyYaml: (value: JsonValue) => string;
/**
 * Stringifies something into JSON5.  I think the only difference between this and `JSON.stringify`
 * is that if an object has a `toJSON5()` method, it will be used.
 * @param value Something to stringify
 * @returns JSON5 string
 */
export declare const stringifyJson5: (value: JsonValue) => string;
/**
 * Pretty-stringifies a JSON value
 * @param value Something to stringify
 * @returns JSON string
 */
export declare const stringifyJson: (value: JsonValue) => string;
/**
 * Finds a file from `cwd`. Searches up to the package root (dir containing `package.json`).
 *
 * @param filename Filename to look for
 * @param cwd Dir it should be in
 * @returns
 */
export declare function findInPkgDir(filename: string, cwd?: string): Promise<string | undefined>;
/**
 * Finds an `mkdocs.yml`, expected to be a sibling of `package.json`
 *
 * Caches the result.
 * @param cwd - Current working directory
 * @returns Path to `mkdocs.yml`
 */
export declare const findMkDocsYml: ((cwd?: string | undefined) => Promise<string | undefined>) & _.MemoizedFunction;
/**
 * Given a directory path, finds closest `package.json` and reads it.
 * @param cwd - Current working directory
 * @param normalize - Whether or not to normalize the result
 * @returns A {@linkcode PackageJson} object if `normalize` is `false`, otherwise a {@linkcode NormalizedPackageJson} object
 */
declare function _readPkgJson(cwd: string, normalize: true): Promise<{
    pkgPath: string;
    pkg: NormalizedPackageJson;
}>;
declare function _readPkgJson(cwd: string, normalize?: false): Promise<{
    pkgPath: string;
    pkg: PackageJson;
}>;
/**
 * Given a directory to start from, reads a `package.json` file and returns its path and contents
 */
export declare const readPackageJson: typeof _readPkgJson & _.MemoizedFunction;
/**
 * Reads a JSON5 file and parses it
 */
export declare const readJson5: (<T extends JsonValue>(filepath: string) => Promise<T>) & _.MemoizedFunction;
/**
 * Reads a JSON file and parses it
 */
export declare const readJson: (<T extends JsonValue>(filepath: string) => Promise<T>) & _.MemoizedFunction;
/**
 * Writes a file, but will not overwrite an existing file unless `overwrite` is true
 *
 * Will stringify JSON objects
 * @param filepath - Path to file
 * @param content - File contents
 * @param overwrite - If `true`, overwrite existing files
 */
export declare function safeWriteFile(filepath: string, content: JsonValue, overwrite?: boolean): Promise<void>;
/**
 * Finds `npm` executable
 */
export declare const whichNpm: () => Promise<string>;
/**
 * `mike` cannot be invoked via `python -m`, so we need to find the script.
 */
export declare const findMike: () => Promise<string | undefined>;
/**
 * Finds the `python3` or `python` executable in the user's `PATH`.
 *
 * `python3` is preferred over `python`, since the latter could be Python 2.
 */
export declare const findPython: (() => Promise<string | undefined>) & _.MemoizedFunction;
/**
 * Reads an `mkdocs.yml` file, merges inherited configs, and returns the result. The result is cached.
 *
 * **IMPORTANT**: The paths of `site_dir` and `docs_dir` are resolved to absolute paths, since they
 * are expressed as relative paths, and each inherited config file can live in different paths.
 * @param filepath Patgh to an `mkdocs.yml` file
 * @returns Parsed `mkdocs.yml` file
 */
export declare const readMkDocsYml: ((filepath: string, cwd?: any) => Promise<MkDocsYml>) & _.MemoizedFunction;
export {};
//# sourceMappingURL=fs.d.ts.map