# Character & Image Asset Strategy

Sakhi Magic Learning is currently intended as a private family learning application, not a public commercial Disney product. The child strongly prefers familiar characters and worlds, so the visual system supports a rich character library while keeping learning objectives primary.

## Familiar character support

Where appropriate and where assets can be used lawfully, the library may include familiar characters/themes such as Elsa, Anna, Ariel, Belle, Cinderella, Rapunzel, Snow White, Aurora, Jasmine, Tiana, Moana, Mulan, Merida, Pocahontas, Mickey Mouse, Minnie Mouse, Winnie the Pooh, Tigger, Piglet, Eeyore, unicorns, rainbows, fairies, mermaids, castles, friendly dragons, animals and magical forests.

Image discovery is not limited to Pinterest. Potential discovery sources include official character/franchise sites, public image search, Pinterest, fan/reference pages, retailer/product imagery as visual reference, Wikimedia or similar repositories, publicly accessible media pages, user-supplied images and existing project assets.

## Asset priority

1. **User-provided images.** Preserve good parent-supplied images and integrate them first.
2. **Existing high-quality project assets.** Audit before replacing anything.
3. **High-quality publicly accessible character imagery.** Select only when technically and legally appropriate for the application and retain source/provenance metadata.
4. **Generated/original supporting art.** Prefer generated art for backgrounds, learning scenes, unicorns, castles, rainbows, generic princess settings, educational objects and supporting characters.

## No remote hotlink dependency

The running app must not depend permanently on arbitrary third-party image URLs. Selected assets should use stable local asset IDs, for example `character_elsa_01`, `character_ariel_01`, `character_belle_01`, `character_rapunzel_01`, `character_mickey_01`, `character_minnie_01`, `character_pooh_01` and `unicorn_luna_01`.

When storing/caching a third-party image, do so only where technically and legally permissible. Retain source information so the asset can be replaced later.

## Inventory rule

Before replacing visuals, classify every existing asset as:

- KEEP
- UPGRADE
- REPLACE
- BROKEN

Do not remove a working image the parent prefers without a concrete reason.

## Library organization

Use centralized categories rather than scattering URLs through UI code:

- `/characters/disney-princesses/`
- `/characters/mickey-friends/`
- `/characters/pooh/`
- `/characters/unicorns/`
- `/characters/fairies/`
- `/characters/animals/`
- `/backgrounds/`
- `/educational/`
- `/rewards/`

All UI code obtains imagery through `AssetService`.

## Asset registry metadata

Each registered image should retain:

- `asset_id`
- `character`
- `category`
- `source_url`
- `source_page`
- `local_path`
- `image_width`
- `image_height`
- `aspect_ratio`
- `use_case`
- `quality_score`
- `active`
- `fallback_asset_id`
- provenance / rights note
- inventory status

## Image quality

Prefer high resolution, clear character visibility, good crop, minimal text, minimal watermarking, clear background separation, appealing expressions and child-friendly presentation.

Reject pixelated images, tiny thumbnails, obvious watermarks, screenshots containing browser/navigation UI, cropped heads, poor compression, adult/inappropriate imagery and distorted characters.

## Visual consistency

Franchise character art may naturally vary in style. The application itself remains cohesive through Sakhi's UI system: backgrounds, buttons, cards, frames, animations, rewards, transitions and learning objects.

Character imagery supports learning and motivation; it does not replace clean instructional objects or interaction design.

## Educational roles

Suggested recurring associations:

- **Belle:** stories, vocabulary, reading comprehension, books, sequencing.
- **Ariel:** ocean science, counting shells, sorting, marine animals, vocabulary.
- **Elsa / Anna:** number puzzles, patterns, spatial reasoning, winter science, logic.
- **Rapunzel:** creative activities, patterns, sequencing, art, story creation.
- **Cinderella:** matching, sorting, routines, time concepts, social situations.
- **Mickey / Minnie:** general review, counting, memory, matching, movement games.
- **Winnie the Pooh:** stories, emotions, friendship, simple reasoning, nature.
- **Unicorns / Luna:** phonics, reading, rewards and rainbow adventures.

These are memorable associations, not permanent subject restrictions.

## Theme selection

When familiar-character assets are available and appropriate, prefer memorable wrappers such as:

- Elsa's Frozen Number Adventure
- Ariel's Underwater Treasure Hunt
- Belle's Enchanted Story Library
- Rapunzel's Lantern Pattern Challenge
- Cinderella's Royal Matching Game
- Mickey & Minnie's Counting Picnic
- Winnie the Pooh's Hundred Acre Story Adventure
- Luna's Rainbow Phonics Quest

The educational objective remains more important than the character wrapper.

## Central acquisition workflow

`SEARCH / DISCOVER → REVIEW QUALITY → SELECT → STORE / CACHE → REGISTER → USE THROUGH AssetService`

Do not let individual lesson components perform their own web searches, and do not search the web every time a lesson starts.

## Failure handling and preload

If a preferred character asset fails, use another registered image of that character. If none exists, use a high-quality themed fallback. Never expose a broken-image icon, raw URL, gray error box or technical error to the child.

Before an adventure starts, preload the main character, background, major interactive objects and the next activity's major assets where practical.

## Product requirement

The experience should feel visually full and exciting without obscuring the learning objects. Familiar characters create motivation, story, emotional connection and recognizable worlds. Clean educational objects teach the actual concept.

## Repository visibility caution

The application may be intended for private family use, but the current GitHub Pages repository is publicly accessible. Do not commit third-party copyrighted character images to the public repository merely because the intended audience is private. User-owned/original assets and assets with clear permission are safe candidates for direct repository storage. Other character imagery should only be stored when the usage rights and hosting model permit it.