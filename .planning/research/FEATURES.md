# Features Research: Educational Web-App for Children

## Table Stakes (Must Have)

Diese Features sind **Pflicht** — ohne sie verlassen Nutzer die App:

| Feature | Komplexität | Begründung |
|---------|-------------|------------|
| **Klare Navigation** | Niedrig | Kinder müssen sofort verstehen, wo sie sind |
| **Große, klickbare Buttons** | Niedrig | Touch-freundlich, motorische Fähigkeiten |
| **Fortschrittsanzeige** | Mittel | "Wo bin ich?" — Orientierung im Lernpfad |
| **Sofortiges Feedback** | Niedrig | Bei richtig/falsch — keine Verzögerung |
| **Altersgerechte Sprache** | Niedrig | Kurze Sätze, einfache Wörter |
| **Visuelle Belohnungen** | Mittel | Sterne, Konfetti, Animationen bei Erfolg |
| **Maskottchen als Guide** | Mittel | Emotionale Bindung, "Freund" statt Lehrer |
| **Mobile-Responsive** | Mittel | Tablets in Schulen weit verbreitet |

## Differentiators (Nice to Have)

Diese Features heben die App von anderen ab:

| Feature | Komplexität | Begründung |
|---------|-------------|------------|
| **Kiki mit Emotionen** | Mittel | Reagiert auf Fortschritt (fröhlich/traurig/stolz) |
| **Interaktive Demos** | Hoch | Simulierte KI-Interaktion (Highlight!) |
| **Mini-Apps zum Selberbauen** | Hoch | Lektion 7 — Höhepunkt des Lernpfads |
| **Sound-Effekte** | Niedrig | Feedback, aber mit Mute-Option |
| **Personalisierung** | Mittel | Name eingeben, Kiki sagt "Hallo [Name]!" |
| **Lehrermodus** | Mittel | Übersicht über alle Lektionen, Präsentationsmodus |
| **Zertifikat am Ende** | Niedrig | PDF zum Ausdrucken "Ich bin KI-Entdecker!" |
| **Easter Eggs** | Niedrig | Versteckte Überraschungen (Motivation) |

## Anti-Features (Bewusst NICHT bauen)

| Feature | Warum NICHT |
|---------|-------------|
| **Benutzerkonten/Login** | Komplexität, Datenschutz, Hürde für Kinder |
| **Leaderboards/Ranking** | Kann demotivieren, Konkurrenz statt Lernen |
| **Zeitdruck bei Quizzen** | Stress, nicht kindgerecht |
| **In-App-Käufe** | Ethisch problematisch bei Kindern |
| **Werbung** | Ablenkung, nicht schulgeeignet |
| **Social Features** | Datenschutz, Moderation nötig |
| **Echte KI-API** | Kosten, Datenschutz, unvorhersehbare Antworten |
| **Offline-Modus** | Komplexität (Service Worker), Internet verfügbar |

## Feature-Dependencies

```
Lektionen (Content)
    └── Quiz-System
         └── Fortschritts-Tracking
              └── Belohnungs-System
                   └── Zertifikat

Maskottchen Kiki
    └── Emotionen/Animationen
         └── Personalisierung (Name)
              └── Kontextuelle Reaktionen

Interaktive Demos
    └── Simulierte Prompts
         └── Mini-App-Builder (Lektion 7)
```

## Priorisierung für MVP

### Phase 1: Fundament
- [ ] Navigation & Routing
- [ ] Design-System (Farben, Typografie, Buttons)
- [ ] Kiki-Grundversion (statisch)
- [ ] Lektions-Container

### Phase 2: Core Learning
- [ ] Lektion 1-3 Content
- [ ] Quiz-System
- [ ] Fortschrittsanzeige
- [ ] Feedback-Animationen

### Phase 3: Engagement
- [ ] Kiki mit Emotionen
- [ ] Sound-Effekte
- [ ] Belohnungs-Animationen
- [ ] Personalisierung

### Phase 4: Advanced
- [ ] Lektion 4-6 Content
- [ ] Interaktive Demos
- [ ] Simulierte Prompt-Übungen

### Phase 5: Highlight
- [ ] Lektion 7: Mini-App-Builder
- [ ] Zertifikat
- [ ] Lehrermodus

## Komplexitäts-Schätzung

| Feature-Gruppe | Geschätzte Zeit |
|----------------|-----------------|
| Design-System & Layout | 2-3 Tage |
| Kiki Maskottchen | 2-3 Tage |
| Lektions-System | 2-3 Tage |
| Quiz-System | 2-3 Tage |
| Fortschritt & Belohnungen | 1-2 Tage |
| 7 Lektionen Content | 3-5 Tage |
| Interaktive Demos | 2-3 Tage |
| Mini-App-Builder | 3-4 Tage |
| Polish & Testing | 2-3 Tage |
| **Gesamt** | **~20-30 Tage** |
