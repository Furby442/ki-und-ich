# Phase 2: Kiki Maskottchen System - Research

**Researched:** 2026-01-28
**Domain:** SVG character animation, CSS animations, accessibility
**Confidence:** HIGH

## Summary

This research covers the implementation of Kiki, a friendly robot mascot character for the KI & ich educational web app. The phase requires SVG-based character design with emotional states, CSS/JavaScript animations, speech bubbles, and particle effects - all built with vanilla JavaScript and CSS for GitHub Pages deployment.

The standard approach is to use **inline SVG** with **CSS keyframe animations** for most effects (idle floating, transitions, emotion changes), reserving JavaScript only for state management and dynamic interactions. This aligns with the existing codebase pattern of ES6 modules with HTML template strings.

**Primary recommendation:** Use a modular SVG component with CSS classes for emotions, CSS keyframe animations for movement, and a simple JavaScript controller for state management - keeping all animation performance-critical operations on the GPU through transform and opacity properties.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Inline SVG | N/A | Character rendering | Scalable, styleable, animatable with CSS |
| CSS Animations | N/A | Movement and transitions | Hardware accelerated, no dependencies |
| CSS Variables | N/A | Theming and state | Dynamic styling without JS overhead |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| requestAnimationFrame | Native | Particle timing | Complex particle systems |
| matchMedia API | Native | Motion preferences | Accessibility detection |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Animations | GSAP | More control, but adds 80KB dependency |
| CSS Animations | SMIL | Native to SVG, but deprecated in Chrome/Edge |
| Inline SVG | img src SVG | Simpler but loses CSS/JS control |
| CSS Particles | tsParticles | More effects, but 50KB+ dependency |

**Installation:**
```bash
# No npm packages required - vanilla CSS/JS approach
# Assets go in existing project structure
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    kiki/
      kiki.js           # Kiki component and state controller
      kiki-avatar.js    # SVG generation with emotion states
      kiki-speech.js    # Speech bubble component
      kiki-particles.js # Particle effects manager
assets/
  styles/
    kiki.css           # All Kiki-related styles and animations
```

### Pattern 1: SVG Component with Emotion States
**What:** SVG structure using CSS classes to switch between emotions
**When to use:** Any SVG character that needs multiple visual states
**Example:**
```html
<!-- Source: https://dev.to/5t3ph/how-to-create-an-animated-svg-face-with-css-5djd -->
<svg class="kiki-avatar" viewBox="0 0 150 200" data-emotion="happy">
  <!-- Body group -->
  <g class="kiki-body">
    <rect class="kiki-torso" x="30" y="60" width="90" height="100" rx="20" />
    <rect class="kiki-head" x="35" y="10" width="80" height="70" rx="15" />
  </g>

  <!-- Eyes - LED display style -->
  <g class="kiki-eyes">
    <rect class="kiki-eye kiki-eye--left" x="50" y="30" width="15" height="20" rx="3" />
    <rect class="kiki-eye kiki-eye--right" x="85" y="30" width="15" height="20" rx="3" />
  </g>

  <!-- Mouth - simple line -->
  <path class="kiki-mouth" d="M55 65 Q75 75 95 65" />

  <!-- Antenna -->
  <g class="kiki-antenna">
    <line x1="75" y1="10" x2="75" y2="-10" />
    <circle cx="75" cy="-15" r="5" />
  </g>

  <!-- Arms -->
  <g class="kiki-arms">
    <path class="kiki-arm kiki-arm--left" d="M30 90 L10 110 L15 120" />
    <path class="kiki-arm kiki-arm--right" d="M120 90 L140 110 L135 120" />
  </g>
</svg>
```

