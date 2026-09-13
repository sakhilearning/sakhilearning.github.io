import { env as transformersEnv } from '@huggingface/transformers';
import { KokoroTTS, TextSplitterStream } from 'kokoro-js';

// Mobile Safari is more reliable with one WASM worker and no proxy worker.
// Kokoro still runs fully on the device; this only reduces peak iPad overhead.
transformersEnv.backends.onnx.wasm.numThreads = 1;
transformersEnv.backends.onnx.wasm.proxy = false;

export { KokoroTTS, TextSplitterStream };
