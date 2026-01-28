# Phase 3: Lesson Framework - Research

**Researched:** 2026-01-28
**Domain:** Content rendering, slide-based navigation, child-friendly typography, educational UX
**Confidence:** HIGH

## Summary

This research covers the implementation of a lesson framework for the "KI & ich" educational web app targeting 7-year-old children. The phase requires a content rendering system that displays lessons in 5-7 screens (10-15 minutes total), with navigation between screens, Kiki mascot integration, and child-friendly text formatting.

The standard approach is to use **JSON-based lesson data** combined with a **screen/slide component** that handles navigation, progress tracking, and Kiki integration. Following the existing codebase pattern (vanilla JavaScript ES6 modules with HTML template strings), the implementation avoids external libraries in favor of CSS-based slide transitions and touch-friendly navigation.

**Primary recommendation:** Build a `LessonRenderer` component that reads lesson data from JSON files, renders one screen at a time using CSS transitions, integrates with the existing Kiki controller for contextual guidance, and uses child-friendly typography (22-26pt text, sans-serif fonts, short sentences).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS ES6 | N/A | Screen rendering and navigation | Matches existing codebase, no dependencies |
| CSS scroll-snap | Native | Swipe navigation | Native browser support, 60fps performance |
| CSS transforms | Native | Screen transitions | Hardware accelerated, smooth animations |
| JSON files | N/A | Lesson content data | Human-readable, easy to edit, no backend needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| localStorage | Native | Resume position | Save progress across sessions |
| CSS Variables | Native | Dynamic styling | Child-friendly typography scales |
| Touch Events API | Native | Swipe detection | Mobile/tablet navigation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| JSON files | Markdown + frontmatter | More complex parsing, overkill for structured content |
| CSS scroll-snap | Swiper.js | Better features, but 50KB+ dependency |
| Vanilla navigation | Embla Carousel | Excellent touch support, but adds complexity |
| CSS transitions | GSAP | More control, but 80KB dependency not worth it |

**Installation:**
```bash
# No npm packages required - vanilla CSS/JS approach
# Lesson data stored as JSON in src/data/lessons/
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  data/
    lessons/
      lesson-1.json       # Was ist KI?
      lesson-2.json       # KI-Arten erklaert
      lesson-3.json       # Was kann KI heute?
      ... (7 total)
  components/
    lesson/
      lesson-renderer.js  # Main component
      lesson-screen.js    # Single screen component
      lesson-nav.js       # Screen navigation controls
  views/
    lesson.js             # Updated lesson view (already exists)
assets/
  styles/
    lesson.css            # Lesson-specific styles
```

### Pattern 1: JSON Lesson Data Structure
**What:** Structured JSON format for lesson content
**When to use:** All lesson content
**Example:**
```json
{
  "id": 1,
  "title": "Was ist KI?",
  "totalScreens": 5,
  "estimatedMinutes": 12,
  "screens": [
    {
      "id": 1,
      "type": "intro",
      "kikiEmotion": "curious",
      "kikiMessage": "Hallo! Heute lernen wir, was KI ist!",
      "content": {
        "heading": "Was ist KI?",
        "text": "KI steht fuer Kuenstliche Intelligenz.",
        "subtext": "Das klingt kompliziert. Aber keine Sorge!"
      },
      "illustration": "robot-thinking.svg"
    },
    {
      "id": 2,
      "type": "explanation",
      "kikiEmotion": "happy",
      "kikiMessage": null,
      "content": {
        "heading": "Computer, die lernen",
        "text": "Ein Computer ist normalerweise dumm.",
        "bullets": [
          "Er macht nur, was wir ihm sagen.",
          "Ohne Anleitung weiss er nichts.",
          "Aber KI kann selbst lernen!"
        ]
      },
      "illustration": "computer-learning.svg"
    },
    {
      "id": 3,
      "type": "example",
      "kikiEmotion": "thoughtful",
      "kikiMessage": "Schau mal!",
      "content": {
        "heading": "Beispiel: Bilder erkennen",
        "text": "Zeig einer KI viele Fotos von Hunden.",
        "subtext": "Nach dem Lernen erkennt sie Hunde selbst!"
      },
      "illustration": "dog-recognition.svg"
    },
    {
      "id": 4,
      "type": "interactive",
      "kikiEmotion": "curious",
      "kikiMessage": "Was meinst du?",
      "content": {
        "heading": "Denk mal nach!",
        "text": "Wo hast du schon KI gesehen?",
        "choices": [
          { "text": "Im Handy", "correct": true, "feedback": "Genau! Siri und Google benutzen KI." },
          { "text": "Im Kuehlschrank", "correct": false, "feedback": "Manche Kuehlschranke haben KI, aber die meisten nicht." },
          { "text": "Im Fernseher", "correct": true, "feedback": "Richtig! Netflix nutzt KI fuer Vorschlaege." }
        ]
      }
    },
    {
      "id": 5,
      "type": "summary",
      "kikiEmotion": "proud",
      "kikiMessage": "Super! Du hast Lektion 1 geschafft!",
      "content": {
        "heading": "Das hast du gelernt:",
        "bullets": [
          "KI heisst Kuenstliche Intelligenz",
          "KI kann selbst lernen",
          "KI ist in vielen Geraeten"
        ],
        "nextAction": "Jetzt kommt ein kleines Quiz!"
      }
    }
  ]
}
```

