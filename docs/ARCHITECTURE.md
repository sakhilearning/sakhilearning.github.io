# Sakhi V3 runtime architecture

`ARCHITECTURE.md` at the repository root is authoritative. V3 uses one concrete
browser module per concern: `SakhiCloud`, `SakhiCurriculum`, `SakhiContent`,
`SakhiActivities`, `SakhiPlan`, `SakhiTrails`, `SakhiPresentation`,
`SakhiProgress`, `SakhiAdaptive`, `SakhiAudio`, `SakhiArt`, `SakhiTemplates`,
and `SakhiApp`.

There are no parallel `*Service` wrapper runtimes. File order must not be used as
a patch mechanism. Curriculum selection precedes presentation. Learning evidence
is recorded only by `SakhiProgress.completeActivity()`.
