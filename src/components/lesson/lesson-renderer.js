/**
 * Lesson Renderer
 *
 * Main controller for displaying and navigating lesson content.
 * Handles screen transitions, touch gestures, keyboard navigation,
 * and Kiki integration.
 */

import { renderScreen } from './lesson-screen.js';

/**
 * Lesson Renderer Class
 */
export class LessonRenderer {
    /**
     * Create a LessonRenderer instance
     * @param {HTMLElement} container - Container element for lesson content
     * @param {Object} lessonData - Lesson data object
     * @param {Object} state - StateManager instance
     */
    constructor(container, lessonData, state) {
        this.container = container;
        this.lesson = lessonData;
        this.state = state;
        this.currentScreen = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Restore saved position if exists
        const savedPosition = state.get(`lesson_${lessonData.id}_position`);
        if (savedPosition !== null && savedPosition < lessonData.screens.length) {
            this.currentScreen = savedPosition;
        }
    }

    /**
     * Render the lesson UI
     */
    render() {
        const { lesson, currentScreen } = this;
        const screen = lesson.screens[currentScreen];
        const totalScreens = lesson.screens.length;

        // Render screen content
        const screenHtml = renderScreen(screen, currentScreen, totalScreens);

        // Build lesson UI with navigation
        this.container.innerHTML = `
            <div class="lesson-wrapper">
                <header class="lesson-header">
                    <h1 class="lesson-title">${lesson.title}</h1>
                    <div class="lesson-progress">
                        <div class="lesson-progress-bar">
                            <div class="lesson-progress-fill" style="width: ${((currentScreen + 1) / totalScreens) * 100}%"></div>
                        </div>
                    </div>
                </header>

                <main class="lesson-content" id="lesson-content">
                    ${screenHtml}
                </main>

                <nav class="lesson-nav">
                    <button
                        class="lesson-nav-btn lesson-nav-btn--prev"
                        ${currentScreen === 0 ? 'disabled' : ''}
                        aria-label="Zurück"
                    >
                        ← Zurück
                    </button>

                    ${currentScreen === totalScreens - 1 ? `
                        <a href="#/quiz/${lesson.id}" class="lesson-nav-btn lesson-nav-btn--quiz">
                            Zum Quiz →
                        </a>
                    ` : `
                        <button
                            class="lesson-nav-btn lesson-nav-btn--next"
                            aria-label="Weiter"
                        >
                            Weiter →
                        </button>
                    `}
                </nav>
            </div>
        `;

        // Setup event listeners
        this.setupEventListeners();

        // Trigger Kiki action for this screen
        this.triggerKikiAction(screen);

        // Save current position
        this.savePosition();
    }

    /**
     * Setup event listeners for navigation
     */
    setupEventListeners() {
        const prevBtn = this.container.querySelector('.lesson-nav-btn--prev');
        const nextBtn = this.container.querySelector('.lesson-nav-btn--next');
        const content = this.container.querySelector('#lesson-content');

        // Button navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevScreen());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextScreen());
        }

        // Touch swipe navigation
        if (content) {
            content.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            content.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }

        // Keyboard navigation
        this.keyboardHandler = (e) => {
            if (e.key === 'ArrowRight') {
                this.nextScreen();
            } else if (e.key === 'ArrowLeft') {
                this.prevScreen();
            }
        };
        document.addEventListener('keydown', this.keyboardHandler);
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left -> next screen
                this.nextScreen();
            } else {
                // Swipe right -> prev screen
                this.prevScreen();
            }
        }
    }

    /**
     * Go to next screen
     */
    nextScreen() {
        if (this.currentScreen < this.lesson.screens.length - 1) {
            this.currentScreen++;
            this.render();
        }
    }

    /**
     * Go to previous screen
     */
    prevScreen() {
        if (this.currentScreen > 0) {
            this.currentScreen--;
            this.render();
        }
    }

    /**
     * Go to specific screen
     * @param {number} index - Screen index
     */
    goToScreen(index) {
        if (index >= 0 && index < this.lesson.screens.length) {
            this.currentScreen = index;
            this.render();
        }
    }

    /**
     * Save current position to state
     */
    savePosition() {
        this.state.set(`lesson_${this.lesson.id}_position`, this.currentScreen);
    }

    /**
     * Trigger Kiki emotion and message for a screen
     * @param {Object} screen - Screen data
     */
    triggerKikiAction(screen) {
        if (!window.kiki) return;

        const { kikiEmotion, kikiMessage } = screen;

        // Set emotion
        if (kikiEmotion) {
            window.kiki.setEmotion(kikiEmotion);
        }

        // Show message (with delay for natural feel)
        if (kikiMessage) {
            setTimeout(() => {
                window.kiki.speak(kikiMessage, { duration: 5000 });
            }, 300);
        }
    }

    /**
     * Cleanup (remove event listeners)
     */
    destroy() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
    }

    /**
     * Get current progress
     * @returns {Object} Progress info
     */
    getProgress() {
        return {
            current: this.currentScreen + 1,
            total: this.lesson.screens.length,
            percentage: Math.round(((this.currentScreen + 1) / this.lesson.screens.length) * 100)
        };
    }
}