### Pattern 2: CSS Emotion Classes
**What:** CSS classes that transform SVG elements for different emotions
**When to use:** Switching between emotion states
**Example:**
```css
/* Source: DEV Community animated SVG face tutorial */
/* Base transition for smooth emotion changes */
.kiki-avatar * {
  transition: transform 0.8s ease-in-out,
              d 0.8s ease-in-out,
              fill 0.3s ease-in-out;
}

/* Happy emotion */
.kiki-avatar[data-emotion="happy"] .kiki-mouth {
  d: path("M55 60 Q75 80 95 60"); /* Smile curve */
}

.kiki-avatar[data-emotion="happy"] .kiki-eye {
  height: 20px;
  ry: 10px; /* Rounded eyes */
}

/* Sad emotion */
.kiki-avatar[data-emotion="sad"] .kiki-mouth {
  d: path("M55 75 Q75 60 95 75"); /* Frown */
}

.kiki-avatar[data-emotion="sad"] .kiki-antenna line {
  transform: rotate(15deg);
  transform-origin: center bottom;
}

/* Surprised emotion */
.kiki-avatar[data-emotion="surprised"] .kiki-eye {
  height: 28px;
  width: 20px;
}

.kiki-avatar[data-emotion="surprised"] .kiki-mouth {
  d: path("M65 65 Q75 75 85 65 Q75 80 65 65"); /* O shape */
}
```

### Pattern 3: CSS Idle Floating Animation
**What:** Continuous subtle animation for "alive" feeling
**When to use:** Mascot needs to appear animated even when idle
**Example:**
```css
/* Source: GeeksforGeeks CSS Floating Animation, CodePen examples */
@keyframes kiki-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes kiki-antenna-sway {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes kiki-blink {
  0%, 90%, 100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}

.kiki-avatar {
  animation: kiki-float 3s ease-in-out infinite;
}

.kiki-antenna {
  transform-origin: center bottom;
  animation: kiki-antenna-sway 4s ease-in-out infinite;
}

.kiki-eye {
  transform-origin: center center;
  animation: kiki-blink 4s ease-in-out infinite;
}
```

