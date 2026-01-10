"use client";

import { useState, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
    isLoading?: boolean;
}

export function SearchBar({
    onSearch,
    placeholder = "Search recipes, ingredients...",
    className,
    isLoading = false
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) onSearch(query);
    };

    const handleClear = () => {
        setQuery("");
        inputRef.current?.focus();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "relative w-full max-w-2xl group transition-all duration-500",
                isFocused ? "scale-[1.02]" : "scale-100",
                className
            )}
        >
            <div className={cn(
                "relative flex items-center h-16 md:h-20 px-6 rounded-3xl border transition-all duration-500 overflow-hidden",
                isFocused
                    ? "bg-secondary/40 border-primary/50 shadow-[0_0_40px_rgba(0,240,255,0.1)] backdrop-blur-2xl"
                    : "bg-secondary/30 border-border/30 backdrop-blur-xl hover:border-border/50"
            )}>
                {/* Animated Glow Effect */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                <Search className={cn(
                    "size-6 transition-colors duration-500",
                    isFocused ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground"
                )} />

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-grow bg-transparent border-none outline-none px-4 text-xl md:text-2xl text-foreground placeholder:text-muted-foreground/50 font-medium"
                />

                <div className="flex items-center gap-3">
                    {isLoading && (
                        <Loader2 className="size-5 text-primary animate-spin" />
                    )}

                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2 rounded-full hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    )}

                    <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg border border-border/30 bg-secondary/30 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                        <span>Enter</span>
                    </div>
                </div>
            </div>
        </form>
    );
}
