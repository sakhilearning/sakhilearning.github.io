# Bundled gentle narration

442 narration and guidance lines are generated once, then served as local MP3 files.
There are no ElevenLabs calls, account requirements, or per-play credits in the audio
playback path. Unbundled or unavailable lines fall back to an English device voice.
The installed device voice varies by operating system. Playback begins after a tap.

- Model: [hexgrad/Kokoro-82M v1.0](https://huggingface.co/hexgrad/Kokoro-82M)
- Voice: `af_heart`, English (US), speed `0.94`
- Model license: Apache 2.0. No model weights are distributed in the app.
- Generator: [kokoro-onnx 0.6.1](https://github.com/thewh1teagle/kokoro-onnx)
- Encoding: 24 kHz mono, 64 kbps MP3; output limited to prevent clipping.
- Provenance: synthetic speech of Sakhi's existing learning content, not a cloned voice.

The app caches recordings after they are heard. First playback of a new recording
requires a connection. The small model and voice-bank paths are provided to
`scripts/generate-narration.py` when rebuilding the pack; they never run on a child's
device. Run `scripts/collect-narration.cjs` before generation when narration changes.
The manifest uses exact text keys to avoid mismatching a question with its audio.

Pure isolated consonants remain in the separate verified phoneme pack. Synthetic
narration is not a replacement for those recordings.
