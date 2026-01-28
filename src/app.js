/**
 * KI und ich - Application Entry Point
 *
 * Initializes the SPA with routing, state management, and error handling.
 */

import { Router } from './services/router.js';
import { StateManager } from './services/state.js';

// Initialize state manager
const state = new StateManager();
state.enableAutoSave();

// Make state available globally for views (simple approach for Phase 1)
window.appState = state;

// Define application routes
const routes = {
    '/': homeView,
    '/lesson/:id': lessonView,
    '/quiz/:id': quizView,
    '/404': notFoundView
};

/**
 * Home view - Landing page
 */
function homeView(container, params) {
    // Update last visited
    state.set('lastVisited', new Date().toISOString());

    const currentLesson = state.get('currentLesson');
    const completedLessons = state.get('completedLessons');

    container.innerHTML = `
        <div class="container">
            <h1>Home - KI und ich</h1>
            <p>Willkommen bei "KI und ich" - Lerne Künstliche Intelligenz!</p>
            <div class="mt-lg">
                <p><small>Aktuelle Lektion: ${currentLesson} | Abgeschlossen: ${completedLessons.length}</small></p>
                <a href="#/lesson/1" class="btn">Lektion 1 starten</a>
            </div>
        </div>
    `;
}

/**
 * Lesson view - Individual lesson
 */
function lessonView(container, params) {
    const lessonId = params.id || '?';
    container.innerHTML = `
        <div class="container">
            <h1>Lektion ${lessonId}</h1>
            <p>Hier kommt der Inhalt für Lektion ${lessonId}.</p>
            <div class="mt-lg">
                <a href="#/" class="btn btn-outline">Zurück zur Startseite</a>
                <a href="#/quiz/${lessonId}" class="btn btn-secondary">Quiz starten</a>
            </div>
        </div>
    `;
}

/**
 * Quiz view - Lesson quiz
 */
function quizView(container, params) {
    const quizId = params.id || '?';
    container.innerHTML = `
        <div class="container">
            <h1>Quiz ${quizId}</h1>
            <p>Quiz für Lektion ${quizId} wird hier angezeigt.</p>
            <div class="mt-lg">
                <a href="#/lesson/${quizId}" class="btn btn-outline">Zurück zur Lektion</a>
            </div>
        </div>
    `;
}

/**
 * 404 view - Not found
 */
function notFoundView(container, params) {
    container.innerHTML = `
        <div class="container text-center">
            <h1>404</h1>
            <p>Diese Seite wurde nicht gefunden.</p>
            <div class="mt-lg">
                <a href="#/" class="btn">Zur Startseite</a>
            </div>
        </div>
    `;
}

// Initialize router
const router = new Router(routes);

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
    const container = document.querySelector('#app');
    if (container) {
        container.innerHTML = `
            <div class="container">
                <div class="alert alert-error">
                    <strong>Ein Fehler ist aufgetreten.</strong>
                    <p>Bitte lade die Seite neu.</p>
                </div>
            </div>
        `;
    }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
