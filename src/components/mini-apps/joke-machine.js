/**
 * Joke Machine Mini-App
 *
 * Displays child-friendly jokes one at a time.
 */

const JOKES = [
    { setup: 'Warum ist die Banane krumm?', punchline: 'Weil niemand in den Urwald gefahren ist und sie gerade gebogen hat!' },
    { setup: 'Was macht ein Pirat am Computer?', punchline: 'Er drueckt die Enter-Taste!' },
    { setup: 'Warum koennen Geister so schlecht luegen?', punchline: 'Weil man durch sie hindurchsehen kann!' },
    { setup: 'Was ist orange und geht ueber die Berge?', punchline: 'Eine Wanderine!' },
    { setup: 'Warum sind Fische so schlau?', punchline: 'Weil sie in Schulen schwimmen!' },
    { setup: 'Was sagt ein grosser Stift zum kleinen Stift?', punchline: 'Wachs-mal-Stift!' },
    { setup: 'Warum trinken Roboter keinen Alkohol?', punchline: 'Weil sie sonst Schrauben locker haben!' },
    { setup: 'Was ist gruen und klopft an die Tuer?', punchline: 'Ein Klopfsalat!' },
    { setup: 'Treffen sich zwei Magneten. Was sagen sie?', punchline: 'Ich finde dich echt anziehend!' },
    { setup: 'Warum ist der Besen so muede?', punchline: 'Er war die ganze Nacht am Fegen!' },
    { setup: 'Was macht ein Clown im Buero?', punchline: 'Faxen!' },
    { setup: 'Warum koennen Baecker nicht Fussball spielen?', punchline: 'Weil sie immer den Teig kneten statt zu kicken!' },
    { setup: 'Was sagt der grosse Chimney zum kleinen Chimney?', punchline: 'Du bist noch zu jung zum Rauchen!' },
    { setup: 'Warum hat der Taucher schlechte Noten?', punchline: 'Er ist immer abgetaucht!' },
    { setup: 'Was macht ein Mathematiker im Garten?', punchline: 'Wurzeln ziehen!' }
];

let usedJokes = [];

/**
 * Get a random joke that hasn't been used recently
 */
function getRandomJoke() {
    if (usedJokes.length >= JOKES.length - 2) {
        usedJokes = [];
    }

    let available = JOKES.filter((_, i) => !usedJokes.includes(i));
    let randomIndex = Math.floor(Math.random() * available.length);
    let jokeIndex = JOKES.indexOf(available[randomIndex]);
    usedJokes.push(jokeIndex);

    return JOKES[jokeIndex];
}

/**
 * Render the Joke Machine
 * @returns {string} HTML string
 */
export function renderJokeMachine() {
    return `
        <div class="mini-app joke-machine">
            <div class="mini-app-header">
                <h2 class="mini-app-title">Witz-Maschine</h2>
                <p class="mini-app-subtitle">Drueck den Knopf fuer einen Witz!</p>
            </div>

            <div class="joke-machine-content" id="joke-content">
                <div class="joke-machine-button-container">
                    <button class="joke-machine-btn" id="tell-joke">
                        <span class="joke-btn-emoji">🎭</span>
                        <span class="joke-btn-text">Witz erzaehlen!</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize Joke Machine interactivity
 * @param {HTMLElement} container - Container element
 */
export function initJokeMachine(container) {
    const content = container.querySelector('#joke-content');
    const jokeBtn = container.querySelector('#tell-joke');

    jokeBtn.addEventListener('click', () => {
        const joke = getRandomJoke();

        content.innerHTML = `
            <div class="joke-display">
                <div class="joke-setup">${joke.setup}</div>
                <button class="joke-reveal-btn" id="reveal-punchline">
                    🥁 Aufloesung zeigen!
                </button>
            </div>
        `;

        if (window.kiki) {
            window.kiki.setEmotion('curious');
        }

        content.querySelector('#reveal-punchline').addEventListener('click', () => {
            content.innerHTML = `
                <div class="joke-display">
                    <div class="joke-setup">${joke.setup}</div>
                    <div class="joke-punchline">${joke.punchline}</div>
                    <button class="mini-app-again-btn" id="another-joke">
                        Noch ein Witz!
                    </button>
                </div>
            `;

            if (window.kiki) {
                window.kiki.setEmotion('happy');
                window.kiki.speak('Haha! War der gut?');
            }

            content.querySelector('#another-joke').addEventListener('click', () => {
                const newJoke = getRandomJoke();
                showJoke(newJoke);
            });
        });
    });

    function showJoke(joke) {
        content.innerHTML = `
            <div class="joke-display">
                <div class="joke-setup">${joke.setup}</div>
                <button class="joke-reveal-btn" id="reveal-punchline">
                    🥁 Aufloesung zeigen!
                </button>
            </div>
        `;

        if (window.kiki) {
            window.kiki.setEmotion('curious');
        }

        content.querySelector('#reveal-punchline').addEventListener('click', () => {
            content.innerHTML = `
                <div class="joke-display">
                    <div class="joke-setup">${joke.setup}</div>
                    <div class="joke-punchline">${joke.punchline}</div>
                    <button class="mini-app-again-btn" id="another-joke">
                        Noch ein Witz!
                    </button>
                </div>
            `;

            if (window.kiki) {
                window.kiki.setEmotion('happy');
            }

            content.querySelector('#another-joke').addEventListener('click', () => {
                const newJoke = getRandomJoke();
                showJoke(newJoke);
            });
        });
    }
}

export default { renderJokeMachine, initJokeMachine };
