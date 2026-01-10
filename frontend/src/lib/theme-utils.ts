/**
 * Theme utility functions
 *
 * Helper functions for working with the theme system.
 */

/**
 * Get the current theme from localStorage
 * Safe for SSR - returns null on server
 */
export function getStoredTheme(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('theme');
}

/**
 * Set theme in localStorage
 * Safe for SSR - no-op on server
 */
export function setStoredTheme(theme: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme', theme);
}

/**
 * Check if user prefers reduced motion
 * Used to disable animations for accessibility
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get system theme preference
 * Returns 'dark' or 'light' based on OS setting
 */
export function getSystemTheme(): 'dark' | 'light' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
