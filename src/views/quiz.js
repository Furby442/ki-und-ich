/**
 * Quiz View - Lesson quiz page
 *
 * Displays quiz content with navigation to lesson/next lesson.
 * Placeholder for Phase 4 quiz implementation.
 */

import { Navigation } from '../components/navigation.js';

/**
 * Lesson titles (matching home and lesson pages)
 */
const LESSON_TITLES = {
    1: 'Was ist KI?',
    2: 'KI-Arten erklärt',
    3: 'Was kann KI heute?',
    4: 'KI im Alltag',
    5: 'Mit KI sprechen',
    6: 'Übungen',
    7: 'Erste App bauen'
};

/**
 * Render quiz view
 * @param {HTMLElement} container - Container element
 * @param {object} state - Application state manager
 * @param {object} params - Route parameters (contains id)
 */
export function QuizView(container, state, params) {
    const quizId = parseInt(params.id, 10);
    const lessonTitle = LESSON_TITLES[quizId] || 'Unbekannte Lektion';

    // Navigation configuration
    const backUrl = `#/lesson/${quizId}`;
    const isLastQuiz = quizId === 7;
    const nextUrl = isLastQuiz ? '#/' : `#/lesson/${quizId + 1}`;

    const navigationHtml = Navigation({
        showBack: true,
        showNext: true,
        backUrl: backUrl,
        nextUrl: nextUrl,
        currentStep: quizId,
        totalSteps: 7
    });

    container.innerHTML = `
        <div class="container quiz-page">
            <header class="quiz-header">
                <div class="quiz-badge">Quiz ${quizId}</div>
                <h1>${lessonTitle}</h1>
            </header>

            <main class="quiz-content">
                <div class="placeholder-message">
                    <p>❓ Quiz kommt in Phase 4</p>
                    <p class="text-secondary">Hier werden Fragen zur Lektion angezeigt.</p>
                </div>
            </main>
        </div>

        ${navigationHtml}
    `;
}

export default QuizView;