### Pattern 4: Speech Bubble with Clip-Path
**What:** CSS-only speech bubble with positioning variable
**When to use:** Dialogue boxes attached to character
**Example:**
```css
/* Source: Smashing Magazine Modern CSS Tooltips */
.kiki-speech {
  --b: 1.5em;       /* Tail base width */
  --h: 1em;         /* Tail height */
  --p: 20%;         /* Tail position from left */
  --r: 16px;        /* Border radius */

  position: relative;
  background: white;
  border-radius: var(--r);
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* Tail using clip-path */
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--h)),
    calc(var(--p) + var(--b) / 2) calc(100% - var(--h)),
    var(--p) 100%,
    calc(var(--p) - var(--b) / 2) calc(100% - var(--h)),
    0 calc(100% - var(--h))
  );
  padding-bottom: calc(16px + var(--h));
}

/* Word-by-word animation */
.kiki-speech-word {
  opacity: 0;
  animation: word-fade-in 0.3s ease-out forwards;
}

@keyframes word-fade-in {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Pattern 5: Prefers-Reduced-Motion Implementation
**What:** Accessibility-first animation approach
**When to use:** All animation implementations
**Example:**
```css
/* Source: web.dev/articles/prefers-reduced-motion */
/* Reduced motion: disable decorative animations */
@media (prefers-reduced-motion: reduce) {
  .kiki-avatar,
  .kiki-antenna,
  .kiki-eye {
    animation: none;
  }

  .kiki-avatar * {
    transition-duration: 0.01ms !important;
  }

  .kiki-speech-word {
    animation: none;
    opacity: 1;
  }

  /* Keep essential feedback - just make it instant */
  .kiki-avatar[data-emotion] * {
    transition-duration: 0.1s;
  }
}
```

### Anti-Patterns to Avoid
- **Animating layout properties:** Never animate width, height, top, left, margin - use transform instead
- **SMIL animations:** Deprecated in Chrome/Blink, avoid `<animate>` elements inside SVG
- **Too many particles:** Keep to 10-20 particles max to avoid GPU memory issues
- **Blocking animations:** Never block user interaction during animations
- **Forgetting transform-origin:** SVG transforms behave differently than HTML - always set explicit origins

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG path morphing | Custom path interpolation | CSS `d` property transitions | Browser handles interpolation, works in modern browsers |
| Timing functions | Custom easing math | CSS `cubic-bezier()` | Better performance, easier debugging |
| Animation sequencing | setTimeout chains | CSS `animation-delay` | More reliable, cancelable, pausable |
| Reduced motion detection | Manual OS checks | `matchMedia('(prefers-reduced-motion)')` | Cross-platform, live updates |
| Speech bubble shapes | Complex border tricks | `clip-path: polygon()` | Single property, GPU accelerated |

**Key insight:** CSS animations are hardware-accelerated by default when using `transform` and `opacity`. JavaScript animations run on the main thread and can jank. Only use JavaScript for state management and triggering CSS animations.

## Common Pitfalls

### Pitfall 1: SVG viewBox Misunderstanding
**What goes wrong:** SVG appears cropped or scaled incorrectly
**Why it happens:** viewBox defines internal coordinate system, not display size
**How to avoid:** Set viewBox to match content bounds, use CSS for display sizing
**Warning signs:** Parts of SVG cut off, elements positioned unexpectedly

### Pitfall 2: Transform Origin in SVG
**What goes wrong:** Rotations and scales happen from wrong point
**Why it happens:** SVG default transform-origin is 0,0 (not center like HTML)
**How to avoid:** Always set explicit `transform-origin` on animated SVG elements
**Warning signs:** Elements "jumping" when animations start

### Pitfall 3: Animation Performance on Mobile
**What goes wrong:** Janky animations, battery drain
**Why it happens:** Too many animated elements, wrong properties animated
**How to avoid:** Only animate `transform` and `opacity`, limit particle count
**Warning signs:** Dropped frames in DevTools Performance tab

### Pitfall 4: Reduced Motion Ignored
**What goes wrong:** Users with vestibular disorders experience discomfort
**Why it happens:** prefers-reduced-motion not implemented
**How to avoid:** Implement from the start, test with DevTools emulation
**Warning signs:** No `@media (prefers-reduced-motion)` in stylesheet

### Pitfall 5: Speech Bubble Text Overflow
**What goes wrong:** Long text breaks bubble layout
**Why it happens:** Fixed sizes without overflow handling
**How to avoid:** Use max-width, word-wrap, and test with various text lengths
**Warning signs:** Text extending outside bubble bounds

### Pitfall 6: Z-Index Stacking Issues
**What goes wrong:** Kiki appears behind/above wrong elements
**Why it happens:** Fixed positioning creates new stacking context
**How to avoid:** Plan z-index values across app (nav: 1000, kiki: 900, speech: 950)
**Warning signs:** Kiki obscured by content or overlapping navigation

## Code Examples

Verified patterns from research:

### Kiki Component Structure (ES6 Module)
```javascript
// src/components/kiki/kiki.js
// Follows existing codebase pattern (see home.js, lesson.js)

import { KikiAvatar } from './kiki-avatar.js';
import { KikiSpeech } from './kiki-speech.js';
import { KikiParticles } from './kiki-particles.js';

/**
 * Kiki emotions enum
 */
export const EMOTIONS = {
  HAPPY: 'happy',
  THOUGHTFUL: 'thoughtful',
  PROUD: 'proud',
  SAD: 'sad',
  SURPRISED: 'surprised',
  CURIOUS: 'curious'
};

/**
 * Kiki Mascot Controller
 */
