# Phase 1: Foundation & Setup - Research

**Researched:** 2026-01-28
**Domain:** Vanilla JavaScript SPA, Mobile-Responsive Web Design, Static Site Hosting
**Confidence:** HIGH

## Summary

This phase establishes a production-ready vanilla JavaScript educational web app for children learning English. The research focused on five critical domains: SPA architecture without frameworks, mobile-responsive design with accessibility, GitHub Pages deployment, LocalStorage state management, and child-friendly UI patterns.

The standard approach is a simple hash-based SPA with mobile-first responsive design, deployed to GitHub Pages as a static site. LocalStorage provides GDPR-compliant progress tracking without collecting personal data. The architecture follows a clear separation: Views (pages) → Components (reusable UI) → Services (business logic) → Data Layer (JSON + LocalStorage).

**Primary recommendation:** Build a mobile-first, hash-routed SPA with 48x48px touch targets, clear navigation patterns, and modular file organization. Deploy via GitHub Pages branch publishing (not Actions). Avoid hand-rolling routing logic or responsive patterns—use proven vanilla JS patterns documented below.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JavaScript | ES6+ | Application logic, DOM manipulation | No build step required, native browser support, zero dependencies |
| CSS3 (Grid + Flexbox) | Current | Responsive layouts | Universal browser support (97%+), no framework needed |
| HTML5 | Current | Semantic markup | Native form validation, accessibility features, SEO-friendly |
| JSON | Native | Data storage for lessons/quizzes | Simple, readable, no parsing library needed |
| LocalStorage API | Native | Progress tracking | Synchronous, simple key-value store, GDPR-compliant for non-personal data |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| SVG (inline) | Current | Kiki mascot illustrations | Scalable, animatable, no external image requests |
| Web Storage API | Native | Session and local persistence | For non-sensitive app state (theme, progress) |
| Hash Router (custom) | N/A | Client-side navigation | Simple SPAs without SEO requirements |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hash routing | History API (pushState) | Cleaner URLs, better SEO, but requires server configuration—not suitable for GitHub Pages static hosting |
| LocalStorage | IndexedDB | Better for large datasets (>5MB), but overkill for simple progress tracking and adds complexity |
| Vanilla JS | React/Vue/Svelte | Faster development with components, but adds build step, dependencies, and complexity—violates TECH-01 requirement |

**Installation:**
```bash
# No installation required - vanilla stack uses native browser APIs
# Only development tools needed:
npm install -g live-server  # Optional: local development server
```

## Architecture Patterns

### Recommended Project Structure
```
root/
├── index.html              # Entry point, SPA shell
├── .nojekyll              # GitHub Pages: disable Jekyll processing
├── assets/
│   ├── styles/
│   │   ├── main.css       # Global styles, CSS variables
│   │   ├── layout.css     # Grid/Flexbox layouts
│   │   └── components.css # Component-specific styles
│   ├── images/            # Static images (Kiki mascot, icons)
│   └── fonts/             # Custom fonts (if needed)
├── src/
│   ├── views/             # Page-level components (Home, Lesson, Quiz)
│   │   ├── home.js
│   │   ├── lesson.js
│   │   └── quiz.js
│   ├── components/        # Reusable UI (Button, ProgressBar, Navigation)
│   │   ├── button.js
│   │   ├── progress-bar.js
│   │   └── navigation.js
│   ├── services/          # Business logic (Router, StateManager, DataLoader)
│   │   ├── router.js
│   │   ├── state.js
│   │   └── data.js
│   └── app.js             # Application entry point, initialization
└── data/
    ├── lessons.json       # Lesson content
    └── quizzes.json       # Quiz questions
```

### Pattern 1: Hash-Based Routing
**What:** Client-side navigation using URL fragments (`#/home`, `#/lesson/1`)
**When to use:** Static hosting without server-side routing configuration (GitHub Pages)

