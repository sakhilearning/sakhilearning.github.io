"""Generate app-local Kokoro narration so child pages never wait for remote TTS."""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets/audio/narration"
VOICE = "af_heart"
SPEED = 0.86

if __name__ == "__main__":
    model, voices = sys.argv[1], sys.argv[2]
    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {"files": {}}
    files = manifest.get("files", {})
    texts = json.loads((OUT / "texts-v5.json").read_text())
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else len(texts)
    shard_index = int(sys.argv[4]) if len(sys.argv) > 4 else 0
    shard_count = int(sys.argv[5]) if len(sys.argv) > 5 else 1
    if shard_index < 0 or shard_index >= shard_count:
        raise ValueError("shard index must be between 0 and shard count - 1")
    options = ort.SessionOptions()
    options.intra_op_num_threads = 3 if shard_count > 1 else 4
    options.inter_op_num_threads = 1
    engine = Kokoro.from_session(ort.InferenceSession(model, sess_options=options, providers=["CPUExecutionProvider"]), voices)
    missing_all = [text for text in texts if text not in files or not (OUT / files[text]).exists()]
    missing = [text for index, text in enumerate(missing_all) if index % shard_count == shard_index][:limit]
    output_path = manifest_path if shard_count == 1 else OUT / f"manifest-part-{shard_index}.json"
    output_files = files if shard_count == 1 else {}
    print(f"Generating {len(missing)} new lines in shard {shard_index + 1}/{shard_count}; preserving {len(files)} existing lines.", flush=True)
    for index, text in enumerate(missing, 1):
        name = hashlib.sha256((VOICE + str(SPEED) + text).encode()).hexdigest()[:20] + ".mp3"
        destination = OUT / name
        if not destination.exists():
            samples, rate = engine.create(text, voice=VOICE, speed=SPEED, lang="en-us")
            if not len(samples) or not np.isfinite(samples).all() or np.max(np.abs(samples)) < 0.01:
                raise RuntimeError("Empty or invalid voice: " + text)
            subprocess.run([
                "ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(rate), "-ac", "1", "-i", "pipe:0",
                "-af", "alimiter=limit=0.90:level=false,afade=t=in:d=0.025", "-codec:a", "libmp3lame", "-b:a", "56k", str(destination)
            ], input=samples.astype("float32").tobytes(), check=True)
        output_files[text] = name
        if index % 25 == 0 or index == len(missing):
            output_path.write_text(json.dumps({"version": 2, "voice": VOICE, "model": "Kokoro-82M v1.0 int8", "speed": SPEED, "files": output_files}, ensure_ascii=False))
            print(f"{index}/{len(missing)} new narration lines ready", flush=True)
    output_path.write_text(json.dumps({"version": 2, "voice": VOICE, "model": "Kokoro-82M v1.0 int8", "speed": SPEED, "files": output_files}, ensure_ascii=False))
    print(f"Complete: {len(output_files)} narration mappings written to {output_path.name}", flush=True)
