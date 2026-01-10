"use client";

import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";
import { ChefHat, Menu, LogOut, User as UserIcon, X, Settings as SettingsIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { data: user, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

    const isAuthed = !!user;
    const isActive = (path: string) => pathname === path;

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header className="fixed top-0 inset-x-0 z-[100] p-4 md:p-6 pointer-events-none">
            <div className="container mx-auto pointer-events-auto max-w-7xl">
                <nav className="rounded-full px-4 md:px-6 h-16 md:h-20 flex items-center justify-between backdrop-blur-2xl bg-background/40 border border-border/50 shadow-[0_8px_32px_hsl(var(--foreground)/0.1)]">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_hsla(var(--primary),0.2)]">
                            <ChefHat className="size-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
                            Chef<span className="font-serif italic text-primary">Stream</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2 p-1 rounded-full bg-secondary/30 border border-border/50">
                        <NavLink href="/" active={isActive('/') && pathname === '/'}>Gallery</NavLink>
                        <NavLink href="/explore" active={isActive('/explore')}>Explore</NavLink>
                        {isAuthed && (
                            <NavLink href="/dashboard" active={isActive('/dashboard')}>Studio</NavLink>
                        )}
                        {isAuthed && (
                            <NavLink href="/cookbook" active={isActive('/cookbook')}>Library</NavLink>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <PillButton
                            variant="ghost"
                            size="sm"
                            className="md:hidden w-10 px-0 z-[110]"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </PillButton>

                        {!isAuthed && !isLoading ? (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="hidden sm:block">
                                    <PillButton variant="ghost" size="sm">
                                        Log in
                                    </PillButton>
                                </Link>
                                <Link href="/register">
                                    <PillButton size="sm">
                                        Sign Up
                                    </PillButton>
                                </Link>
                            </div>
                        ) : isAuthed ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className="hidden sm:flex items-center gap-2 pr-4 pl-1 py-1 rounded-full border border-border/50 hover:bg-secondary/50 transition-colors">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <UserIcon className="size-4" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">Profile</span>
                                </Link>
                                <Link href="/settings" className="hidden sm:flex items-center gap-2 pr-4 pl-1 py-1 rounded-full border border-border/50 hover:bg-secondary/50 transition-colors">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <SettingsIcon className="size-4" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">Settings</span>
                                </Link>
                                <PillButton
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-destructive h-10 w-10 p-0 rounded-full"
                                    onClick={async () => {
                                        const { logout } = await import("@/lib/auth");
                                        await logout();
                                    }}
                                >
                                    <LogOut className="size-5" />
                                </PillButton>
                            </div>
                        ) : (
                            <div className="size-10 rounded-full bg-secondary/50 animate-pulse" />
                        )}
                    </div>
                </nav>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-0 z-[90] bg-background/95 backdrop-blur-2xl p-6 pt-24 pointer-events-auto md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            <MobileNavLink href="/" active={isActive('/') && pathname === '/'}>Gallery</MobileNavLink>
                            <MobileNavLink href="/explore" active={isActive('/explore')}>Explore</MobileNavLink>
                            {isAuthed && (
                                <>
                                    <MobileNavLink href="/dashboard" active={isActive('/dashboard')}>Studio</MobileNavLink>
                                    <MobileNavLink href="/cookbook" active={isActive('/cookbook')}>Library</MobileNavLink>
                                    <MobileNavLink href="/profile" active={isActive('/profile')}>Profile</MobileNavLink>
                                    <MobileNavLink href="/settings" active={isActive('/settings')}>Settings</MobileNavLink>
                                </>
                            )}

                            {!isAuthed && !isLoading && (
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <Link href="/login">
                                        <PillButton variant="ghost" className="w-full">Log in</PillButton>
                                    </Link>
                                    <Link href="/register">
                                        <PillButton className="w-full">Sign Up</PillButton>
                                    </Link>
                                </div>
                            )}

                            {isAuthed && (
                                <button
                                    onClick={async () => {
                                        const { logout } = await import("@/lib/auth");
                                        await logout();
                                    }}
                                    className="mt-8 flex items-center justify-center gap-2 p-4 rounded-3xl border border-destructive/20 bg-destructive/5 text-destructive font-bold uppercase tracking-widest text-xs"
                                >
                                    <LogOut className="size-4" />
                                    Sign Out
                                </button>
                            )}

                            {/* Theme Toggle for Mobile */}
                            <div className="mt-8 flex justify-center">
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                "px-6 py-2 rounded-full text-xs font-bold transition-all duration-500 uppercase tracking-widest text-center",
                active
                    ? "bg-primary text-primary-foreground shadow-[0_5px_15px_hsla(var(--primary),0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                "p-4 rounded-2xl text-lg font-bold transition-all duration-300 flex items-center justify-center",
                active
                    ? "bg-primary/20 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
        >
            {children}
        </Link>
    );
}