**Example:**
```javascript
// Source: MDN - Hash Routing + Vanilla SPA patterns from WebSearch
class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash] || this.routes['/404'];

    // Clear current view
    const app = document.getElementById('app');
    app.innerHTML = '';

    // Render new view
    route.render(app);
  }

  navigate(path) {
    window.location.hash = path;
  }
}

// Usage
const router = new Router({
  '/': { render: (el) => el.innerHTML = HomeView() },
  '/lesson/:id': { render: (el) => el.innerHTML = LessonView() },
  '/404': { render: (el) => el.innerHTML = NotFoundView() }
});
```

### Pattern 2: Mobile-First Responsive Layout
**What:** Start with mobile styles, progressively enhance for larger screens
**When to use:** All responsive web apps (industry standard 2026)

**Example:**
```css
/* Source: MDN - Responsive Design + 2026 Best Practices */

/* Mobile-first: Base styles for narrow screens */
.container {
  display: block;
  padding: 1rem;
}

.lesson-grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column on mobile */
  gap: 1rem;
}

/* Tablet: 600px and up */
@media screen and (width >= 600px) {
  .lesson-grid {
    grid-template-columns: repeat(2, 1fr); /* Two columns */
  }
}

/* Desktop: 1200px and up */
@media screen and (width >= 1200px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .lesson-grid {
    grid-template-columns: repeat(3, 1fr); /* Three columns */
  }
}
```

### Pattern 3: LocalStorage State Management
**What:** Persist user progress without backend using browser storage
**When to use:** Non-sensitive data, small datasets (<5MB), GDPR-compliant scenarios

**Example:**
```javascript
// Source: WebSearch - LocalStorage Best Practices 2026
class StateManager {
  constructor(storageKey = 'app-state') {
    this.storageKey = storageKey;
    this.state = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : this.getDefaultState();
    } catch (error) {
      console.error('Failed to load state:', error);
      return this.getDefaultState();
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  getDefaultState() {
    return {
      currentLesson: 0,
      completedLessons: [],
      quizScores: {}
    };
  }

  // Auto-save before page unload
  enableAutoSave() {
    window.addEventListener('beforeunload', () => this.save());
  }
}
```

### Pattern 4: Touch-Friendly Component Design
**What:** Ensure all interactive elements meet 48x48px minimum touch target size
**When to use:** All mobile-responsive apps (WCAG 2.1 Level AA requirement)

**Example:**
```css
/* Source: WebSearch - Responsive Design Touch Targets 2026 */

/* Minimum touch target size: 48x48px (Google) / 44x44px (Apple) */
.btn,
.nav-item,
.interactive-element {
  min-width: 48px;
  min-height: 48px;

  /* Add padding for visual comfort while maintaining touch area */
  padding: 12px 20px;

  /* Spacing between touch targets (prevent accidental taps) */
  margin: 8px;

  /* Visual feedback on interaction */
  transition: background-color 0.2s ease;
}

.btn:active {
  background-color: var(--color-primary-dark);
  transform: scale(0.98); /* Subtle press feedback */
}
```

### Anti-Patterns to Avoid

