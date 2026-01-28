/**
 * Mini-Apps View
 *
 * Hub for all interactive AI mini-apps.
 */

import { renderStoryGenerator, initStoryGenerator } from '../components/mini-apps/story-generator.js';
import { renderAnimalQuiz, initAnimalQuiz } from '../components/mini-apps/animal-quiz.js';
import { renderJokeMachine, initJokeMachine } from '../components/mini-apps/joke-machine.js';
import { renderNameMeaning, initNameMeaning } from '../components/mini-apps/name-meaning.js';

const APPS = [
    { id: 'story', name: 'Geschichten-Generator', emoji: '📖', render: renderStoryGenerator, init: initStoryGenerator },
    { id: 'animal', name: 'Tier-Quiz', emoji: '🐾', render: renderAnimalQuiz, init: initAnimalQuiz },
    { id: 'joke', name: 'Witz-Maschine', emoji: '😂', render: renderJokeMachine, init: initJokeMachine },
    { id: 'name', name: 'Namens-Bedeutung', emoji: '✨', render: renderNameMeaning, init: initNameMeaning }
];

/**
 * Render mini-apps view
 * @param {HTMLElement} container - Container element
 * @param {object} state - Application state manager
 * @param {object} params - Route parameters
 */
export function MiniAppsView(container, state, params) {
    const appId = params?.app;

    if (appId) {
        renderSingleApp(container, appId);
    } else {
        renderAppList(container);
    }
}

/**
 * Render the app selection list
 */
function renderAppList(container) {
    const appsHtml = APPS.map(app => `
        <a href="#/apps/${app.id}" class="mini-app-card">
            <span class="mini-app-card-emoji">${app.emoji}</span>
            <span class="mini-app-card-name">${app.name}</span>
        </a>
    `).join('');

    container.innerHTML = `
        <div class="container mini-apps-page">
            <header class="mini-apps-header">
                <h1>Mini-Apps</h1>
                <p class="mini-apps-subtitle">Probier KI selbst aus!</p>
            </header>

            <div class="mini-apps-grid">
                ${appsHtml}
            </div>

            <div class="mini-apps-back">
                <a href="#/" class="btn">Zurueck zur Uebersicht</a>
            </div>
        </div>
    `;

    if (window.kiki) {
        window.kiki.setEmotion('excited');
        window.kiki.speak('Waehle eine App und hab Spass!');
    }
}

/**
 * Render a single app
 */
function renderSingleApp(container, appId) {
    const app = APPS.find(a => a.id === appId);

    if (!app) {
        container.innerHTML = `
            <div class="container">
                <h1>App nicht gefunden</h1>
                <a href="#/apps" class="btn">Zurueck zu den Apps</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="container mini-apps-page">
            <div class="mini-app-back-link">
                <a href="#/apps" class="mini-app-back">← Alle Apps</a>
            </div>

            <div class="mini-app-container" id="app-container">
                ${app.render()}
            </div>
        </div>
    `;

    // Initialize the app's interactivity
    const appContainer = container.querySelector('#app-container');
    app.init(appContainer);
}

export default MiniAppsView;
