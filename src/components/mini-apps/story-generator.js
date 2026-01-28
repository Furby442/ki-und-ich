/**
 * Story Generator Mini-App
 *
 * Generates stories based on character and location selection.
 * Uses predefined story templates to simulate AI generation.
 */

const CHARACTERS = [
    { id: 'hero', name: 'Ein mutiger Held', emoji: '🦸' },
    { id: 'dragon', name: 'Ein freundlicher Drache', emoji: '🐉' },
    { id: 'robot', name: 'Ein kleiner Roboter', emoji: '🤖' },
    { id: 'princess', name: 'Eine kluge Prinzessin', emoji: '👸' },
    { id: 'animal', name: 'Ein sprechendes Tier', emoji: '🐰' }
];

const LOCATIONS = [
    { id: 'forest', name: 'Im magischen Wald', emoji: '🌲' },
    { id: 'space', name: 'Im Weltraum', emoji: '🚀' },
    { id: 'castle', name: 'In einem Schloss', emoji: '🏰' },
    { id: 'underwater', name: 'Unter Wasser', emoji: '🌊' },
    { id: 'city', name: 'In einer grossen Stadt', emoji: '🏙️' }
];

const STORIES = {
    'hero-forest': 'Der mutige Held wanderte durch den magischen Wald. Ploetzlich hoerte er ein Geraeusch! Es war ein kleines Eichhoernchen, das Hilfe brauchte. Der Held half dem Tier, seinen Weg nach Hause zu finden. Am Ende wurden sie beste Freunde!',
    'hero-space': 'Der mutige Held flog mit seinem Raumschiff durch das Weltall. Er entdeckte einen neuen Planeten voller bunter Kristalle! Die Bewohner dort freuten sich sehr ueber seinen Besuch und zeigten ihm ihre fliegenden Autos.',
    'hero-castle': 'Der mutige Held kam zu einem alten Schloss. Drinnen fand er einen Schatz - aber nicht aus Gold! Es waren Buecher voller Geschichten. Der Held las sie alle und wurde der klugste Held im ganzen Land.',
    'hero-underwater': 'Der mutige Held tauchte tief ins Meer. Dort traf er sprechende Fische und eine weise Schildkroete. Sie zeigten ihm eine versunkene Stadt voller Wunder!',
    'hero-city': 'Der mutige Held kam in eine grosse Stadt. Dort half er Menschen, die sich verlaufen hatten. Jeder war so dankbar! Am Ende kannte ihn die ganze Stadt.',

    'dragon-forest': 'Der freundliche Drache lebte im magischen Wald. Er konnte zwar Feuer spucken, aber er nutzte es nur zum Grillen von Marshmallows! Alle Waldtiere liebten seine leckeren Snacks.',
    'dragon-space': 'Der freundliche Drache wollte die Sterne sehen. Also flog er hoch hinaus ins Weltall! Dort freundete er sich mit Aliens an, die noch nie einen Drachen gesehen hatten.',
    'dragon-castle': 'Der freundliche Drache fand ein verlassenes Schloss. Er raeumte es auf und machte daraus ein Hotel fuer muede Reisende. Jeder liebte das warme Feuer des Drachens!',
    'dragon-underwater': 'Der freundliche Drache wollte schwimmen lernen. Die Fische halfen ihm dabei. Jetzt ist er der einzige Drache, der sowohl fliegen als auch tauchen kann!',
    'dragon-city': 'Der freundliche Drache besuchte die Stadt. Zuerst hatten alle Angst, aber dann half er mit seinem Feuer beim Backen. Nun hat die Stadt die besten Brote weit und breit!',

    'robot-forest': 'Der kleine Roboter verirrte sich im magischen Wald. Die Tiere halfen ihm, den Weg zu finden. Dafuer reparierte der Roboter das kaputte Baumhaus der Voegel!',
    'robot-space': 'Der kleine Roboter war fuer den Weltraum gebaut. Er flog zu fernen Planeten und schickte Fotos zur Erde. Alle Kinder schauten sich seine Bilder an!',
    'robot-castle': 'Der kleine Roboter wurde zum Schloss-Helfer. Er putzte, kochte und spielte mit der Koenigsfamilie. Er war der beste Freund der Prinzessin!',
    'robot-underwater': 'Der kleine Roboter war wasserdicht! Er tauchte zum Meeresgrund und entdeckte einen alten Schatz. Er brachte ihn ins Museum, damit alle ihn sehen koennen.',
    'robot-city': 'Der kleine Roboter half in der Stadt. Er regelte den Verkehr, sammelte Muell und spielte mit Kindern. Alle nannten ihn liebevoll Robby!',

    'princess-forest': 'Die kluge Prinzessin erforschte den magischen Wald. Sie fand Pflanzen, die niemand kannte! Sie schrieb ein Buch darueber und wurde beruehmte Wissenschaftlerin.',
    'princess-space': 'Die kluge Prinzessin baute ihr eigenes Raumschiff. Sie flog zum Mond und pflanzte dort Blumen! Jetzt kann man sie nachts mit dem Fernrohr sehen.',
    'princess-castle': 'Die kluge Prinzessin erfand tolle Sachen in ihrem Schloss. Ihre beste Erfindung? Ein Kuchen-Automat, der jeden Tag einen anderen Kuchen backt!',
    'princess-underwater': 'Die kluge Prinzessin lernte von den Meeresbewohnern. Sie erfand einen Anzug zum Atmen unter Wasser. Jetzt besucht sie oft ihre Fisch-Freunde!',
    'princess-city': 'Die kluge Prinzessin baute Schulen in der Stadt. Jedes Kind konnte dort lernen. Sie war die beliebteste Prinzessin im ganzen Koenigreich!',

    'animal-forest': 'Das sprechende Tier kannte jeden Baum im Wald. Es erzaehlte den anderen Tieren Geschichten. Jeden Abend versammelten sich alle, um zuzuhoeren!',
    'animal-space': 'Das sprechende Tier war der erste Hase im Weltraum! Es landete auf einem Karottenplaneten und war uebergluecklich. Dort gab es endlos viel zu essen!',
    'animal-castle': 'Das sprechende Tier wurde Ratgeber im Schloss. Es war so weise, dass sogar der Koenig es um Rat fragte. Alle Probleme wurden geloest!',
    'animal-underwater': 'Das sprechende Tier lernte von den Fischen. Bald konnte es ihre Sprache! Es wurde zum Uebersetzer zwischen Land und Meer.',
    'animal-city': 'Das sprechende Tier wurde Star im Fernsehen. Es moderierte eine Show fuer Kinder. Alle liebten seine lustigen Geschichten!'
};

