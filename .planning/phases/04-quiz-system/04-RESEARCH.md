# Phase 4: Quiz System - Research

**Researched:** 2026-01-28
**Domain:** Interactive Quiz UI for Children's Educational App
**Confidence:** HIGH

## Summary

This research investigates best practices for implementing an interactive multiple-choice quiz system in a German educational web app for children ages 5-11. The focus is on child-friendly UI patterns, immediate visual feedback animations, and JSON-based quiz data structures that integrate with the existing Kiki mascot system.

The existing codebase provides solid foundations: `quiz.js` already has `answerQuestion(correct)` and `completeQuiz(score, total)` hooks that integrate with Kiki's `reactToAnswer()` and `reactToQuizEnd()` methods. The lesson JSON format and loader pattern provide a template for quiz data.

**Primary recommendation:** Build a simple, single-screen quiz component with large answer buttons, immediate shake/pulse CSS animations for feedback, and leverage existing Kiki integration hooks. No external libraries needed - vanilla CSS animations and ES6 modules suffice.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS (ES6) | N/A | Quiz logic, DOM manipulation | Already in codebase, no bundle complexity |
| CSS Animations | N/A | Feedback animations (shake, pulse) | Native browser support, performant |
| CSS Custom Properties | N/A | Design system integration | Already established in main.css |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| JSON | N/A | Quiz data storage | Store quiz questions per lesson |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla CSS animations | Animate.css | External dependency, overkill for simple shake/pulse |
| Custom quiz component | React/Vue | Would require full app refactor, not needed |
| LocalStorage state | StateManager | Already integrated via window.appState |

**Installation:**
```bash
# No additional packages needed
# Uses existing project structure
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── data/
│   ├── lessons/          # Existing lesson JSON files
│   └── quizzes/          # NEW: Quiz JSON files (quiz-1.json, quiz-2.json, etc.)
├── components/
│   └── quiz/             # NEW: Quiz component files
│       ├── quiz-renderer.js   # Main quiz controller
│       ├── quiz-question.js   # Individual question rendering
│       └── quiz-feedback.js   # Feedback animation controller
├── views/
│   └── quiz.js           # Existing - update to use new components
└── assets/
    └── styles/
        └── quiz.css      # NEW: Quiz-specific styles
```

### Pattern 1: Quiz Data as JSON (Like Lessons)
**What:** Store quiz questions in JSON files, one per lesson, loaded dynamically
**When to use:** All quiz content
**Example:**
```json
{
  "lessonId": 1,
  "title": "Was ist KI? - Quiz",
  "questions": [
    {
      "id": 1,
      "question": "Was bedeutet KI?",
      "answers": [
        { "id": "a", "text": "Kleine Ideen" },
        { "id": "b", "text": "Kuenstliche Intelligenz", "correct": true },
        { "id": "c", "text": "Komische Informationen" },
        { "id": "d", "text": "Keine Idee" }
      ],
      "feedback": {
        "correct": "Genau! KI bedeutet Kuenstliche Intelligenz.",
        "incorrect": "Nicht ganz. KI steht fuer Kuenstliche Intelligenz."
      }
    }
  ]
}
```

