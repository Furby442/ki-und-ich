# Research Summary: KI & ich

## Key Findings

### Stack
- **Vanilla HTML/CSS/JavaScript** — kein Framework nötig
- **JSON-Dateien** für Lektionen und Quizzes
- **LocalStorage** für Fortschritt (DSGVO-freundlich)
- **GitHub Pages** für kostenloses Hosting
- **SVG** für Kiki-Maskottchen (skalierbar, animierbar)

### Features
- **Table Stakes:** Klare Navigation, große Buttons, Fortschrittsanzeige, sofortiges Feedback
- **Differentiators:** Kiki mit Emotionen, interaktive KI-Demos, Mini-App-Builder
- **Anti-Features:** Keine Accounts, kein Zeitdruck, keine echte API

### Architecture
- Simple SPA mit Hash-Routing
- Views → Components → Services → Data Layer
- Content in JSON, Progress in LocalStorage
- Modularer Aufbau für schrittweise Entwicklung

### Critical Pitfalls
1. Zu komplexe Sprache für Kinder
2. Lerneinheiten zu lang (>15 Min)
3. Navigation unklar
4. Demotivierende Fehler-Behandlung
5. Design überladen
6. Nicht touch-freundlich
7. KI-Konzepte zu abstrakt

---

## Recommended Stack (Final)

| Layer | Technologie | Begründung |
|-------|-------------|------------|
| **Markup** | HTML5 | Semantisch, zugänglich |
| **Styling** | CSS3 + Custom Properties | Volle Kontrolle, kein Build |
| **Logic** | Vanilla JavaScript | Einfach, keine Dependencies |
| **Data** | JSON-Dateien | Leicht zu pflegen |
| **Storage** | LocalStorage | Kein Backend nötig |
| **Routing** | Hash-based (custom) | Funktioniert auf static hosts |
| **Assets** | SVG + WebP | Performant, skalierbar |
| **Hosting** | GitHub Pages | Kostenlos, HTTPS |

---

## Table Stakes Features (v1 Must-Have)

1. ✅ Klare, kindgerechte Navigation
2. ✅ Große Touch-Targets (48x48px minimum)
3. ✅ Fortschrittsanzeige auf jeder Seite
4. ✅ Sofortiges Feedback bei Quiz-Antworten
5. ✅ Kiki als durchgängiger Guide
6. ✅ Belohnungen (Sterne, Animationen)
7. ✅ Mobile-responsive Design
8. ✅ Altersgerechte Sprache (7-Jährige-Test)

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│            User Interface           │
│  Home → Lesson → Quiz → Result      │
├─────────────────────────────────────┤
│           Components                │
│  Kiki | Quiz | Cards | Buttons      │
├─────────────────────────────────────┤
│            Services                 │
│  Router | Progress | Content        │
├─────────────────────────────────────┤
│             Data                    │
│  JSON (content) | LocalStorage      │
└─────────────────────────────────────┘
```

---

## Critical Pitfalls to Avoid

| Pitfall | Prevention | Phase |
|---------|------------|-------|
| Komplexe Sprache | 7-Jähriger-Test für alle Texte | Content (6) |
| Zu lange Einheiten | Max 5-7 Screens pro Lektion | Structure (3) |
| Unklare Navigation | Immer sichtbarer Weiter-Button | Foundation (1) |
| Demotivierende Fehler | Growth Mindset, Kiki-Hints | Quiz (4) |
| Überladenes Design | Design-System, Whitespace | Design (1-2) |
| Kleine Touch-Targets | 48x48px Minimum | Components (2) |
| Abstrakte KI-Konzepte | Konkrete Analogien, Demos | Content (6) |

---

## Implications for Roadmap

### Build Order (9 Phasen empfohlen)

1. **Foundation** — Projekt-Setup, Design-System, Router
2. **Kiki** — Maskottchen mit Emotionen und Sprechblasen
3. **Lesson System** — Content-Rendering, Navigation
4. **Quiz System** — Fragen, Antworten, Feedback
5. **Progress & Rewards** — Tracking, Sterne, Animationen
6. **Content Creation** — Alle 7 Lektionen + Quizzes
7. **Interactive Demos** — Simulierte KI-Interaktionen
8. **Mini-App Builder** — Lektion 7 Höhepunkt
9. **Polish** — Sounds, Zertifikat, Lehrermodus, Mobile-Test

### Kritische Dependencies

```
Foundation → Kiki → Lessons → Quiz → Progress → Content → Demos → MiniApp → Polish
```

### Risiken

| Risiko | Mitigation |
|--------|------------|
| Content zu komplex | User-Testing mit Kindern |
| Kiki-Animation aufwändig | SVG statt Lottie, einfache Emotionen |
| 7 Lektionen = viel Content | Erst 3 Lektionen bauen, dann erweitern |
| Mini-App-Builder komplex | Vordefinierte Templates, nicht freier Code |

---

## Confidence Assessment

| Bereich | Confidence | Anmerkung |
|---------|------------|-----------|
| Stack (Vanilla JS) | 🟢 Hoch | Bewährt für einfache SPAs |
| JSON für Content | 🟢 Hoch | Standard-Approach |
| Kiki mit SVG | 🟡 Mittel | Animationen brauchen Feinarbeit |
| Quiz-System | 🟢 Hoch | Gut verstanden, klar umsetzbar |
| Mini-App-Builder | 🟡 Mittel | Komplexestes Feature, gut planen |
| Content-Qualität | 🟡 Mittel | Hängt von User-Testing ab |

---

*Research completed: 2026-01-28*
