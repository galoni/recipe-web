"use client";

import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";
import { ChefHat, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
    const pathname = usePathname();
    const { data: user, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

    const isAuthed = !!user;
    const isActive = (path: string) => pathname === path;

    return (
        <header className="fixed top-0 inset-x-0 z-[100] p-4 md:p-6 pointer-events-none">
            <div className="container mx-auto pointer-events-auto max-w-7xl">
                <nav className="rounded-full px-4 md:px-6 h-16 md:h-20 flex items-center justify-between backdrop-blur-2xl bg-background/40 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_hsla(var(--primary),0.2)]">
                            <ChefHat className="size-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                            Chef<span className="font-serif italic text-primary">Stream</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/5">
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
                        {/* Mobile Menu */}
                        <PillButton variant="ghost" size="sm" className="md:hidden w-10 px-0">
                            <Menu className="size-5" />
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
                                <Link href="/profile" className="hidden sm:flex items-center gap-2 pr-4 pl-1 py-1 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <UserIcon className="size-4" />
                                    </div>
                                    <span className="text-xs font-bold text-white/70">Profile</span>
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
                            <div className="size-10 rounded-full bg-white/10 animate-pulse" />
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                "px-6 py-2 rounded-full text-xs font-bold transition-all duration-500 uppercase tracking-widest",
                active
                    ? "bg-primary text-primary-foreground shadow-[0_5px_15px_hsla(var(--primary),0.2)]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
            )}
        >
            {children}
        </Link>
    );
}