### Pattern 2: Single-Question-at-a-Time Display
**What:** Show one question with 4 large answer buttons, progress indicator at top
**When to use:** All quiz screens (matches existing lesson screen pattern)
**Example:**
```javascript
// QuizRenderer follows LessonRenderer pattern
export class QuizRenderer {
    constructor(container, quizData, state) {
        this.container = container;
        this.quiz = quizData;
        this.state = state;
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
    }

    render() {
        const question = this.quiz.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.quiz.questions.length) * 100;

        this.container.innerHTML = `
            <div class="quiz-wrapper">
                <div class="quiz-progress">
                    <div class="quiz-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="quiz-question">${question.question}</div>
                <div class="quiz-answers" id="quiz-answers">
                    ${question.answers.map(a => `
                        <button class="quiz-answer-btn" data-id="${a.id}">
                            ${a.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        this.setupEventListeners();
    }
}
```

### Pattern 3: State Machine for Answer Flow
**What:** Manage quiz states: WAITING -> ANSWERED -> FEEDBACK -> NEXT_QUESTION
**When to use:** Control user flow through quiz
**Example:**
```javascript
const QUIZ_STATES = {
    WAITING: 'waiting',
    ANSWERED: 'answered',
    SHOWING_FEEDBACK: 'showing_feedback',
    COMPLETE: 'complete'
};

// After answer selection:
// 1. Set state to ANSWERED
// 2. Disable all buttons
// 3. Apply correct/incorrect CSS class
// 4. Trigger Kiki reaction
// 5. Wait 1.5-2 seconds
// 6. Transition to next question or COMPLETE
```

### Anti-Patterns to Avoid
- **Multiple simultaneous questions:** Children get overwhelmed; show ONE question at a time
- **Timer pressure:** NEVER add countdown timers - creates anxiety (requirement: no time pressure)
- **Immediate next-question:** Always pause for feedback absorption (1.5-2 seconds minimum)
- **Small touch targets:** Answer buttons must be minimum 48px, preferably 64px+ for young children
- **Complex navigation:** No back/skip buttons during quiz - linear flow only

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Quiz state persistence | Custom localStorage | Existing StateManager (`window.appState`) | Already handles DSGVO compliance, auto-save |
| Mascot reactions | New animation system | Existing `window.kiki.reactToAnswer()` | Already implemented with particles, emotions |
| Quiz completion | Custom celebration | Existing `window.kiki.reactToQuizEnd(score, total)` | Already handles score-based reactions |
| Progress tracking | Custom progress bar | Existing lesson progress bar CSS | Consistent styling with lessons |
| Loading JSON | Custom fetch | Pattern from `lesson-loader.js` | Error handling, caching already solved |
| Touch gestures | Custom swipe detection | Buttons only | Simpler for young children |

**Key insight:** The existing codebase already solved mascot integration, state management, and styling patterns. Quiz implementation should follow these patterns exactly for consistency.

## Common Pitfalls

### Pitfall 1: Allowing Multiple Answer Clicks
**What goes wrong:** Child clicks rapidly and selects multiple answers, breaking score tracking
**Why it happens:** No guard against clicks after first selection
**How to avoid:** Set `this.answered = true` immediately on first click, check before processing
**Warning signs:** Score goes above 5, or negative; console errors about undefined

### Pitfall 2: Feedback Disappears Too Fast
**What goes wrong:** Child doesn't register if answer was correct
**Why it happens:** Moving to next question immediately after selection
**How to avoid:** 2000ms minimum delay before next question, visual + Kiki verbal confirmation
**Warning signs:** User testing shows children asking "was that right?"

### Pitfall 3: Touch Targets Too Small
**What goes wrong:** Young children miss buttons, get frustrated
**Why it happens:** Using standard button sizing (40px)
**How to avoid:** Minimum 64px height for answer buttons, full-width on mobile
**Warning signs:** Multiple taps on same answer, high frustration in testing

### Pitfall 4: Incorrect Answer Styling Feels Punishing
**What goes wrong:** Red color + shake animation feels aggressive to sensitive children
**Why it happens:** Using standard "error" styling without considering emotional impact
**How to avoid:** Softer orange/amber for incorrect, gentle shake not aggressive; Kiki encourages
**Warning signs:** Child becomes upset after wrong answer, stops trying

### Pitfall 5: Quiz Score Not Saved
**What goes wrong:** User refreshes page and loses quiz progress
**Why it happens:** Forgetting to persist score in StateManager
**How to avoid:** Call `state.set('quizScores', {...})` on quiz completion
**Warning signs:** State quizScores object doesn't update

## Code Examples

Verified patterns from official sources:

### CSS Shake Animation for Incorrect Answer
```css
/* Source: Best practices from 30secondsofcode.org, adapted for children */
@keyframes quiz-shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}

.quiz-answer-btn--incorrect {
    animation: quiz-shake 0.5s ease-in-out;
    background-color: var(--color-accent); /* Orange, not red */
    border-color: var(--color-accent);
}
```

### CSS Pulse Animation for Correct Answer
```css
/* Source: GeeksforGeeks CSS pulse patterns, child-friendly adaptation */
@keyframes quiz-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 20px var(--color-primary); }
    100% { transform: scale(1); }
}

.quiz-answer-btn--correct {
    animation: quiz-pulse 0.6s ease-in-out;
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
}
```

### Answer Button Base Styling
```css
/* Child-friendly large touch targets */
.quiz-answer-btn {
    display: block;
    width: 100%;
    min-height: 64px;
    padding: var(--space-md) var(--space-lg);
    margin-bottom: var(--space-md);

    font-size: var(--lesson-font-size-base); /* 22px for readability */
    font-weight: var(--font-weight-medium);
    text-align: left;

    background-color: white;
    border: 3px solid var(--color-border);
    border-radius: var(--radius-lg);

    cursor: pointer;
    transition: all var(--transition-fast);
}

.quiz-answer-btn:hover:not(:disabled) {
    border-color: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.quiz-answer-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}
```

### Quiz Loader (Following lesson-loader.js Pattern)
```javascript
// Source: Existing lesson-loader.js pattern in codebase
const quizCache = new Map();

export async function loadQuiz(lessonId) {
    if (quizCache.has(lessonId)) {
        return quizCache.get(lessonId);
    }

    try {
        const response = await fetch(`./src/data/quizzes/quiz-${lessonId}.json`);

        if (!response.ok) {
            throw new Error(`Quiz ${lessonId} nicht gefunden`);
        }

        const quizData = await response.json();
        validateQuiz(quizData);
        quizCache.set(lessonId, quizData);

        return quizData;
    } catch (error) {
        console.error(`Fehler beim Laden des Quiz ${lessonId}:`, error);
        throw error;
    }
}

function validateQuiz(quiz) {
    if (!quiz.lessonId || !Array.isArray(quiz.questions)) {
        throw new Error('Ungueltiges Quiz-Format');
    }
    if (quiz.questions.length !== 5) {
        throw new Error(`Quiz hat ${quiz.questions.length} Fragen (erwartet 5)`);
    }
}
```

### Kiki Integration (Using Existing Hooks)
```javascript
// Source: Existing quiz.js hooks
function handleAnswerClick(answerId) {
    if (this.answered) return;
    this.answered = true;

    const question = this.quiz.questions[this.currentQuestion];
    const selectedAnswer = question.answers.find(a => a.id === answerId);
    const isCorrect = selectedAnswer.correct === true;

    // Update score
    if (isCorrect) {
        this.score++;
    }

    // Apply visual feedback
    const btn = this.container.querySelector(`[data-id="${answerId}"]`);
    btn.classList.add(isCorrect ? 'quiz-answer-btn--correct' : 'quiz-answer-btn--incorrect');

    // Show correct answer if user was wrong
    if (!isCorrect) {
        const correctId = question.answers.find(a => a.correct).id;
        this.container.querySelector(`[data-id="${correctId}"]`)
            .classList.add('quiz-answer-btn--correct-hint');
    }

    // Disable all buttons
    this.container.querySelectorAll('.quiz-answer-btn').forEach(b => b.disabled = true);

    // Trigger Kiki reaction (uses existing hook from quiz.js)
    answerQuestion(isCorrect);

    // Delay before next question
    setTimeout(() => this.nextQuestion(), 2000);
}
```

### Quiz Completion with State Persistence
```javascript
completeQuiz() {
    const { score, quiz } = this;
    const total = quiz.questions.length;

    // Trigger Kiki celebration/encouragement
    completeQuiz(score, total);

    // Save to state (uses existing StateManager)
    const quizScores = window.appState.get('quizScores') || {};
    quizScores[quiz.lessonId] = score;
    window.appState.set('quizScores', quizScores);
    window.appState.save();

    // Render completion screen
    this.container.innerHTML = `
        <div class="quiz-complete">
            <h2>Quiz geschafft!</h2>
            <div class="quiz-score">
                <span class="quiz-score-number">${score}</span>
                <span class="quiz-score-text">von ${total} richtig</span>
            </div>
            <a href="#/lesson/${quiz.lessonId + 1}" class="btn btn-lg">
                Weiter zur naechsten Lektion
            </a>
        </div>
    `;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Timer-based quizzes | No time pressure | 2020+ | Better for child anxiety |
| Red for wrong answers | Softer colors (orange/amber) | 2022+ | Less punishing feel |
| Text-only feedback | Mascot + visual + audio | 2024+ | Multi-sensory learning |
| Custom animation libs | CSS @keyframes | 2023+ | Better performance, no dependencies |

**Deprecated/outdated:**
- jQuery for DOM manipulation: Use vanilla JS querySelector/classList
- External animation libraries (Animate.css): CSS keyframes are sufficient
- Complex gamification (XP, levels): Keep simple for young children

## Open Questions

Things that couldn't be fully resolved:

1. **Number of answer options (3 vs 4)?**
   - What we know: 4 options is standard for MCQ, but 3 might be easier for young children
   - What's unclear: Target age range within 5-11 varies widely in reading ability
   - Recommendation: Use 4 options but keep answer text SHORT (max 4-5 words)

2. **Audio feedback in addition to visual?**
   - What we know: Multi-sensory feedback improves learning for children
   - What's unclear: Whether to add sound effects (correct ding, wrong buzzer)
   - Recommendation: Defer to Phase 5 or later; visual + Kiki speech sufficient for now

3. **Retry failed quizzes?**
   - What we know: Children should be able to retry for mastery
   - What's unclear: Should wrong answers be tracked, or just allow unlimited retries?
   - Recommendation: Allow retry from quiz end screen, overwrite score in state

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis: `quiz.js`, `kiki.js`, `lesson-renderer.js`, `lesson-loader.js`
- Existing CSS design system: `main.css`, `lesson.css`, `kiki.css`, `components.css`

### Secondary (MEDIUM confidence)
- [Ramotion - UX Design for Kids](https://www.ramotion.com/blog/ux-design-for-kids/) - Child UI principles
- [AufaitUX - UI/UX Design Tips for Children](https://www.aufaitux.com/blog/ui-ux-designing-for-children/) - Touch targets, feedback
- [Duolingo UX Research](https://t-i-show.medium.com/design-for-learning-apps-ux-research-and-case-study-on-duolingo-1800d33744c9) - Gamification patterns
- [30 Seconds of Code - Shake Animation](https://www.30secondsofcode.org/css/s/shake-invalid-input/) - CSS shake pattern
- [GeeksforGeeks - CSS Pulse Animation](https://www.geeksforgeeks.org/css/css-pulse-animation/) - CSS pulse pattern

### Tertiary (LOW confidence)
- Various CodePen/Medium tutorials on quiz apps (patterns verified against official sources)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing codebase patterns, vanilla JS/CSS
- Architecture: HIGH - Following established lesson/kiki patterns
- Pitfalls: MEDIUM - Based on UX research and child design best practices
- Code examples: HIGH - Adapted from existing codebase with verified CSS patterns

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (30 days - stable domain, no external dependencies)
