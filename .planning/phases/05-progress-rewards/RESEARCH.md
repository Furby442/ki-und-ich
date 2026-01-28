# Phase 5: Progress & Rewards - Research

**Researched:** 2026-01-28
**Domain:** Progress tracking, celebration animations, audio feedback, accessible UI
**Confidence:** HIGH

## Summary

This phase adds motivational feedback systems to the "KI & ich" educational app: progress persistence, visual completion indicators, confetti celebrations, and sound effects. The existing codebase already has strong foundations:

- **StateManager** already tracks `completedLessons[]` and `quizScores{}` with LocalStorage persistence
- **Kiki particles system** provides a proven CSS animation pattern for celebrations
- **Home view** already renders completion checkmarks on lesson cards
- **Quiz renderer** already saves scores and marks lessons complete when score >= 3

The main work is enhancing what exists: adding confetti for quiz completion, implementing an audio feedback system with Web Audio API, and creating an accessible mute toggle that persists preference.

**Primary recommendation:** Extend the existing KikiParticles pattern with confetti shapes, add a SoundManager service using Web Audio API with preloaded buffers, and persist the mute preference in StateManager alongside other settings.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS | ES6 modules | Core logic | Project constraint - no frameworks |
| CSS animations | CSS3 | Visual effects | Already used for Kiki, reduces dependencies |
| LocalStorage | Web API | Persistence | Already working via StateManager |

### New for This Phase
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Web Audio API | Native | Sound effects | Browser-native, precise timing, no dependency |
| canvas-confetti | 1.9.4 (CDN) | Celebration effect | 3KB, works via CDN, mature, well-documented |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| canvas-confetti | js-confetti | js-confetti is slightly smaller (3.2KB br) and simpler API, but canvas-confetti has better custom canvas support and `disableForReducedMotion` built-in |
| canvas-confetti | Custom canvas | Custom gives full control but requires 100+ lines of physics code; not worth it for this scope |
| Web Audio API | HTML5 Audio | HTML5 Audio is simpler but lacks precise timing, polyphony, and volume control needed for responsive UI sounds |

**CDN Installation:**
```html
<!-- Add to index.html before closing </body> -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  services/
    state.js         # Existing - add soundEnabled preference
    sound.js         # NEW - SoundManager singleton
  components/
    kiki/
      kiki-particles.js  # Existing - extend with confetti
    settings/
      sound-toggle.js    # NEW - accessible mute button
assets/
  audio/
    correct.mp3      # ~1-2KB each, optimized
    incorrect.mp3
    complete.mp3
    click.mp3
```

### Pattern 1: SoundManager Singleton
**What:** Single AudioContext shared across app, preloaded buffers, mute state from StateManager
**When to use:** Any time you need UI sound feedback
**Example:**
```javascript
// Source: MDN Web Audio API Best Practices
class SoundManager {
    constructor(stateManager) {
        this.state = stateManager;
        this.audioContext = null;
        this.buffers = {};
        this.initialized = false;
    }

    // Must call after user gesture
    async init() {
        if (this.initialized) return;

        this.audioContext = new AudioContext();

        // Resume if suspended (autoplay policy)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Preload all sounds
        await Promise.all([
            this.loadSound('correct', 'assets/audio/correct.mp3'),
            this.loadSound('incorrect', 'assets/audio/incorrect.mp3'),
            this.loadSound('complete', 'assets/audio/complete.mp3'),
            this.loadSound('click', 'assets/audio/click.mp3')
        ]);

        this.initialized = true;
    }

    async loadSound(name, url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.buffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    play(name) {
        // Check mute preference from state
        if (this.state.get('soundEnabled') === false) return;
        if (!this.buffers[name]) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = this.buffers[name];
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    setMuted(muted) {
        this.state.set('soundEnabled', !muted);
    }

    isMuted() {
        return this.state.get('soundEnabled') === false;
    }
}

export const soundManager = new SoundManager(stateManager);
```

### Pattern 2: Confetti Celebration on Quiz Pass
**What:** Trigger canvas-confetti when user passes quiz (score >= 3)
**When to use:** Quiz completion with passing score
**Example:**
```javascript
// Source: canvas-confetti GitHub docs
function celebrateQuizPass() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Burst from center-top
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58CC02', '#1FA3F3', '#8B5CF6', '#F59E0B'],
        disableForReducedMotion: true
    });
}
```

### Pattern 3: Accessible Sound Toggle Button
**What:** Toggle button with aria-pressed that persists mute state
**When to use:** Global sound control in header/settings
**Example:**
```javascript
// Source: W3C ARIA APG Button Pattern
function renderSoundToggle(container, soundManager) {
    const isMuted = soundManager.isMuted();

    container.innerHTML = `
        <button
            type="button"
            class="sound-toggle"
            aria-pressed="${isMuted}"
            aria-label="Ton"
            title="${isMuted ? 'Ton aktivieren' : 'Ton deaktivieren'}"
        >
            <span class="sound-toggle-icon" aria-hidden="true">
                ${isMuted ? '🔇' : '🔊'}
            </span>
            <span class="visually-hidden">
                Ton ${isMuted ? 'aus' : 'an'}
            </span>
        </button>
    `;

    container.querySelector('.sound-toggle').addEventListener('click', (e) => {
        const button = e.currentTarget;
        const nowMuted = button.getAttribute('aria-pressed') !== 'true';

        soundManager.setMuted(nowMuted);
        button.setAttribute('aria-pressed', nowMuted);
        button.setAttribute('title', nowMuted ? 'Ton aktivieren' : 'Ton deaktivieren');
        button.querySelector('.sound-toggle-icon').textContent = nowMuted ? '🔇' : '🔊';
    });
}
```

