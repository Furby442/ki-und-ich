/**
 * Celebration Utilities
 *
 * Provides confetti and visual celebration effects.
 * Uses canvas-confetti library (loaded via CDN).
 * Respects prefers-reduced-motion preference.
 */

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Trigger a confetti burst with custom options
 * @param {Object} options - canvas-confetti options override
 */
export function triggerConfetti(options = {}) {
    // Skip if reduced motion preferred
    if (prefersReducedMotion()) {
        return;
    }

    // Check if confetti is available (CDN loaded)
    if (typeof window.confetti !== 'function') {
        console.warn('Celebration: confetti library not loaded');
        return;
    }

    // Default options with app colors
    const defaults = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58CC02', '#1FA3F3', '#8B5CF6', '#F59E0B', '#FF6B6B'],
        disableForReducedMotion: true
    };

    window.confetti({
        ...defaults,
        ...options
    });
}

/**
 * Celebrate quiz pass with multi-burst confetti
 * Creates a more dramatic effect for quiz completion
 */
export function celebrateQuizPass() {
    if (prefersReducedMotion()) {
        return;
    }

    // First burst - center
    triggerConfetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.5, y: 0.6 }
    });

    // Second burst - left side (delayed)
    setTimeout(() => {
        triggerConfetti({
            particleCount: 40,
            spread: 55,
            origin: { x: 0.3, y: 0.65 }
        });
    }, 150);

    // Third burst - right side (delayed)
    setTimeout(() => {
        triggerConfetti({
            particleCount: 40,
            spread: 55,
            origin: { x: 0.7, y: 0.65 }
        });
    }, 300);
}

/**
 * Celebrate perfect score (5/5) with extra flair
 */
export function celebratePerfectScore() {
    if (prefersReducedMotion()) {
        return;
    }

    // Confetti rain from top
    triggerConfetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0 },
        gravity: 0.8,
        scalar: 1.2
    });

    // Side bursts
    setTimeout(() => {
        triggerConfetti({
            particleCount: 50,
            angle: 60,
            spread: 45,
            origin: { x: 0, y: 0.6 }
        });
        triggerConfetti({
            particleCount: 50,
            angle: 120,
            spread: 45,
            origin: { x: 1, y: 0.6 }
        });
    }, 200);
}

export default { triggerConfetti, celebrateQuizPass, celebratePerfectScore };
