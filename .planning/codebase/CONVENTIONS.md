# Coding Conventions

**Analysis Date:** 2026-01-28

## Naming Patterns

**Files:**
- PascalCase for React component files: `App.js`, `Confetti.js`
- camelCase for utility and CSS files: `index.js`, `index.css`, `App.css`
- Component names match file names exactly

**Functions:**
- camelCase for regular functions: `particlesInit`, `particlesLoaded`
- PascalCase for React components: `App`, `Confetti`
- Functions use arrow function syntax consistently: `const functionName = () => {}`

**Variables:**
- camelCase for all variable declarations: `shareMessage`, `shareLink`, `root`, `container`, `engine`
- Constants use camelCase: `shareMessage`, `shareLink`
- No const assertions or uppercasing for constants

**Types:**
- No TypeScript used; JavaScript only
- No explicit type definitions or JSDoc annotations observed

## Code Style

**Formatting:**
- No explicit formatter configuration (eslint only configured via package.json)
- react-scripts handles formatting defaults
- Line length appears flexible; some lines exceed typical 80-char limit (e.g., lines 20-24 in App.js)
- Indentation: 4 spaces observed in Confetti.js, 2 spaces in App.js (inconsistent)

**Linting:**
- ESLint configured via package.json: `extends: ["react-app", "react-app/jest"]`
- No explicit eslintrc file; using Create React App defaults
- No Prettier configuration; default formatting applied

## Import Organization

**Order:**
1. External library imports: `import React from 'react'`, `import Particles from "react-particles"`
2. Local component imports: `import App from './App'`, `import Confetti from "./Confetti"`
3. Local style imports: `import './App.css'`, `import './index.css'`
4. Dependency imports from libraries: `import { useCallback } from "react"`, `import { loadFull } from "tsparticles"`

**Path Aliases:**
- Relative paths used: `'./App'`, `'./index.css'`, `"./Confetti"`
- No alias configuration detected in package.json or tsconfig

## Error Handling

**Patterns:**
- No try-catch blocks observed
- async/await used with console.log but no error handling: `await console.log(container)` in Confetti.js (line 16)
- No error boundaries or error state management
- No validation of external API responses
- Console.log used for debugging output (lines 8, 16 in Confetti.js)

## Logging

**Framework:** console

**Patterns:**
- Direct console.log usage: `console.log(engine)` (Confetti.js line 8)
- Unnecessary await before console.log: `await console.log(container)` (Confetti.js line 16) - anti-pattern
- No structured logging
- No log levels (info, warn, error) distinguished
- Logging used for debugging particle engine initialization

## Comments

**When to Comment:**
- Inline comments used for explaining configuration: comments in Confetti.js lines 9-11 explain tsparticles bundle loading
- Social sharing URLs have no comments explaining the URL building logic
- CSS classes have comments identifying platform: `/* Twitter */`, `/* Linkedin */`, `/* Reddit */` (App.css lines 38, 44, 50)

**JSDoc/TSDoc:**
- No JSDoc annotations used
- No function documentation
- No type documentation

## Function Design

**Size:**
- Most functions are small (< 20 lines)
- App.js component is concise (7 lines of logic)
- Confetti.js has two callback functions: `particlesInit` (5 lines) and `particlesLoaded` (2 lines)
- Large inline configuration object in return statement (lines 24-172 in Confetti.js)

**Parameters:**
- Minimal parameters: `() => {}` with no parameters common
- Callbacks receive single parameter: `async engine =>`, `async container =>`
- Arrow function syntax consistent: `const name = (params) => {}`

**Return Values:**
- JSX returned directly from components
- No explicit return statements for configuration objects; inline objects passed to props
- Callbacks return Promise (async functions)

## Module Design

**Exports:**
- Default exports used: `export default App`, `export default Confetti`
- No named exports
- Only component exports; no helper exports

**Barrel Files:**
- No barrel files (index.js files that re-export) used
- index.js in src is entry point only (renders App)

---

*Convention analysis: 2026-01-28*
