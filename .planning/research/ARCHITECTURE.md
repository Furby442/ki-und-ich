# Architecture Research: Educational Web-App for Children

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Views     │  │  Components │  │    Services     │ │
│  │             │  │             │  │                 │ │
│  │ - Home      │  │ - Kiki      │  │ - Progress      │ │
│  │ - Lesson    │  │ - Quiz      │  │ - Router        │ │
│  │ - Quiz      │  │ - Button    │  │ - Content       │ │
│  │ - Result    │  │ - Card      │  │ - Storage       │ │
│  │ - Demo      │  │ - Progress  │  │                 │ │
│  │ - MiniApp   │  │ - Feedback  │  │                 │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │                 Data Layer                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │   │
│  │  │ lessons/ │  │ quizzes/ │  │ LocalStorage │  │   │
│  │  │  (JSON)  │  │  (JSON)  │  │  (Progress)  │  │   │
│  │  └──────────┘  └──────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Views (Pages)

| View | Beschreibung | Komponenten |
|------|--------------|-------------|
| **HomeView** | Startseite mit Übersicht | Kiki, LessonCards, ProgressBar |
| **LessonView** | Einzelne Lektion anzeigen | Kiki, ContentBlocks, NextButton |
| **QuizView** | Quiz nach Lektion | QuizQuestion, AnswerButtons, Feedback |
| **ResultView** | Quiz-Ergebnis | Kiki (emotional), Stars, ContinueButton |
| **DemoView** | Interaktive KI-Demos | SimulatedChat, PromptInput |
| **MiniAppView** | Lektion 7: App bauen | CodePreview, AppSelector |
| **CertificateView** | Abschluss-Zertifikat | Certificate, PrintButton |

### Core Components

```
Components/
├── Kiki/
│   ├── KikiAvatar.js       # SVG-Rendering
│   ├── KikiEmotions.js     # happy, thinking, proud, confused
│   └── KikiSpeech.js       # Sprechblase mit Text
│
├── Lesson/
│   ├── LessonCard.js       # Vorschau auf Startseite
│   ├── ContentBlock.js     # Text, Bild, Video-Platzhalter
│   └── ProgressIndicator.js # Punkte/Schritte in Lektion
│
├── Quiz/
│   ├── QuizQuestion.js     # Frage anzeigen
│   ├── AnswerButton.js     # Multiple Choice Button
│   ├── FeedbackPopup.js    # Richtig/Falsch Animation
│   └── QuizProgress.js     # 1/5, 2/5, etc.
│
├── UI/
│   ├── Button.js           # Primary, Secondary, Ghost
│   ├── Card.js             # Container mit Shadow
│   ├── Modal.js            # Overlay für Popups
│   ├── ProgressBar.js      # Gesamtfortschritt
│   └── Stars.js            # Bewertung (1-3 Sterne)
│
└── Demo/
    ├── SimulatedChat.js    # Fake Chat-Interface
    ├── PromptInput.js      # Eingabefeld
    └── ResponseBubble.js   # Simulierte KI-Antwort
```

## Data Flow

```
User Action
    │
    ▼
┌─────────┐     ┌──────────┐     ┌──────────────┐
│  View   │────▶│ Service  │────▶│ LocalStorage │
└─────────┘     └──────────┘     └──────────────┘
    │                │
    │                ▼
    │          ┌──────────┐
    │          │   JSON   │
    │          │  Content │
    │          └──────────┘
    │                │
    ▼                ▼
┌─────────────────────────┐
│    Component Update     │
│    (DOM Manipulation)   │
└─────────────────────────┘
```

### Beispiel: Quiz beantworten

1. User klickt Antwort-Button
2. QuizView empfängt Event
3. QuizService prüft Antwort gegen JSON
4. ProgressService speichert in LocalStorage
5. FeedbackPopup zeigt Richtig/Falsch
6. Kiki reagiert emotional
7. Nächste Frage oder Ergebnis

## Data Structures

### Lesson JSON

