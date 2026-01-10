'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

/**
 * Theme Provider wrapper for next-themes
 *
 * Provides theme context to the entire application with SSR support.
 * Supports Light, Dark, and System themes with localStorage persistence.
 *
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
 *   {children}
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
