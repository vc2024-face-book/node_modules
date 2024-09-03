import type { SpawnOptions } from 'node:child_process';
import { SevereServiceError } from 'webdriverio';
import type { Capabilities, Options, Services } from '@wdio/types';
import type { OnCompleteResult, ParsedAnswers, ProjectProps, Questionnair, ReplCommandArguments, SupportedPackage } from './types.js';
export declare const renderFile: (path: string, data: Record<string, any>) => Promise<string>;
export declare class HookError extends SevereServiceError {
    origin: string;
    constructor(message: string, origin: string);
}
/**
 * run service launch sequences
 */
export declare function runServiceHook(launcher: Services.ServiceInstance[], hookName: keyof Services.HookFunctions, ...args: any[]): Promise<undefined>;
/**
 * Run hook in service launcher
 * @param {Array|Function} hook - can be array of functions or single function
 * @param {object} config
 * @param {object} capabilities
 */
export declare function runLauncherHook(hook: Function | Function[], ...args: any[]): Promise<void | any[]>;
/**
 * Run onCompleteHook in Launcher
 * @param {Array|Function} onCompleteHook - can be array of functions or single function
 * @param {*} config
 * @param {*} capabilities
 * @param {*} exitCode
 * @param {*} results
 */
export declare function runOnCompleteHook(onCompleteHook: Function | Function[], config: Options.Testrunner, capabilities: Capabilities.TestrunnerCapabilities, exitCode: number, results: OnCompleteResult): Promise<(0 | 1)[]>;
/**
 * get runner identification by caps
 */
export declare function getRunnerName(caps?: WebdriverIO.Capabilities): string;
export declare function findInConfig(config: string, type: string): RegExpMatchArray | null;
export declare function replaceConfig(config: string, type: string, name: string): string | undefined;
export declare function addServiceDeps(names: SupportedPackage[], packages: string[], update?: boolean): void;
/**
 * @todo add JSComments
 */
export declare function convertPackageHashToObject(pkg: string, hash?: string): SupportedPackage;
export declare function getSerenityPackages(answers: Questionnair): string[];
export declare function getCapabilities(arg: ReplCommandArguments): Promise<{
    capabilities: {
        deviceName: string;
        platformVersion: string;
        udid: string;
        platformName: string;
        automationName: string;
        app: string;
        browserName?: undefined;
    };
} | {
    capabilities: {
        deviceName: string;
        platformVersion: string;
        udid: string;
        platformName: string;
        automationName: string;
        browserName: string;
    };
} | {
    capabilities: {
        alwaysMatch: WebdriverIO.Capabilities;
        firstMatch: WebdriverIO.Capabilities[];
        browserName?: undefined;
    };
} | {
    capabilities: {
        browserName: string;
    };
}>;
/**
 * Checks if certain directory has babel configuration files
 * @param rootDir directory where this function checks for Babel signs
 * @returns true, if a babel config was found, otherwise false
 */
export declare function hasBabelConfig(rootDir: string): Promise<boolean>;
/**
 * detect if project has a compiler file
 */
export declare function detectCompiler(answers: Questionnair): Promise<boolean>;
/**
 * Check if package is installed
 * @param {string} package to check existance for
 */
export declare function hasPackage(pkg: string): Promise<boolean>;
/**
 * generate test files based on CLI answers
 */
export declare function generateTestFiles(answers: ParsedAnswers): Promise<void>;
export declare function generateBrowserRunnerTestFiles(answers: ParsedAnswers): Promise<void>;
export declare function getAnswers(yes: boolean): Promise<Questionnair>;
export declare function getPathForFileGeneration(answers: Questionnair, projectRootDir: string): {
    destSpecRootPath: string;
    destStepRootPath: string;
    destPageObjectRootPath: string;
    destSerenityLibRootPath: string;
    relativePath: string;
};
export declare function getDefaultFiles(answers: Questionnair, pattern: string): Promise<string>;
/**
 * Ensure core WebdriverIO packages have the same version as cli so that if someone
 * installs `@wdio/cli@next` and runs the wizard, all related packages have the same version.
 * running `matchAll` to a version like "8.0.0-alpha.249+4bc237701", results in:
 * ['8.0.0-alpha.249+4bc237701', '8', '0', '0', 'alpha', '249', '4bc237701']
 */
export declare function specifyVersionIfNeeded(packagesToInstall: string[], version: string, npmTag: string): string[];
/**
 * Receive project properties
 * @returns {@type ProjectProps} if a package.json can be found in cwd or parent directories, otherwise undefined
 *                               which means that a new project can be created
 */
export declare function getProjectProps(cwd?: string): Promise<ProjectProps | undefined>;
export declare function runProgram(command: string, args: string[], options: SpawnOptions): Promise<void>;
/**
 * create package.json if not already existing
 */
export declare function createPackageJSON(parsedAnswers: ParsedAnswers): Promise<false | undefined>;
export declare function npmInstall(parsedAnswers: ParsedAnswers, npmTag: string): Promise<void>;
/**
 * detect the package manager that was used
 */
export declare function detectPackageManager(argv?: string[]): "npm" | "yarn" | "pnpm" | "bun";
/**
 * set up TypeScript if it is desired but not installed
 */
export declare function setupTypeScript(parsedAnswers: ParsedAnswers): Promise<void>;
export declare function createWDIOConfig(parsedAnswers: ParsedAnswers): Promise<void>;
/**
 * Get project root directory based on questionair answers
 * @param answers questionair answers
 * @param projectProps project properties received via `getProjectProps`
 * @returns project root path
 */
export declare function getProjectRoot(parsedAnswers?: Questionnair): Promise<string>;
export declare function createWDIOScript(parsedAnswers: ParsedAnswers): Promise<boolean>;
export declare function runAppiumInstaller(parsedAnswers: ParsedAnswers): Promise<void | import("execa").Result<{
    stdio: "inherit";
}>>;
//# sourceMappingURL=utils.d.ts.map