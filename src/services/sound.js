/**
 * SoundManager - Web Audio API based sound effects
 *
 * Uses single AudioContext (singleton pattern) with preloaded buffers.
 * Respects soundEnabled preference from StateManager.
 * Must be initialized after first user gesture to comply with autoplay policy.
 */

export class SoundManager {
    constructor() {
        this.audioContext = null;
        this.buffers = {};
        this.initialized = false;
        this.stateManager = null;
    }

    /**
     * Set the state manager reference
     * Called from app.js after state is created
     */
    setStateManager(stateManager) {
        this.stateManager = stateManager;
    }

    /**
     * Initialize audio context and preload sounds
     * MUST be called after user gesture (click/tap)
     */
    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Resume if suspended (autoplay policy)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Preload all sounds in parallel
            await Promise.all([
                this.loadSound('correct', 'assets/audio/correct.mp3'),
                this.loadSound('incorrect', 'assets/audio/incorrect.mp3'),
                this.loadSound('complete', 'assets/audio/complete.mp3'),
                this.loadSound('click', 'assets/audio/click.mp3')
            ]);

            this.initialized = true;
            console.log('SoundManager: Initialized with', Object.keys(this.buffers).length, 'sounds');
        } catch (error) {
            console.warn('SoundManager: Failed to initialize', error);
        }
    }

    /**
     * Load a sound file into buffer
     */
    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            this.buffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.warn(`SoundManager: Failed to load ${name}`, error);
        }
    }

    /**
     * Play a sound by name
     * Respects mute preference, silently fails if sound not loaded
     */
    play(name) {
        // Check mute preference
        if (this.stateManager && this.stateManager.get('soundEnabled') === false) {
            return;
        }

        // Check if sound exists
        if (!this.audioContext || !this.buffers[name]) {
            return;
        }

        // Create new source node (single-use)
        const source = this.audioContext.createBufferSource();
        source.buffer = this.buffers[name];
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    /**
     * Set muted state
     */
    setMuted(muted) {
        if (this.stateManager) {
            this.stateManager.set('soundEnabled', !muted);
        }
    }

    /**
     * Check if muted
     */
    isMuted() {
        if (!this.stateManager) return false;
        return this.stateManager.get('soundEnabled') === false;
    }

    /**
     * Check if initialized
     */
    isReady() {
        return this.initialized;
    }
}

// Singleton instance
export const soundManager = new SoundManager();
export default soundManager;
