import type { TransformCallback } from 'node:stream';
import { Transform } from 'node:stream';
export default class RunnerStream extends Transform {
    constructor();
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
    _final(callback: (error?: Error | undefined) => void): void;
}
//# sourceMappingURL=stdStream.d.ts.map