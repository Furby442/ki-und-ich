# Requirements: KI & ich

**Defined:** 2026-01-28
**Core Value:** Kinder verstehen KI als Werkzeug, das sie selbst steuern können — nicht als Magie oder Bedrohung.

## v1 Requirements

### Navigation & UI

- [x] **NAV-01**: User kann durch klare Navigation mit sichtbarem Weiter-Button navigieren
- [x] **NAV-02**: User sieht Fortschrittsanzeige auf jeder Seite (wo im Lernpfad)
- [x] **NAV-03**: App ist mobile-responsive (funktioniert auf Tablets)
- [x] **NAV-04**: User sieht Home-Übersicht mit allen Lektionen auf einen Blick
- [x] **NAV-05**: Touch-Targets sind mindestens 48x48px groß

### Kiki Maskottchen

- [ ] **KIKI-01**: Kiki erscheint als SVG-Avatar auf jeder Seite
- [ ] **KIKI-02**: Kiki zeigt verschiedene Emotionen (fröhlich, nachdenklich, stolz, traurig)
- [ ] **KIKI-03**: Kiki hat eine Sprechblase für Erklärungen
- [ ] **KIKI-04**: Kiki reagiert animiert auf User-Aktionen (Quiz richtig/falsch)
- [ ] **KIKI-05**: Kiki begrüßt User auf der Startseite

### Lektionen

- [ ] **LEKT-01**: Lektion 1 "Was ist KI?" ist vollständig mit Text und Bildern
- [ ] **LEKT-02**: Lektion 2 "KI-Arten" erklärt LLM, LAM etc. kindgerecht
- [ ] **LEKT-03**: Lektion 3 "Was kann KI heute?" zeigt aktuellen Stand
- [ ] **LEKT-04**: Lektion 4 "KI im Alltag" zeigt praktische Anwendungen
- [ ] **LEKT-05**: Lektion 5 "Mit KI sprechen" erklärt Prompt-Techniken (0-shot, few-shot)
- [ ] **LEKT-06**: Lektion 6 enthält Recherche- und Prompt-Übungen
- [ ] **LEKT-07**: Lektion 7 "Erste App bauen" führt zu Mini-Apps
- [ ] **LEKT-08**: Jede Lektion hat max 5-7 Screens (10-15 Min)
- [ ] **LEKT-09**: Sprache ist für 7-Jährige verständlich (kurze Sätze, einfache Wörter)

### Quiz

- [ ] **QUIZ-01**: Nach jeder Lektion gibt es ein Quiz mit 5 Multiple-Choice-Fragen
- [ ] **QUIZ-02**: User bekommt sofortiges visuelles Feedback (richtig/falsch Animation)
- [ ] **QUIZ-03**: Quiz-Ergebnis wird angezeigt (X von 5 richtig)
- [ ] **QUIZ-04**: Kiki reagiert auf Quiz-Ergebnis (feiert bei Erfolg, ermutigt bei Fehlern)

### Mini-Apps (Lektion 7)

- [ ] **MINI-01**: Geschichten-Generator: User gibt Figur + Ort ein → simulierte Geschichte
- [ ] **MINI-02**: Tier-Quiz: User denkt an Tier → simulierte KI stellt Fragen und rät
- [ ] **MINI-03**: Witz-Maschine: User klickt → kinderfreundlicher Witz erscheint
- [ ] **MINI-04**: Namens-Bedeutung: User gibt Namen ein → simulierte Bedeutung

### Fortschritt & Belohnungen

- [ ] **PROG-01**: Fortschritt wird in LocalStorage gespeichert
- [ ] **PROG-02**: Abgeschlossene Lektionen werden auf Home markiert
- [ ] **PROG-03**: Konfetti-Animation bei Quiz-Erfolg
- [ ] **PROG-04**: Sound-Effekte bei Interaktionen (mit Mute-Option)

### Lehrermodus

