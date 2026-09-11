# Sakhi V3 status

Current release candidate: `2026.09.10-v3`, based on production commit
`bb388ed14f721c25c3fb2140481e2913e8ed9bc8`.

Automated V3 QA passes locally. Deployment still requires the V3 Supabase
migration for plan/email metadata. Only `/t/` and `/p/` are bundled as locally
verified phoneme recordings; other isolated phonemes should be validated before
being marked local-quality complete.
