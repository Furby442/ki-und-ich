# Testing Patterns

**Analysis Date:** 2026-01-28

## Test Framework

**Runner:**
- Jest (via react-scripts 5.0.1)
- Config: Built into react-scripts; no explicit jest.config.js file
- Invoked via `npm test` command

**Assertion Library:**
- Jest built-in assertions (no external assertion library)

**Run Commands:**
```bash
npm test              # Run tests (interactive watch mode via react-scripts)
npm run build         # Build project (includes test checking)
npm run start         # Start development server
npm run eject         # Eject from Create React App (not recommended)
```

## Test File Organization

**Location:**
- No test files detected in codebase
- Pattern would follow Create React App convention: co-located with source files

**Naming:**
- Expected pattern: `*.test.js` or `*.spec.js` (standard CRA convention)
- Example: `App.test.js`, `Confetti.test.js`

**Structure:**
- No test directory; tests typically co-located with components in Create React App projects
- Codebase has zero test coverage currently

## Test Structure

**Suite Organization:**
- No tests exist to demonstrate pattern
- Standard CRA pattern would be:
```javascript
describe('Component', () => {
  test('should render', () => {
    // assertions
  });
});
```

**Patterns:**
- Setup/teardown: Would use `beforeEach()` / `afterEach()` per Jest convention
- Assertions: Jest matchers (`.toBe()`, `.toEqual()`, `.toHaveBeenCalled()`, etc.)
- No setupTests.js file observed; no custom test utilities

## Mocking

**Framework:** Jest mocking system (built-in)

**Patterns:**
- No mocking observed in codebase
- Would follow Jest convention: `jest.mock()` for modules
- Example pattern (not implemented):
```javascript
jest.mock('react-particles');
```

**What to Mock:**
- External libraries: `react-particles`, `tsparticles`
- Browser APIs: `ReactDOM.createRoot`
- Window/document objects for DOM testing

**What NOT to Mock:**
- React hooks: `useCallback` should be tested as-is
- Component render output: verify actual DOM
- CSS imports: static imports should load

## Fixtures and Factories

**Test Data:**
- No fixtures or factories present
- Would likely need mock particle engine configuration for testing Confetti.js

**Location:**
- Expected: `src/__fixtures__/` or `src/__mocks__/` directories (not created)
- Possible factory for particle options object (currently inline in Confetti.js)

## Coverage

**Requirements:** Not enforced

**View Coverage:**
```bash
npm test -- --coverage
```

## Test Types

**Unit Tests:**
- Not implemented
- Scope: Would test individual functions
  - `App` component render
  - `Confetti` component initialization
  - `particlesInit` and `particlesLoaded` callbacks

**Integration Tests:**
- Not implemented
- Would test App + Confetti integration
- Would test particle engine initialization with real tsparticles library

**E2E Tests:**
- Not detected; not configured
- No Cypress, Playwright, or other E2E framework present

## Common Patterns

**Async Testing:**
- Not tested
- Pattern would use async/await in test:
```javascript
test('loads particles', async () => {
  const { container } = render(<Confetti />);
  await waitFor(() => expect(container).toBeInTheDocument());
});
```

**Error Testing:**
- No error handling in code, so no error tests
- Could test missing particle engine gracefully handling
- Could test missing DOM root element

## Testing Gaps

**Critical Missing Coverage:**
- `src/App.js`: No tests for component rendering, social share links, or JSX structure
- `src/Confetti.js`: No tests for:
  - `particlesInit` callback execution
  - `particlesLoaded` callback execution
  - Particle configuration object integrity
  - tsparticles integration
  - useCallback memoization
- `src/index.js`: No tests for React root creation or App mounting

**Current State:**
- Zero test files
- Zero test coverage
- jest test command configured but no tests to run

---

*Testing analysis: 2026-01-28*
