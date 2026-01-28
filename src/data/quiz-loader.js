/**
 * Quiz Loader
 *
 * Fetches and caches quiz JSON data.
 * Validates quiz structure before returning.
 * Mirrors lesson-loader.js pattern.
 */

// Cache for loaded quizzes
const quizCache = new Map();

/**
 * Load a quiz by lesson ID
 * @param {number} lessonId - Lesson ID (1-7)
 * @returns {Promise<Object>} Quiz data object
 * @throws {Error} If quiz not found or invalid
 */
export async function loadQuiz(lessonId) {
    // Check cache first
    if (quizCache.has(lessonId)) {
        return quizCache.get(lessonId);
    }

    try {
        const response = await fetch(`./src/data/quizzes/quiz-${lessonId}.json`);

        if (!response.ok) {
            throw new Error(`Quiz ${lessonId} nicht gefunden`);
        }

        const quizData = await response.json();

        // Validate quiz structure
        validateQuiz(quizData);

        // Cache the quiz
        quizCache.set(lessonId, quizData);

        return quizData;
    } catch (error) {
        console.error(`Fehler beim Laden des Quiz ${lessonId}:`, error);
        throw error;
    }
}

/**
 * Validate quiz data structure
 * @param {Object} quiz - Quiz data to validate
 * @throws {Error} If quiz structure is invalid
 */
function validateQuiz(quiz) {
    if (!quiz.lessonId || !quiz.title || !Array.isArray(quiz.questions)) {
        throw new Error('Ungültige Quiz-Struktur');
    }

    if (quiz.questions.length !== 5) {
        throw new Error(`Quiz hat ${quiz.questions.length} Fragen (erwartet 5)`);
    }

    // Validate each question
    quiz.questions.forEach((question, index) => {
        if (!question.question || !Array.isArray(question.answers) || question.correctIndex === undefined) {
            throw new Error(`Frage ${index + 1} fehlt question, answers oder correctIndex`);
        }

        if (question.answers.length < 2 || question.answers.length > 4) {
            throw new Error(`Frage ${index + 1} hat ${question.answers.length} Antworten (erwartet 2-4)`);
        }

        if (question.correctIndex < 0 || question.correctIndex >= question.answers.length) {
            throw new Error(`Frage ${index + 1} hat ungültigen correctIndex`);
        }
    });
}

/**
 * Clear quiz cache (useful for development)
 */
export function clearQuizCache() {
    quizCache.clear();
}

/**
 * Check if a quiz is cached
 * @param {number} lessonId - Lesson ID
 * @returns {boolean}
 */
export function isQuizCached(lessonId) {
    return quizCache.has(lessonId);
}
