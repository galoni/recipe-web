"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { SearchBar } from "@/components/ui/search-bar";
import { RecipeCard } from "@/components/shared/recipe-card";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { exploreRecipes } from "@/lib/api";
import { Recipe } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Compass, Sparkles } from "lucide-react";

function ExploreContent() {
    const searchParams = useSearchParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

    const fetchRecipes = async (query?: string) => {
        setIsLoading(true);
        try {
            const data = await exploreRecipes(query);
            setRecipes(data);
        } catch (error) {
            console.error("Failed to fetch recipes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const query = searchParams.get("q") || "";
        setSearchQuery(query);
        fetchRecipes(query);
    }, [searchParams]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        fetchRecipes(query);
        // Update URL without full reload
        const newUrl = query ? `/explore?q=${encodeURIComponent(query)}` : '/explore';
        window.history.pushState({}, '', newUrl);
    };

    return (
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 pt-32 md:pt-40">
            <div className="flex flex-col items-center text-center space-y-12 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">
                        <Compass className="size-3.5 text-primary" />
                        <span>Global Discovery</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.9]">
                        Explore the <span className="font-serif italic text-primary">Commons</span>.
                    </h1>
                    <p className="text-white/40 text-xl font-medium mx-auto">
                        Browse recipes shared by the community or search for specific ingredients and techniques.
                    </p>
                </motion.div>

                <SearchBar
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    className="z-20"
                    placeholder={searchQuery || "Search recipes, ingredients..."}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-6">
                    <Loader2 className="size-16 text-primary animate-spin" />
                    <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">Scanning Neural Library...</p>
                </div>
            ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence>
                        {recipes.map((recipe, idx) => (
                            <motion.div
                                key={recipe.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                layout
                            >
                                <RecipeCard
                                    recipe={recipe}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-24 text-center space-y-8"
                >
                    <div className="size-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Sparkles className="size-10 text-primary/40" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">No recipes found</h2>
                    <p className="text-white/40 text-lg max-w-sm mx-auto">
                        We couldn&apos;t find any recipes matching &quot;{searchQuery}&quot;. Try a different search or extract a new one!
                    </p>
                </motion.div>
            )}
        </main>
    );
}

export default function ExplorePage() {
    return (
        <BackgroundLayout>
            <Navbar />
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-40 space-y-6 pt-32 md:pt-40">
                    <Loader2 className="size-16 text-primary animate-spin" />
                </div>
            }>
                <ExploreContent />
            </Suspense>
        </BackgroundLayout>
    );
}
