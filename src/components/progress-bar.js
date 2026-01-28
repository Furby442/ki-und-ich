/**
 * ProgressBar Component
 *
 * Visual progress indicator showing current position in learning path.
 * Displays filled/unfilled segments representing completion status.
 */

/**
 * Render progress bar component
 * @param {object} config - Progress bar configuration
 * @param {number} config.current - Current step (1-based)
 * @param {number} config.total - Total number of steps
 * @param {string} config.label - Label text
 * @returns {string} HTML string
 */
export function ProgressBar(config) {
    const {
        current = 1,
        total = 7,
        label = `Schritt ${current} von ${total}`
    } = config;

    // Generate segments for visual progress
    const segments = [];
    for (let i = 1; i <= total; i++) {
        const state = i < current ? 'completed' : i === current ? 'current' : 'upcoming';
        segments.push(`
            <div class="progress-segment progress-segment--${state}"
                 role="presentation"
                 aria-label="Schritt ${i}${i === current ? ' (aktuell)' : i < current ? ' (abgeschlossen)' : ''}">
            </div>
        `);
    }

    return `
        <div class="progress-bar-container" role="progressbar"
             aria-valuenow="${current}"
             aria-valuemin="1"
             aria-valuemax="${total}"
             aria-label="${label}">
            <div class="progress-segments">
                ${segments.join('')}
            </div>
            <div class="progress-label">
                ${label}
            </div>
        </div>
    `;
}

export default ProgressBar;
