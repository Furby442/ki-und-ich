# Stack Research: Educational Web-App for Children

## Recommended Stack

### Frontend Framework

**Recommendation: Vanilla HTML/CSS/JavaScript oder Vue 3**

| Option | Empfehlung | Begründung |
|--------|------------|------------|
| **Vanilla JS** | ✅ Stark empfohlen | Keine Build-Tools nötig, einfaches Deployment, keine Dependencies |
| **Vue 3** | ✅ Alternative | Reaktiv, einfach zu lernen, gute DX |
| **React** | ⚠️ Nicht empfohlen | Overkill für statische Lern-App, komplexer Build |
| **Svelte** | ⚠️ Möglich | Kompiliert zu Vanilla JS, aber weniger verbreitet |

**Entscheidung für dieses Projekt: Vanilla JS**
- Kein Build-Schritt nötig
- Direkt im Browser testbar
- Leicht zu deployen (GitHub Pages, Netlify)
- Keine Node.js-Abhängigkeit

### CSS Framework

| Option | Empfehlung | Begründung |
|--------|------------|------------|
| **Vanilla CSS + CSS Variables** | ✅ Empfohlen | Volle Kontrolle über Design, keine Abstraktion |
| **Tailwind CSS** | ⚠️ Möglich | Utility-first, aber braucht Build |
| **Bootstrap** | ❌ Nicht empfohlen | Zu "erwachsen", nicht kindgerecht |

**Entscheidung: Custom CSS mit CSS Variables**
- Design-System für Farben, Spacing, Typografie
- Duolingo-Style erfordert Custom-Design ohnehin
- CSS Variables für Theming

### Animation

| Option | Empfehlung | Begründung |
|--------|------------|------------|
| **CSS Animations** | ✅ Empfohlen | Native, performant, keine Dependency |
| **Lottie** | ✅ Für Maskottchen | JSON-basierte Animationen, leichtgewichtig |
| **GSAP** | ⚠️ Möglich | Mächtig, aber Lizenzfragen |
| **Anime.js** | ⚠️ Möglich | Leichtgewichtig, MIT-Lizenz |

**Entscheidung: CSS Animations + SVG für Kiki**
- CSS für UI-Animationen (Buttons, Übergänge)
- SVG mit CSS/JS für Kiki-Maskottchen-Animationen

### Datenstruktur

| Aspekt | Lösung |
|--------|--------|
| **Lektionen-Content** | JSON-Dateien |
| **Quiz-Fragen** | JSON-Dateien |
| **Fortschritt speichern** | LocalStorage |
| **Kiki-Dialoge** | JSON-Dateien |

### Deployment

| Option | Empfehlung | Begründung |
|--------|------------|------------|
| **GitHub Pages** | ✅ Empfohlen | Kostenlos, einfach, HTTPS |
| **Netlify** | ✅ Alternative | Kostenlos, schnell, Preview-Deploys |
| **Vercel** | ⚠️ Möglich | Gut für Frameworks, hier Overkill |

## Dateistruktur

```
ki-und-ich/
├── index.html
├── css/
│   ├── variables.css      # Design tokens
│   ├── base.css           # Reset, Typography
│   ├── components.css     # Buttons, Cards, etc.
│   ├── layout.css         # Grid, Container
│   └── animations.css     # Keyframes
├── js/
│   ├── app.js             # Main entry
│   ├── router.js          # Simple SPA routing
│   ├── lessons.js         # Lesson logic
│   ├── quiz.js            # Quiz logic
│   ├── kiki.js            # Mascot interactions
│   └── progress.js        # LocalStorage handling
├── data/
│   ├── lessons/
│   │   ├── lesson-1.json
│   │   ├── lesson-2.json
│   │   └── ...
│   └── quizzes/
│       ├── quiz-1.json
│       └── ...
├── assets/
│   ├── images/
│   ├── icons/
│   └── kiki/              # Mascot SVGs/animations
└── pages/
    ├── home.html
    ├── lesson.html
    ├── quiz.html
    └── ...
```

## Confidence Levels

| Entscheidung | Confidence | Begründung |
|--------------|------------|------------|
| Vanilla JS statt Framework | 🟢 Hoch | Projekt ist einfach genug, kein State-Management nötig |
| Custom CSS | 🟢 Hoch | Duolingo-Style erfordert Custom-Design |
| LocalStorage für Fortschritt | 🟢 Hoch | Kein Backend, DSGVO-freundlich |
| JSON für Content | 🟢 Hoch | Einfach zu pflegen, keine DB nötig |
| GitHub Pages Deployment | 🟢 Hoch | Kostenlos, einfach, zuverlässig |

## Was NICHT verwenden

| Technologie | Warum nicht |
|-------------|-------------|
| **React/Next.js** | Overkill, komplexer Build, unnötige Abhängigkeiten |
| **Backend/API** | Nicht nötig für statische Lern-App |
| **Datenbank** | LocalStorage reicht für Fortschritt |
| **Authentication** | Out of scope für v1 |
| **TypeScript** | Overhead für kleines Projekt |
| **Webpack/Vite** | Kein Build nötig bei Vanilla JS |