export class Kiki {
  constructor(containerId = 'kiki-container') {
    this.container = document.getElementById(containerId);
    this.currentEmotion = EMOTIONS.HAPPY;
    this.speechVisible = false;
    this.particles = new KikiParticles();

    // Check reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Listen for preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', (e) => {
        this.prefersReducedMotion = e.matches;
        this.updateMotionPreference();
      });
  }

  /**
   * Set Kiki's emotional state
   * @param {string} emotion - One of EMOTIONS values
   * @param {object} options - Animation options
   */
  setEmotion(emotion, options = {}) {
    const avatar = this.container.querySelector('.kiki-avatar');
    if (avatar) {
      avatar.dataset.emotion = emotion;
      this.currentEmotion = emotion;

      // Trigger particles for strong positive emotions
      if (!this.prefersReducedMotion && emotion === EMOTIONS.PROUD) {
        this.particles.burst('stars', { count: 8 });
      }
    }
  }

  /**
   * Show speech bubble with text
   * @param {string} text - Message to display
   * @param {object} options - Display options
   */
  speak(text, options = {}) {
    const { duration = 0, wordAnimation = true } = options;
    // Implementation uses KikiSpeech component
  }

  /**
   * React to quiz answer
   * @param {boolean} correct - Whether answer was correct
   */
  reactToAnswer(correct) {
    if (correct) {
      this.setEmotion(EMOTIONS.HAPPY);
      this.speak('Super gemacht!');
    } else {
      this.setEmotion(EMOTIONS.THOUGHTFUL);
      this.speak('Kein Problem, versuch es nochmal!');
    }
  }
}
```

### SVG Avatar Generator
```javascript
// src/components/kiki/kiki-avatar.js

/**
 * Generate Kiki SVG markup
 * @param {object} options - Avatar options
 * @returns {string} SVG HTML string
 */
export function KikiAvatar(options = {}) {
  const {
    size = 150,
    emotion = 'happy',
    ariaLabel = 'Kiki, der freundliche Roboter'
  } = options;

  return `
    <svg
      class="kiki-avatar"
      viewBox="0 0 150 200"
      width="${size}"
      height="${size * 1.33}"
      data-emotion="${emotion}"
      role="img"
      aria-label="${ariaLabel}"
    >
      <!-- Floating effect applied to root group -->
      <g class="kiki-root">

        <!-- Antenna -->
        <g class="kiki-antenna">
          <line x1="75" y1="10" x2="75" y2="-5"
                stroke="var(--kiki-primary)" stroke-width="4"
                stroke-linecap="round"/>
          <circle cx="75" cy="-10" r="6"
                  fill="var(--kiki-accent)"/>
        </g>

        <!-- Head -->
        <rect class="kiki-head"
              x="35" y="10" width="80" height="65" rx="12"
              fill="var(--kiki-primary)"/>

        <!-- LED Eyes -->
        <g class="kiki-eyes">
          <rect class="kiki-eye kiki-eye--left"
                x="48" y="30" width="18" height="22" rx="4"
                fill="var(--kiki-screen)"/>
          <rect class="kiki-eye kiki-eye--right"
                x="84" y="30" width="18" height="22" rx="4"
                fill="var(--kiki-screen)"/>
        </g>

        <!-- Mouth -->
        <path class="kiki-mouth"
              d="M55 62 Q75 72 95 62"
              stroke="var(--kiki-screen)"
              stroke-width="4"
              stroke-linecap="round"
              fill="none"/>

        <!-- Body -->
        <rect class="kiki-body"
              x="40" y="80" width="70" height="90" rx="15"
              fill="var(--kiki-primary)"/>

        <!-- Body screen/panel -->
        <rect x="50" y="95" width="50" height="40" rx="5"
              fill="var(--kiki-screen-dim)"/>

        <!-- Arms -->
        <g class="kiki-arms">
          <g class="kiki-arm kiki-arm--left">
            <rect x="20" y="90" width="18" height="35" rx="8"
                  fill="var(--kiki-secondary)"/>
            <circle cx="28" cy="130" r="10"
                    fill="var(--kiki-secondary)"/>
          </g>
          <g class="kiki-arm kiki-arm--right">
            <rect x="112" y="90" width="18" height="35" rx="8"
                  fill="var(--kiki-secondary)"/>
            <circle cx="122" cy="130" r="10"
                    fill="var(--kiki-secondary)"/>
          </g>
        </g>

      </g>
    </svg>
  `;
}
```

### Complete CSS Animation File
```css
/* assets/styles/kiki.css */

