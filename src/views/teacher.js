/**
 * Teacher Mode View
 *
 * Provides teachers with an overview of all lessons
 * and free navigation without progress restrictions.
 */

const LESSONS = [
    { id: 1, title: 'Was ist KI?', description: 'Einfuehrung in kuenstliche Intelligenz' },
    { id: 2, title: 'KI-Arten erklaert', description: 'Text-KI, Bild-KI, Sprach-KI' },
    { id: 3, title: 'Was kann KI heute?', description: 'Aktuelle Faehigkeiten von KI' },
    { id: 4, title: 'KI im Alltag', description: 'KI auf Handy, beim Streamen, zu Hause' },
    { id: 5, title: 'Mit KI sprechen', description: 'Prompting-Techniken fuer Kinder' },
    { id: 6, title: 'Uebungen', description: 'Praktische Uebungen zum Prompting' },
    { id: 7, title: 'Erste App bauen', description: 'Einfuehrung in die Mini-Apps' }
];

/**
 * Render teacher mode view
 * @param {HTMLElement} container - Container element
 * @param {object} state - Application state manager
 */
export function TeacherView(container, state) {
    const lessonsHtml = LESSONS.map(lesson => `
        <div class="teacher-lesson-card">
            <div class="teacher-lesson-header">
                <span class="teacher-lesson-number">${lesson.id}</span>
                <h3 class="teacher-lesson-title">${lesson.title}</h3>
            </div>
            <p class="teacher-lesson-desc">${lesson.description}</p>
            <div class="teacher-lesson-actions">
                <a href="#/lesson/${lesson.id}" class="teacher-btn teacher-btn--lesson">
                    Lektion starten
                </a>
                <a href="#/quiz/${lesson.id}" class="teacher-btn teacher-btn--quiz">
                    Quiz zeigen
                </a>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="container teacher-page">
            <header class="teacher-header">
                <div class="teacher-header-top">
                    <a href="#/" class="teacher-back">← Zurueck</a>
                    <span class="teacher-badge">Lehrer-Modus</span>
                </div>
                <h1>Unterrichtsuebersicht</h1>
                <p class="teacher-subtitle">
                    Alle Lektionen und Quizze auf einen Blick.
                    Navigation ohne Fortschrittsbeschraenkungen.
                </p>
            </header>

            <section class="teacher-section">
                <h2>Lektionen (1-7)</h2>
                <div class="teacher-lessons-grid">
                    ${lessonsHtml}
                </div>
            </section>

            <section class="teacher-section">
                <h2>Mini-Apps</h2>
                <p class="teacher-apps-intro">
                    Interaktive Apps zum Ausprobieren von KI-Konzepten:
                </p>
                <div class="teacher-apps-grid">
                    <a href="#/apps/story" class="teacher-app-card">
                        <span class="teacher-app-emoji">📖</span>
                        <span>Geschichten-Generator</span>
                    </a>
                    <a href="#/apps/animal" class="teacher-app-card">
                        <span class="teacher-app-emoji">🐾</span>
                        <span>Tier-Quiz</span>
                    </a>
                    <a href="#/apps/joke" class="teacher-app-card">
                        <span class="teacher-app-emoji">😂</span>
                        <span>Witz-Maschine</span>
                    </a>
                    <a href="#/apps/name" class="teacher-app-card">
                        <span class="teacher-app-emoji">✨</span>
                        <span>Namens-Bedeutung</span>
                    </a>
                </div>
            </section>

            <section class="teacher-section teacher-tips">
                <h2>Tipps fuer den Unterricht</h2>
                <ul class="teacher-tips-list">
                    <li>Beginne mit Lektion 1 als Einfuehrung (ca. 10-15 Min)</li>
                    <li>Lasse Schueler die Quizze einzeln oder in Gruppen loesen</li>
                    <li>Die Mini-Apps eignen sich gut fuer praktische Uebungen</li>
                    <li>Kiki reagiert auf richtige/falsche Antworten - das motiviert!</li>
                    <li>Der Ton kann oben rechts auf der Startseite deaktiviert werden</li>
                </ul>
            </section>

            <section class="teacher-section">
                <h2>Schnellzugriff</h2>
                <div class="teacher-quick-actions">
                    <button class="teacher-btn teacher-btn--action" id="reset-progress">
                        Fortschritt zuruecksetzen
                    </button>
                </div>
            </section>
        </div>
    `;

    // Reset progress button
    const resetBtn = container.querySelector('#reset-progress');
    resetBtn.addEventListener('click', () => {
        if (confirm('Wirklich den gesamten Fortschritt zuruecksetzen?')) {
            state.reset();
            if (window.kiki) {
                window.kiki.setEmotion('surprised');
                window.kiki.speak('Alles zurueckgesetzt! Bereit fuer eine neue Klasse.');
            }
            // Reload to show reset state
            setTimeout(() => {
                window.location.hash = '#/';
                window.location.reload();
            }, 1500);
        }
    });

    // Kiki greeting for teacher mode
    if (window.kiki) {
        window.kiki.setEmotion('thoughtful');
        window.kiki.speak('Willkommen im Lehrer-Modus! Hier sehen Sie alle Inhalte.');
    }
}

export default TeacherView;
