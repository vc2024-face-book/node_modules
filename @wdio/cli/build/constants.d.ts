import type { Options } from '@wdio/types';
import type { Questionnair } from './types.js';
export declare const pkg: {
    name: string;
    version: string;
    description: string;
    author: string;
    homepage: string;
    license: string;
    bin: {
        wdio: string;
    };
    engines: {
        node: string;
    };
    repository: {
        type: string;
        url: string;
        directory: string;
    };
    keywords: string[];
    bugs: {
        url: string;
    };
    main: string;
    type: string;
    module: string;
    types: string;
    exports: {
        ".": {
            types: string;
            import: string;
            requireSource: string;
            require: string;
        };
    };
    typeScriptVersion: string;
    dependencies: {
        "@types/node": string;
        "@vitest/snapshot": string;
        "@wdio/config": string;
        "@wdio/globals": string;
        "@wdio/logger": string;
        "@wdio/protocols": string;
        "@wdio/types": string;
        "@wdio/utils": string;
        "async-exit-hook": string;
        chalk: string;
        chokidar: string;
        "cli-spinners": string;
        dotenv: string;
        ejs: string;
        execa: string;
        "import-meta-resolve": string;
        inquirer: string;
        "lodash.flattendeep": string;
        "lodash.pickby": string;
        "lodash.union": string;
        "read-pkg-up": string;
        "recursive-readdir": string;
        tsx: string;
        webdriverio: string;
        yargs: string;
    };
    devDependencies: {
        "@types/async-exit-hook": string;
        "@types/ejs": string;
        "@types/inquirer": string;
        "@types/lodash.flattendeep": string;
        "@types/lodash.pickby": string;
        "@types/lodash.union": string;
        "@types/recursive-readdir": string;
        "@types/yargs": string;
    };
    publishConfig: {
        access: string;
    };
};
export declare const CLI_EPILOGUE: string;
export declare const CONFIG_HELPER_INTRO = "\n===============================\n\uD83E\uDD16 WDIO Configuration Wizard \uD83E\uDDD9\n===============================\n";
export declare const SUPPORTED_COMMANDS: string[];
export declare const PMs: readonly ["npm", "yarn", "pnpm", "bun"];
export declare const SUPPORTED_CONFIG_FILE_EXTENSION: string[];
export declare const configHelperSuccessMessage: ({ projectRootDir, runScript, extraInfo }: {
    projectRootDir: string;
    runScript: string;
    extraInfo: string;
}) => string;
export declare const CONFIG_HELPER_SERENITY_BANNER = "\nLearn more about Serenity/JS:\n  \uD83D\uDD17 https://serenity-js.org\n";
export declare const DEPENDENCIES_INSTALLATION_MESSAGE = "\nTo install dependencies, execute:\n%s\n";
export declare const NPM_INSTALL = "";
export declare const ANDROID_CONFIG: {
    platformName: string;
    automationName: string;
    deviceName: string;
};
export declare const IOS_CONFIG: {
    platformName: string;
    automationName: string;
    deviceName: string;
};
/**
 * We have to use a string hash for value because InquirerJS default values do not work if we have
 * objects as a `value` to be stored from the user's answers.
 */
export declare const SUPPORTED_PACKAGES: {
    runner: {
        name: string;
        value: string;
    }[];
    framework: {
        name: string;
        value: string;
    }[];
    reporter: {
        name: string;
        value: string;
    }[];
    plugin: {
        name: string;
        value: string;
    }[];
    service: {
        name: string;
        value: string;
    }[];
};
export declare const SUPPORTED_BROWSER_RUNNER_PRESETS: ({
    name: string;
    value: string;
} | {
    name: string;
    value: null;
})[];
export declare const TESTING_LIBRARY_PACKAGES: Record<string, string>;
export declare enum BackendChoice {
    Local = "On my local machine",
    Experitest = "In the cloud using Experitest",
    Saucelabs = "In the cloud using Sauce Labs",
    Browserstack = "In the cloud using BrowserStack",
    OtherVendors = "In the cloud using Testingbot or LambdaTest or a different service",
    Grid = "I have my own Selenium cloud"
}
export declare enum ElectronBuildToolChoice {
    ElectronForge = "Electron Forge (https://www.electronforge.io/)",
    ElectronBuilder = "electron-builder (https://www.electron.build/)",
    SomethingElse = "Something else"
}
declare enum ProtocolOptions {
    HTTPS = "https",
    HTTP = "http"
}
export declare enum RegionOptions {
    US = "us",
    EU = "eu",
    APAC = "apac"
}
export declare const E2E_ENVIRONMENTS: {
    name: string;
    value: string;
}[];
export declare const MOBILE_ENVIRONMENTS: {
    name: string;
    value: string;
}[];
export declare const BROWSER_ENVIRONMENTS: {
    name: string;
    value: string;
}[];
declare function isBrowserRunner(answers: Questionnair): boolean;
export declare function usesSerenity(answers: Questionnair): boolean;
export declare const isNuxtProject: boolean;
export declare const QUESTIONNAIRE: ({
    type: string;
    name: string;
    message: string;
    choices: {
        name: string;
        value: string;
    }[];
    when?: undefined;
    default?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: ({
        name: string;
        value: string;
    } | {
        name: string;
        value: null;
    })[];
    when: typeof isBrowserRunner;
    default?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: boolean;
    when: (answers: Questionnair) => string | false | undefined;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: ElectronBuildToolChoice[];
    when: (answers: Questionnair) => boolean;
    default?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: BackendChoice[];
    when: (answers: Questionnair) => boolean;
    default?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: {
        name: string;
        value: string;
    }[];
    default: string;
    when: (answers: Questionnair) => boolean;
} | {
    type: string;
    name: string;
    message: string;
    choices: {
        name: string;
        value: string;
    }[];
    default: string[];
    when: (answers: Questionnair) => boolean;
} | {
    type: string;
    name: string;
    message: string;
    when: (answers: Questionnair) => boolean | undefined;
    choices?: undefined;
    default?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: string;
    when: (answers: Questionnair) => boolean | undefined;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: ProtocolOptions;
    choices: ProtocolOptions[];
    when: (answers: Questionnair) => boolean;
} | {
    type: string;
    name: string;
    message: string;
    choices: RegionOptions[];
    when: (answers: Questionnair) => boolean;
    default?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: boolean;
    when: (answers: Questionnair) => boolean;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: (answers: Questionnair) => {
        name: string;
        value: string;
    }[];
    when?: undefined;
    default?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    when: (answers: Questionnair) => boolean;
    default: (answers: Questionnair) => true | Promise<boolean>;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: (answers: Questionnair) => Promise<string>;
    when: (answers: Questionnair) => false | RegExpMatchArray | null;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    default: (answers: Questionnair) => Promise<string>;
    when: (answers: Questionnair) => boolean | undefined;
    choices?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: {
        name: string;
        value: string;
    }[];
    default: string[];
    when?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: (answers: Questionnair) => ({
        name: string;
        value: string;
    } | undefined)[];
    default: (answers: Questionnair) => string[];
    when?: undefined;
} | {
    type: string;
    name: string;
    message: () => string;
    default: boolean;
    choices?: undefined;
    when?: undefined;
})[];
export declare const COMMUNITY_PACKAGES_WITH_TS_SUPPORT: string[];
export declare const TESTRUNNER_DEFAULTS: Options.Definition<Options.Testrunner & {
    capabilities: unknown;
}>;
export declare const WORKER_GROUPLOGS_MESSAGES: {
    normalExit: (cid: string) => string;
    exitWithError: (cid: string) => string;
};
export {};
//# sourceMappingURL=constants.d.ts.map