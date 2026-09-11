# Deploy Sakhi V3 RC2 from macOS

Your existing repository path from this project is:

`/Users/vinaygovindam/Downloads/sakhi-learning`

## Recommended: overlay RC2 on the existing upgrade branch

1. Download and unzip `sakhi-learning-trails-v3-rc2.zip` into Downloads.
2. In Terminal:

```bash
cd /Users/vinaygovindam/Downloads/sakhi-learning
git checkout upgrade/sakhi-v3
git status
```

The working tree must be clean. Then run:

```bash
~/Downloads/sakhi-v3-rc2/install-over-existing.sh \
  /Users/vinaygovindam/Downloads/sakhi-learning
```

The installer preserves your existing public `supabase-config.js` and existing phoneme recordings. It does not ask for or copy any ElevenLabs service secret.

## Validate

```bash
cd /Users/vinaygovindam/Downloads/sakhi-learning
npm run release
```

Expected final lines include:

- 85 skills across 8 subject trails
- 26 weeks / 130 learning days
- 2,125 generated activity checks
- runtime core passed
- deployment validation passed

## Local test

```bash
npm run preview
```

Open the localhost URL printed by the command.

## Commit and push only after local QA

```bash
git add -A
git commit -m "Upgrade Sakhi V3 to RC2 deployment-hardened build"
git push -u origin upgrade/sakhi-v3
```

The included GitHub Pages workflow runs `npm run release`, uploads `dist`, and deploys only after all release checks pass.

## Test the deployed site without stale PWA cache

After GitHub Actions finishes, open the site in a private/incognito browser window first. Confirm that the page shows a styled scene, four trail preview cards, and a gradient Start button. Then do a normal refresh in the installed/PWA version.

RC2 uses a new service-worker cache and a cache-busted manifest/service-worker registration, so the old RC1 shell should be replaced. If an installed PWA still shows the older build, close the installed app completely and reopen it once after visiting the site in the browser.

## Supabase / ElevenLabs

Do not put the ElevenLabs key in browser source. Keep the key and voice ID as Supabase Edge Function secrets. `supabase-config.js` should contain only the public Supabase project URL and public anon/publishable key.
