# Asset policy

## Included assets

| Asset | Source | Use |
|---|---|---|
| `assets/icon-180.png` | User-supplied prior Sakhi project | App icon |
| `assets/icon-192.png` | User-supplied prior Sakhi project | App/browser icon |
| `assets/icon-512.png` | User-supplied prior Sakhi project | PWA icon |
| Runtime world art from `sakhi-art.js` | Original procedural SVG composition | Decorative child-facing world/companion art |
| Emoji | Unicode/platform rendering | Small UI affordances only |

The runtime SVG art is intentionally generic fantasy/princess-style artwork and is not traced from or designed to impersonate a specific copyrighted character.

## Rules for future assets

1. Inventory an asset before replacing it.
2. Keep provenance for every image/audio/font file.
3. Do not hotlink arbitrary web images.
4. Do not commit copyrighted Disney/princess artwork, logos, stills or music to a public repository unless you hold appropriate rights.
5. Keep licensed/familiar-character packs presentation-only. They may change world art, palette, companion labels, narration flavor and reward labels; they must not change curriculum, skill selection, prerequisites, difficulty, mastery or review.
6. Prefer original/generated art for the default repository.
7. Keep child privacy in mind: do not embed third-party tracking pixels, behavioral advertising SDKs or social-sharing widgets into the child experience.

## Suggested licensed-asset adapter

If you later obtain lawful assets, create a private folder such as:

```text
assets/licensed/<pack-id>/
  manifest.json
  home.webp
  companion.webp
  reward.webp
```

`manifest.json` should contain only presentation data (theme ID, filenames, alt text, attribution/license notes). Do not place skill IDs or difficulty rules in an asset manifest.
