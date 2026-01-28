/**
 * Router - Hash-based SPA routing
 *
 * Handles client-side navigation using URL hash changes.
 * Supports route parameters (e.g., /lesson/:id)
 */

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.container = null;

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    init() {
        this.container = document.querySelector('#app');
        if (!this.container) {
            console.error('Router: #app container not found');
            return;
        }
        this.handleRoute();
    }

    /**
     * Extract route path from URL hash
     * @returns {string} Path without leading #
     */
    getPath() {
        const hash = window.location.hash.slice(1); // Remove #
        return hash || '/';
    }

    /**
     * Match current path against route patterns
     * Supports route parameters like /lesson/:id
     * @returns {object} { route, params } or null
     */
    matchRoute() {
        const path = this.getPath();

        // Try exact match first
        if (this.routes[path]) {
            return { route: path, params: {} };
        }

        // Try pattern matching for parameterized routes
        for (const pattern in this.routes) {
            if (!pattern.includes(':')) continue;

            const params = this.extractParams(pattern, path);
            if (params) {
                return { route: pattern, params };
            }
        }

        // No match found
        return null;
    }

    /**
     * Extract parameters from route pattern
     * Example: pattern=/lesson/:id, path=/lesson/1 -> { id: '1' }
     * @param {string} pattern Route pattern with :param
     * @param {string} path Current path
     * @returns {object|null} Params object or null if no match
     */
    extractParams(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];

            if (patternPart.startsWith(':')) {
                // This is a parameter
                const paramName = patternPart.slice(1);
                params[paramName] = pathPart;
            } else if (patternPart !== pathPart) {
                // Static part doesn't match
                return null;
            }
        }

        return params;
    }

    /**
     * Handle current route
     */
    handleRoute() {
        if (!this.container) return;

        const match = this.matchRoute();

        if (match) {
            const viewFunction = this.routes[match.route];
            this.render(viewFunction, match.params);
        } else {
            // 404 - route not found
            const notFoundView = this.routes['/404'];
            if (notFoundView) {
                this.render(notFoundView, {});
            } else {
                this.container.innerHTML = '<h1>404 - Seite nicht gefunden</h1>';
            }
        }
    }

    /**
     * Render view function
     * @param {Function} viewFunction View to render
     * @param {object} params Route parameters
     */
    render(viewFunction, params) {
        // Clear container
        this.container.innerHTML = '';

        // Call view function with container and params
        viewFunction(this.container, params);
    }

    /**
     * Navigate to a new route programmatically
     * @param {string} path Path to navigate to
     */
    navigate(path) {
        window.location.hash = path;
    }
}

export default Router;
