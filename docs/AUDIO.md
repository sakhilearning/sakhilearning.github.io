# Sakhi Audio

Sakhi has two separate audio responsibilities:

1. `SpeechService` owns narration, provider selection, caching, playback state, readiness, overlap prevention, replay, and user-facing playback diagnostics.
2. `PhonemeAudioService` owns instructional phoneme assets and will only play validated phoneme recordings.

General TTS must not be treated as authoritative phonics audio. First child interaction must initialize audio before the first activity narration is needed. Parent Mode must provide a sound test and distinguish provider failure, browser playback restriction, and likely device mute/inaudibility without promising that browser code can override OS silent mode.
