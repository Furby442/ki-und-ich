/**
 * Quiz Renderer
 *
 * Main controller for displaying and navigating quiz questions.
 * Handles answer selection, feedback, and scoring.
 */

/**
 * Quiz Renderer Class
 */
export class QuizRenderer {
    /**
     * Create a QuizRenderer instance
     * @param {HTMLElement} container - Container element for quiz content
     * @param {Object} quizData - Quiz data object
     * @param {Object} state - StateManager instance
     */
    constructor(container, quizData, state) {
        this.container = container;
        this.quiz = quizData;
        this.state = state;
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        this.answers = []; // Track all answers for results
    }

    /**
     * Render the current quiz state
     */
    render() {
        if (this.currentQuestion >= this.quiz.questions.length) {
            this.renderResults();
            return;
        }

        this.renderQuestion();
    }

    /**
     * Render a question screen
     */
    renderQuestion() {
        const question = this.quiz.questions[this.currentQuestion];
        const totalQuestions = this.quiz.questions.length;

        // Render answers
        const answersHtml = question.answers.map((answer, index) => `
            <button
                class="quiz-answer"
                data-index="${index}"
                ${this.answered ? 'disabled' : ''}
                aria-label="Antwort ${index + 1}: ${answer}"
            >
                <span class="quiz-answer-letter">${String.fromCharCode(65 + index)}</span>
                <span class="quiz-answer-text">${answer}</span>
            </button>
        `).join('');

        this.container.innerHTML = `
            <div class="quiz-wrapper">
                <header class="quiz-header">
                    <h1 class="quiz-title">${this.quiz.title}</h1>
                    <div class="quiz-progress">
                        <div class="quiz-progress-bar">
                            <div class="quiz-progress-fill" style="width: ${((this.currentQuestion + 1) / totalQuestions) * 100}%"></div>
                        </div>
                        <span class="quiz-progress-text">Frage ${this.currentQuestion + 1} von ${totalQuestions}</span>
                    </div>
                </header>

                <main class="quiz-content">
                    <div class="quiz-question">
                        <h2 class="quiz-question-text">${question.question}</h2>
                    </div>

                    <div class="quiz-answers" id="quiz-answers">
                        ${answersHtml}
                    </div>

                    <div class="quiz-feedback" id="quiz-feedback" aria-live="polite"></div>
                </main>
            </div>
        `;

        this.setupEventListeners();
    }

    /**
     * Setup event listeners for answer buttons
     */
    setupEventListeners() {
        const answersContainer = this.container.querySelector('#quiz-answers');

        if (answersContainer) {
            answersContainer.addEventListener('click', (e) => {
                const button = e.target.closest('.quiz-answer');
                if (button && !this.answered) {
                    const index = parseInt(button.dataset.index, 10);
                    this.handleAnswer(index);
                }
            });
        }
    }

    /**
     * Handle answer selection
     * @param {number} selectedIndex - Index of selected answer
     */
    handleAnswer(selectedIndex) {
        if (this.answered) return;

        this.answered = true;
        const question = this.quiz.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correctIndex;

        // Update score
        if (isCorrect) {
            this.score++;
        }

        // Track answer
        this.answers.push({
            questionIndex: this.currentQuestion,
            selectedIndex,
            isCorrect
        });

        // Show visual feedback
        this.showFeedback(selectedIndex, isCorrect, question);

        // Dispatch event for Kiki integration
        this.dispatchAnswerEvent(isCorrect);

        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    /**
     * Show visual feedback for answer
     * @param {number} selectedIndex - Index of selected answer
     * @param {boolean} isCorrect - Whether answer was correct
     * @param {Object} question - Current question object
     */
    showFeedback(selectedIndex, isCorrect, question) {
        const buttons = this.container.querySelectorAll('.quiz-answer');
        const feedbackEl = this.container.querySelector('#quiz-feedback');

        // Mark selected answer
        buttons[selectedIndex].classList.add(isCorrect ? 'quiz-answer--correct' : 'quiz-answer--incorrect');

        // Show correct answer if wrong
        if (!isCorrect) {
            buttons[question.correctIndex].classList.add('quiz-answer--correct');
        }

        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);

        // Show feedback text
        const feedbackText = isCorrect ? question.feedback.correct : question.feedback.incorrect;
        feedbackEl.innerHTML = `
            <div class="quiz-feedback-message ${isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect'}">
                ${feedbackText}
            </div>
        `;
    }

