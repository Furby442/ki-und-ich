/**
 * Name Meaning Mini-App
 *
 * Provides fun "AI-generated" meanings for names.
 * Uses creative templates to simulate AI explanation.
 */

const NAME_MEANINGS = {
    // Common German names with fun meanings
    'anna': { meaning: 'Die Anmutige', origin: 'Hebraeisch', trait: 'freundlich und hilfsbereit' },
    'emma': { meaning: 'Die Grosse', origin: 'Germanisch', trait: 'stark und mutig' },
    'mia': { meaning: 'Die Geliebte', origin: 'Skandinavisch', trait: 'liebevoll und kreativ' },
    'leon': { meaning: 'Der Loewe', origin: 'Griechisch', trait: 'mutig und stark' },
    'finn': { meaning: 'Der Helle', origin: 'Irisch', trait: 'klug und abenteuerlustig' },
    'paul': { meaning: 'Der Kleine', origin: 'Lateinisch', trait: 'freundlich und lustig' },
    'marie': { meaning: 'Die Widerspenstige', origin: 'Hebraeisch', trait: 'kreativ und einfallsreich' },
    'sophie': { meaning: 'Die Weise', origin: 'Griechisch', trait: 'klug und nachdenklich' },
    'max': { meaning: 'Der Groesste', origin: 'Lateinisch', trait: 'sportlich und energiegeladen' },
    'lena': { meaning: 'Die Strahlende', origin: 'Griechisch', trait: 'froehlich und optimistisch' },
    'tim': { meaning: 'Der Ehrende', origin: 'Griechisch', trait: 'ehrlich und treu' },
    'lisa': { meaning: 'Die Gott Geweihte', origin: 'Hebraeisch', trait: 'hilfsbereit und freundlich' },
    'lukas': { meaning: 'Der Lichtbringer', origin: 'Griechisch', trait: 'hell und aufgeweckt' },
    'hannah': { meaning: 'Die Begnadete', origin: 'Hebraeisch', trait: 'talentiert und kreativ' },
    'ben': { meaning: 'Der Sohn', origin: 'Hebraeisch', trait: 'loyal und zuverlaessig' },
    'julia': { meaning: 'Die Jugendliche', origin: 'Lateinisch', trait: 'lebhaft und energisch' },
    'felix': { meaning: 'Der Glueckliche', origin: 'Lateinisch', trait: 'froehlich und optimistisch' },
    'laura': { meaning: 'Der Lorbeer', origin: 'Lateinisch', trait: 'siegreich und erfolgreich' },
    'noah': { meaning: 'Der Ruhebringer', origin: 'Hebraeisch', trait: 'ruhig und ausgeglichen' },
    'lara': { meaning: 'Die Schuetzende', origin: 'Lateinisch', trait: 'fuersorglich und stark' }
};

const GENERIC_ORIGINS = ['Lateinisch', 'Griechisch', 'Germanisch', 'Hebraeisch', 'Keltisch'];
const GENERIC_TRAITS = [
    'kreativ und einfallsreich',
    'freundlich und hilfsbereit',
    'mutig und abenteuerlustig',
    'klug und neugierig',
    'froehlich und optimistisch',
    'loyal und zuverlaessig'
];

/**
 * Generate a meaning for any name
 */
function getMeaning(name) {
    const lowerName = name.toLowerCase().trim();

    if (NAME_MEANINGS[lowerName]) {
        return NAME_MEANINGS[lowerName];
    }

    // Generate creative meaning for unknown names
    const firstLetter = name.charAt(0).toUpperCase();
    const meanings = [
        `Der/Die ${firstLetter}-Strahlende`,
        `Der/Die mit ${firstLetter} beginnende Held(in)`,
        `Der/Die ${firstLetter}-Kluge`,
        `Der/Die ${firstLetter}-Mutige`
    ];

    return {
        meaning: meanings[Math.floor(Math.random() * meanings.length)],
        origin: GENERIC_ORIGINS[Math.floor(Math.random() * GENERIC_ORIGINS.length)],
        trait: GENERIC_TRAITS[Math.floor(Math.random() * GENERIC_TRAITS.length)]
    };
}

/**
 * Render the Name Meaning app
 * @returns {string} HTML string
 */
export function renderNameMeaning() {
    return `
        <div class="mini-app name-meaning">
            <div class="mini-app-header">
                <h2 class="mini-app-title">Namens-Bedeutung</h2>
                <p class="mini-app-subtitle">Finde heraus, was dein Name bedeutet!</p>
            </div>

            <div class="name-meaning-content">
                <div class="name-input-container">
                    <label for="name-input" class="name-input-label">Dein Name:</label>
                    <input
                        type="text"
                        id="name-input"
                        class="name-input"
                        placeholder="Schreib deinen Namen..."
                        maxlength="20"
                        autocomplete="off"
                    >
                </div>

                <button class="mini-app-generate-btn" id="find-meaning" disabled>
                    Bedeutung finden!
                </button>

                <div class="name-result" id="name-result"></div>
            </div>
        </div>
    `;
}

/**
 * Initialize Name Meaning interactivity
 * @param {HTMLElement} container - Container element
 */
export function initNameMeaning(container) {
    const input = container.querySelector('#name-input');
    const findBtn = container.querySelector('#find-meaning');
    const resultDiv = container.querySelector('#name-result');

    input.addEventListener('input', () => {
        findBtn.disabled = input.value.trim().length < 2;
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !findBtn.disabled) {
            findBtn.click();
        }
    });

    findBtn.addEventListener('click', () => {
        const name = input.value.trim();
        if (name.length < 2) return;

        // Show loading briefly for "AI magic" effect
        resultDiv.innerHTML = `
            <div class="name-loading">
                <span class="loading-dots">KI denkt nach...</span>
            </div>
        `;

        setTimeout(() => {
            const meaning = getMeaning(name);

            resultDiv.innerHTML = `
                <div class="name-result-card">
                    <h3 class="name-result-name">${name}</h3>
                    <div class="name-result-item">
                        <span class="name-result-label">Bedeutung:</span>
                        <span class="name-result-value">${meaning.meaning}</span>
                    </div>
                    <div class="name-result-item">
                        <span class="name-result-label">Herkunft:</span>
                        <span class="name-result-value">${meaning.origin}</span>
                    </div>
                    <div class="name-result-item">
                        <span class="name-result-label">Typisch:</span>
                        <span class="name-result-value">${meaning.trait}</span>
                    </div>
                    <button class="mini-app-again-btn" id="try-another">
                        Anderen Namen probieren
                    </button>
                </div>
            `;

            if (window.kiki) {
                window.kiki.setEmotion('happy');
                window.kiki.speak(`${name} - was fuer ein schoener Name!`);
            }

            container.querySelector('#try-another').addEventListener('click', () => {
                input.value = '';
                input.focus();
                findBtn.disabled = true;
                resultDiv.innerHTML = '';
            });
        }, 800);
    });
}

export default { renderNameMeaning, initNameMeaning };
