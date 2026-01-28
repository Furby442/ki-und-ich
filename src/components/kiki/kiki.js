/**
 * Kiki Controller
 *
 * Manages the Kiki mascot globally across all views.
 * Singleton pattern - one Kiki instance for the entire app.
 */

import { KikiAvatar, EMOTIONS } from './kiki-avatar.js';
import { KikiSpeech } from './kiki-speech.js';
import { KikiParticles } from './kiki-particles.js';

export { EMOTIONS };

// Message arrays for variety
const CORRECT_MESSAGES = [
    'Super gemacht!',
    'Toll!',
    'Richtig!',
    'Genau!'
];

const INCORRECT_MESSAGES = [
    'Kein Problem, versuch es nochmal!',
    'Fast! Probier nochmal!',
    'Hmm, nicht ganz. Noch ein Versuch!',
    'Das ist knifflig! Versuch es nochmal!'
];

/**
 * Get random item from array
 */
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Kiki Mascot Controller
 */
class Kiki {
    constructor() {
        this.container = null;
        this.avatar = null;
        this.speechContainer = null;
        this.speechTimeout = null;
        this.particles = null;
        this.currentEmotion = EMOTIONS.HAPPY;
        this.initialized = false;

        // Check reduced motion preference
        this.prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        // Listen for preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)')
            .addEventListener('change', (e) => {
                this.prefersReducedMotion = e.matches;
            });
    }

    /**
     * Initialize Kiki - called once from app.js
     * Creates the container and renders Kiki into the DOM
     */
    init() {
        if (this.initialized) {
            return;
        }

        // Create Kiki container
        this.container = document.createElement('div');
        this.container.id = 'kiki-container';
        this.container.className = 'kiki-container';

        // Render Kiki avatar
        this.container.innerHTML = KikiAvatar({
            size: 150,
            emotion: this.currentEmotion
        });

        // Create particles container inside kiki container
        const particlesContainer = document.createElement('div');
        particlesContainer.id = 'kiki-particles';
        particlesContainer.className = 'kiki-particles';
        this.container.appendChild(particlesContainer);

        // Initialize particles system
        this.particles = new KikiParticles(particlesContainer);

        // Create speech container (separate from avatar container)
        this.speechContainer = document.createElement('div');
        this.speechContainer.id = 'kiki-speech-container';
        this.speechContainer.className = 'kiki-speech-container';

        // Add to body
        document.body.appendChild(this.container);
        document.body.appendChild(this.speechContainer);

        // Store reference to SVG
        this.avatar = this.container.querySelector('.kiki-avatar');

        // Set up speech dismiss handler (event delegation)
        this.speechContainer.addEventListener('click', (e) => {
            if (e.target.closest('.kiki-speech-dismiss')) {
                this.hideSpeech();
            }
        });

        this.initialized = true;
    }

    /**
     * Set Kiki's emotional state
     * @param {string} emotion - One of EMOTIONS values
     */
    setEmotion(emotion) {
        if (!this.avatar) {
            console.warn('Kiki not initialized');
            return;
        }

        // Validate emotion
        const validEmotions = Object.values(EMOTIONS);
        if (!validEmotions.includes(emotion)) {
            console.warn(`Invalid emotion: ${emotion}. Valid: ${validEmotions.join(', ')}`);
            return;
        }

        this.avatar.dataset.emotion = emotion;
        this.currentEmotion = emotion;
    }

    /**
     * Get current emotion
     * @returns {string} Current emotion
     */
    getEmotion() {
        return this.currentEmotion;
    }

    /**
     * Show speech bubble with text
     * @param {string} text - Message to display
     * @param {Object} options - Speech options
     * @param {number} options.duration - Auto-hide after ms (0 = stay until dismissed)
     * @param {boolean} options.animate - Enable word animation
     */
    speak(text, options = {}) {
        const { duration = 0, animate = !this.prefersReducedMotion } = options;

        if (!this.speechContainer) {
            console.warn('Kiki not initialized');
            return;
        }

        // Clear any existing timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }

        // Render speech bubble
        this.speechContainer.innerHTML = KikiSpeech(text, { animate });

        // Get the speech element
        const speechElement = this.speechContainer.querySelector('.kiki-speech');

        // Trigger fade-in after render (next frame)
        requestAnimationFrame(() => {
            if (speechElement) {
                speechElement.classList.add('kiki-speech--visible');
            }
        });

        // Set up auto-dismiss if duration specified
        if (duration > 0) {
            this.speechTimeout = setTimeout(() => {
                this.hideSpeech();
            }, duration);
        }
    }

    /**
     * Hide speech bubble
     */
    hideSpeech() {
        if (!this.speechContainer) return;

        const speechElement = this.speechContainer.querySelector('.kiki-speech');
        if (!speechElement) return;

        // Clear timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }

        // Trigger fade-out
        speechElement.classList.remove('kiki-speech--visible');

        // Clean up after transition
        setTimeout(() => {
            if (this.speechContainer) {
                this.speechContainer.innerHTML = '';
            }
        }, 300);
    }

    /**
     * Check if speech bubble is currently visible
     * @returns {boolean}
     */
    isSpeaking() {
        if (!this.speechContainer) return false;
        const speechElement = this.speechContainer.querySelector('.kiki-speech');
        return speechElement && speechElement.classList.contains('kiki-speech--visible');
    }

    /**
     * Trigger a reaction animation (for quiz feedback)
     * @param {string} reaction - 'correct' or 'encourage'
     */
    triggerReaction(reaction) {
        if (!this.avatar) return;

        // Set reaction attribute
        this.avatar.dataset.reaction = reaction;

        // Remove after animation completes
        setTimeout(() => {
            delete this.avatar.dataset.reaction;
        }, reaction === 'correct' ? 800 : 2000);
    }

    /**
     * React to quiz answer
     * @param {boolean} correct - Whether the answer was correct
     */
    reactToAnswer(correct) {
        if (!this.initialized) return;

        if (correct) {
            // Celebration!
            this.setEmotion(EMOTIONS.PROUD);
            this.triggerReaction('correct');

            // Particles
            if (this.particles) {
                this.particles.burst('stars', { count: 8, origin: { x: 75, y: 40 } });
            }

            // Encouraging message
            this.speak(randomItem(CORRECT_MESSAGES), { duration: 3000 });
        } else {
            // Encouragement
            this.setEmotion(EMOTIONS.THOUGHTFUL);
            this.triggerReaction('encourage');

            // Supportive message
            this.speak(randomItem(INCORRECT_MESSAGES), { duration: 4000 });
        }
    }

    /**
     * React to quiz completion
     * @param {number} score - Number of correct answers
     * @param {number} total - Total number of questions
     */
    reactToQuizEnd(score, total) {
        if (!this.initialized) return;

        if (score >= 3) {
            // Passed!
            this.setEmotion(EMOTIONS.PROUD);
            this.triggerReaction('correct');

            if (this.particles) {
                this.particles.burst('stars', { count: 12, origin: { x: 75, y: 40 } });
            }

            this.speak(`Super! Du hast ${score} von ${total} richtig!`);
        } else {
            // Encourage to try again
            this.setEmotion(EMOTIONS.THOUGHTFUL);

            this.speak('Das war schon gut! Versuch die Lektion nochmal!');
        }
    }

    /**
     * Check if reduced motion is preferred
     * @returns {boolean}
     */
    isReducedMotion() {
        return this.prefersReducedMotion;
    }
}

// Export singleton instance
export const kikiInstance = new Kiki();

// Also export class for testing
export { Kiki };
