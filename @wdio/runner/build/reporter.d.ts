import type { Options, Capabilities } from '@wdio/types';
/**
 * BaseReporter
 * responsible for initialising reporters for every testrun and propagating events
 * to all these reporters
 */
export default class BaseReporter {
    #private;
    private _config;
    private _cid;
    caps: Capabilities.RequestedStandaloneCapabilities | Capabilities.RequestedMultiremoteCapabilities;
    private _reporters;
    private listeners;
    constructor(_config: Options.Testrunner, _cid: string, caps: Capabilities.RequestedStandaloneCapabilities | Capabilities.RequestedMultiremoteCapabilities);
    initReporters(): Promise<void>;
    /**
     * emit events to all registered reporter and wdio launcer
     *
     * @param  {string} e       event name
     * @param  {object} payload event payload
     */
    emit(e: string, payload: any): void;
    onMessage(listener: (ev: any) => void): void;
    getLogFile(name: string): string | undefined;
    /**
     * return write stream object based on reporter name
     */
    getWriteStreamObject(reporter: string): {
        write: (content: unknown) => boolean;
    };
    /**
     * wait for reporter to finish synchronization, e.g. when sending data asynchronous
     * to a server (e.g. sumo reporter)
     */
    waitForSync(): Promise<unknown>;
    /**
     * initialize reporters
     */
    private _loadReporter;
}
//# sourceMappingURL=reporter.d.ts.map