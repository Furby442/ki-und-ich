/**
 * Lesson View - Individual lesson page
 *
 * Displays lesson content using LessonRenderer.
 * Loads lesson data from JSON files.
 */

import { LessonRenderer } from '../components/lesson/lesson-renderer.js';
import { loadLesson } from '../data/lesson-loader.js';

// Store current renderer for cleanup
let currentRenderer = null;

/**
 * Render lesson view
 * @param {HTMLElement} container - Container element
 * @param {object} state - Application state manager
 * @param {object} params - Route parameters (contains id)
 */
export async function LessonView(container, state, params) {
    const lessonId = parseInt(params.id, 10);

    // Cleanup previous renderer
    if (currentRenderer) {
        currentRenderer.destroy();
        currentRenderer = null;
    }

    // Show loading state
    container.innerHTML = `
        <div class="container lesson-page">
            <div class="lesson-loading">
                <p>Lektion wird geladen...</p>
            </div>
        </div>
    `;

    try {
        // Load lesson data
        const lessonData = await loadLesson(lessonId);

        // Create and render lesson
        currentRenderer = new LessonRenderer(container, lessonData, state);
        currentRenderer.render();

    } catch (error) {
        console.error('Fehler beim Laden der Lektion:', error);

        // Show error state
        container.innerHTML = `
            <div class="container lesson-page">
                <div class="lesson-error">
                    <h2>Lektion nicht verfügbar</h2>
                    <p>Lektion ${lessonId} konnte nicht geladen werden.</p>
                    <p class="text-secondary">${error.message}</p>
                    <a href="#/" class="btn btn-primary">Zurück zur Übersicht</a>
                </div>
            </div>
        `;

        // Set Kiki to sad on error
        if (window.kiki) {
            window.kiki.setEmotion('sad');
            window.kiki.speak('Oh nein! Die Lektion konnte nicht geladen werden.', { duration: 4000 });
        }
    }
}

export default LessonView;
