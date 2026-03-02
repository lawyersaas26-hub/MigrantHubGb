/**
 * Prefetch utility for preloading routes and resources
 * Improves perceived performance by loading likely next pages in advance
 */

/**
 * Prefetch a route by dynamically importing it
 */
export function prefetchRoute(routePath: string): void {
    // Map routes to their lazy-loaded components
    const routeMap: Record<string, () => Promise<any>> = {
        '/favorites': () => import('../pages/Favorites'),
        '/account': () => import('../pages/Account'),
        '/search': () => import('../pages/SearchResults'),
        '/jobs': () => import('../pages/JobsList'),
        '/cars': () => import('../pages/CarsList'),
        '/lawyers': () => import('../pages/LawyersList'),
        '/accountants': () => import('../pages/AccountantsList'),
        '/driving-instructors': () => import('../pages/DrivingInstructorsList'),
        '/travel-agents': () => import('../pages/TravelAgentsList'),
        '/businesses': () => import('../pages/BusinessesList'),
    };

    const prefetchFn = routeMap[routePath];
    if (prefetchFn) {
        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                prefetchFn().catch(() => {
                    // Silently fail - prefetching is optional
                });
            });
        } else {
            setTimeout(() => {
                prefetchFn().catch(() => {
                    // Silently fail - prefetching is optional
                });
            }, 2000);
        }
    }
}

/**
 * Prefetch multiple routes
 */
export function prefetchRoutes(routes: string[]): void {
    routes.forEach(route => prefetchRoute(route));
}

/**
 * Prefetch common routes after initial load
 */
export function prefetchCommonRoutes(): void {
    // Prefetch most commonly accessed routes
    setTimeout(() => {
        prefetchRoutes([
            '/favorites',
            '/account',
            '/search',
        ]);
    }, 3000); // Wait 3 seconds after initial load
}






