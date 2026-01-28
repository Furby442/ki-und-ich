/**
 * Lesson Loader
 *
 * Fetches and caches lesson JSON data.
 * Validates lesson structure before returning.
 */

// Cache for loaded lessons
const lessonCache = new Map();

/**
 * Load a lesson by ID
 * @param {number} lessonId - Lesson ID (1-7)
 * @returns {Promise<Object>} Lesson data object
 * @throws {Error} If lesson not found or invalid
 */
export async function loadLesson(lessonId) {
    // Check cache first
    if (lessonCache.has(lessonId)) {
        return lessonCache.get(lessonId);
    }

    try {
        const response = await fetch(`./src/data/lessons/lesson-${lessonId}.json`);

        if (!response.ok) {
            throw new Error(`Lektion ${lessonId} nicht gefunden`);
        }

        const lessonData = await response.json();

        // Validate lesson structure
        validateLesson(lessonData);

        // Cache the lesson
        lessonCache.set(lessonId, lessonData);

        return lessonData;
    } catch (error) {
        console.error(`Fehler beim Laden der Lektion ${lessonId}:`, error);
        throw error;
    }
}

/**
 * Validate lesson data structure
 * @param {Object} lesson - Lesson data to validate
 * @throws {Error} If lesson structure is invalid
 */
function validateLesson(lesson) {
    if (!lesson.id || !lesson.title || !Array.isArray(lesson.screens)) {
        throw new Error('Ungültige Lektionsstruktur');
    }

    if (lesson.screens.length < 1 || lesson.screens.length > 10) {
        throw new Error(`Lektion hat ${lesson.screens.length} Bildschirme (erwartet 1-10)`);
    }

    // Validate each screen
    lesson.screens.forEach((screen, index) => {
        if (!screen.type || !screen.content) {
            throw new Error(`Bildschirm ${index + 1} fehlt type oder content`);
        }
    });
}

/**
 * Preload all lessons (for faster navigation)
 * @returns {Promise<void>}
 */
export async function preloadAllLessons() {
    const lessonIds = [1, 2, 3, 4, 5, 6, 7];
    const promises = lessonIds.map(id => loadLesson(id).catch(() => null));
    await Promise.all(promises);
}

/**
 * Clear lesson cache (useful for development)
 */
export function clearLessonCache() {
    lessonCache.clear();
}

/**
 * Check if a lesson is cached
 * @param {number} lessonId - Lesson ID
 * @returns {boolean}
 */
export function isLessonCached(lessonId) {
    return lessonCache.has(lessonId);
}