/**
 * Render the Story Generator
 * @returns {string} HTML string
 */
export function renderStoryGenerator() {
    const charactersHtml = CHARACTERS.map(c => `
        <button class="mini-app-option" data-type="character" data-id="${c.id}">
            <span class="mini-app-option-emoji">${c.emoji}</span>
            <span class="mini-app-option-text">${c.name}</span>
        </button>
    `).join('');

    const locationsHtml = LOCATIONS.map(l => `
        <button class="mini-app-option" data-type="location" data-id="${l.id}">
            <span class="mini-app-option-emoji">${l.emoji}</span>
            <span class="mini-app-option-text">${l.name}</span>
        </button>
    `).join('');

    return `
        <div class="mini-app story-generator">
            <div class="mini-app-header">
                <h2 class="mini-app-title">Geschichten-Generator</h2>
                <p class="mini-app-subtitle">Waehle eine Figur und einen Ort!</p>
            </div>

            <div class="mini-app-section">
                <h3>Wer ist in der Geschichte?</h3>
                <div class="mini-app-options" id="characters">
                    ${charactersHtml}
                </div>
            </div>

            <div class="mini-app-section">
                <h3>Wo spielt die Geschichte?</h3>
                <div class="mini-app-options" id="locations">
                    ${locationsHtml}
                </div>
            </div>

            <button class="mini-app-generate-btn" id="generate-story" disabled>
                Geschichte erstellen!
            </button>

            <div class="mini-app-result" id="story-result"></div>
        </div>
    `;
}

/**
 * Initialize Story Generator interactivity
 * @param {HTMLElement} container - Container element
 */
export function initStoryGenerator(container) {
    let selectedCharacter = null;
    let selectedLocation = null;

    const generateBtn = container.querySelector('#generate-story');
    const resultDiv = container.querySelector('#story-result');

    // Character selection
    container.querySelectorAll('[data-type="character"]').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('[data-type="character"]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedCharacter = btn.dataset.id;
            updateGenerateButton();
        });
    });

    // Location selection
    container.querySelectorAll('[data-type="location"]').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('[data-type="location"]').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedLocation = btn.dataset.id;
            updateGenerateButton();
        });
    });

    function updateGenerateButton() {
        generateBtn.disabled = !(selectedCharacter && selectedLocation);
    }

    // Generate story
    generateBtn.addEventListener('click', () => {
        const storyKey = `${selectedCharacter}-${selectedLocation}`;
        const story = STORIES[storyKey] || 'Es war einmal... eine wunderbare Geschichte!';

        resultDiv.innerHTML = `
            <div class="story-output">
                <h3>Deine Geschichte:</h3>
                <p class="story-text">${story}</p>
                <button class="mini-app-again-btn" id="new-story">Neue Geschichte!</button>
            </div>
        `;

        // Kiki reaction
        if (window.kiki) {
            window.kiki.setEmotion('happy');
            window.kiki.speak('Wow, was fuer eine tolle Geschichte!');
        }

        // New story button
        container.querySelector('#new-story').addEventListener('click', () => {
            resultDiv.innerHTML = '';
            container.querySelectorAll('.mini-app-option').forEach(b => b.classList.remove('selected'));
            selectedCharacter = null;
            selectedLocation = null;
            updateGenerateButton();
        });
    });
}

export default { renderStoryGenerator, initStoryGenerator };
