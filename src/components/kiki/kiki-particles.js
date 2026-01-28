/**
 * Kiki Particle Effects
 *
 * Lightweight particle system for celebration animations.
 * Uses CSS animations for performance.
 */

/**
 * Particle Effects Manager
 */
export class KikiParticles {
    constructor(container) {
        this.container = container;
        this.particleCount = 8;
    }

    /**
     * Check if reduced motion is preferred
     * @returns {boolean}
     */
    isReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Trigger particle burst effect
     * @param {string} type - 'stars' or 'sparkles'
     * @param {Object} options - Burst options
     * @param {number} options.count - Number of particles
     * @param {Object} options.origin - Origin point { x, y }
     */
    burst(type = 'stars', options = {}) {
        const {
            count = this.particleCount,
            origin = { x: 75, y: 40 }
        } = options;

        // Skip if reduced motion preferred
        if (this.isReducedMotion()) {
            return;
        }

        // Create particles
        for (let i = 0; i < count; i++) {
            this.createParticle(type, origin, i, count);
        }
    }

    /**
     * Create a single particle
     * @param {string} type - Particle type
     * @param {Object} origin - Origin point
     * @param {number} index - Current particle index
     * @param {number} total - Total particles
     */
    createParticle(type, origin, index, total) {
        const particle = document.createElement('div');
        particle.className = `kiki-particle kiki-particle--${type}`;

        // Calculate burst direction (spread around circle)
        const angle = (index / total) * Math.PI * 2;
        const distance = 40 + Math.random() * 30; // 40-70px
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 20; // Bias upward

        // Set CSS variables for animation
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.left = `${origin.x}px`;
        particle.style.top = `${origin.y}px`;

        // Add to container
        this.container.appendChild(particle);

        // Trigger animation on next frame
        requestAnimationFrame(() => {
            particle.classList.add('kiki-particle--animating');
        });

        // Remove after animation
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}
