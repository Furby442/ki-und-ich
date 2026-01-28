/**
 * Navigation Component
 *
 * Bottom navigation bar with back/forward buttons and progress indicator.
 * Follows mobile-first design pattern with 48x48px touch targets.
 */

import { ProgressBar } from './progress-bar.js';

/**
 * Render navigation component
 * @param {object} config - Navigation configuration
 * @param {boolean} config.showBack - Show back button
 * @param {boolean} config.showNext - Show next button
 * @param {string} config.backUrl - URL for back button
 * @param {string} config.nextUrl - URL for next button
 * @param {number} config.currentStep - Current step number (1-7)
 * @param {number} config.totalSteps - Total steps (7)
 * @returns {string} HTML string
 */
export function Navigation(config) {
    const {
        showBack = false,
        showNext = false,
        backUrl = '#/',
        nextUrl = '#/',
        currentStep = 1,
        totalSteps = 7
    } = config;

    const progressBar = ProgressBar({
        current: currentStep,
        total: totalSteps,
        label: `Schritt ${currentStep} von ${totalSteps}`
    });

    return `
        <nav class="nav-bar" role="navigation" aria-label="Hauptnavigation">
            <div class="nav-container">
                ${showBack ? `
                    <a href="${backUrl}" class="nav-btn nav-btn--back" aria-label="Zurück">
                        <span class="nav-btn-icon">←</span>
                        <span class="nav-btn-text">Zurück</span>
                    </a>
                ` : '<div class="nav-btn-spacer"></div>'}

                <div class="nav-progress">
                    ${progressBar}
                </div>

                ${showNext ? `
                    <a href="${nextUrl}" class="nav-btn nav-btn--next" aria-label="Weiter">
                        <span class="nav-btn-text">Weiter</span>
                        <span class="nav-btn-icon">→</span>
                    </a>
                ` : '<div class="nav-btn-spacer"></div>'}
            </div>
        </nav>
    `;
}

export default Navigation;
