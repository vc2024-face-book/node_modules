import type { Argv } from 'yargs';
import type { RunCommandArguments } from '../types.js';
export declare const command = "run <configPath>";
export declare const desc = "Run your WDIO configuration file to initialize your tests. (default)";
export declare const cmdArgs: {
    readonly watch: {
        readonly desc: "Run WebdriverIO in watch mode";
        readonly type: "boolean";
    };
    readonly hostname: {
        readonly alias: "h";
        readonly desc: "automation driver host address";
        readonly type: "string";
    };
    readonly port: {
        readonly alias: "p";
        readonly desc: "automation driver port";
        readonly type: "number";
    };
    readonly path: {
        readonly type: "string";
        readonly desc: "path to WebDriver endpoints (default \"/\")";
    };
    readonly user: {
        readonly alias: "u";
        readonly desc: "username if using a cloud service as automation backend";
        readonly type: "string";
    };
    readonly key: {
        readonly alias: "k";
        readonly desc: "corresponding access key to the user";
        readonly type: "string";
    };
    readonly logLevel: {
        readonly alias: "l";
        readonly desc: "level of logging verbosity";
        readonly choices: readonly ["trace", "debug", "info", "warn", "error", "silent"];
    };
    readonly bail: {
        readonly desc: "stop test runner after specific amount of tests have failed";
        readonly type: "number";
    };
    readonly baseUrl: {
        readonly desc: "shorten url command calls by setting a base url";
        readonly type: "string";
    };
    readonly waitforTimeout: {
        readonly alias: "w";
        readonly desc: "timeout for all waitForXXX commands";
        readonly type: "number";
    };
    readonly updateSnapshots: {
        readonly alias: "s";
        readonly desc: "update DOM, image or test snapshots";
        readonly type: "string";
        readonly coerce: (value: string) => string;
    };
    readonly framework: {
        readonly alias: "f";
        readonly desc: "defines the framework (Mocha, Jasmine or Cucumber) to run the specs";
        readonly type: "string";
    };
    readonly reporters: {
        readonly alias: "r";
        readonly desc: "reporters to print out the results on stdout";
        readonly type: "array";
    };
    readonly suite: {
        readonly desc: "overwrites the specs attribute and runs the defined suite";
        readonly type: "array";
    };
    readonly spec: {
        readonly desc: "run only a certain spec file - overrides specs piped from stdin";
        readonly type: "array";
    };
    readonly exclude: {
        readonly desc: "exclude certain spec file from the test run - overrides exclude piped from stdin";
        readonly type: "array";
    };
    readonly repeat: {
        readonly desc: "Repeat specific specs and/or suites N times";
        readonly type: "number";
    };
    readonly mochaOpts: {
        readonly desc: "Mocha options";
        readonly coerce: (opts: {
            [x: string]: boolean | string | number;
        }) => {
            [x: string]: string | number | boolean;
        };
    };
    readonly jasmineOpts: {
        readonly desc: "Jasmine options";
        readonly coerce: (opts: {
            [x: string]: boolean | string | number;
        }) => {
            [x: string]: string | number | boolean;
        };
    };
    readonly cucumberOpts: {
        readonly desc: "Cucumber options";
        readonly coerce: (opts: {
            [x: string]: boolean | string | number;
        }) => {
            [x: string]: string | number | boolean;
        };
    };
    readonly coverage: {
        readonly desc: "Enable coverage for browser runner";
    };
    readonly shard: {
        readonly desc: "Shard tests and execute only the selected shard. Specify in the one-based form like `--shard x/y`, where x is the current and y the total shard.";
        readonly coerce: (shard: string) => {
            current: number;
            total: number;
        };
    };
};
export declare const builder: (yargs: Argv) => Argv<import("yargs").Omit<{}, "framework" | "reporters" | "hostname" | "port" | "path" | "updateSnapshots" | "user" | "key" | "spec" | "exclude" | "bail" | "watch" | "shard" | "mochaOpts" | "jasmineOpts" | "cucumberOpts" | "baseUrl" | "waitforTimeout" | "logLevel" | "coverage" | "suite" | "repeat"> & import("yargs").InferredOptionTypes<{
    readonly watch: {
        readonly desc: "Run WebdriverIO in watch mode";
        readonly type: "boolean";
    };
    readonly hostname: {
        readonly alias: "h";
        readonly desc: "automation driver host address";
        readonly type: "string";
    };
    readonly port: {
        readonly alias: "p";
        readonly desc: "automation driver port";
        readonly type: "number";
    };
    readonly path: {
        readonly type: "string";
        readonly desc: "path to WebDriver endpoints (default \"/\")";
    };
    readonly user: {
        readonly alias: "u";
        readonly desc: "username if using a cloud service as automation backend";
        readonly type: "string";
    };
    readonly key: {
        readonly alias: "k";
        readonly desc: "corresponding access key to the user";
        readonly type: "string";
    };
    readonly logLevel: {
        readonly alias: "l";
        readonly desc: "level of logging verbosity";
        readonly choices: readonly ["trace", "debug", "info", "warn", "error", "silent"];
    };
    readonly bail: {
        readonly desc: "stop test runner after specific amount of tests have failed";
        readonly type: "number";
    };
    readonly baseUrl: {
        readonly desc: "shorten url command calls by setting a base url";
        readonly type: "string";
    };
    readonly waitforTimeout: {
        readonly alias: "w";
        readonly desc: "timeout for all waitForXXX commands";
        readonly type: "number";
    };
    readonly updateSnapshots: {
        readonly alias: "s";
        readonly desc: "update DOM, image or test snapshots";
        readonly type: "string";
        readonly coerce: (value: string) => string;
    };
    readonly framework: {
        readonly alias: "f";
        readonly desc: "defines the framework (Mocha, Jasmine or Cucumber) to run the specs";
        readonly type: "string";
    };
    readonly reporters: {
        readonly alias: "r";
        readonly desc: "reporters to print out the results on stdout";
        readonly type: "array";
    };
    readonly suite: {
        readonly desc: "overwrites the specs attribute and runs the defined suite";
        readonly type: "array";
    };
    readonly spec: {
        readonly desc: "run only a certain spec file - overrides specs piped from stdin";
        readonly type: "array";
    };
    readonly exclude: {
        readonly desc: "exclude certain spec file from the test run - overrides exclude piped from stdin";
        readonly type: "array";
    };
    readonly repeat: {
        readonly desc: "Repeat specific specs and/or suites N times";
        readonly type: "number";
    };
    readonly mochaOpts: {
        readonly desc: "Mocha options";
        readonly coerce: (opts: {
            [x: string]: boolean | string | number;
        }) => {
            [x: string]: string | number | boolean;
        };
    };
    readonly jasmineOpts: {
        readonly desc: "Jasmine options";
        readonly coerce: (opts: {
            [x: string]: boolean | string | number;
        }) => {
            [x: string]: string | number | boolean;
        };
    };
    readonly cucumberOpts: {
        readonly desc: "Cucumber options";
        readonly coerce: (opts: {
            [x: string]: boolean | string | number;
        }) => {
            [x: string]: string | number | boolean;
        };
    };
    readonly coverage: {
        readonly desc: "Enable coverage for browser runner";
    };
    readonly shard: {
        readonly desc: "Shard tests and execute only the selected shard. Specify in the one-based form like `--shard x/y`, where x is the current and y the total shard.";
        readonly coerce: (shard: string) => {
            current: number;
            total: number;
        };
    };
}>>;
export declare function launchWithStdin(wdioConfPath: string, params: Partial<RunCommandArguments>): void;
export declare function launch(wdioConfPath: string, params: Partial<RunCommandArguments>): Promise<void>;
declare enum NodeVersion {
    'major' = 0,
    'minor' = 1,
    'patch' = 2
}
export declare function nodeVersion(type: keyof typeof NodeVersion): number;
export declare function handler(argv: RunCommandArguments): Promise<false | void>;
export {};
//# sourceMappingURL=run.d.ts.map