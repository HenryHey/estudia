# Estudia — domain glossary

Reference for naming parts of the app in prompts. The **UI is in Catalan**; this document is in **English**. When you change copy, match the labels users see (listed below).

---

## What Estudia is

**Estudia** is a place to **practice for a while**: pick a **school subject** on the **home** screen, choose a **topic** (*tema*), play through a **round**, then optionally start **another round**. Some topics remember **scores** on the device (best exam or last round, depending on the game).

---

## Subjects, topics, and games

- A **subject** (*matèria*) is what you choose on **home** — for now **Geography** and **Math** only.
- A **topic** (*tema*) is a unit inside a subject — e.g. **Comarques de Catalunya** under Geography, **Taules de multiplicar** under Math.
- A **game** is the **way you play**: the rules, screens, and actions for one round. The same game type can serve different topics or content.

**Games in the app today:**

| Game | What the learner does | Used for |
|------|------------------------|----------|
| **Flashcard game** | Flip a **card**, see the answer, say **I knew it** or **not yet** (and choose **study** or **exam** first) | Geography topic **Comarques de Catalunya** (per **province**) |
| **Times-table game** | Answer **multiplication** problems one at a time: type the result, **check**, get feedback, **next** until the round ends | Math topic **Taules de multiplicar** |

---

## Screens and navigation

| Term | Meaning | App copy (CA) |
|------|---------|----------------|
| **Home** | Lists **subjects** | *Estudia* — “Tria una matèria i practica una estona.” |
| **Subject hub** | Lists **topics** for one subject | *Tria un tema.* |
| **Back** / **Home** (header) | Return up the hierarchy or to home | *Enrere*, *Inici* |
| **Province picker** | Inside topic **Comarques de Catalunya**: choose a province | Topic title *Comarques de Catalunya* |

---

## Subjects (home)

| Subject | App title | Topics (today) |
|---------|-----------|----------------|
| **Geography** | *Geografia* | *Comarques de Catalunya* |
| **Math** | *Mates* | *Taules de multiplicar* |

### Geography

- **Flow:** home → *Geografia* → topic *Comarques de Catalunya* → **province** → flashcard game.
- **Scores:** each **province** tile shows its own **best exam**; subject and topic tiles do not show one combined score.

### Math

- **Flow:** home → *Mates* → topic *Taules de multiplicar* → times-table game.
- **Scores:** **last round** on the topic tile (and on home for Math); not necessarily the best ever.

---

## Topics (current)

### Comarques de Catalunya (Geography)

- **Practices:** **comarques** and **county capitals** in **Catalonia**, by **province**.
- **Game:** flashcard game.

### Taules de multiplicar (Math)

- **Practices:** multiplication with factors from 1 to 10.
- **Game:** times-table game.

---

## Flashcard game

Used for the **Comarques de Catalunya** topic.

### Card

- **Question side** — shown first.
- **Answer side** — shown after **flip** (tap the card or *Gira*).

Cards often have a **label** (e.g. *Comarca* or *Capital de comarca*) plus the **prompt**.

### Learner actions

| Action | App copy (CA) | Meaning |
|--------|---------------|---------|
| Flip | *Gira* / tap card | Reveal the answer |
| Knew it | *La sé* | I know this (counts in **exam**) |
| Not yet | *Encara no* | Still learning (in **study**, card comes back) |

### Practice mode (before a round)

| Mode | App copy | Behavior | Score saved? |
|------|----------|----------|--------------|
| **Study** | *Estudi* | Missed cards **return** until all cleared | No |
| **Exam** | *Examen* | **One turn per card** per round | Yes — **best exam** if improved |

**Exam detail (Comarques):** one random question type per comarca per round (name from capital, or capital from name).

---

## Times-table game

Used for **Taules de multiplicar**.

- **Round:** fixed number of random problems (factors 1–10).
- **Flow:** answer → *Comprova* → feedback → *Següent* until *Has acabat!*

---

## Geography content (comarques)

- **Province** — Barcelona, Lleida, Tarragona, or Girona; each has its own deck and best exam score.
- **Comarca** / **county capital** — paired recall both ways.

Content follows the official comarca list (Generalitat reference t15902).

---

## Rounds, progress, and scores

| Where | What is remembered |
|-------|---------------------|
| Math subject (home) | **Last** round (times tables topic) |
| Times tables **topic** tile | **Last** round |
| Each **province** under Comarques | Best **exam** |
| Flashcard **study** mode | Nothing |

If nothing played yet: *Encara sense puntuació*.

---

## Quick map: routes

```
Home (/)
├── /geografia                      → topics (Geografia)
│   └── /geografia/comarques        → provinces (tema: Comarques de Catalunya)
│       └── /geografia/comarques/[provincia] → flashcard game
└── /mates                          → topics (Mates)
    └── /mates/taules               → times-table game (tema: Taules de multiplicar)
```

---

## Prompt vocabulary

| Use in prompts | App (CA) |
|----------------|----------|
| subject | *matèria* — *Geografia*, *Mates* |
| topic / tema | *tema* — *Comarques de Catalunya*, *Taules de multiplicar* |
| game | flashcard game, times-table game |
| province | *província* |
| comarca | *comarca* |
| study / exam | *Estudi* / *Examen* |
| round | *ronda* |
| best exam | *millor examen* |
| last score | *última puntuació* |

---

*Domain draft — add subjects, topics, and games as the product grows.*
