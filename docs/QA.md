# Sakhi V3 QA

The release gate is:

```bash
npm ci
npm run qa
```

It includes syntax validation, graph/content/activity validation, 8,500 generated
activity cases, adaptive/mastery/reward regressions, six-month plan checks,
fixed-trail separation, 25/30/35-minute cadence checks, cloud integrity guards,
CSS ownership checks, asset checks, and PWA wiring checks.

Before merging a release branch to `main`, also complete a real-device smoke pass
on the primary iPad/phone: Start -> full daily session -> off-screen completion ->
Treasures -> Parent Dashboard -> refresh -> offline/reconnect. Confirm no console
errors, no overlapping narration, no broken images, and legible touch targets in
portrait and landscape.
