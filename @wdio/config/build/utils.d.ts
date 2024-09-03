import type { Options } from '@wdio/types';
export declare const validObjectOrArray: (object: any) => object is object | Array<any>;
/**
 * remove line numbers from file path, ex:
 * `/foo:9` or `c:\bar:14:5`
 * @param   {string} filePath path to spec file
 * @returns {string}
 */
export declare function removeLineNumbers(filePath: string): string;
/**
 * does spec file path contain Cucumber's line number, ex
 * `/foo/bar:9` or `c:\bar\foo:14:5`
 * @param {string|string[]} spec
 */
export declare function isCucumberFeatureWithLineNumber(spec: string | string[]): boolean;
export declare function isCloudCapability(caps: WebdriverIO.Capabilities): boolean;
/**
 * validates configurations based on default values
 * @param  {Object} defaults  object describing all allowed properties
 * @param  {Object} options   option to check against
 * @return {Object}           validated config enriched with default values
 */
export declare function validateConfig<T>(defaults: Options.Definition<T>, options: T, keysToKeep?: (keyof T)[]): T;
export declare function objectToEnv(params?: Record<string, any>): void;
//# sourceMappingURL=utils.d.ts.map