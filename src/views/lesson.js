/**
 * Lesson View - Individual lesson page
 *
 * Displays lesson content with navigation to previous/next pages.
 * Placeholder for Phase 3 content implementation.
 */

import { Navigation } from '../components/navigation.js';

/**
 * Lesson titles (matching home page)
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
 * Render lesson view
 * @param {HTMLElement} container - Container element
 * @param {object} state - Application state manager
 * @param {object} params - Route parameters (contains id)
 */
export function LessonView(container, state, params) {
    const lessonId = parseInt(params.id, 10);
    const lessonTitle = LESSON_TITLES[lessonId] || 'Unbekannte Lektion';

    // Navigation configuration
    const showBack = lessonId > 1;
    const backUrl = lessonId === 1 ? '#/' : `#/lesson/${lessonId - 1}`;
    const nextUrl = `#/quiz/${lessonId}`;

    const navigationHtml = Navigation({
        showBack: true, // Always show back (to home or previous lesson)
        showNext: true,
        backUrl: backUrl,
        nextUrl: nextUrl,
        currentStep: lessonId,
        totalSteps: 7
    });

    container.innerHTML = `
        <div class="container lesson-page">
            <header class="lesson-header">
                <div class="lesson-badge">Lektion ${lessonId}</div>
                <h1>${lessonTitle}</h1>
            </header>

            <main class="lesson-content">
                <div class="placeholder-message">
                    <p>📚 Lektion ${lessonId} Inhalt kommt in Phase 3</p>
                    <p class="text-secondary">Hier wird der Lerninhalt angezeigt.</p>
                </div>
            </main>
        </div>

        ${navigationHtml}
    `;

    // Set Kiki emotion based on lesson
    if (window.kiki) {
        // Lesson 1: curious (introduction)
        // Lesson 7: proud (final lesson)
        // Others: happy (standard learning)
        const emotion = lessonId === 1 ? 'curious' : lessonId === 7 ? 'proud' : 'happy';
        window.kiki.setEmotion(emotion);

        // Brief message on first visit to this lesson (per session)
        const sessionKey = `kiki_lesson_${lessonId}_visited`;
        if (!sessionStorage.getItem(sessionKey)) {
            setTimeout(() => {
                const message = lessonId === 1
                    ? 'Lektion 1 - das wird spannend!'
                    : `Weiter geht's mit Lektion ${lessonId}!`;
                window.kiki.speak(message, { duration: 3000 });
                sessionStorage.setItem(sessionKey, 'true');
            }, 300);
        }
    }
}

export default LessonView;
