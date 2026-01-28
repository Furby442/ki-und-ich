# KI & ich

## What This Is

Eine interaktive Web-App, die Grundschulkindern (5-11 Jahre) spielerisch erklärt, was Künstliche Intelligenz ist und wie man sie sinnvoll nutzt. Das Maskottchen "Kiki" — ein kleiner, neugieriger Roboter — führt die Kinder durch 7 Lektionen, von den Grundlagen bis zum Programmieren einer eigenen Mini-App mit Claude. Die App ist für Lehrer (zur Demonstration im Unterricht) und Schüler (zum eigenständigen Lernen) konzipiert.

## Core Value

Kinder verstehen KI als Werkzeug, das sie selbst steuern können — nicht als Magie oder Bedrohung. Sie entwickeln "AI Leadership": die Haltung, dass der Mensch die Kontrolle behält.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Lernpfad (7 Lektionen):**
- [ ] Lektion 1: Was ist KI? — Grundverständnis aufbauen
- [ ] Lektion 2: KI-Arten erklärt (LLM, LAM etc.) — kindgerecht
- [ ] Lektion 3: Was kann KI heute? — Aktueller Stand
- [ ] Lektion 4: KI im Alltag — Praktische Anwendungen
- [ ] Lektion 5: Mit KI sprechen — Prompt-Techniken (0-shot, few-shot etc.)
- [ ] Lektion 6: Übungen — Recherche- und Prompt-Übungen
- [ ] Lektion 7: Erste App bauen — Mini-Projekte mit Claude

**Interaktion:**
- [ ] Quiz nach jeder Lektion
- [ ] Kiki-Maskottchen führt durch alle Inhalte
- [ ] Simulierte KI-Demos (ohne echte API)

**Mini-Apps für Lektion 7:**
- [ ] Geschichten-Generator
- [ ] Tier-Quiz ("Ich denke an ein Tier...")
- [ ] Witz-Maschine
- [ ] Namens-Bedeutung

**Design & UX:**
- [ ] Bunt & verspielt (Duolingo-Style)
- [ ] Kurze Lerneinheiten (10-15 Min max)
- [ ] Altersgerechte Sprache und Visualisierungen

### Out of Scope

- Echte Claude API-Anbindung — Kosten, Komplexität, Datenschutz in Schulen
- Englische Version — Fokus auf deutschen Bildungsmarkt
- Sekundarstufe (11-18 Jahre) — andere Zielgruppe, andere Didaktik
- Hausaufgaben-Helfer App — pädagogisch umstritten, nicht im Fokus
- Benutzerkonten/Login — unnötige Komplexität für v1
- Offline-Funktionalität — Internet in Schulen verfügbar

## Context

**Pädagogische Grundlagen:**
- KI-Kompetenzmodelle (Steiner 2025): OECD AI Literacy Framework, Dagstuhl-Dreieck, AI Fluency Framework (Anthropic)
- Kernkompetenzen: Verstehen → Anwenden → Reflektieren → Mitgestalten
- "AI Leadership" als Leitbild: Mensch behält Steuerung und Kontrolle

**Lernforschung:**
- Aufmerksamkeit bei Kindern: max 10-15 Minuten pro Einheit
- Growth Mindset fördern: "Das kann ich noch nicht" statt "Das kann ich nicht"
- Multisensorisch: Sehen, Hören, Interagieren
- Fehler als Lernchance, nicht als Versagen

**Neurologische Erkenntnisse:**
- Emotion und Lernen untrennbar — spielerisch, positiv
- Neugier-getriebenes Lernen am effektivsten
- Sichere Beziehung als Lernbasis (daher Kiki als "Freund")

**Technischer Kontext:**
- Web-App (HTML, CSS, JavaScript)
- Kein Backend nötig (statische Seite)
- Simulierte KI-Antworten (vorgefertigte Beispiele)

## Constraints

- **Zielgruppe**: Grundschule (5-11 Jahre) — Sprache und Konzepte entsprechend anpassen
- **Keine echte API**: Simulierte Demos nur — kein API-Key, keine Kosten
- **Sprache**: Nur Deutsch — kein Englisch in v1
- **Barrierefreiheit**: Große Schrift, klare Kontraste, einfache Navigation
- **Datenschutz**: Keine Datensammlung, keine Cookies, keine Tracker — DSGVO-konform für Schulen

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Kiki als Maskottchen | KI ist abstrakt — ein freundlicher Roboter macht es greifbar | — Pending |
| Simulierte statt echte API | Kosten, Datenschutz, Komplexität vermeiden | — Pending |
| 7-Lektionen-Struktur | Vom Verstehen zum Selbermachen — aufbauend | — Pending |
| Duolingo-Style Design | Bewährt für Lern-Apps, kindgerecht, motivierend | — Pending |
| Quiz nach jeder Lektion | Aktives Lernen, Selbsttests fördern Retention | — Pending |

---
*Last updated: 2026-01-28 after initialization*
