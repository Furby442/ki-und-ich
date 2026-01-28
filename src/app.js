/**
 * KI und ich - Application Entry Point
 *
 * Initializes the SPA with routing, state management, and error handling.
 */

import { Router } from './services/router.js';
import { StateManager } from './services/state.js';
import { HomeView } from './views/home.js';
import { LessonView } from './views/lesson.js';
import { QuizView } from './views/quiz.js';
import { kikiInstance } from './components/kiki/kiki.js';
import { soundManager } from './services/sound.js';

// Initialize state manager
const state = new StateManager();
state.enableAutoSave();

// Make state available globally for views (simple approach for Phase 1)
window.appState = state;

// Initialize sound manager with state reference
soundManager.setStateManager(state);
window.soundManager = soundManager;

// Initialize sound on first user interaction (autoplay policy)
document.addEventListener('click', () => {
    soundManager.init();
}, { once: true });

// Define application routes
const routes = {
    '/': (container, params) => HomeView(container, state),
    '/lesson/:id': (container, params) => LessonView(container, state, params),
    '/quiz/:id': (container, params) => QuizView(container, state, params),
    '/404': notFoundView
};

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

// Initialize Kiki mascot
kikiInstance.init();
window.kiki = kikiInstance;

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