### Pattern 2: Screen Types Enum
**What:** Consistent screen type definitions
**When to use:** Rendering logic for different content types
**Example:**
```javascript
// src/components/lesson/lesson-renderer.js

export const SCREEN_TYPES = {
  INTRO: 'intro',           // Title screen with Kiki greeting
  EXPLANATION: 'explanation', // Text with bullet points
  EXAMPLE: 'example',       // Concrete example with illustration
  INTERACTIVE: 'interactive', // Simple choice/interaction
  SUMMARY: 'summary'        // Lesson recap with transition to quiz
};
```

### Pattern 3: Lesson Renderer Component
**What:** Main component that manages screen state and navigation
**When to use:** Displaying lessons
**Example:**
```javascript
// src/components/lesson/lesson-renderer.js

/**
 * Lesson Renderer - Manages lesson screen display and navigation
 */
export class LessonRenderer {
  constructor(container, lessonData, state) {
    this.container = container;
    this.lesson = lessonData;
    this.state = state;
    this.currentScreen = 0;
    this.totalScreens = lessonData.screens.length;

    // Bind navigation methods
    this.nextScreen = this.nextScreen.bind(this);
    this.prevScreen = this.prevScreen.bind(this);
    this.goToScreen = this.goToScreen.bind(this);
  }

  /**
   * Render the lesson container and initial screen
   */
  render() {
    // Start from saved position if available
    const savedPosition = this.state.get(`lesson_${this.lesson.id}_position`);
    if (savedPosition && savedPosition < this.totalScreens) {
      this.currentScreen = savedPosition;
    }

    this.container.innerHTML = `
      <div class="lesson-renderer">
        <div class="lesson-progress">
          <div class="lesson-progress-bar">
            <div class="lesson-progress-fill" style="width: ${this.getProgress()}%"></div>
          </div>
          <span class="lesson-progress-text">
            ${this.currentScreen + 1} / ${this.totalScreens}
          </span>
        </div>

        <div class="lesson-screen-container">
          <div class="lesson-screen" data-screen="${this.currentScreen}">
            ${this.renderScreen(this.lesson.screens[this.currentScreen])}
          </div>
        </div>

        <nav class="lesson-screen-nav">
          <button class="lesson-nav-btn lesson-nav-btn--prev"
                  ${this.currentScreen === 0 ? 'disabled' : ''}
                  aria-label="Zurueck">
            <span class="nav-icon">&#8592;</span>
            <span class="nav-text">Zurueck</span>
          </button>

          <button class="lesson-nav-btn lesson-nav-btn--next"
                  aria-label="${this.isLastScreen() ? 'Zum Quiz' : 'Weiter'}">
            <span class="nav-text">${this.isLastScreen() ? 'Quiz starten' : 'Weiter'}</span>
            <span class="nav-icon">&#8594;</span>
          </button>
        </nav>
      </div>
    `;

    this.attachEventListeners();
    this.triggerKikiAction();
  }

  /**
   * Get progress percentage
   */
  getProgress() {
    return Math.round(((this.currentScreen + 1) / this.totalScreens) * 100);
  }

  /**
   * Check if on last screen
   */
  isLastScreen() {
    return this.currentScreen === this.totalScreens - 1;
  }

  /**
   * Save current position
   */
  savePosition() {
    this.state.set(`lesson_${this.lesson.id}_position`, this.currentScreen);
  }

  /**
   * Navigate to next screen
   */
  nextScreen() {
    if (this.isLastScreen()) {
      // Navigate to quiz
      window.location.hash = `#/quiz/${this.lesson.id}`;
      return;
    }

    this.goToScreen(this.currentScreen + 1);
  }

  /**
   * Navigate to previous screen
   */
  prevScreen() {
    if (this.currentScreen > 0) {
      this.goToScreen(this.currentScreen - 1);
    }
  }

  /**
   * Go to specific screen
   */
  goToScreen(index) {
    if (index < 0 || index >= this.totalScreens) return;

    const direction = index > this.currentScreen ? 'next' : 'prev';
    this.currentScreen = index;
    this.savePosition();

    // Update screen with transition
    this.updateScreen(direction);
    this.updateProgress();
    this.updateNavButtons();
    this.triggerKikiAction();
  }

  /**
   * Update screen content with CSS transition
   */
  updateScreen(direction) {
    const screenContainer = this.container.querySelector('.lesson-screen-container');
    const screenElement = this.container.querySelector('.lesson-screen');

    // Add transition class
    screenElement.classList.add(`lesson-screen--exit-${direction}`);

    setTimeout(() => {
      screenElement.innerHTML = this.renderScreen(this.lesson.screens[this.currentScreen]);
      screenElement.className = `lesson-screen lesson-screen--enter-${direction}`;
      screenElement.dataset.screen = this.currentScreen;

      // Trigger reflow then animate in
      requestAnimationFrame(() => {
        screenElement.classList.remove(`lesson-screen--enter-${direction}`);
      });
    }, 200);
  }

  /**
   * Trigger Kiki emotion and message for current screen
   */
  triggerKikiAction() {
    const screen = this.lesson.screens[this.currentScreen];

    if (window.kiki) {
      // Set emotion
      if (screen.kikiEmotion) {
        window.kiki.setEmotion(screen.kikiEmotion);
      }

      // Speak message if provided
      if (screen.kikiMessage) {
        setTimeout(() => {
          window.kiki.speak(screen.kikiMessage, { duration: 4000 });
        }, 300);
      }
    }
  }

  /**
   * Render a single screen based on type
   */
  renderScreen(screen) {
    const content = screen.content;

    // Common parts
    const heading = content.heading
      ? `<h2 class="lesson-heading">${content.heading}</h2>`
      : '';

    const text = content.text
      ? `<p class="lesson-text">${content.text}</p>`
      : '';

    const subtext = content.subtext
      ? `<p class="lesson-subtext">${content.subtext}</p>`
      : '';

    const bullets = content.bullets
      ? `<ul class="lesson-bullets">${content.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
      : '';

    const illustration = screen.illustration
      ? `<img class="lesson-illustration" src="assets/images/${screen.illustration}" alt="" role="presentation" />`
      : '';

    // Screen type specific rendering
    switch (screen.type) {
      case 'intro':
        return `
          <div class="lesson-screen-content lesson-screen-content--intro">
            ${illustration}
            ${heading}
            ${text}
            ${subtext}
          </div>
        `;

      case 'explanation':
        return `
          <div class="lesson-screen-content lesson-screen-content--explanation">
            ${heading}
            ${text}
            ${bullets}
            ${illustration}
          </div>
        `;

      case 'example':
        return `
          <div class="lesson-screen-content lesson-screen-content--example">
            ${illustration}
            ${heading}
            ${text}
            ${subtext}
          </div>
        `;

      case 'interactive':
        return `
          <div class="lesson-screen-content lesson-screen-content--interactive">
            ${heading}
            ${text}
            <div class="lesson-choices">
              ${content.choices.map((choice, i) => `
                <button class="lesson-choice" data-index="${i}" data-correct="${choice.correct}">
                  ${choice.text}
                </button>
              `).join('')}
            </div>
          </div>
        `;

      case 'summary':
        return `
          <div class="lesson-screen-content lesson-screen-content--summary">
            ${heading}
            ${bullets}
            ${content.nextAction ? `<p class="lesson-next-action">${content.nextAction}</p>` : ''}
          </div>
        `;

      default:
        return `
          <div class="lesson-screen-content">
            ${heading}
            ${text}
            ${bullets}
            ${illustration}
          </div>
        `;
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Navigation buttons
    const prevBtn = this.container.querySelector('.lesson-nav-btn--prev');
    const nextBtn = this.container.querySelector('.lesson-nav-btn--next');

    prevBtn?.addEventListener('click', this.prevScreen);
    nextBtn?.addEventListener('click', this.nextScreen);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.nextScreen();
      if (e.key === 'ArrowLeft') this.prevScreen();
    });

    // Touch swipe (basic implementation)
    let touchStartX = 0;
    const screenContainer = this.container.querySelector('.lesson-screen-container');

    screenContainer?.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    screenContainer?.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          this.nextScreen(); // Swipe left = next
        } else {
          this.prevScreen(); // Swipe right = prev
        }
      }
    });

    // Interactive choice handling (event delegation)
    this.container.addEventListener('click', (e) => {
      const choice = e.target.closest('.lesson-choice');
      if (choice) {
        this.handleChoiceClick(choice);
      }
    });
  }

  /**
   * Handle interactive choice click
   */
  handleChoiceClick(choiceElement) {
    const isCorrect = choiceElement.dataset.correct === 'true';
    const screen = this.lesson.screens[this.currentScreen];
    const choiceIndex = parseInt(choiceElement.dataset.index, 10);
    const feedback = screen.content.choices[choiceIndex].feedback;

    // Visual feedback
    choiceElement.classList.add(isCorrect ? 'lesson-choice--correct' : 'lesson-choice--incorrect');

    // Kiki reaction
    if (window.kiki) {
      window.kiki.reactToAnswer(isCorrect);
      if (feedback) {
        setTimeout(() => {
          window.kiki.speak(feedback, { duration: 4000 });
        }, 1000);
      }
    }
  }

  /**
   * Update progress bar
   */
  updateProgress() {
    const fill = this.container.querySelector('.lesson-progress-fill');
    const text = this.container.querySelector('.lesson-progress-text');

    if (fill) fill.style.width = `${this.getProgress()}%`;
    if (text) text.textContent = `${this.currentScreen + 1} / ${this.totalScreens}`;
  }

  /**
   * Update navigation button states
   */
  updateNavButtons() {
    const prevBtn = this.container.querySelector('.lesson-nav-btn--prev');
    const nextBtn = this.container.querySelector('.lesson-nav-btn--next');

    if (prevBtn) prevBtn.disabled = this.currentScreen === 0;
    if (nextBtn) {
      const nextText = nextBtn.querySelector('.nav-text');
      if (nextText) {
        nextText.textContent = this.isLastScreen() ? 'Quiz starten' : 'Weiter';
      }
    }
  }
}
```

### Pattern 4: Child-Friendly Typography CSS
**What:** Typography optimized for 7-year-old readers
**When to use:** All lesson text content
**Example:**
```css
/* assets/styles/lesson.css */

/* ========================================
   CHILD-FRIENDLY TYPOGRAPHY
   Based on research for 7-year-old readers
   ======================================== */

:root {
  /* Child-friendly font sizes (larger than default) */
  --lesson-font-size-heading: 28px;    /* Large, clear headings */
  --lesson-font-size-text: 22px;       /* Main text - research shows 22-26pt optimal */
  --lesson-font-size-subtext: 18px;    /* Secondary text */
  --lesson-font-size-bullet: 20px;     /* List items */

  /* Line heights for readability */
  --lesson-line-height-heading: 1.3;
  --lesson-line-height-text: 1.6;      /* Extra spacing for children */

  /* Letter spacing - slightly increased for readability */
  --lesson-letter-spacing: 0.02em;

  /* Word spacing - children benefit from more space */
  --lesson-word-spacing: 0.05em;
}

/* Lesson headings */
.lesson-heading {
  font-size: var(--lesson-font-size-heading);
  font-weight: var(--font-weight-bold);
  line-height: var(--lesson-line-height-heading);
  color: var(--color-primary);
  margin-bottom: var(--space-lg);
  text-align: center;
}

/* Main lesson text */
.lesson-text {
  font-size: var(--lesson-font-size-text);
  line-height: var(--lesson-line-height-text);
  letter-spacing: var(--lesson-letter-spacing);
  word-spacing: var(--lesson-word-spacing);
  color: var(--color-text);
  margin-bottom: var(--space-md);
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Secondary/subtext */
.lesson-subtext {
  font-size: var(--lesson-font-size-subtext);
  line-height: var(--lesson-line-height-text);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--space-md);
}

/* Bullet points */
.lesson-bullets {
  list-style: none;
  padding: 0;
  margin: var(--space-lg) 0;
}

.lesson-bullets li {
  font-size: var(--lesson-font-size-bullet);
  line-height: var(--lesson-line-height-text);
  padding: var(--space-sm) 0;
  padding-left: 36px;
  position: relative;
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.lesson-bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-color: var(--color-primary);
  border-radius: 50%;
}

/* ========================================
   SCREEN CONTENT LAYOUT
   ======================================== */

.lesson-renderer {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 160px); /* Account for header and nav */
  padding: var(--space-md);
}

.lesson-screen-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.lesson-screen {
  width: 100%;
  max-width: 700px;
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}

/* Screen transitions */
.lesson-screen--exit-next {
  transform: translateX(-30px);
  opacity: 0;
}

.lesson-screen--exit-prev {
  transform: translateX(30px);
  opacity: 0;
}

.lesson-screen--enter-next {
  transform: translateX(30px);
  opacity: 0;
}

.lesson-screen--enter-prev {
  transform: translateX(-30px);
  opacity: 0;
}

/* Screen content areas */
.lesson-screen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-lg);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.lesson-screen-content--intro {
  text-align: center;
}

.lesson-screen-content--intro .lesson-heading {
  font-size: 36px;
  margin-top: var(--space-lg);
}

/* ========================================
   ILLUSTRATIONS
   ======================================== */

.lesson-illustration {
  max-width: 200px;
  max-height: 180px;
  margin: var(--space-md) auto;
  object-fit: contain;
}

.lesson-screen-content--intro .lesson-illustration {
  max-width: 250px;
  max-height: 200px;
}

/* ========================================
   INTERACTIVE CHOICES
   ======================================== */

.lesson-choices {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: 400px;
  margin-top: var(--space-lg);
}

.lesson-choice {
  display: block;
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  font-size: var(--lesson-font-size-bullet);
  font-weight: var(--font-weight-medium);
  text-align: center;
  background: white;
  border: 3px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: var(--touch-target-min);
}

.lesson-choice:hover {
  border-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.lesson-choice:active {
  transform: translateY(0);
}

.lesson-choice--correct {
  background-color: #d4edda;
  border-color: var(--color-primary);
  pointer-events: none;
}

.lesson-choice--incorrect {
  background-color: #fff3cd;
  border-color: var(--color-accent);
  pointer-events: none;
}

/* ========================================
   PROGRESS BAR
   ======================================== */

.lesson-progress {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.lesson-progress-bar {
  flex: 1;
  height: 10px;
  background-color: var(--color-background-alt);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.lesson-progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.lesson-progress-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* ========================================
   SCREEN NAVIGATION
   ======================================== */

.lesson-screen-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: white;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.lesson-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  min-width: 100px;
  min-height: var(--touch-target-min);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lesson-nav-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.lesson-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lesson-nav-btn--prev {
  background-color: var(--color-background-alt);
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.lesson-nav-btn--prev:hover:not(:disabled) {
  background-color: white;
  border-color: var(--color-primary);
}

.nav-icon {
  font-size: var(--font-size-xl);
  line-height: 1;
}

/* ========================================
   SUMMARY SCREEN
   ======================================== */

.lesson-next-action {
  font-size: var(--lesson-font-size-text);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-align: center;
  margin-top: var(--space-xl);
  padding: var(--space-md);
  background: var(--color-background-alt);
  border-radius: var(--radius-md);
}

/* ========================================
   RESPONSIVE ADJUSTMENTS
   ======================================== */

@media (max-width: 599px) {
  :root {
    --lesson-font-size-heading: 24px;
    --lesson-font-size-text: 18px;
    --lesson-font-size-subtext: 16px;
    --lesson-font-size-bullet: 18px;
  }

  .lesson-screen-content {
    padding: var(--space-md);
  }

  .lesson-illustration {
    max-width: 150px;
    max-height: 140px;
  }

  .lesson-nav-btn {
    min-width: 80px;
    padding: var(--space-sm) var(--space-md);
  }

  .nav-text {
    display: none;
  }

  .nav-icon {
    font-size: var(--font-size-xxl);
  }
}

@media (min-width: 600px) and (max-width: 1199px) {
  .lesson-screen-content--intro .lesson-heading {
    font-size: 32px;
  }
}

/* ========================================
   ACCESSIBILITY - REDUCED MOTION
   ======================================== */

@media (prefers-reduced-motion: reduce) {
  .lesson-screen {
    transition-duration: 0.01ms;
  }

  .lesson-choice:hover {
    transform: none;
  }

  .lesson-nav-btn:hover:not(:disabled) {
    transform: none;
  }
}
```

### Pattern 5: Loading Lesson Data
**What:** Fetch and cache JSON lesson data
**When to use:** When entering a lesson view
**Example:**
```javascript
// src/data/lesson-loader.js

/**
 * Lesson Data Loader
 * Fetches and caches lesson JSON data
 */
const lessonCache = new Map();

/**
 * Load lesson data by ID
 * @param {number} lessonId - Lesson number (1-7)
 * @returns {Promise<object>} Lesson data
 */
export async function loadLesson(lessonId) {
  // Check cache first
  if (lessonCache.has(lessonId)) {
    return lessonCache.get(lessonId);
  }

  try {
    const response = await fetch(`./src/data/lessons/lesson-${lessonId}.json`);

    if (!response.ok) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    const lessonData = await response.json();

    // Validate lesson data
    if (!lessonData.screens || !Array.isArray(lessonData.screens)) {
      throw new Error(`Invalid lesson data structure for lesson ${lessonId}`);
    }

    // Cache for future use
    lessonCache.set(lessonId, lessonData);

    return lessonData;
  } catch (error) {
    console.error('Failed to load lesson:', error);
    throw error;
  }
}

/**
 * Preload all lessons (optional, for faster navigation)
 */
export async function preloadAllLessons() {
  const lessonIds = [1, 2, 3, 4, 5, 6, 7];

  await Promise.all(
    lessonIds.map(id => loadLesson(id).catch(() => null))
  );
}
```

### Anti-Patterns to Avoid
- **Hardcoding content:** Always use JSON data files, never embed German text in JS
- **Too many screens:** Keep to 5-7 screens max per lesson (research shows attention span)
- **Complex sentence structures:** Use simple subject-verb-object for 7-year-olds
- **Small touch targets:** All buttons must be at least 48x48px
- **Missing Kiki integration:** Every screen should consider Kiki emotion/message
- **Ignoring responsive:** Test on tablets (primary school device)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Swipe gestures | Complex gesture detection | CSS scroll-snap or simple touch events | Native behavior, better performance |
| Content validation | Manual JSON checking | JSON Schema | Structured validation, editor support |
| Progress persistence | Custom storage solution | Existing StateManager | Already implemented in Phase 1 |
| Screen transitions | JavaScript DOM manipulation | CSS transforms | Hardware accelerated, smoother |
| Typography scaling | Manual breakpoint values | CSS clamp() or existing variables | More maintainable |

**Key insight:** The lesson framework should reuse existing patterns from the codebase (StateManager, Navigation component, Kiki controller) rather than creating parallel systems.

## Common Pitfalls

### Pitfall 1: Text Too Complex for Children
**What goes wrong:** 7-year-olds don't understand the content
**Why it happens:** Writing at adult reading level
**How to avoid:**
- Max 10-12 words per sentence
- Use words children already know
- One idea per sentence
- Active voice ("KI lernt" not "KI wird gelernt")
**Warning signs:** Sentences with commas, compound sentences, technical terms without explanation

### Pitfall 2: Too Many Screens Per Lesson
**What goes wrong:** Children lose focus, don't complete lessons
**Why it happens:** Trying to cover too much content
**How to avoid:**
- Maximum 7 screens per lesson
- Target 10-15 minutes total
- Each screen should be digestible in 1-2 minutes
**Warning signs:** Lessons taking more than 15 minutes, high dropout rates

### Pitfall 3: Missing Touch Navigation
**What goes wrong:** Tablet users can't navigate naturally
**Why it happens:** Only implementing button navigation
**How to avoid:**
- Add swipe gesture support
- Test on actual tablets
- Make touch targets at least 48x48px
**Warning signs:** No touchstart/touchend handlers, small buttons

### Pitfall 4: Kiki Not Contextually Relevant
**What goes wrong:** Kiki feels disconnected from content
**Why it happens:** Generic messages not tied to screen content
**How to avoid:**
- Each screen defines kikiEmotion and kikiMessage
- Messages reference what's on screen
- Emotion matches content mood
**Warning signs:** Same Kiki emotion across all screens, generic messages

### Pitfall 5: Illustrations Not Loading
**What goes wrong:** Empty spaces where images should be
**Why it happens:** Wrong paths, missing files, no fallbacks
**How to avoid:**
- Use role="presentation" for decorative images
- Provide alt text only for meaningful images
- Test all illustration references
- Have placeholder styles for missing images
**Warning signs:** Broken image icons, layout shifts when images fail

### Pitfall 6: Progress Not Saving
**What goes wrong:** Children lose their place when returning
**Why it happens:** Not integrating with StateManager
**How to avoid:**
- Save screen position on every navigation
- Load saved position when entering lesson
- Clear position when lesson completed
**Warning signs:** Always starting at screen 1, no localStorage entries

## Code Examples

Verified patterns from research and existing codebase:

### Updated Lesson View
```javascript
// src/views/lesson.js (updated)

import { Navigation } from '../components/navigation.js';
import { LessonRenderer } from '../components/lesson/lesson-renderer.js';
import { loadLesson } from '../data/lesson-loader.js';

const LESSON_TITLES = {
    1: 'Was ist KI?',
    2: 'KI-Arten erklaert',
    3: 'Was kann KI heute?',
    4: 'KI im Alltag',
    5: 'Mit KI sprechen',
    6: 'Uebungen',
    7: 'Erste App bauen'
};

export async function LessonView(container, state, params) {
    const lessonId = parseInt(params.id, 10);
    const lessonTitle = LESSON_TITLES[lessonId] || 'Unbekannte Lektion';

    // Show loading state
    container.innerHTML = `
        <div class="container lesson-page">
            <header class="lesson-header">
                <div class="lesson-badge">Lektion ${lessonId}</div>
                <h1>${lessonTitle}</h1>
            </header>
            <main class="lesson-content">
                <div class="loading-message">
                    <p>Lektion wird geladen...</p>
                </div>
            </main>
        </div>
    `;

    try {
        // Load lesson data
        const lessonData = await loadLesson(lessonId);

        // Clear loading state
        const contentArea = container.querySelector('.lesson-content');
        contentArea.innerHTML = '';

        // Initialize and render lesson
        const renderer = new LessonRenderer(contentArea, lessonData, state);
        renderer.render();

    } catch (error) {
        console.error('Failed to load lesson:', error);
        container.querySelector('.lesson-content').innerHTML = `
            <div class="error-message">
                <p>Lektion konnte nicht geladen werden.</p>
                <a href="#/" class="btn">Zurueck zur Startseite</a>
            </div>
        `;
    }
}

export default LessonView;
```

### Sample Lesson JSON (Lesson 1)
```json
{
  "id": 1,
  "title": "Was ist KI?",
  "totalScreens": 5,
  "estimatedMinutes": 12,
  "screens": [
    {
      "id": 1,
      "type": "intro",
      "kikiEmotion": "curious",
      "kikiMessage": "Hallo! Heute lernen wir, was KI ist!",
      "content": {
        "heading": "Was ist KI?",
        "text": "KI ist kurz fuer Kuenstliche Intelligenz.",
        "subtext": "Das klingt schwer. Aber es ist gar nicht so schwer!"
      },
      "illustration": "intro-robot.svg"
    },
    {
      "id": 2,
      "type": "explanation",
      "kikiEmotion": "happy",
      "kikiMessage": null,
      "content": {
        "heading": "Computer, die lernen koennen",
        "text": "Normale Computer sind nicht schlau.",
        "bullets": [
          "Sie machen nur, was wir sagen.",
          "Ohne uns wissen sie nichts.",
          "Aber KI ist anders!"
        ]
      },
      "illustration": null
    },
    {
      "id": 3,
      "type": "example",
      "kikiEmotion": "thoughtful",
      "kikiMessage": "Schau mal, so lernt eine KI!",
      "content": {
        "heading": "So lernt KI",
        "text": "Zeig einer KI ganz viele Fotos von Hunden.",
        "subtext": "Dann kann sie Hunde von alleine erkennen!"
      },
      "illustration": "dog-photos.svg"
    },
    {
      "id": 4,
      "type": "interactive",
      "kikiEmotion": "curious",
      "kikiMessage": "Was denkst du?",
      "content": {
        "heading": "Wo gibt es KI?",
        "text": "Rate mal: Wo ist KI drin?",
        "choices": [
          {
            "text": "Im Handy",
            "correct": true,
            "feedback": "Ja! Siri und der Google Assistent nutzen KI."
          },
          {
            "text": "In jedem Spielzeug",
            "correct": false,
            "feedback": "Nicht in jedem. Aber manche Spielzeuge haben KI!"
          },
          {
            "text": "Im Fernseher",
            "correct": true,
            "feedback": "Richtig! Netflix zeigt dir mit KI passende Filme."
          }
        ]
      }
    },
    {
      "id": 5,
      "type": "summary",
      "kikiEmotion": "proud",
      "kikiMessage": "Super! Du hast Lektion 1 geschafft!",
      "content": {
        "heading": "Das hast du gelernt",
        "bullets": [
          "KI bedeutet Kuenstliche Intelligenz",
          "KI kann selbst lernen",
          "KI ist in Handys, Fernsehern und mehr"
        ],
        "nextAction": "Jetzt gibt es ein kleines Quiz!"
      }
    }
  ]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Carousel libraries | CSS scroll-snap | 2020+ | No dependencies, native performance |
| Fixed font sizes | Fluid typography | 2022+ | Better accessibility, responsive |
| Image-based content | SVG illustrations | 2020+ | Scalable, smaller files |
| Click-only navigation | Touch + click + keyboard | Always | Essential for accessibility |
| Server-rendered content | JSON + client rendering | 2018+ | Static hosting, offline capable |

**Deprecated/outdated:**
- Flash-based educational content: Dead, use HTML5
- Fixed pixel layouts: Use flexible/responsive
- Auto-advancing slides: Children need control of pace
- Audio auto-play: Accessibility violation, mute by default

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal Screen Count Per Lesson**
   - What we know: Research suggests 5-7 screens for 10-15 minute attention span
   - What's unclear: Whether this applies equally to all age ranges (5-11)
   - Recommendation: Start with 5-7, gather feedback, adjust per lesson

2. **Illustration Style**
   - What we know: Simple, geometric illustrations work well (Duolingo style)
   - What's unclear: Whether to use existing assets or create custom
   - Recommendation: Plan for placeholder SVGs initially, create custom later

3. **Interactive Element Complexity**
   - What we know: Simple choices work well for young children
   - What's unclear: How much interaction is too much per screen
   - Recommendation: Max one interactive element per screen, keep choices to 2-4 options

## Sources

### Primary (HIGH confidence)
- [Typography for Children Research](https://medium.com/ux-of-edtech/typography-in-digital-products-for-kids-f10ce0588555) - Font sizes, x-height, infant characters
- [Fonts.com Typography for Children](https://www.fonts.com/content/learning/fyti/situational-typography/typography-for-children) - Age-appropriate font guidelines
- [Duolingo Design System](https://adele.uxpin.com/duolingo-design-guidelines) - Gamification patterns, lesson structure
- [Duolingo UX Breakdown](https://userguiding.com/blog/duolingo-onboarding-ux) - Bite-sized lessons, progress bars
- [WAI-ARIA Overview](https://www.w3.org/WAI/standards-guidelines/aria/) - Accessibility requirements
- [MDN ARIA Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) - Implementation patterns

### Secondary (MEDIUM confidence)
- [CSS Tricks Touch Sliders](https://css-tricks.com/the-javascript-behind-touch-friendly-sliders/) - Touch event handling
- [CSS Scroll Snap](https://medium.com/@_zouhir/swipe-views-with-css-snap-points-building-a-more-efficient-mobile-web-navigation-f9ac8c53dbc0) - Native swipe navigation
- [Nearpod/LessonUp patterns](https://www.commonsense.org/education/best-in-class/the-best-interactive-presentation-and-lesson-tools-for-classrooms) - Educational slide tools
- [10 Best Carousel Libraries 2026](https://www.cssscript.com/top-10-javascript-css-carousels/) - Library comparison

### Tertiary (LOW confidence)
- [Embla Carousel](https://www.cssscript.com/draggable-touch-embla-carousel/) - Touch carousel option (not using, but reviewed)
- Various CodePen examples - Creative inspiration

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - vanilla JS/CSS matches existing codebase
- Architecture patterns: HIGH - follows existing component structure
- Typography guidelines: HIGH - research-backed for children
- JSON data structure: MEDIUM - custom design, needs validation
- Touch navigation: MEDIUM - basic implementation, may need refinement

**Research date:** 2026-01-28
**Valid until:** 60 days (stable patterns, no fast-moving dependencies)
