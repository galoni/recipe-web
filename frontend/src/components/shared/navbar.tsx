"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, Search, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api";

export function Navbar() {
    const { data: user, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

    const isAuthed = !!user;

    return (
        <header className="w-full bg-background-light/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-border sticky top-0 z-[100]">
            <div className="px-6 md:px-12 h-20 flex items-center justify-between max-w-[1440px] mx-auto w-full">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-11 bg-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <ChefHat className="size-6 text-white" />
                        </div>
                        <h2 className="text-text-main dark:text-white text-2xl font-black font-outfit tracking-tighter">
                            ChefStream
                        </h2>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors flex items-center gap-2">
                            Discover
                        </Link>
                        <Link href="/cookbook" className="text-sm font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors flex items-center gap-2">
                            My Cookbook
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-muted border border-border group focus-within:border-primary/50 transition-all">
                        <Search className="size-4 text-text-muted group-focus-within:text-primary" />
                        <input
                            placeholder="Explore recipes..."
                            className="bg-transparent border-none outline-none px-3 text-sm font-bold w-40 focus:w-64 transition-all"
                        />
                    </div>

                    <div className="hidden md:flex gap-3 items-center">
                        {!isAuthed && !isLoading ? (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="font-black border-none text-text-main hover:bg-muted rounded-xl px-6">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="ghost" className="font-black border-none text-text-main hover:bg-muted rounded-xl px-6">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        ) : isAuthed ? (
                            <>
                                <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-muted/50 rounded-xl">
                                    <UserIcon className="size-4 text-primary" />
                                    <span className="text-sm font-bold max-w-[120px] truncate">{user.email}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="font-black border-none text-red-500 hover:bg-red-50 rounded-xl px-6 flex items-center gap-2"
                                    onClick={async () => {
                                        const { logout } = await import("@/lib/auth");
                                        await logout();
                                    }}
                                >
                                    <LogOut className="size-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-4" />
                        )}
                        <Button className="font-black bg-primary hover:bg-primary-dark text-white rounded-xl px-8 shadow-glow">
                            Start Cooking
                        </Button>
                    </div>

                    <Button variant="ghost" className="md:hidden size-10 flex items-center justify-center rounded-xl hover:bg-muted">
                        <Menu className="size-6" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
