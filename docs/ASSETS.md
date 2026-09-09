# Sakhi Assets

All runtime visual assets are resolved through `AssetService`. User-provided and existing good assets are inventoried before replacement. Asset selection considers theme, activity concept, skill, and character; a single generic castle image must not be used as the default for unrelated activities.

Runtime components do not hotlink or perform web searches. Selected assets use stable IDs with provenance, quality, dimensions, concept/theme/activity/character tags, validation state, and fallback metadata.