- **Global State Without Structure:** Don't scatter `localStorage.setItem()` calls throughout the codebase. Centralize state management in a single service.
- **Inline Styles:** Avoid `style="..."` attributes. Use CSS classes for maintainability and reusability.
- **Tightly Coupled Views:** Don't access the router directly from components. Use event dispatching or dependency injection.
- **Ignoring Hash Change Edge Cases:** Always handle initial page load (`DOMContentLoaded`) in addition to `hashchange` events.
- **Fixed Breakpoints for Devices:** Don't target specific devices (e.g., "iPhone 12"). Use content-based breakpoints where layout breaks.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom regex patterns for each field | HTML5 native validation (`required`, `pattern`, `type="email"`) | Browser-native, accessible, internationalized, no JS needed |
| Responsive images | JavaScript-based image swapping | `<picture>` element with `srcset`/`sizes` | Native lazy loading, bandwidth optimization, SEO-friendly |
| Date formatting | String manipulation for dates | `Intl.DateTimeFormat` API | Locale-aware, handles timezones, no library needed |
| Smooth scrolling | Custom scroll animation loops | CSS `scroll-behavior: smooth` | Hardware-accelerated, respects user preferences (`prefers-reduced-motion`) |
| CSS reset | Writing custom reset from scratch | Modern CSS reset (e.g., Josh Comeau's) | Handles modern edge cases, accessibility-aware |
| Touch gesture detection | Custom touch event handlers | Browser Pointer Events API | Unified mouse/touch/pen handling, better performance |

**Key insight:** Modern browsers provide robust native APIs that handle edge cases, accessibility, and performance better than custom implementations. Always check [Can I Use](https://caniuse.com/) before writing custom solutions.

## Common Pitfalls

### Pitfall 1: Missing Viewport Meta Tag
**What goes wrong:** Responsive CSS media queries don't trigger on mobile devices; page appears zoomed out.
**Why it happens:** Mobile browsers default to `width=980px` (desktop viewport) for backward compatibility with non-responsive sites.
**How to avoid:** Always include in `<head>`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
**Warning signs:** Media queries work in desktop browser dev tools but fail on actual mobile devices.

### Pitfall 2: Synchronous LocalStorage Blocking UI
**What goes wrong:** Large localStorage operations freeze the UI, causing janky interactions.
**Why it happens:** `localStorage.setItem()` and `getItem()` are synchronous and block the main thread.
**How to avoid:**
- Batch writes instead of writing on every state change
- Use `requestIdleCallback()` for non-critical saves
- Keep stored data small (< 1MB recommended)
**Warning signs:** Noticeable lag when navigating between pages or saving progress.

### Pitfall 3: Hash Routing SEO Blindness
**What goes wrong:** Search engines don't index pages; all content appears under single URL.
**Why it happens:** URL fragments (everything after `#`) are not sent to servers, so crawlers ignore them.
**How to avoid:** For this educational app, SEO is not a requirement (TECH-03: GitHub Pages). If SEO becomes needed, migrate to History API with server-side rendering.
**Warning signs:** Google Search Console shows only homepage indexed.

### Pitfall 4: Touch Target Size Too Small
**What goes wrong:** Users (especially children) accidentally tap wrong buttons, leading to frustration.
**Why it happens:** Designers use desktop-sized buttons (e.g., 24x24px icons) without considering finger size.
**How to avoid:**
- Minimum 48x48px for all interactive elements
- Add 8px spacing between adjacent touch targets
- Test on actual tablet devices
**Warning signs:** High error rates in analytics, user complaints about "hard to tap" buttons.

### Pitfall 5: GitHub Pages 404 on Refresh
**What goes wrong:** Direct URL access (e.g., bookmark or page refresh) shows 404 error for non-root routes.
**Why it happens:** Hash routing works client-side, but server doesn't know about `#/lesson/1` routes. GitHub Pages tries to serve `/lesson/1.html` which doesn't exist.
**How to avoid:** Use hash routing correctly (routes must be after `#`, e.g., `https://example.com/#/lesson/1`, not `https://example.com/lesson/1`).
**Warning signs:** App works when navigating internally but breaks on direct URL access or refresh.

### Pitfall 6: GDPR Misunderstanding with LocalStorage
**What goes wrong:** Developers assume LocalStorage always requires cookie consent banners.
**Why it happens:** Conflicting guidance online about whether LocalStorage is covered by GDPR.
**How to avoid:**
- LocalStorage for "strictly necessary" functionality (progress tracking essential to app) likely doesn't require consent
- Ensure NO personal data is stored (no names, emails, IP addresses)
- Include transparent privacy notice explaining what's stored
**Warning signs:** Legal review flags unnecessary consent banners, or missing privacy notice.

## Code Examples

Verified patterns from official sources:

### Complete HTML Shell (index.html)
```html
<!-- Source: MDN + WebSearch Best Practices 2026 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kiki English - Learn English for Children</title>

  <!-- Preload critical assets -->
  <link rel="preload" href="assets/styles/main.css" as="style">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="assets/styles/main.css">
  <link rel="stylesheet" href="assets/styles/layout.css">
  <link rel="stylesheet" href="assets/styles/components.css">
</head>
<body>
  <!-- App root -->
  <div id="app">
    <!-- Content injected by router -->
  </div>

  <!-- Scripts (defer for non-blocking load) -->
  <script type="module" src="src/app.js"></script>
</body>
</html>
```

### CSS Variables for Theming
```css
/* Source: WebSearch - CSS Best Practices 2026 */
:root {
  /* Colors (Duolingo-inspired: bright, playful) */
  --color-primary: #58cc02;      /* Green */
  --color-primary-dark: #46a302;
  --color-secondary: #1cb0f6;    /* Blue */
  --color-accent: #ff9600;       /* Orange */
  --color-danger: #ea2b2b;       /* Red */

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 28px;

  /* Spacing (8px grid system) */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;

  /* Touch targets */
  --touch-target-min: 48px;

  /* Breakpoints (for JS) */
  --breakpoint-tablet: 600px;
  --breakpoint-desktop: 1200px;
}

/* Dark mode support (respects system preference) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1a1a1a;
    --color-text: #ffffff;
  }
}
```

### Responsive Grid for Lesson Cards
```css
/* Source: MDN + WebSearch - CSS Grid 2026 */
.lesson-grid {
  display: grid;

  /* Auto-fit: Creates as many columns as fit, minimum 250px wide */
  /* No media queries needed! */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  gap: var(--space-md);
  padding: var(--space-md);
}

.lesson-card {
  background: white;
  border-radius: 12px;
  padding: var(--space-md);

  /* Touch-friendly minimum size */
  min-height: var(--touch-target-min);

  /* Smooth transitions */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lesson-card:hover,
.lesson-card:focus {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  .lesson-card {
    transition: none;
  }
}
```

### App Initialization (app.js)
```javascript
// Source: WebSearch - Vanilla JS Project Structure 2026
import Router from './services/router.js';
import StateManager from './services/state.js';
import HomeView from './views/home.js';
import LessonView from './views/lesson.js';
import QuizView from './views/quiz.js';

// Initialize state manager
const state = new StateManager('kiki-english-state');
state.enableAutoSave();

// Define routes
const routes = {
  '/': HomeView,
  '/lesson/:id': LessonView,
  '/quiz/:id': QuizView,
  '/404': () => '<h1>Page Not Found</h1>'
};

// Initialize router
const router = new Router(routes, state);

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  // Show user-friendly error message
  document.getElementById('app').innerHTML = `
    <div class="error-message">
      <p>Sorry, something went wrong. Please refresh the page.</p>
    </div>
  `;
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery DOM manipulation | Vanilla JS (querySelector, classList, template literals) | ~2015-2020 | Native APIs now match jQuery convenience; no library needed |
| Float-based layouts | CSS Grid + Flexbox | 2016-2020 (97% support by 2025) | True 2D layouts without hacks; responsive without media queries |
| Pixel breakpoints | Content-based breakpoints + container queries | 2023-2026 | Layouts adapt to content, not devices; truly modular components |
| Manual image optimization | Native lazy loading (`loading="lazy"`) | 2019 (Chrome 76) | Automatic performance optimization; no Intersection Observer needed |
| Cookie-based storage | LocalStorage / SessionStorage | 2009 (HTML5), mainstream 2015+ | Simpler API, more storage (5-10MB vs 4KB), no server roundtrip |
| History API only | History API + hash fallback | 2012 (History API support) | Clean URLs preferred, but hash routing still valid for static hosts |

**Deprecated/outdated:**
- **jQuery:** Replaced by native APIs (`querySelector`, `fetch`, `classList`). Modern browsers have closed the convenience gap.
- **Modernizr:** Feature detection largely unnecessary with evergreen browsers and broad ES6+ support.
- **CSS frameworks (Bootstrap, Foundation):** Vanilla CSS Grid/Flexbox provide same capabilities without bloat. Use only if design system needed.
- **Babel for ES6+:** Not needed for modern browsers (2020+). Only required if supporting IE11 (which GitHub Pages doesn't require).

## Open Questions

Things that couldn't be fully resolved:

1. **Exact GDPR compliance interpretation for educational apps**
   - What we know: LocalStorage for "strictly necessary" functionality likely doesn't require consent; no personal data storage makes compliance easier
   - What's unclear: Whether progress tracking qualifies as "strictly necessary" vs "functional" (which may require consent)
   - Recommendation: Include transparent privacy notice explaining what's stored locally; consult legal expert for school deployment context

2. **Optimal JSON structure for lesson content**
   - What we know: JSON is standard for static data; should be structured for easy querying
   - What's unclear: Whether to use single `lessons.json` file or split by lesson (e.g., `lesson-1.json`, `lesson-2.json`)
   - Recommendation: Start with single file for simplicity; split if performance degrades (>100KB)

3. **Offline support scope**
   - What we know: GitHub Pages serves static files; Service Workers can enable offline caching
   - What's unclear: Whether offline support is required (not mentioned in requirements)
   - Recommendation: Defer to Phase 2+ unless TECH-01 implies offline capability

## Sources

### Primary (HIGH confidence)
- [MDN - Responsive Design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) - Mobile-first patterns, viewport meta tag, media queries
- [MDN - Hash Routing](https://developer.mozilla.org/en-US/docs/Glossary/Hash_routing) - Hash routing mechanism, hashchange event, browser support
- [GitHub Docs - Configuring Publishing Source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) - GitHub Pages setup, .nojekyll file, branch vs Actions deployment

### Secondary (MEDIUM confidence)
- [Building Modern SPAs with Vanilla JavaScript](https://dev.to/moseeh_52/building-modern-spas-with-vanilla-javascript-a-beginners-guide-9a3) - Verified with MDN patterns
- [Responsive Design Best Practices 2026](https://pxlpeak.com/blog/web-design/responsive-design-best-practices) - Touch target sizes verified with multiple sources
- [Modern CSS Layout Techniques 2025-2026](https://www.frontendtools.tech/blog/modern-css-layout-techniques-flexbox-grid-subgrid-2025) - Browser support data cross-referenced with Can I Use
- [State Management in Vanilla JS: 2026 Trends](https://medium.com/@chirag.dave/state-management-in-vanilla-js-2026-trends-f9baed7599de) - LocalStorage patterns verified with RxDB guide

### Tertiary (LOW confidence - marked for validation)
- [GDPR Compliance for Apps 2025](https://gdprlocal.com/gdpr-compliance-for-apps/) - Legal interpretation (recommend legal review)
- [How I structure my vanilla JS projects](https://gomakethings.com/how-i-structure-my-vanilla-js-projects/) - One developer's opinion (cross-referenced with Google's Pulito project)

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - Vanilla JS, CSS Grid/Flexbox, LocalStorage, GitHub Pages are well-established, documented in official sources
- Architecture: **HIGH** - SPA patterns, hash routing, file structure verified across MDN and multiple 2026 sources
- Pitfalls: **MEDIUM** - Common issues documented in community sources, some from training data (e.g., localStorage blocking UI)
- GDPR compliance: **LOW** - Legal interpretation varies; requires expert review for school context

**Research date:** 2026-01-28
**Valid until:** ~2026-04-28 (90 days - stable domain, slow-moving standards)

**Key gaps requiring validation:**
- Legal review of GDPR compliance for educational context (Germany/schools)
- Accessibility testing on actual tablet devices (touch target validation)
- Performance testing with target lesson count and content size