```json
{
  "id": "lesson-1",
  "title": "Was ist KI?",
  "kikiIntro": "Hallo! Ich bin Kiki. Heute lernen wir...",
  "sections": [
    {
      "type": "text",
      "content": "Künstliche Intelligenz ist..."
    },
    {
      "type": "image",
      "src": "assets/images/lesson-1/robot.svg",
      "alt": "Ein freundlicher Roboter"
    },
    {
      "type": "interactive",
      "component": "simple-demo"
    }
  ],
  "kikiOutro": "Super gemacht! Jetzt weißt du..."
}
```

### Quiz JSON

```json
{
  "lessonId": "lesson-1",
  "questions": [
    {
      "id": "q1",
      "question": "Was kann eine KI gut?",
      "answers": [
        { "text": "Muster erkennen", "correct": true },
        { "text": "Träumen", "correct": false },
        { "text": "Fühlen", "correct": false }
      ],
      "kikiHint": "Denk an das Beispiel mit den Katzenbildern...",
      "explanation": "KI ist super darin, Muster zu erkennen!"
    }
  ]
}
```

### Progress (LocalStorage)

```json
{
  "userName": "Max",
  "completedLessons": ["lesson-1", "lesson-2"],
  "quizScores": {
    "lesson-1": { "score": 4, "total": 5, "stars": 3 },
    "lesson-2": { "score": 3, "total": 5, "stars": 2 }
  },
  "currentLesson": "lesson-3",
  "totalStars": 5,
  "certificateUnlocked": false
}
```

## Build Order (Dependencies)

```
Phase 1: Foundation
├── 1.1 Project Setup (HTML, CSS structure)
├── 1.2 Design System (variables.css, base styles)
├── 1.3 Router (simple hash-based)
└── 1.4 Basic Layout (header, main, nav)

Phase 2: Core Components
├── 2.1 Button, Card, ProgressBar components
├── 2.2 Kiki Avatar (static SVG)
├── 2.3 Kiki Speech Bubble
└── 2.4 Kiki Emotions (CSS classes)

Phase 3: Content System
├── 3.1 Lesson data structure (JSON)
├── 3.2 ContentBlock renderer
├── 3.3 LessonView
└── 3.4 Lesson Navigation

Phase 4: Quiz System
├── 4.1 Quiz data structure (JSON)
├── 4.2 QuizQuestion component
├── 4.3 Answer validation
├── 4.4 Feedback animations
└── 4.5 ResultView

Phase 5: Progress & Storage
├── 5.1 LocalStorage service
├── 5.2 Progress tracking
├── 5.3 Stars calculation
└── 5.4 Home page with progress

Phase 6: Content Creation
├── 6.1 Lesson 1-3 content
├── 6.2 Quiz 1-3 content
├── 6.3 Lesson 4-6 content
└── 6.4 Quiz 4-6 content

Phase 7: Interactive Demos
├── 7.1 SimulatedChat component
├── 7.2 Prompt input handling
├── 7.3 Pre-defined responses
└── 7.4 Demo integration in lessons

Phase 8: Mini-App Builder (Lesson 7)
├── 8.1 App selector UI
├── 8.2 Story Generator
├── 8.3 Animal Quiz
├── 8.4 Joke Machine
└── 8.5 Name Meaning

Phase 9: Polish
├── 9.1 Animations & transitions
├── 9.2 Sound effects (optional)
├── 9.3 Certificate generator
├── 9.4 Teacher mode
└── 9.5 Mobile optimization
```

## Routing Strategy

Simple hash-based routing (no library needed):

```javascript
const routes = {
  '#/': HomeView,
  '#/lesson/:id': LessonView,
  '#/quiz/:id': QuizView,
  '#/result/:id': ResultView,
  '#/demo/:type': DemoView,
  '#/miniapp': MiniAppView,
  '#/certificate': CertificateView
};
```

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **No framework** | Simplicity, no build step, easy deployment |
| **JSON for content** | Easy to edit, version control friendly |
| **LocalStorage** | No backend, GDPR compliant, persists between sessions |
| **Hash routing** | Works on static hosts (GitHub Pages) |
| **CSS-only animations** | Performance, no JS dependency for visuals |
| **SVG for Kiki** | Scalable, animatable, small file size |
