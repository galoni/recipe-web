"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, Search, Menu, LogOut, User as UserIcon, Book, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api";
import { usePathname } from "next/navigation";

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
        <header className="w-full glass sticky top-0 z-[100] border-b border-border/40">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                            <ChefHat className="size-6 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-xl font-bold font-display tracking-tight text-foreground">
                            ChefStream
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Home className="size-4" />
                            Home
                        </Link>
                        <Link
                            href="/cookbook"
                            className={`text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/cookbook') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Book className="size-4" />
                            My Cookbook
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="hidden sm:flex items-center px-3 py-2 rounded-full bg-secondary/50 border border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all w-64">
                        <Search className="size-4 text-muted-foreground mr-2" />
                        <input
                            placeholder="Search recipes..."
                            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/70"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {!isAuthed && !isLoading ? (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="font-medium text-foreground hover:bg-muted rounded-full">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md hover:shadow-glow transition-all">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        ) : isAuthed ? (
                            <div className="flex items-center gap-4">
                                <Link href="/profile" className="flex items-center gap-2 pl-1 pr-3 py-1 bg-muted/50 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border">
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <UserIcon className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium max-w-[100px] truncate text-foreground">{user?.email?.split('@')[0]}</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                    onClick={async () => {
                                        const { logout } = await import("@/lib/auth");
                                        await logout();
                                    }}
                                >
                                    <LogOut className="size-5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="size-8 rounded-full bg-muted animate-pulse" />
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Button variant="ghost" size="icon" className="md:hidden rounded-full text-foreground hover:bg-muted">
                        <Menu className="size-6" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
