# Sakhi production security risk register

## SR-001 — `sharp` / libvips advisory chain in Kokoro build dependencies

**Status:** bounded build-time exception; release remains fail-closed for any new high/critical advisory.

`kokoro-js` depends on `@huggingface/transformers`, whose Node dependency tree currently includes `sharp`. npm reports high-severity advisories in native libvips/libheif and reports no upstream fix for the installed dependency chain.

Sakhi is deployed as a static browser/PWA application. The release process bundles the browser Kokoro runtime with esbuild before deployment. The deployed site does not run Node, `sharp`, libvips, or libheif.

The release security gate (`scripts/audit-production.cjs`) therefore enforces all of the following:

1. the generated browser bundle must exist before the audit runs;
2. the deployed Kokoro browser bundle must not contain native `sharp`/libvips import or binary markers;
3. the only accepted high-severity npm advisory nodes are the currently known `sharp` → `@huggingface/transformers` → `kokoro-js` chain;
4. any new high/critical package immediately fails the release;
5. any critical advisory immediately fails the release;
6. if native `sharp`/libvips code ever enters the browser artifact, the exception immediately fails.

This is not a blanket npm-audit suppression. It is an artifact-scoped risk decision for a native Node dependency that is not deployed to the learner device. The exception should be removed as soon as the upstream dependency chain supplies a fixed release or Sakhi replaces that build path.
