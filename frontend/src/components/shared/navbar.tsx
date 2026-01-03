"use client";

import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";
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
            <div className="container mx-auto pointer-events-auto">
                <nav className="glass rounded-2xl md:rounded-full px-4 md:px-6 h-16 md:h-20 flex items-center justify-between shadow-soft backdrop-blur-xl bg-black/40 border-white/5">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:shadow-[0_0_15px_hsl(var(--primary))] transition-all duration-300">
                            <ChefHat className="size-6 text-primary group-hover:text-black transition-colors" />
                        </div>
                        <span className="text-xl font-bold font-display tracking-tight text-white hidden sm:block">
                            ChefStream
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/5">
                        <NavLink href="/" active={isActive('/') && pathname === '/'}>Home</NavLink>
                        {isAuthed && (
                            <NavLink href="/dashboard" active={isActive('/dashboard')}>Generate</NavLink>
                        )}
                        {isAuthed && (
                            <NavLink href="/cookbook" active={isActive('/cookbook')}>Cookbook</NavLink>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu */}
                        <NeonButton variant="ghost" size="sm" className="md:hidden">
                            <Menu className="size-5" />
                        </NeonButton>

                        {!isAuthed && !isLoading ? (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="hidden sm:block">
                                    <NeonButton variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                                        Log in
                                    </NeonButton>
                                </Link>
                                <Link href="/register">
                                    <NeonButton size="sm" className="rounded-full shadow-neon">
                                        Sign Up
                                    </NeonButton>
                                </Link>
                            </div>
                        ) : isAuthed ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className="hidden sm:flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <UserIcon className="size-4" />
                                    </div>
                                </Link>
                                <NeonButton
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-destructive h-9 w-9 p-0 rounded-full"
                                    onClick={async () => {
                                        const { logout } = await import("@/lib/auth");
                                        await logout();
                                    }}
                                >
                                    <LogOut className="size-5" />
                                </NeonButton>
                            </div>
                        ) : (
                            <div className="size-9 rounded-full bg-white/10 animate-pulse" />
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
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                active
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
        >
            {children}
        </Link>
    );
}