/* ========================================
   KIKI MASCOT - CSS Variables & Animations
   ======================================== */

:root {
  /* Kiki color palette - purple/violet theme */
  --kiki-primary: #8B5CF6;       /* Main purple */
  --kiki-secondary: #A78BFA;     /* Lighter purple */
  --kiki-accent: #F59E0B;        /* Orange glow */
  --kiki-screen: #22D3EE;        /* Cyan LED */
  --kiki-screen-dim: #155E75;    /* Dimmed screen */

  /* Animation timing */
  --kiki-timing-slow: 0.8s;
  --kiki-timing-normal: 0.4s;
  --kiki-timing-fast: 0.2s;
  --kiki-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========================================
   BASE STYLES
   ======================================== */

.kiki-container {
  position: fixed;
  bottom: 80px;  /* Above nav bar */
  left: 16px;
  z-index: 900;
  pointer-events: none;
}

.kiki-avatar {
  pointer-events: auto;
  cursor: pointer;
}

/* Smooth transitions for all emotion changes */
.kiki-avatar * {
  transition:
    transform var(--kiki-timing-slow) var(--kiki-easing),
    d var(--kiki-timing-slow) var(--kiki-easing),
    fill var(--kiki-timing-normal) var(--kiki-easing);
}

/* ========================================
   IDLE ANIMATIONS
   ======================================== */

@keyframes kiki-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes kiki-antenna-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes kiki-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes kiki-glow {
  0%, 100% { filter: drop-shadow(0 0 2px var(--kiki-accent)); }
  50% { filter: drop-shadow(0 0 8px var(--kiki-accent)); }
}

.kiki-root {
  animation: kiki-float 3s ease-in-out infinite;
}

.kiki-antenna {
  transform-origin: 75px 10px;
  animation: kiki-antenna-sway 4s ease-in-out infinite;
}

.kiki-eye {
  transform-origin: center center;
  animation: kiki-blink 4s ease-in-out infinite;
}

.kiki-antenna circle {
  animation: kiki-glow 2s ease-in-out infinite;
}

/* ========================================
   EMOTION STATES
   ======================================== */

/* Happy - default, smile */
.kiki-avatar[data-emotion="happy"] .kiki-mouth {
  d: path("M55 62 Q75 75 95 62");
}

/* Thoughtful - raised eyebrow effect, slight frown */
.kiki-avatar[data-emotion="thoughtful"] .kiki-eye--left {
  transform: translateY(-3px);
}
.kiki-avatar[data-emotion="thoughtful"] .kiki-mouth {
  d: path("M60 65 Q75 62 90 65");
}
.kiki-avatar[data-emotion="thoughtful"] .kiki-antenna {
  animation: none;
  transform: rotate(15deg);
}

/* Proud - big smile, puffed up */
.kiki-avatar[data-emotion="proud"] .kiki-mouth {
  d: path("M50 58 Q75 80 100 58");
}
.kiki-avatar[data-emotion="proud"] .kiki-eye {
  transform: scaleY(0.7);
}
.kiki-avatar[data-emotion="proud"] .kiki-body {
  transform: scale(1.05);
  transform-origin: center bottom;
}

/* Sad - droopy, frown */
.kiki-avatar[data-emotion="sad"] .kiki-mouth {
  d: path("M55 72 Q75 60 95 72");
}
.kiki-avatar[data-emotion="sad"] .kiki-antenna {
  animation: none;
  transform: rotate(30deg);
}
.kiki-avatar[data-emotion="sad"] .kiki-eye {
  transform: translateY(3px) scaleY(0.8);
}

/* Surprised - wide eyes, O mouth */
.kiki-avatar[data-emotion="surprised"] .kiki-eye {
  transform: scale(1.3);
  animation: none;
}
.kiki-avatar[data-emotion="surprised"] .kiki-mouth {
  d: path("M65 62 Q67 72 75 72 Q83 72 85 62 Q83 52 75 52 Q67 52 65 62");
}
.kiki-avatar[data-emotion="surprised"] .kiki-antenna {
  transform: rotate(0);
  animation: none;
}
.kiki-avatar[data-emotion="surprised"] .kiki-antenna circle {
  animation: kiki-glow 0.3s ease-in-out infinite;
}

/* Curious - head tilt, one eye bigger */
.kiki-avatar[data-emotion="curious"] .kiki-head {
  transform: rotate(-5deg);
  transform-origin: center bottom;
}
.kiki-avatar[data-emotion="curious"] .kiki-eye--right {
  transform: scale(1.2);
}
.kiki-avatar[data-emotion="curious"] .kiki-mouth {
  d: path("M58 65 Q75 68 92 62");
}

/* ========================================
   SPEECH BUBBLE
   ======================================== */

.kiki-speech {
  --speech-tail-width: 1.2em;
  --speech-tail-height: 0.8em;
  --speech-tail-position: 15%;

  position: fixed;
  bottom: 220px;
  left: 100px;
  max-width: 280px;
  min-width: 120px;

  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  padding-bottom: calc(12px + var(--speech-tail-height));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--speech-tail-height)),
    calc(var(--speech-tail-position) + var(--speech-tail-width)) calc(100% - var(--speech-tail-height)),
    calc(var(--speech-tail-position) + var(--speech-tail-width) / 2) 100%,
    var(--speech-tail-position) calc(100% - var(--speech-tail-height)),
    0 calc(100% - var(--speech-tail-height))
  );

  font-size: var(--font-size-base);
  color: var(--color-text);
  z-index: 950;

  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.kiki-speech--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Word-by-word animation */
