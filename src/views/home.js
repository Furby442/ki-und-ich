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

    container.innerHTML = `
        <div class="container home-page">
            <header class="home-header">
                <h1>KI und ich</h1>
                <p class="home-welcome">Willkommen! Lerne spielerisch, was Künstliche Intelligenz ist.</p>
            </header>

            <div class="lesson-grid">
                ${lessonCards}
            </div>
        </div>
    `;

    // Kiki greeting - only on first visit per session
    if (!sessionStorage.getItem('kiki_greeted') && window.kiki) {
        setTimeout(() => {
            window.kiki.setEmotion('happy');
            window.kiki.speak('Hallo! Ich bin Kiki, dein Roboter-Freund. Klick auf eine Lektion, um loszulegen!');
            sessionStorage.setItem('kiki_greeted', 'true');
        }, 500);
    }
}

export default HomeView;