    /**
     * Dispatch answer event for external listeners (Kiki)
     * @param {boolean} isCorrect - Whether answer was correct
     */
    dispatchAnswerEvent(isCorrect) {
        const event = new CustomEvent('quiz-answer', {
            detail: { isCorrect, questionIndex: this.currentQuestion }
        });
        this.container.dispatchEvent(event);
    }

    /**
     * Move to next question
     */
    nextQuestion() {
        this.currentQuestion++;
        this.answered = false;
        this.render();
    }

    /**
     * Render results screen
     */
    renderResults() {
        const total = this.quiz.questions.length;
        const passed = this.score >= 3;

        // Save score to state
        this.saveScore();

        // Dispatch completion event
        this.dispatchCompleteEvent();

        // Determine result message
        let resultMessage, resultEmoji;
        if (this.score === total) {
            resultMessage = 'Perfekt! Alle Fragen richtig!';
            resultEmoji = '🌟';
        } else if (this.score >= 4) {
            resultMessage = 'Super gemacht!';
            resultEmoji = '🎉';
        } else if (this.score >= 3) {
            resultMessage = 'Gut gemacht!';
            resultEmoji = '👍';
        } else {
            resultMessage = 'Das war schon gut! Versuch es nochmal!';
            resultEmoji = '💪';
        }

        this.container.innerHTML = `
            <div class="quiz-wrapper">
                <header class="quiz-header">
                    <h1 class="quiz-title">${this.quiz.title}</h1>
                </header>

                <main class="quiz-content quiz-results">
                    <div class="quiz-results-emoji">${resultEmoji}</div>

                    <h2 class="quiz-results-title">${resultMessage}</h2>

                    <div class="quiz-score">
                        <span class="quiz-score-number">${this.score}</span>
                        <span class="quiz-score-text">von ${total} richtig</span>
                    </div>

                    <div class="quiz-results-actions">
                        <button class="quiz-btn quiz-btn--retry" id="quiz-retry">
                            Nochmal versuchen
                        </button>
                        <a href="#/" class="quiz-btn quiz-btn--home">
                            Zur Übersicht
                        </a>
                    </div>
                </main>
            </div>
        `;

        // Setup retry button
        const retryBtn = this.container.querySelector('#quiz-retry');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.restart());
        }
    }

    /**
     * Save quiz score to state
     */
    saveScore() {
        const quizScores = this.state.get('quizScores') || {};
        quizScores[this.quiz.lessonId] = {
            score: this.score,
            total: this.quiz.questions.length,
            completedAt: new Date().toISOString()
        };
        this.state.set('quizScores', quizScores);

        // Mark lesson as completed if passed
        if (this.score >= 3) {
            const completedLessons = this.state.get('completedLessons') || [];
            if (!completedLessons.includes(this.quiz.lessonId)) {
                completedLessons.push(this.quiz.lessonId);
                this.state.set('completedLessons', completedLessons);
            }
        }
    }

    /**
     * Dispatch completion event for external listeners (Kiki)
     */
    dispatchCompleteEvent() {
        const event = new CustomEvent('quiz-complete', {
            detail: {
                score: this.score,
                total: this.quiz.questions.length,
                lessonId: this.quiz.lessonId
            }
        });
        this.container.dispatchEvent(event);
    }

    /**
     * Restart the quiz
     */
    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
        this.answers = [];
        this.render();
    }

    /**
     * Get current progress
     * @returns {Object} Progress info
     */
    getProgress() {
        return {
            current: this.currentQuestion + 1,
            total: this.quiz.questions.length,
            score: this.score
        };
    }
}