.kiki-speech-word {
  display: inline-block;
  opacity: 0;
  animation: word-appear 0.3s ease-out forwards;
}

@keyframes word-appear {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================================
   PARTICLE EFFECTS
   ======================================== */

.kiki-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.kiki-particle {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.kiki-particle--star {
  width: 12px;
  height: 12px;
  background: var(--kiki-accent);
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%,
    79% 91%, 50% 70%, 21% 91%, 32% 57%,
    2% 35%, 39% 35%
  );
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(0.5);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) scale(1);
  }
}

.kiki-particle--animating {
  animation: particle-burst 0.8s ease-out forwards;
}

/* ========================================
   QUIZ REACTIONS
   ======================================== */

@keyframes thumbs-up {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg) translateY(-5px); }
  75% { transform: rotate(15deg) translateY(-5px); }
}

.kiki-avatar[data-reaction="correct"] .kiki-arm--right {
  animation: thumbs-up 0.6s ease-in-out;
  transform-origin: 122px 90px;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25%, 75% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

.kiki-avatar[data-reaction="encourage"] .kiki-arm--right {
  animation: wave 0.8s ease-in-out 2;
  transform-origin: 122px 90px;
}

/* ========================================
   ACCESSIBILITY - REDUCED MOTION
   ======================================== */

@media (prefers-reduced-motion: reduce) {
  /* Disable all decorative animations */
  .kiki-root,
  .kiki-antenna,
  .kiki-eye,
  .kiki-antenna circle,
  .kiki-arm--right,
  .kiki-arm--left {
    animation: none !important;
  }

  /* Keep state transitions but make them instant */
  .kiki-avatar * {
    transition-duration: 0.1s !important;
  }

  /* Disable speech word animation */
  .kiki-speech-word {
    animation: none;
    opacity: 1;
  }

  /* Disable particles */
  .kiki-particle {
    display: none;
  }

  /* Keep speech bubble fade but faster */
  .kiki-speech {
    transition-duration: 0.1s;
  }
}

/* ========================================
   RESPONSIVE ADJUSTMENTS
   ======================================== */

@media (max-width: 599px) {
  .kiki-container {
    bottom: 70px;
    left: 8px;
  }

  .kiki-avatar {
    width: 100px;
    height: 133px;
  }

  .kiki-speech {
    left: 80px;
    bottom: 180px;
    max-width: 220px;
    font-size: var(--font-size-sm);
  }
}
```

### Particles Manager (Lightweight)
```javascript
// src/components/kiki/kiki-particles.js

/**
 * Lightweight particle effects manager
 * Uses CSS animations, no external library
 */
export class KikiParticles {
  constructor(containerId = 'kiki-particles') {
    this.container = document.getElementById(containerId);
    this.particleCount = 8;
  }

  /**
   * Trigger particle burst effect
   * @param {string} type - 'stars' | 'sparkles'
   * @param {object} options - Burst options
   */
  burst(type = 'stars', options = {}) {
    const { count = this.particleCount, origin = { x: 75, y: 40 } } = options;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    for (let i = 0; i < count; i++) {
      this.createParticle(type, origin, i, count);
    }
  }

  createParticle(type, origin, index, total) {
    const particle = document.createElement('div');
    particle.className = `kiki-particle kiki-particle--${type}`;

    // Calculate burst direction (spread around circle)
    const angle = (index / total) * Math.PI * 2;
    const distance = 40 + Math.random() * 30;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 20; // Bias upward

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.left = `${origin.x}px`;
    particle.style.top = `${origin.y}px`;

    this.container.appendChild(particle);

    // Trigger animation
    requestAnimationFrame(() => {
      particle.classList.add('kiki-particle--animating');
    });

    // Clean up after animation
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SMIL `<animate>` | CSS animations | 2015+ | SMIL deprecated in Chrome |
| JavaScript-driven animations | CSS transforms | 2018+ | Better performance, less jank |
| GIF mascots | Inline SVG | 2019+ | Smaller files, scalable, styleable |
| Fixed emotion images | CSS state classes | 2020+ | Single asset, multiple states |
| JS particle libraries | CSS clip-path particles | 2023+ | Lighter weight, GPU accelerated |

**Deprecated/outdated:**
- SMIL: Chrome intended deprecation, use CSS animations instead
- jQuery animations: Use CSS or Web Animations API
- Canvas-based mascots: SVG more flexible for character work
- Image sprites for emotions: Single SVG with CSS classes preferred

## Open Questions

Things that couldn't be fully resolved:

1. **SVG `d` Property Transitions**
   - What we know: Modern browsers support animating path `d` attribute via CSS
   - What's unclear: Exact browser support matrix (Safari may have quirks)
   - Recommendation: Test in Safari, have fallback of swap-on-class-change

2. **Optimal Particle Count for Mobile**
   - What we know: Too many particles cause performance issues
   - What's unclear: Exact threshold varies by device
   - Recommendation: Start with 8, test on low-end devices, reduce if needed

3. **Speech Bubble Positioning on Small Screens**
   - What we know: Fixed positioning works, but may overlap content
   - What's unclear: Best UX pattern when content area is limited
   - Recommendation: Consider moving to inline/relative position on mobile

## Sources

### Primary (HIGH confidence)
- Smashing Magazine: Modern CSS Tooltips Speech Bubbles - clip-path techniques, CSS variables
- DEV Community: Animated SVG Face with CSS - emotion states, transform patterns
- web.dev: prefers-reduced-motion - accessibility implementation patterns
- MDN: @keyframes, CSS animations, matchMedia API

### Secondary (MEDIUM confidence)
- GeeksforGeeks: CSS Floating Animation - basic floating patterns
- CSS-Tricks: SVG Animation comparison - CSS vs SMIL vs JavaScript
- Chrome Developers: Hardware-accelerated animations - performance optimization

### Tertiary (LOW confidence)
- CodePen examples - creative inspiration, not production patterns
- Various blog posts - ecosystem trends, may be outdated

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - vanilla CSS/JS well documented
- Architecture: HIGH - follows existing codebase patterns
- Animation techniques: HIGH - verified with official sources
- Particle effects: MEDIUM - custom implementation, needs testing
- Browser compatibility: MEDIUM - path `d` animation needs Safari testing

**Research date:** 2026-01-28
**Valid until:** 60 days (stable CSS animation patterns)