### Pattern 4: Enhanced Completion Badge CSS
**What:** Animated checkmark badge with scale-in entrance
**When to use:** Lesson cards showing completion status
**Example:**
```css
/* Source: Existing components.css pattern, enhanced */
.lesson-status {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-primary);
    color: white;
    border-radius: var(--radius-full);
    font-size: var(--font-size-lg);

    /* Entrance animation */
    animation: badge-pop 0.4s ease-out;
}

@keyframes badge-pop {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    70% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .lesson-status {
        animation: none;
    }
}
```

### Anti-Patterns to Avoid
- **Multiple AudioContexts:** Creating new AudioContext per sound wastes resources and may hit browser limits. Use ONE singleton.
- **Autoplay without user gesture:** Never call `audioContext.resume()` or play sounds before user interaction. Initialize on first click.
- **Storing volume as string:** LocalStorage stores strings, but always parse numbers explicitly: `parseFloat(state.get('volume')) || 1.0`
- **Emoji in aria-label:** Screen readers read emoji names ("speaker with sound waves"). Use text descriptions instead.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confetti physics | Custom particle simulation | canvas-confetti CDN | Gravity, air resistance, rotation, performance optimization - 100+ lines saved |
| Audio cross-browser | XMLHttpRequest + Web Audio wrapper | Web Audio API directly | Native support in all modern browsers, no polyfill needed |
| Reduced motion detection | Manual preference tracking | `window.matchMedia('(prefers-reduced-motion: reduce)')` | Native API, auto-updates on preference change |
| Toggle button accessibility | Custom keyboard handlers | Native `<button>` + `aria-pressed` | Built-in keyboard support, screen reader announcements |

**Key insight:** The project constraint is vanilla JS, not zero dependencies. Using a 3KB CDN library for confetti is appropriate; hand-rolling physics simulation is not.

## Common Pitfalls

### Pitfall 1: AudioContext Autoplay Block
**What goes wrong:** AudioContext created on page load stays suspended, sounds never play
**Why it happens:** Browsers block automatic audio; context must be created/resumed after user gesture
**How to avoid:** Initialize SoundManager on first user interaction (click anywhere)
**Warning signs:** `audioContext.state === 'suspended'` after creation

```javascript
// Solution: Initialize lazily on first interaction
document.addEventListener('click', () => {
    soundManager.init();
}, { once: true });
```

### Pitfall 2: AudioBufferSourceNode Reuse
**What goes wrong:** Sound plays once, then calling `play()` again throws error
**Why it happens:** AudioBufferSourceNode is single-use; cannot call `start()` twice
**How to avoid:** Create new source node for each playback
**Warning signs:** "Failed to execute 'start' on 'AudioBufferSourceNode'" error

### Pitfall 3: LocalStorage Parse Errors
**What goes wrong:** `JSON.parse(localStorage.getItem('key'))` throws on null or invalid data
**Why it happens:** `getItem()` returns null if key doesn't exist, or user manually edited storage
**How to avoid:** StateManager already handles this with defaults - use it, don't bypass
**Warning signs:** "Unexpected token" JSON parse errors in console

### Pitfall 4: Confetti Canvas Stacking
**What goes wrong:** Multiple confetti bursts create multiple canvas elements
**Why it happens:** Calling `confetti()` repeatedly without cleanup
**How to avoid:** canvas-confetti handles this automatically; don't create manual cleanup logic
**Warning signs:** DOM inspector shows multiple canvas elements

### Pitfall 5: Sound Toggle State Desync
**What goes wrong:** Button shows muted but sounds still play, or vice versa
**Why it happens:** Visual state not synced with actual SoundManager state
**How to avoid:** Single source of truth in StateManager; button reads from state on every render
**Warning signs:** Refreshing page changes toggle state unexpectedly

## Code Examples

Verified patterns from official sources:

### Web Audio API: Load and Play Sound
```javascript
// Source: MDN Web Audio API docs
async function loadAndPlay(url) {
    const audioCtx = new AudioContext();

    // Fetch and decode
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // Play
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);
}
```

### canvas-confetti: Custom Canvas + Options
```javascript
// Source: canvas-confetti GitHub
// Create instance on custom canvas
const myCanvas = document.getElementById('confetti-canvas');
const myConfetti = confetti.create(myCanvas, {
    resize: true,
    useWorker: true
});

// Trigger with options
myConfetti({
    particleCount: 100,
    spread: 160,
    origin: { y: 0.6 },
    colors: ['#58CC02', '#1FA3F3', '#8B5CF6'],
    disableForReducedMotion: true
});
```

