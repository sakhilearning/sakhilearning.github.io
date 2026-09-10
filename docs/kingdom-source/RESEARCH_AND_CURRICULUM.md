# Research and curriculum rationale

This file separates **source-derived findings** from **product decisions made for Sakhi Learning Kingdom**.

## Source-derived findings

### Foundational reading

The U.S. Institute of Education Sciences / What Works Clearinghouse K–3 foundational reading practice guide recommends: academic language/vocabulary; awareness of speech-sound segments and their links to letters; decoding/word analysis plus writing/recognizing words; and daily connected-text reading. The guide rates the sound/letter and decoding recommendations as strong evidence and connected-text reading as moderate evidence.

Source: https://ies.ed.gov/ncee/wwc/PracticeGuide/21

Common Core Kindergarten foundational-reading standards include print concepts, upper/lowercase letter recognition, rhyme, syllables, onset-rime, phoneme isolation/blending/segmenting, letter-sound correspondence, vowel sounds, common high-frequency words, and emergent-reader text.

Source: https://www.thecorestandards.org/ELA-Literacy/RF/K/

### Kindergarten writing

Common Core Kindergarten writing includes combinations of drawing, dictating and writing for opinion, informative/explanatory and narrative purposes, with adult guidance and opportunities to add details.

Source: https://www.thecorestandards.org/ELA-Literacy/W/K/

### Kindergarten mathematics

Common Core Kindergarten mathematics organizes content around Counting & Cardinality, Operations & Algebraic Thinking, Number & Operations in Base Ten, Measurement & Data, and Geometry.

Source: https://www.thecorestandards.org/Math/Content/K/

### Development at age five

CDC's age-5 milestones include telling a story with at least two events, answering simple questions about a story, recognizing simple rhymes, counting to 10, naming some numbers 1–5, using time words, writing some letters in one's name, naming some letters, taking turns, doing simple chores and hopping on one foot. CDC also lists paying attention for 5–10 minutes during activities such as stories or arts/crafts and notes that screen time does not count for that milestone.

Source: https://www.cdc.gov/act-early/milestones/5-years.html

### Play and joyful engagement

NAEYC defines developmentally appropriate practice as strengths-based and play-based, aiming at joyful, engaged learning while considering common developmental patterns, the individual child and the child's context.

Source: https://www.naeyc.org/resources/position-statements/dap/contents

### Touch accessibility

WCAG 2.2's enhanced target-size criterion uses 44 × 44 CSS pixels for pointer targets, with specified exceptions. Sakhi's core child controls are deliberately larger than this floor.

Source: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced

### Child privacy

FTC COPPA guidance says covered child-directed services collecting personal information from children under 13 generally need a clear privacy policy, direct notice to parents and verifiable parental consent (subject to limited exceptions), parent access/deletion controls, data security, retention limits and data minimization. The FTC notes the rule was amended in 2025 and operators should use the current rule/guidance.

Source: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions

## Sakhi Learning Kingdom product decisions

These are app recommendations/inferences, not claims that the sources prescribe this exact format.

### Six-month cadence

- 26 weeks.
- 5 learning days per week.
- 130 planned days.
- 30 minutes as the family's default daily target, for 65 planned hours.
- Each day is divided into four short ~6-minute interactive blocks plus ~6 minutes off-screen.
- The off-screen block combines movement, pencil/handwriting and family conversation.

The 30-minute total is a product choice. The short-block structure is intended to respect variability in five-year-old attention and to avoid treating the entire 30 minutes as continuous screen work.

### Domains

The app preserves the supplied 48-skill Sakhi curriculum rather than replacing it:

| Domain | Existing Sakhi skills | Purpose in this app |
|---|---:|---|
| Reading & Phonics | 11 | letter-sound work, vowel knowledge, blending/segmenting, CVC words, digraphs/blends, sentences, high-frequency words, fluency/comprehension |
| Math Thinking | 10 | number sense, counting/quantities, operations, shapes/space, patterns, measurement, teen numbers/place value and problem solving |
| Stories & Language | 8 | listening, vocabulary, sequencing, story comprehension, categories/relationships and inference |
| Puzzle Power | 6 | classification, patterns, sequences, matching, spatial/flexible reasoning |
| Discovery Lab | 8 | observe, compare, predict, living things, materials, weather/earth-style observation and evidence talk |
| Create & Write | 5 | letter formation practice, spelling/encoding, labels, sentences and simple story expression |

Exact titles and prerequisites are in `data/curriculum-snapshot.json`.

### Weekly arc

| Week | Theme of learning |
|---:|---|
| 1 | Welcome to Learning Kingdom |
| 2 | Sound Detectives |
| 3 | Vowel Garden |
| 4 | Blend Bridge |
| 5 | CVC Castle |
| 6 | Word Builder Workshop |
| 7 | Digraph Harbor |
| 8 | Blend Forest |
| 9 | Sentence Lanterns |
| 10 | Story Door |
| 11 | Fluency Meadow |
| 12 | Long Vowel Magic |
| 13 | Mix, Review & Grow |
| 14 | Shape Explorer |
| 15 | Measure & Compare |
| 16 | Teen Number Towers |
| 17 | Problem-Solving Palace |
| 18 | Number Bond Champions |
| 19 | Storyteller Studio |
| 20 | Discovery Lab |
| 21 | Puzzle Power |
| 22 | Read & Write Projects |
| 23 | Math Adventure |
| 24 | Kindergarten Review |
| 25 | Showcase Projects |
| 26 | Celebration & Readiness |

The plan is not a rigid lockstep sequence. `sakhi-plan.js` substitutes prerequisite/frontier skills when the scheduled skill is not unlocked and inserts spaced review when due.

### Mastery and review

Each skill keeps its own supplied `mastery_criteria` and `review_policy`. Evidence can move through Not Introduced → Learning → Developing → Mostly Mastered → Mastered. Multi-session criteria are respected. Review dates are scheduled from the skill's review policy. Decorative worlds never participate in these calculations.

On-screen letter tracing is intentionally **practice-only**. Fine-motor handwriting quality is better checked through real pencil/paper work and adult observation than inferred from a permissive finger-trace canvas.

### Daily experience

A typical day is:

1. Reading/phonics quest (~6 min).
2. Math quest (~6 min).
3. Writing/language quest (~6 min).
4. Logic/science/discovery quest (~6 min).
5. Off-screen move + pencil + family-talk mission (~6 min).

The actual quest can change because a due spaced-review skill or needed prerequisite takes priority. That is intentional.

### Progress shown to parents

The dashboard avoids a single “overall score.” It shows concrete evidence: sessions, practice minutes, completed plan days, recent attempts, skill states, domain practice accuracy, independence/hints and what is due next. Accuracy is labeled practice evidence, not a grade.

### Familiar-character / princess strategy

The educational engine is theme-independent. For a public GitHub project, use original worlds and assets. If the family later has lawful rights to use a familiar-character pack, implement it as a separate presentation configuration that can map companions/backgrounds/narration/reward labels without changing skill IDs, prerequisites, item difficulty, mastery or review.

Example educational associations can still be used as *design inspiration* (a library world for stories, ocean world for counting/science, ice world for pattern/spatial puzzles, tower/art world for sequencing/creativity), but the public codebase should not include unlicensed Disney images, logos, copied dialogue, music, or confusingly similar character art.
