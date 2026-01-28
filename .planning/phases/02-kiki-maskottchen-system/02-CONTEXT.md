# Phase 2: Kiki Maskottchen System - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Kiki ist ein kleiner, neugieriger Roboter der als emotionaler Guide durch den Lernpfad führt. Er erscheint auf jeder Seite, zeigt verschiedene Emotionen, erklärt in Sprechblasen, und reagiert auf Quiz-Antworten. Kiki macht KI für Kinder greifbar und freundlich.

</domain>

<decisions>
## Implementation Decisions

### Kikis Aussehen
- **Größe:** Mittel (120-150px) — gut sichtbar, lässt Platz für Inhalt
- **Position:** Unten links, fixiert — neben der Navigation, immer sichtbar
- **Stil:** Mix aus Roboter-Körper mit weichen, freundlichen Gesichtszügen
- **Hauptfarbe:** Lila/Violett — magisch, kreativ, kindgerecht
- **Körperform:** Kastenförmig mit abgerundeten Ecken — klassischer Roboter-Look
- **Fortbewegung:** Schwebt leicht — keine Beine/Füße sichtbar
- **Antenne:** Ja, eine Antenne/Fühler oben — typisch für Roboter, kann wackeln
- **Augen:** LED-Display Augen — rechteckig, können Symbole zeigen (Herz, Stern, X)
- **Mund:** Einfache Linie — kann lächeln, traurig sein, überrascht
- **Arme:** Roboterarme mit sichtbaren Gelenken, segmentiert
- **Hände:** Drei Finger (Cartoon-Stil) — einfach, kindgerecht, leicht zu animieren

### Emotionen & Animationen
- **Emotionen:** Erweitertes Set (6): fröhlich, nachdenklich, stolz, traurig, überrascht, neugierig
- **Animations-Tempo:** Langsam (0.8-1s) — sanft, nicht überwältigend für Kinder
- **Idle-Animation:** Ja, subtil — leichtes Schweben, Blinzeln — Kiki "lebt"
- **LED-Augen:** Kombination aus Augenformen + gelegentlich Symbole bei starken Emotionen
- **Antenne:** Reagiert auf Emotionen — wackelt/bewegt sich (aufgeregt = schnell, traurig = hängt runter)
- **Arm-Gesten:** Grundgesten (winken, zeigen) UND emotionale Gesten (jubeln, Schultern hängen)
- **Partikel-Effekte:** Ja, dezent — kleine Sterne/Funken bei Freude, Tränen bei Trauer
- **Barrierefreiheit:** prefers-reduced-motion wird beachtet — Animationen werden reduziert

### Sprechblasen
- **Position:** Im Content-Bereich — separiert von Kiki, mehr wie ein Hinweis-Banner
- **Stil:** Chat-Bubble Stil — wie eine Chat-Nachricht, mit kleinem Pfeil zu Kiki
- **Textlänge:** Kurz (1-2 Sätze) — prägnant, schnell lesbar für Kinder
- **Text-Animation:** Wortweise fade-in — Wort für Wort erscheint

### Quiz-Reaktionen
- **Richtige Antwort:** Subtil + Text — Lächeln, Daumen hoch, kurzes Lob
- **Falsche Antwort:** Aufmunternd aktiv — Winkt ab, "Kein Problem!", motiviert weiterzumachen
- **Quiz-Ende:** Stolz bei Bestehen — ab 3/5 richtig = stolz, darunter = ermutigt nochmal zu versuchen
- **Reaktions-Dauer:** Bleibt bis User "Weiter" klickt — keine automatische Zeitbegrenzung

### Claude's Discretion
- Exakte SVG-Implementierung und Pfade
- Genaue Animationskurven (easing)
- Technische Details der Partikel-Effekte
- Farbschattierungen und Akzentfarben neben Lila
- Genaue Pixel-Positionierung

</decisions>

<specifics>
## Specific Ideas

- Kiki soll freundlich wirken wie die Duolingo-Eule, aber eindeutig ein Roboter sein
- LED-Display Augen ermöglichen kreative Ausdrucksformen (Herzen, Sterne, Fragezeichen)
- Die Antenne ist ein visuelles "Tell" für Kikis Stimmung — Kinder können daran ablesen wie es Kiki geht
- Schwebendes Design macht Kiki magisch und hebt ihn von normalen Charakteren ab
- Chat-Bubble Stil für Sprechblasen passt zum KI-Thema (wie ein Chat mit KI)

</specifics>

<deferred>
## Deferred Ideas

Keine — Diskussion blieb innerhalb des Phase-Scopes

</deferred>

---

*Phase: 02-kiki-maskottchen-system*
*Context gathered: 2026-01-28*
