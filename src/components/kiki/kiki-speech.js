/**
 * Kiki Speech Bubble Component
 *
 * Generates speech bubble HTML with word-by-word animation.
 * Used by Kiki controller to display messages to children.
 */

/**
 * Generate speech bubble HTML
 * @param {string} text - Message to display
 * @param {Object} options - Speech options
 * @param {boolean} options.animate - Enable word animation (default: true)
 * @returns {string} Speech bubble HTML
 */
export function KikiSpeech(text, options = {}) {
    const { animate = true } = options;

    // Split text into words and wrap each for animation
    const words = text.split(' ');
    const wordSpans = words.map((word, index) => {
        const delay = animate ? `animation-delay: ${index * 0.1}s` : '';
        return `<span class="kiki-speech-word" style="${delay}">${word}</span>`;
    }).join(' ');

    return `
        <div class="kiki-speech" role="status" aria-live="polite">
            <div class="kiki-speech-content">
                ${wordSpans}
            </div>
            <button class="kiki-speech-dismiss" aria-label="Schliessen" type="button">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="2" y1="2" x2="12" y2="12"/>
                    <line x1="12" y1="2" x2="2" y2="12"/>
                </svg>
            </button>
        </div>
    `;
}
