/**
 * Home View - Landing page with lesson grid
 *
 * Displays all 7 lessons in a responsive grid layout.
 * Each lesson card shows number, title, and completion status.
 */

/**
 * Lesson data with German titles
 */
const LESSONS = [
    { id: 1, title: 'Was ist KI?' },
    { id: 2, title: 'KI-Arten erklärt' },
    { id: 3, title: 'Was kann KI heute?' },
    { id: 4, title: 'KI im Alltag' },
    { id: 5, title: 'Mit KI sprechen' },
    { id: 6, title: 'Übungen' },
    { id: 7, title: 'Erste App bauen' }
];

/**
 * Render home view
 * @param {HTMLElement} container - Container element
 * @param {object} state - Application state manager
 */
export function HomeView(container, state) {
    // Update last visited
    state.set('lastVisited', new Date().toISOString());

    const completedLessons = state.get('completedLessons') || [];

    // Generate lesson cards
    const lessonCards = LESSONS.map(lesson => {
        const isCompleted = completedLessons.includes(lesson.id);
        const cardState = isCompleted ? 'completed' : 'available';

        return `
            <a href="#/lesson/${lesson.id}"
               class="lesson-card lesson-card--${cardState}"
               aria-label="Lektion ${lesson.id}: ${lesson.title}${isCompleted ? ' (abgeschlossen)' : ''}">
                <div class="lesson-number">${lesson.id}</div>
                <h3 class="lesson-title">${lesson.title}</h3>
                ${isCompleted ? '<div class="lesson-status">✓</div>' : ''}
            </a>
        `;
    }).join('');

    const soundEnabled = state.get('soundEnabled') !== false;

    container.innerHTML = `
        <div class="container home-page">
            <header class="home-header">
                <div class="home-header-row">
                    <h1>KI und ich</h1>
                    <button
                        type="button"
                        class="sound-toggle"
                        id="sound-toggle"
                        aria-pressed="${soundEnabled}"
                        aria-label="Ton"
                        title="${soundEnabled ? 'Ton deaktivieren' : 'Ton aktivieren'}"
                    >
                        <span class="sound-toggle-icon" aria-hidden="true">
                            ${soundEnabled ? '🔊' : '🔇'}
                        </span>
                    </button>
                </div>
                <p class="home-welcome">Willkommen! Lerne spielerisch, was Kuenstliche Intelligenz ist.</p>
            </header>

            <div class="lesson-grid">
                ${lessonCards}
            </div>

            <div class="home-apps-link">
                <a href="#/apps" class="btn btn-secondary">
                    🎮 Mini-Apps ausprobieren
                </a>
                <a href="#/teacher" class="btn btn-outline" style="margin-left: var(--space-md);">
                    👩‍🏫 Lehrer-Modus
                </a>
            </div>
        </div>
    `;

    // Setup sound toggle button
    const soundToggle = container.querySelector('#sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const isEnabled = soundToggle.getAttribute('aria-pressed') === 'true';
            const nowMuted = isEnabled;

            // Update state via soundManager
            if (window.soundManager) {
                window.soundManager.setMuted(nowMuted);
            } else {
                // Fallback: update state directly
                state.set('soundEnabled', !nowMuted);
            }

            // Update button appearance
            soundToggle.setAttribute('aria-pressed', !nowMuted);
            soundToggle.setAttribute('title', nowMuted ? 'Ton aktivieren' : 'Ton deaktivieren');
            soundToggle.querySelector('.sound-toggle-icon').textContent = nowMuted ? '🔇' : '🔊';

            // Play click sound to confirm (if turning on)
            if (!nowMuted && window.soundManager) {
                window.soundManager.play('click');
            }
        });
    }

    // Kiki greeting - only on first visit per session
    console.log('[HomeView] Greeting check:', {
        kiki_greeted: sessionStorage.getItem('kiki_greeted'),
        window_kiki: !!window.kiki,
        condition: !sessionStorage.getItem('kiki_greeted') && window.kiki
    });
    if (!sessionStorage.getItem('kiki_greeted') && window.kiki) {
        console.log('[HomeView] Triggering greeting in 500ms');
        setTimeout(() => {
            console.log('[HomeView] Showing greeting now');
            window.kiki.setEmotion('happy');
            window.kiki.speak('Hallo! Ich bin Kiki, dein Roboter-Freund. Klick auf eine Lektion, um loszulegen!');
            sessionStorage.setItem('kiki_greeted', 'true');
        }, 500);
    }
}

export default HomeView;
