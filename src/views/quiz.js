/**
 * Quiz View - Lesson quiz page
 *
 * Displays quiz content using QuizRenderer.
 * Loads quiz data from JSON files and integrates with Kiki.
 */

import { QuizRenderer } from '../components/quiz/quiz-renderer.js';
import { loadQuiz } from '../data/quiz-loader.js';

// Store current renderer for cleanup
let currentRenderer = null;

/**
 * Render quiz view
 * @param {HTMLElement} container - Container element
 * @param {object} state - Application state manager
 * @param {object} params - Route parameters (contains id)
 */
export async function QuizView(container, state, params) {
    const quizId = parseInt(params.id, 10);

    // Cleanup previous renderer
    if (currentRenderer) {
        currentRenderer.destroy();
        currentRenderer = null;
    }

    // Show loading state
    container.innerHTML = `
        <div class="quiz-wrapper">
            <div class="quiz-loading">
                <p>Quiz wird geladen...</p>
            </div>
        </div>
    `;

    // Set Kiki to curious while loading
    if (window.kiki) {
        window.kiki.setEmotion('curious');
    }

    try {
        // Load quiz data
        const quizData = await loadQuiz(quizId);

        // Create and render quiz
        currentRenderer = new QuizRenderer(container, quizData, state);
        currentRenderer.render();

        // Setup event listeners for Kiki integration
        setupKikiIntegration(container);

    } catch (error) {
        console.error('Fehler beim Laden des Quiz:', error);

        // Show error state
        container.innerHTML = `
            <div class="quiz-wrapper">
                <div class="quiz-error">
                    <h2>Quiz nicht verfügbar</h2>
                    <p>Quiz ${quizId} konnte nicht geladen werden.</p>
                    <p class="text-secondary">${error.message}</p>
                    <a href="#/lesson/${quizId}" class="quiz-btn quiz-btn--home">Zurück zur Lektion</a>
                </div>
            </div>
        `;

        // Set Kiki to sad on error
        if (window.kiki) {
            window.kiki.setEmotion('sad');
            window.kiki.speak('Oh nein! Das Quiz konnte nicht geladen werden.', { duration: 4000 });
        }
    }
}

/**
 * Setup event listeners for Kiki integration
 * @param {HTMLElement} container - Container element
 */
function setupKikiIntegration(container) {
    // Listen for quiz answer events
    container.addEventListener('quiz-answer', (e) => {
        const { correct } = e.detail;
        answerQuestion(correct);
    });

    // Listen for quiz complete events
    container.addEventListener('quiz-complete', (e) => {
        const { score, total } = e.detail;
        completeQuiz(score, total);
    });
}

/**
 * Call when user answers a quiz question
 * Hook for Phase 4 quiz system integration
 * @param {boolean} correct - Whether the answer was correct
 */
export function answerQuestion(correct) {
    if (window.kiki) {
        window.kiki.reactToAnswer(correct);
    }
}

/**
 * Call when quiz is completed
 * Hook for Phase 4 quiz system integration
 * @param {number} score - Number of correct answers
 * @param {number} total - Total number of questions
 */
export function completeQuiz(score, total) {
    if (window.kiki) {
        window.kiki.reactToQuizEnd(score, total);
    }
}

export default QuizView;
