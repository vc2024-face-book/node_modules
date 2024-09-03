export default BasePlugin;
export type Plugin = import("@appium/types").Plugin;
export type NextPluginCallback = import("@appium/types").NextPluginCallback;
export type Constraints = import("@appium/types").Constraints;
export type Driver<C extends Constraints> = import("@appium/types").Driver<C>;
/**
 * @implements {Plugin}
 */
export class BasePlugin implements Plugin {
    /**
     * Subclasses should use type `import('@appium/types').MethodMap<SubclassName>`.
     *
     * This will verify that the commands in the `newMethodMap` property are
     * valid.  It is impossible to use a generic type param here; the type of this should really
     * be something like `MethodMap<T extends BasePlugin>` but that isn't a thing TS does.
     *
     * ```ts
     * static newMethodMap = {
     *   '/session/:sessionId/fake_data': {
     *     GET: {command: 'getFakeSessionData', neverProxy: true},
     *   }
     * } as const;
     * ```
     */
    static newMethodMap: {};
    /**
     * Subclasses should use type `import('@appium/types').ExecuteMethodMap<SubclassName>`.
     *
     * Building up this map allows the use of the convenience function `executeMethod`, which
     * basically does verification of names and parameters for execute methods implemented by this
     * plugin.
     *
     * ```ts
     * static executeMethodMap = {
     *   'foo: bar': {
     *     command: 'commandName',
     *     params: {required: ['thing1', 'thing2'], optional: ['thing3']},
     *   },
     * } as const;
     * ```
     */
    static executeMethodMap: {};
    /**
     * @param {string} name
     * @param {Record<string,unknown>} [cliArgs]
     */
    constructor(name: string, cliArgs?: Record<string, unknown> | undefined);
    name: string;
    cliArgs: Record<string, unknown>;
    logger: import("@appium/types").AppiumLogger;
    /**
     * A convenience method that can be called by plugins who implement their own `executeMethodMap`.
     * Only useful if your plugin has defined `executeMethodMap`. This helper requires passing in the
     * `next` and `driver` objects since naturally we'd want to make sure to trigger the driver's own
     * `executeMethod` call if an execute method is not found on the plugin itself.
     *
     * @template {Constraints} C
     * @param {NextPluginCallback} next
     * @param {Driver<C>} driver
     * @param {string} script
     * @param {readonly [import('@appium/types').StringRecord<unknown>] | readonly any[]} protoArgs
     */
    executeMethod<C extends Constraints>(next: NextPluginCallback, driver: Driver<C>, script: string, protoArgs: readonly [import("@appium/types").StringRecord<unknown>] | readonly any[]): Promise<unknown>;
}
//# sourceMappingURL=plugin.d.ts.map