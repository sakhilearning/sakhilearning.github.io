# Sakhi Activity Schema

Every child activity is normalized and validated before rendering. Required educational fields include activity/session identity, domain/strand/skill, difficulty, interaction type, objective, written/spoken instruction, character prompt, items/targets, correct answer, distractors, scaffold hints, success/retry feedback, mastery signal, visual/audio assets, reward rule, and completion rule.

Prompt and interaction type must agree. Invalid trace data must reject the activity rather than falling back to an unrelated component.
