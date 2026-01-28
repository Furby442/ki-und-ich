/**
 * StateManager - LocalStorage-based state persistence
 *
 * DSGVO/GDPR Compliance:
 * This state manager stores ONLY application state (lesson progress, quiz scores).
 * NO personal data (names, emails, user identifiers) is stored.
 * All data remains local to the user's browser and is never transmitted.
 */

export class StateManager {
    constructor(storageKey = 'ki-und-ich-state') {
        this.storageKey = storageKey;
        this.state = this.loadState();
        this.autoSaveEnabled = false;
    }

    /**
     * Get default initial state
     * @returns {object} Default state structure
     */
    getDefaultState() {
        return {
            currentLesson: 0,
            completedLessons: [],
            quizScores: {},
            lastVisited: null,
            soundEnabled: true
        };
    }

    /**
     * Load state from localStorage
     * @returns {object} Loaded state or default state
     */
    loadState() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Validate that loaded state has expected structure
                return {
                    ...this.getDefaultState(),
                    ...parsed
                };
            }
        } catch (error) {
            console.warn('StateManager: Failed to load state from localStorage', error);
        }

        // Return default state if load failed or no state exists
        return this.getDefaultState();
    }

    /**
     * Save current state to localStorage
     * @returns {boolean} True if save successful
     */
    save() {
        try {
            const serialized = JSON.stringify(this.state);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (error) {
            console.error('StateManager: Failed to save state to localStorage', error);
            // Possible causes: storage quota exceeded, privacy mode, etc.
            return false;
        }
    }

    /**
     * Get a state property
     * @param {string} key State property key
     * @returns {*} Value of property
     */
    get(key) {
        return this.state[key];
    }

    /**
     * Set a state property
     * @param {string} key State property key
     * @param {*} value New value
     */
    set(key, value) {
        this.state[key] = value;
        if (this.autoSaveEnabled) {
            this.save();
        }
    }

    /**
     * Get entire state object
     * @returns {object} Current state
     */
    getAll() {
        return { ...this.state };
    }

    /**
     * Update multiple state properties at once
     * @param {object} updates Object with key-value pairs to update
     */
    update(updates) {
        this.state = {
            ...this.state,
            ...updates
        };
        if (this.autoSaveEnabled) {
            this.save();
        }
    }

    /**
     * Enable auto-save on page unload
     */
    enableAutoSave() {
        if (this.autoSaveEnabled) return;

        this.autoSaveEnabled = true;

        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.save();
        });

        // Also save on visibility change (e.g., tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.save();
            }
        });
    }

    /**
     * Reset state to defaults (useful for testing)
     */
    reset() {
        this.state = this.getDefaultState();
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('StateManager: Failed to clear localStorage', error);
        }
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    static isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default StateManager;