### Accessible Toggle Button (Complete)
```html
<!-- Source: W3C ARIA APG -->
<button
    type="button"
    class="sound-toggle"
    aria-pressed="false"
    aria-label="Ton"
>
    <span class="sound-toggle-icon" aria-hidden="true">🔊</span>
</button>

<style>
.sound-toggle {
    min-width: 44px;
    min-height: 44px;
    padding: 8px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.sound-toggle[aria-pressed="true"] {
    background: var(--color-background-alt);
}

.sound-toggle:focus {
    outline: 3px solid rgba(88, 204, 2, 0.4);
    outline-offset: 2px;
}
</style>
```

### StateManager: Add Sound Preference
```javascript
// Extend existing getDefaultState()
getDefaultState() {
    return {
        currentLesson: 0,
        completedLessons: [],
        quizScores: {},
        lastVisited: null,
        soundEnabled: true  // NEW: default to sounds on
    };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HTML5 Audio elements | Web Audio API | 2020+ | Better timing, volume control, polyphony |
| Custom canvas confetti | canvas-confetti/js-confetti | 2022+ | No need to hand-roll physics |
| `role="checkbox"` for toggles | `aria-pressed` on buttons | WAI-ARIA 1.2 | Correct semantics for toggle buttons |
| `onclick` handlers | `addEventListener` | ES6 | Better separation, multiple listeners |

**Deprecated/outdated:**
- ScriptProcessorNode: Replaced by AudioWorklet (not needed for simple playback)
- `volume` property on Audio elements: Use GainNode with Web Audio API for consistent volume control

## Open Questions

Things that couldn't be fully resolved:

1. **Sound file format priority**
   - What we know: MP3 has universal support, OGG is smaller but needs fallback
   - What's unclear: Optimal file size vs quality balance for children's app
   - Recommendation: Use MP3 at 64kbps mono, keep files under 10KB each

2. **Confetti on correct answers vs only quiz completion**
   - What we know: Kiki already shows star particles on correct answers
   - What's unclear: Would full confetti on every correct answer be too much?
   - Recommendation: Keep Kiki particles for correct answers, full confetti only on quiz pass

3. **Sound on page transitions**
   - What we know: Can add whoosh/click sounds on navigation
   - What's unclear: Might feel annoying or add latency
   - Recommendation: Start with just quiz feedback sounds; add navigation sounds only if requested

## Sources

### Primary (HIGH confidence)
- [MDN Web Audio API Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) - AudioContext management, autoplay policies
- [W3C ARIA APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) - Toggle button accessibility
- [canvas-confetti GitHub](https://github.com/catdad/canvas-confetti) - API, configuration, CDN usage
- [js-confetti GitHub](https://github.com/loonywizard/js-confetti) - Alternative library comparison

### Secondary (MEDIUM confidence)
- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - General API reference
- [Pixabay Sound Effects](https://pixabay.com/sound-effects/search/ui/) - Free royalty-free sounds
- [Zapsplat UI Sounds](https://www.zapsplat.com/sound-effect-category/multimedia/) - Free UI sounds with attribution

### Tertiary (LOW confidence)
- Blog posts on confetti implementations - Used for comparison, not authoritative

## Existing Code Analysis

### What Already Works (Don't Rebuild)
1. **StateManager** (`src/services/state.js`):
   - Already has `completedLessons: []` and `quizScores: {}` in default state
   - Already persists to LocalStorage with auto-save on page unload
   - Already validates and merges defaults on load
   - **Action:** Just add `soundEnabled: true` to defaults

2. **Quiz completion tracking** (`src/components/quiz/quiz-renderer.js`):
   - Already saves score in `saveScore()` method
   - Already marks lesson complete when `score >= 3`
   - Already dispatches `quiz-complete` custom event
   - **Action:** Add confetti and sound triggers in `renderResults()`

3. **Lesson completion display** (`src/views/home.js`):
   - Already reads `completedLessons` from state
   - Already renders checkmark badge via `.lesson-status` div
   - **Action:** Enhance CSS animation, no JS changes needed

4. **Kiki celebration** (`src/components/kiki/kiki.js`):
   - Already calls `reactToQuizEnd()` with particles burst
   - Already respects `prefers-reduced-motion`
   - **Action:** Add confetti to complement (not replace) Kiki celebration

### Integration Points
```javascript
// In quiz-renderer.js renderResults():
// After line 201 (this.saveScore())
if (this.score >= 3 && window.confetti) {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true
    });
}
if (window.soundManager) {
    window.soundManager.play(this.score >= 3 ? 'complete' : 'tryagain');
}
```

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using native APIs and well-established CDN library
- Architecture: HIGH - Extends existing patterns from codebase
- Pitfalls: HIGH - Well-documented in MDN and library docs
- Code examples: HIGH - From official documentation

**Research date:** 2026-01-28
**Valid until:** 2026-04-28 (90 days - stable APIs, mature libraries)
