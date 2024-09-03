"use strict";
/**
 * Scaffolding functions for CLI `init` command
 *
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
exports.initMkDocs = exports.initTsConfigJson = void 0;
exports.initPython = initPython;
exports.init = init;
const JSON5 = __importStar(require("json5"));
const constants_1 = require("./constants");
const yaml_1 = __importDefault(require("yaml"));
const teen_process_1 = require("teen_process");
const error_1 = require("./error");
const scaffold_1 = require("./scaffold");
const logger_1 = require("./logger");
const lodash_1 = __importDefault(require("lodash"));
const fs_1 = require("./fs");
/**
 * Data for the base `mkdocs.yml` file
 */
const BASE_MKDOCS_YML = Object.freeze({
    INHERIT: './node_modules/@appium/docutils/base-mkdocs.yml',
    docs_dir: 'docs',
    site_dir: 'site',
});
/**
 * Data for the base `tsconfig.json` file
 */
const BASE_TSCONFIG_JSON = Object.freeze({
    $schema: 'https://json.schemastore.org/tsconfig',
    extends: '@appium/tsconfig/tsconfig.json',
    compilerOptions: {
        outDir: 'build',
    },
});
const log = (0, logger_1.getLogger)('init');
const dryRunLog = (0, logger_1.getLogger)('dry-run', log);
/**
 * Files included, by default, in `tsconfig.json`
 */
const DEFAULT_INCLUDE = ['lib', 'test', 'index.js'];
/**
 * Function which scaffolds a `tsconfig.json` file
 */
exports.initTsConfigJson = (0, scaffold_1.createScaffoldTask)(constants_1.NAME_TSCONFIG_JSON, BASE_TSCONFIG_JSON, 'TypeScript configuration', {
    /**
     * Merges the contents of the `include` property with any passed on the CLI. If neither exists,
     * uses the default set of includes.
     * @param content Parsed and/or scaffolded `tsconfig.json`
     * @param opts Options specific to this task
     * @returns `tsconfig.json` content with potentially-modified `include` prop
     */
    transform: (content, { include }) => {
        include = [...(content.include ?? include ?? [])];
        if (lodash_1.default.isEmpty(include)) {
            include = [...DEFAULT_INCLUDE];
        }
        return {
            ...content,
            include: lodash_1.default.uniq(include),
        };
    },
    deserialize: JSON5.parse,
    serialize: fs_1.stringifyJson5,
});
/**
 * Function which scaffolds an `mkdocs.yml` file
 */
exports.initMkDocs = (0, scaffold_1.createScaffoldTask)(constants_1.NAME_MKDOCS_YML, BASE_MKDOCS_YML, 'MkDocs configuration', {
    deserialize: yaml_1.default.parse,
    serialize: fs_1.stringifyYaml,
    transform: (content, opts, pkg) => {
        let siteName = opts.siteName ?? content.site_name;
        if (!siteName) {
            siteName = pkg.name ?? '(no name)';
            if (siteName) {
                log.info('Using site name from package.json: %s', siteName);
            }
        }
        let repoUrl = opts.repoUrl ?? content.repo_url;
        if (!repoUrl) {
            repoUrl = pkg.repository?.url;
            if (repoUrl) {
                log.info('Using repo URL from package.json: %s', repoUrl);
            }
        }
        let repoName = opts.repoName ?? content.repo_name;
        if (repoUrl && !repoName) {
            let { pathname } = new URL(repoUrl);
            pathname = pathname.slice(1);
            const pathparts = pathname.split('/');
            const owner = pathparts[0];
            let repo = pathparts[1];
            repo = repo.replace(/\.git$/, '');
            repoName = [owner, repo].join('/');
            if (repoName) {
                log.info('Using repo name from package.json: %s', repoName);
            }
        }
        let siteDescription = opts.siteDescription ?? content.site_description;
        if (!siteDescription) {
            siteDescription = pkg.description;
            if (siteDescription) {
                log.info('Using site description URL from package.json: %s', siteDescription);
            }
        }
        return {
            ...content,
            site_name: siteName,
            repo_url: repoUrl,
            repo_name: repoName,
            site_description: siteDescription,
        };
    },
});
/**
 * Installs Python dependencies
 * @param opts Options
 */
async function initPython({ pythonPath, dryRun = false, upgrade = false, } = {}) {
    pythonPath = pythonPath ?? (await (0, fs_1.findPython)()) ?? constants_1.NAME_PYTHON;
    const args = ['-m', 'pip', 'install', '-r', constants_1.REQUIREMENTS_TXT_PATH];
    if (upgrade) {
        args.push('--upgrade');
    }
    if (dryRun) {
        dryRunLog.info('Would execute command: %s %s', pythonPath, args.join(' '));
    }
    else {
        log.debug('Executing command: %s %s', pythonPath, args.join(' '));
        log.info('Installing Python dependencies...');
        try {
            const result = await (0, teen_process_1.exec)(pythonPath, args, { shell: true });
            const { code, stdout } = result;
            if (code !== 0) {
                throw new error_1.DocutilsError(`Could not install Python dependencies. Reason: ${stdout}`);
            }
        }
        catch (err) {
            throw new error_1.DocutilsError(`Could not install Python dependencies. Reason: ${err.message}`);
        }
    }
    log.success('Installed Python dependencies (or dependencies already installed)');
}
/**
 * Main handler for `init` command.
 *
 * This runs tasks in serial; it _could_ run in parallel, but it has deleterious effects upon
 * console output which would need mitigation.
 */
async function init({ typescript, python, tsconfigJson: tsconfigJsonPath, packageJson: packageJsonPath, overwrite, include, mkdocs, mkdocsYml: mkdocsYmlPath, siteName, repoName, repoUrl, copyright, dryRun, cwd, pythonPath, upgrade, } = {}) {
    if (typescript && !upgrade) {
        await (0, exports.initTsConfigJson)({
            dest: tsconfigJsonPath,
            packageJson: packageJsonPath,
            overwrite,
            include,
            dryRun,
            cwd,
        });
    }
    if (python) {
        await initPython({ pythonPath, dryRun, upgrade });
    }
    if (mkdocs && !upgrade) {
        await (0, exports.initMkDocs)({
            dest: mkdocsYmlPath,
            cwd,
            siteName,
            repoUrl,
            repoName,
            copyright,
            packageJson: packageJsonPath,
            overwrite,
            dryRun,
        });
    }
}
//# sourceMappingURL=init.js.map