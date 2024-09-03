import child from 'node:child_process';
import { EventEmitter } from 'node:events';
import type { ChildProcess } from 'node:child_process';
import type { WritableStreamBuffer } from 'stream-buffers';
import type { Options, Workers } from '@wdio/types';
/**
 * WorkerInstance
 * responsible for spawning a sub process to run the framework in and handle its
 * session lifetime.
 */
export default class WorkerInstance extends EventEmitter implements Workers.Worker {
    cid: string;
    config: Options.Testrunner;
    configFile: string;
    caps: WebdriverIO.Capabilities;
    capabilities: WebdriverIO.Capabilities;
    specs: string[];
    execArgv: string[];
    retries: number;
    stdout: WritableStreamBuffer;
    stderr: WritableStreamBuffer;
    childProcess?: ChildProcess;
    sessionId?: string;
    server?: Record<string, any>;
    logsAggregator: string[];
    instances?: Record<string, {
        sessionId: string;
    }>;
    isMultiremote?: boolean;
    isBusy: boolean;
    isKilled: boolean;
    isReady: Promise<boolean>;
    isSetup: Promise<boolean>;
    isReadyResolver: (value: boolean | PromiseLike<boolean>) => void;
    isSetupResolver: (value: boolean | PromiseLike<boolean>) => void;
    /**
     * assigns paramters to scope of instance
     * @param  {object}   config      parsed configuration object
     * @param  {string}   cid         capability id (e.g. 0-1)
     * @param  {string}   configFile  path to config file (for sub process to parse)
     * @param  {object}   caps        capability object
     * @param  {string[]} specs       list of paths to test files to run in this worker
     * @param  {number}   retries     number of retries remaining
     * @param  {object}   execArgv    execution arguments for the test run
     */
    constructor(config: Options.Testrunner, { cid, configFile, caps, specs, execArgv, retries }: Workers.WorkerRunPayload, stdout: WritableStreamBuffer, stderr: WritableStreamBuffer);
    /**
     * spawns process to kick of wdio-runner
     */
    startProcess(): child.ChildProcess;
    private _handleMessage;
    private _handleError;
    private _handleExit;
    /**
     * sends message to sub process to execute functions in wdio-runner
     * @param  command  method to run in wdio-runner
     * @param  args     arguments for functions to call
     */
    postMessage(command: string, args: Workers.WorkerMessageArgs, requiresSetup?: boolean): void;
}
//# sourceMappingURL=worker.d.ts.map