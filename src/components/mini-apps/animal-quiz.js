/**
 * Animal Quiz Mini-App
 *
 * AI-style guessing game where the app asks questions
 * to guess which animal the user is thinking of.
 */

const QUESTIONS = [
    { id: 'legs', text: 'Hat das Tier vier Beine?', yesPath: 'four-legs', noPath: 'not-four-legs' },
    { id: 'fly', text: 'Kann das Tier fliegen?', yesPath: 'can-fly', noPath: 'cannot-fly' },
    { id: 'water', text: 'Lebt das Tier im Wasser?', yesPath: 'in-water', noPath: 'on-land' },
    { id: 'big', text: 'Ist das Tier groesser als ein Mensch?', yesPath: 'big', noPath: 'small' },
    { id: 'pet', text: 'Ist es ein beliebtes Haustier?', yesPath: 'pet', noPath: 'wild' },
    { id: 'fur', text: 'Hat das Tier Fell?', yesPath: 'has-fur', noPath: 'no-fur' }
];

const GUESSES = {
    'four-legs-big-has-fur': { animal: 'Loewe', emoji: '🦁' },
    'four-legs-big-no-fur': { animal: 'Elefant', emoji: '🐘' },
    'four-legs-small-pet-has-fur': { animal: 'Hund', emoji: '🐕' },
    'four-legs-small-pet-no-fur': { animal: 'Schildkroete', emoji: '🐢' },
    'four-legs-small-wild-has-fur': { animal: 'Fuchs', emoji: '🦊' },
    'four-legs-small-wild-no-fur': { animal: 'Frosch', emoji: '🐸' },
    'not-four-legs-can-fly': { animal: 'Vogel', emoji: '🐦' },
    'not-four-legs-cannot-fly-in-water': { animal: 'Fisch', emoji: '🐟' },
    'not-four-legs-cannot-fly-on-land': { animal: 'Schlange', emoji: '🐍' }
};

/**
 * Render the Animal Quiz
 * @returns {string} HTML string
 */
export function renderAnimalQuiz() {
    return `
        <div class="mini-app animal-quiz">
            <div class="mini-app-header">
                <h2 class="mini-app-title">Tier-Quiz</h2>
                <p class="mini-app-subtitle">Denk an ein Tier - ich versuche es zu erraten!</p>
            </div>

            <div class="animal-quiz-content" id="quiz-content">
                <div class="animal-quiz-start">
                    <p class="animal-quiz-instruction">Denk dir ein Tier aus und behalte es im Kopf.</p>
                    <p class="animal-quiz-instruction">Ich stelle dir ein paar Fragen!</p>
                    <button class="mini-app-generate-btn" id="start-quiz">
                        Ich habe ein Tier!
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize Animal Quiz interactivity
 * @param {HTMLElement} container - Container element
 */
export function initAnimalQuiz(container) {
    const content = container.querySelector('#quiz-content');
    let answers = [];
    let questionIndex = 0;

    const startBtn = container.querySelector('#start-quiz');
    startBtn.addEventListener('click', () => {
        if (window.kiki) {
            window.kiki.setEmotion('curious');
            window.kiki.speak('Okay, ich stelle dir jetzt Fragen!');
        }
        showQuestion();
    });

    function showQuestion() {
        if (questionIndex >= QUESTIONS.length) {
            makeGuess();
            return;
        }

        const q = QUESTIONS[questionIndex];
        content.innerHTML = `
            <div class="animal-quiz-question">
                <p class="animal-quiz-q-number">Frage ${questionIndex + 1} von ${QUESTIONS.length}</p>
                <h3 class="animal-quiz-q-text">${q.text}</h3>
                <div class="animal-quiz-buttons">
                    <button class="animal-quiz-btn animal-quiz-btn--yes" data-answer="yes">
                        Ja
                    </button>
                    <button class="animal-quiz-btn animal-quiz-btn--no" data-answer="no">
                        Nein
                    </button>
                </div>
            </div>
        `;

        content.querySelector('[data-answer="yes"]').addEventListener('click', () => {
            answers.push(q.yesPath);
            questionIndex++;
            showQuestion();
        });

        content.querySelector('[data-answer="no"]').addEventListener('click', () => {
            answers.push(q.noPath);
            questionIndex++;
            showQuestion();
        });
    }

    function makeGuess() {
        // Try to find best matching guess
        const answerKey = answers.join('-');
        let guess = null;

        // Look for partial matches
        for (const key of Object.keys(GUESSES)) {
            const parts = key.split('-');
            const matches = parts.filter(p => answers.includes(p)).length;
            if (matches >= 2) {
                guess = GUESSES[key];
                break;
            }
        }

        // Fallback guess
        if (!guess) {
            if (answers.includes('can-fly')) {
                guess = GUESSES['not-four-legs-can-fly'];
            } else if (answers.includes('in-water')) {
                guess = GUESSES['not-four-legs-cannot-fly-in-water'];
            } else if (answers.includes('big')) {
                guess = GUESSES['four-legs-big-has-fur'];
            } else {
                guess = GUESSES['four-legs-small-pet-has-fur'];
            }
        }

        content.innerHTML = `
            <div class="animal-quiz-result">
                <div class="animal-quiz-guess-emoji">${guess.emoji}</div>
                <h3>Ich glaube, du denkst an...</h3>
                <p class="animal-quiz-guess-animal">${guess.animal}!</p>
                <div class="animal-quiz-feedback">
                    <button class="animal-quiz-btn animal-quiz-btn--yes" id="correct-guess">
                        Richtig!
                    </button>
                    <button class="animal-quiz-btn animal-quiz-btn--no" id="wrong-guess">
                        Falsch
                    </button>
                </div>
            </div>
        `;

        content.querySelector('#correct-guess').addEventListener('click', () => {
            if (window.kiki) {
                window.kiki.setEmotion('proud');
                window.kiki.speak('Juhu! Ich habs erraten!');
                if (window.kiki.celebrateSuccess) {
                    window.kiki.celebrateSuccess();
                }
            }
            showPlayAgain(true);
        });

        content.querySelector('#wrong-guess').addEventListener('click', () => {
            if (window.kiki) {
                window.kiki.setEmotion('thoughtful');
                window.kiki.speak('Hmm, das naechste Mal schaff ich es!');
            }
            showPlayAgain(false);
        });
    }

    function showPlayAgain(wasCorrect) {
        const resultDiv = content.querySelector('.animal-quiz-result');
        resultDiv.innerHTML += `
            <div class="animal-quiz-again">
                <p>${wasCorrect ? 'Super, das hat Spass gemacht!' : 'An welches Tier hast du gedacht?'}</p>
                <button class="mini-app-again-btn" id="play-again">Nochmal spielen!</button>
            </div>
        `;

        content.querySelector('#play-again').addEventListener('click', () => {
            answers = [];
            questionIndex = 0;
            content.innerHTML = `
                <div class="animal-quiz-start">
                    <p class="animal-quiz-instruction">Denk dir ein neues Tier aus!</p>
                    <button class="mini-app-generate-btn" id="start-again">
                        Ich habe ein Tier!
                    </button>
                </div>
            `;
            content.querySelector('#start-again').addEventListener('click', () => {
                showQuestion();
            });
        });
    }
}

export default { renderAnimalQuiz, initAnimalQuiz };
