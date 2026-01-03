"use client";

import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipes, deleteRecipe } from "@/lib/api";
import { RecipeCard } from "@/components/shared/recipe-card";
import { useState } from "react";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";
import { Recipe } from "@/lib/types";

export default function CookbookPage() {
    const queryClient = useQueryClient();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data: recipes, isLoading } = useQuery({
        queryKey: ["recipes"],
        queryFn: getRecipes,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string | number) => deleteRecipe(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
            setIsDeleteDialogOpen(false);
            setSelectedRecipe(null);
        },
    });

    const handleDeleteClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRecipe?.id) {
            deleteMutation.mutate(selectedRecipe.id);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main min-h-screen flex flex-col font-display antialiased">
            <Navbar />
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-10 py-12 pt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-outfit text-text-main">
                            My <span className="text-primary italic">Cookbook</span>
                        </h1>
                        <p className="text-text-muted text-lg font-medium">Your curated collection of AI-extracted recipes.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Link href="/">
                            <Button className="rounded-2xl px-8 h-14 bg-primary hover:bg-primary-dark text-white font-black shadow-glow flex items-center gap-2">
                                <Plus className="size-5" />
                                Add New Recipe
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <Loader2 className="size-12 text-primary animate-spin" />
                        <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading your recipes...</p>
                    </div>
                ) : recipes && recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {recipes.map((recipe, idx) => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <RecipeCard
                                        recipe={recipe}
                                        onDelete={() => handleDeleteClick(recipe)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative p-1 bg-gradient-to-br from-border to-transparent rounded-[3rem]"
                    >
                        <div className="bg-white dark:bg-surface-dark rounded-[2.9rem] p-20 text-center space-y-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <BookOpen className="size-64 text-primary" />
                            </div>

                            <div className="size-24 bg-muted rounded-3xl flex items-center justify-center mx-auto shadow-soft mb-4">
                                <BookOpen className="size-12 text-primary/50" />
                            </div>

                            <div className="space-y-3 relative z-10">
                                <h3 className="text-3xl font-black font-outfit">Your library is empty</h3>
                                <p className="text-text-muted text-lg max-w-md mx-auto">
                                    Paste a YouTube link on the home page to start building your personal AI-powered cookbook.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Link href="/">
                                    <Button variant="outline" className="rounded-xl px-10 h-14 border-border hover:bg-muted font-black uppercase tracking-widest">
                                        Go extract something
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {selectedRecipe && (
                <DeleteConfirmation
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title={selectedRecipe.title}
                    isDeleting={deleteMutation.isPending}
                />
            )}
        </div>
    );
}