- [ ] **LEHR-01**: Lehrermodus zeigt Übersicht aller Lektionen für Präsentation
- [ ] **LEHR-02**: Im Lehrermodus kann Navigation frei erfolgen (keine Sperre)

### Technisch

- [x] **TECH-01**: App läuft als statische Web-App (HTML, CSS, JS)
- [x] **TECH-02**: Kein Backend erforderlich
- [x] **TECH-03**: App ist auf GitHub Pages deploybar
- [x] **TECH-04**: App speichert keine personenbezogenen Daten (DSGVO-konform)

## v2 Requirements

### Personalisierung
- **PERS-01**: User kann Namen eingeben, Kiki sagt "Hallo [Name]!"
- **PERS-02**: User kann Kiki-Farbe/Aussehen anpassen

### Zertifikat
- **ZERT-01**: Nach Abschluss aller Lektionen erhält User Zertifikat
- **ZERT-02**: Zertifikat ist als PDF druckbar

### Erweiterungen
- **ERW-01**: Weitere Lektionen zu fortgeschrittenen KI-Themen
- **ERW-02**: Glossar mit KI-Begriffen

### Quiz-Erweiterungen
- **QUIZ-05**: Erklärungen warum Antwort richtig/falsch
- **QUIZ-06**: Sterne-Bewertung (1-3 Sterne je nach Ergebnis)
- **QUIZ-07**: Kiki-Hints bei falschen Antworten

## Out of Scope

| Feature | Reason |
|---------|--------|
| Echte Claude API | Kosten, Datenschutz, unvorhersehbare Antworten |
| Benutzerkonten/Login | Komplexität, Datenschutz, Hürde für Kinder |
| Leaderboards/Ranking | Kann demotivieren, Konkurrenz statt Lernen |
| Zeitdruck bei Quiz | Stress, nicht kindgerecht |
| Englische Version | Fokus auf deutschen Bildungsmarkt |
| Offline-Modus | Komplexität, Internet in Schulen verfügbar |
| Social Features | Datenschutz, Moderation nötig |
| In-App-Käufe | Ethisch problematisch bei Kindern |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| NAV-03 | Phase 1 | Complete |
| NAV-04 | Phase 1 | Complete |
| NAV-05 | Phase 1 | Complete |
| TECH-01 | Phase 1 | Complete |
| TECH-02 | Phase 1 | Complete |
| TECH-03 | Phase 1 | Complete |
| TECH-04 | Phase 1 | Complete |
| KIKI-01 | Phase 2 | Pending |
| KIKI-02 | Phase 2 | Pending |
| KIKI-03 | Phase 2 | Pending |
| KIKI-04 | Phase 2 | Pending |
| KIKI-05 | Phase 2 | Pending |
| LEKT-08 | Phase 3 | Pending |
| LEKT-09 | Phase 3 | Pending |
| QUIZ-01 | Phase 4 | Pending |
| QUIZ-02 | Phase 4 | Pending |
| QUIZ-03 | Phase 4 | Pending |
| QUIZ-04 | Phase 4 | Pending |
| PROG-01 | Phase 5 | Pending |
| PROG-02 | Phase 5 | Pending |
| PROG-03 | Phase 5 | Pending |
| PROG-04 | Phase 5 | Pending |
| LEKT-01 | Phase 6 | Pending |
| LEKT-02 | Phase 6 | Pending |
| LEKT-03 | Phase 6 | Pending |
| LEKT-04 | Phase 6 | Pending |
| LEKT-05 | Phase 7 | Pending |
| LEKT-06 | Phase 7 | Pending |
| LEKT-07 | Phase 8 | Pending |
| MINI-01 | Phase 8 | Pending |
| MINI-02 | Phase 8 | Pending |
| MINI-03 | Phase 8 | Pending |
| MINI-04 | Phase 8 | Pending |
| LEHR-01 | Phase 9 | Pending |
| LEHR-02 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 after roadmap creation*
