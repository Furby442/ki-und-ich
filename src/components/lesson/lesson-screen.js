/**
 * Lesson Screen Component
 *
 * Renders individual lesson screens based on type.
 * Types: intro, explanation, example, interactive, summary
 */

/**
 * Screen type definitions
 */
export const SCREEN_TYPES = {
    INTRO: 'intro',
    EXPLANATION: 'explanation',
    EXAMPLE: 'example',
    INTERACTIVE: 'interactive',
    SUMMARY: 'summary'
};

/**
 * Render a lesson screen
 * @param {Object} screen - Screen data
 * @param {number} index - Screen index (0-based)
 * @param {number} total - Total number of screens
 * @returns {string} HTML string
 */
export function renderScreen(screen, index, total) {
    const { type, content } = screen;

    const renderers = {
        [SCREEN_TYPES.INTRO]: renderIntroScreen,
        [SCREEN_TYPES.EXPLANATION]: renderExplanationScreen,
        [SCREEN_TYPES.EXAMPLE]: renderExampleScreen,
        [SCREEN_TYPES.INTERACTIVE]: renderInteractiveScreen,
        [SCREEN_TYPES.SUMMARY]: renderSummaryScreen
    };

    const renderer = renderers[type] || renderDefaultScreen;
    const screenContent = renderer(content);

    return `
        <div class="lesson-screen lesson-screen--${type}" data-screen="${index}">
            <div class="lesson-screen-content">
                ${screenContent}
            </div>
            <div class="lesson-screen-indicator">
                ${index + 1} von ${total}
            </div>
        </div>
    `;
}

/**
 * Render intro screen (welcome, image, text)
 */
function renderIntroScreen(content) {
    const { headline, text, image } = content;

    return `
        <div class="screen-intro">
            ${image ? `<div class="screen-image screen-image--${image}"></div>` : ''}
            <h2 class="screen-headline">${headline}</h2>
            <p class="screen-text">${text}</p>
        </div>
    `;
}

/**
 * Render explanation screen (text, bullets, highlight)
 */
function renderExplanationScreen(content) {
    const { headline, text, bullets, highlight } = content;

    let bulletsHtml = '';
    if (bullets && bullets.length > 0) {
        bulletsHtml = `
            <ul class="screen-bullets">
                ${bullets.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }

    let highlightHtml = '';
    if (highlight) {
        highlightHtml = `<div class="screen-highlight">${highlight}</div>`;
    }

    return `
        <div class="screen-explanation">
            <h2 class="screen-headline">${headline}</h2>
            <p class="screen-text">${text}</p>
            ${bulletsHtml}
            ${highlightHtml}
        </div>
    `;
}

/**
 * Render example screen (examples with titles)
 */
function renderExampleScreen(content) {
    const { headline, text, examples } = content;

    let examplesHtml = '';
    if (examples && examples.length > 0) {
        examplesHtml = `
            <div class="screen-examples">
                ${examples.map(ex => `
                    <div class="example-card">
                        <h4 class="example-title">${ex.title}</h4>
                        <p class="example-description">${ex.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="screen-example">
            <h2 class="screen-headline">${headline}</h2>
            <p class="screen-text">${text}</p>
            ${examplesHtml}
        </div>
    `;
}

/**
 * Render interactive screen (placeholder for Phase 4+)
 */
function renderInteractiveScreen(content) {
    const { headline, text, interaction } = content;

    return `
        <div class="screen-interactive">
            <h2 class="screen-headline">${headline}</h2>
            <p class="screen-text">${text}</p>
            <div class="screen-interaction-placeholder">
                Interaktives Element kommt in Phase 4
            </div>
        </div>
    `;
}

/**
 * Render summary screen (recap with list)
 */
function renderSummaryScreen(content) {
    const { headline, summary, nextStep } = content;

    let summaryHtml = '';
    if (summary && summary.length > 0) {
        summaryHtml = `
            <ul class="screen-summary-list">
                ${summary.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }

    return `
        <div class="screen-summary">
            <h2 class="screen-headline">${headline}</h2>
            ${summaryHtml}
            ${nextStep ? `<p class="screen-next-step">${nextStep}</p>` : ''}
        </div>
    `;
}

/**
 * Fallback renderer for unknown screen types
 */
function renderDefaultScreen(content) {
    return `
        <div class="screen-default">
            <p>${JSON.stringify(content)}</p>
        </div>
    `;
}
