/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import assert from 'assert';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { mkdir, unlink } from 'fs/promises';
import os from 'os';
import path from 'path';
import { Browser, BrowserPlatform, downloadUrls, } from './browser-data/browser-data.js';
import { Cache, InstalledBrowser } from './Cache.js';
import { debug } from './debug.js';
import { detectBrowserPlatform } from './detectPlatform.js';
import { unpackArchive } from './fileUtil.js';
import { downloadFile, getJSON, headHttpRequest } from './httpUtil.js';
const debugInstall = debug('puppeteer:browsers:install');
const times = new Map();
function debugTime(label) {
    times.set(label, process.hrtime());
}
function debugTimeEnd(label) {
    const end = process.hrtime();
    const start = times.get(label);
    if (!start) {
        return;
    }
    const duration = end[0] * 1000 + end[1] / 1e6 - (start[0] * 1000 + start[1] / 1e6); // calculate duration in milliseconds
    debugInstall(`Duration for ${label}: ${duration}ms`);
}
export async function install(options) {
    options.platform ??= detectBrowserPlatform();
    options.unpack ??= true;
    if (!options.platform) {
        throw new Error(`Cannot download a binary for the provided platform: ${os.platform()} (${os.arch()})`);
    }
    const url = getDownloadUrl(options.browser, options.platform, options.buildId, options.baseUrl);
    try {
        return await installUrl(url, options);
    }
    catch (err) {
        // If custom baseUrl is provided, do not fall back to CfT dashboard.
        if (options.baseUrl && !options.forceFallbackForTesting) {
            throw err;
        }
        debugInstall(`Error downloading from ${url}.`);
        switch (options.browser) {
            case Browser.CHROME:
            case Browser.CHROMEDRIVER:
            case Browser.CHROMEHEADLESSSHELL: {
                debugInstall(`Trying to find download URL via https://googlechromelabs.github.io/chrome-for-testing.`);
                const version = (await getJSON(new URL(`https://googlechromelabs.github.io/chrome-for-testing/${options.buildId}.json`)));
                let platform = '';
                switch (options.platform) {
                    case BrowserPlatform.LINUX:
                        platform = 'linux64';
                        break;
                    case BrowserPlatform.MAC_ARM:
                        platform = 'mac-arm64';
                        break;
                    case BrowserPlatform.MAC:
                        platform = 'mac-x64';
                        break;
                    case BrowserPlatform.WIN32:
                        platform = 'win32';
                        break;
                    case BrowserPlatform.WIN64:
                        platform = 'win64';
                        break;
                }
                const url = version.downloads[options.browser]?.find(link => {
                    return link['platform'] === platform;
                })?.url;
                if (url) {
                    debugInstall(`Falling back to downloading from ${url}.`);
                    return await installUrl(new URL(url), options);
                }
                throw err;
            }
            default:
                throw err;
        }
    }
}
async function installUrl(url, options) {
    options.platform ??= detectBrowserPlatform();
    if (!options.platform) {
        throw new Error(`Cannot download a binary for the provided platform: ${os.platform()} (${os.arch()})`);
    }
    const fileName = url.toString().split('/').pop();
    assert(fileName, `A malformed download URL was found: ${url}.`);
    const cache = new Cache(options.cacheDir);
    const browserRoot = cache.browserRoot(options.browser);
    const archivePath = path.join(browserRoot, `${options.buildId}-${fileName}`);
    if (!existsSync(browserRoot)) {
        await mkdir(browserRoot, { recursive: true });
    }
    if (!options.unpack) {
        if (existsSync(archivePath)) {
            return archivePath;
        }
        debugInstall(`Downloading binary from ${url}`);
        debugTime('download');
        await downloadFile(url, archivePath, options.downloadProgressCallback);
        debugTimeEnd('download');
        return archivePath;
    }
    const outputPath = cache.installationDir(options.browser, options.platform, options.buildId);
    try {
        if (existsSync(outputPath)) {
            const installedBrowser = new InstalledBrowser(cache, options.browser, options.buildId, options.platform);
            if (!existsSync(installedBrowser.executablePath)) {
                throw new Error(`The browser folder (${outputPath}) exists but the executable (${installedBrowser.executablePath}) is missing`);
            }
            await runSetup(installedBrowser);
            return installedBrowser;
        }
        debugInstall(`Downloading binary from ${url}`);
        try {
            debugTime('download');
            await downloadFile(url, archivePath, options.downloadProgressCallback);
        }
        finally {
            debugTimeEnd('download');
        }
        debugInstall(`Installing ${archivePath} to ${outputPath}`);
        try {
            debugTime('extract');
            await unpackArchive(archivePath, outputPath);
        }
        finally {
            debugTimeEnd('extract');
        }
        const installedBrowser = new InstalledBrowser(cache, options.browser, options.buildId, options.platform);
        if (options.buildIdAlias) {
            const metadata = installedBrowser.readMetadata();
            metadata.aliases[options.buildIdAlias] = options.buildId;
            installedBrowser.writeMetadata(metadata);
        }
        await runSetup(installedBrowser);
        return installedBrowser;
    }
    finally {
        if (existsSync(archivePath)) {
            await unlink(archivePath);
        }
    }
}
async function runSetup(installedBrowser) {
    // On Windows for Chrome invoke setup.exe to configure sandboxes.
    if ((installedBrowser.platform === BrowserPlatform.WIN32 ||
        installedBrowser.platform === BrowserPlatform.WIN64) &&
        installedBrowser.browser === Browser.CHROME &&
        installedBrowser.platform === detectBrowserPlatform()) {
        try {
            debugTime('permissions');
            const browserDir = path.dirname(installedBrowser.executablePath);
            const setupExePath = path.join(browserDir, 'setup.exe');
            if (!existsSync(setupExePath)) {
                return;
            }
            spawnSync(path.join(browserDir, 'setup.exe'), [`--configure-browser-in-directory=` + browserDir], {
                shell: true,
            });
            // TODO: Handle error here. Currently the setup.exe sometimes
            // errors although it sets the permissions correctly.
        }
        finally {
            debugTimeEnd('permissions');
        }
    }
}
/**
 *
 * @public
 */
export async function uninstall(options) {
    options.platform ??= detectBrowserPlatform();
    if (!options.platform) {
        throw new Error(`Cannot detect the browser platform for: ${os.platform()} (${os.arch()})`);
    }
    new Cache(options.cacheDir).uninstall(options.browser, options.platform, options.buildId);
}
/**
 * Returns metadata about browsers installed in the cache directory.
 *
 * @public
 */
export async function getInstalledBrowsers(options) {
    return new Cache(options.cacheDir).getInstalledBrowsers();
}
/**
 * @public
 */
export async function canDownload(options) {
    options.platform ??= detectBrowserPlatform();
    if (!options.platform) {
        throw new Error(`Cannot download a binary for the provided platform: ${os.platform()} (${os.arch()})`);
    }
    return await headHttpRequest(getDownloadUrl(options.browser, options.platform, options.buildId, options.baseUrl));
}
function getDownloadUrl(browser, platform, buildId, baseUrl) {
    return new URL(downloadUrls[browser](platform, buildId, baseUrl));
}
//# sourceMappingURL=install.js.map