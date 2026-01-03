"use client";

import { Navbar } from "@/components/shared/navbar";
import { PillButton } from "@/components/ui/PillButton";
import { BookOpen, Plus, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipes, deleteRecipe, toggleRecipePrivacy } from "@/lib/api";
import { RecipeCard } from "@/components/shared/recipe-card";
import { useState } from "react";
import { DeleteConfirmation } from "@/components/shared/delete-confirmation";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
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

    const toggleMutation = useMutation({
        mutationFn: ({ id, isPublic }: { id: string | number; isPublic: boolean }) =>
            toggleRecipePrivacy(id, isPublic),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
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
        <BackgroundLayout>
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 pt-32 md:pt-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">
                            <BookOpen className="size-3.5 text-primary" />
                            <span>Heritage Library</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.9]">
                            Your <span className="font-serif italic text-primary">Vault</span>.
                        </h1>
                        <p className="text-white/40 text-xl font-medium max-w-md">Your curated collection of neural-extracted recipes and techniques.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Link href="/dashboard">
                            <PillButton className="h-16 px-10 text-lg">
                                <Plus className="size-5 mr-2" />
                                Add New Recipe
                            </PillButton>
                        </Link>
                    </motion.div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-6">
                        <Loader2 className="size-16 text-primary animate-spin" />
                        <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">Synchronizing Library...</p>
                    </div>
                ) : recipes && recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                                        onTogglePublic={(id, current) => toggleMutation.mutate({ id, isPublic: !current })}
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
                        className="glass-card p-16 md:p-24 text-center space-y-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                            <BookOpen className="size-80 text-primary" />
                        </div>

                        <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <BookOpen className="size-12 text-primary" />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <h3 className="text-4xl font-bold text-white">Your library is empty</h3>
                            <p className="text-white/40 text-xl max-w-md mx-auto font-medium">
                                Paste a source link on the dashboard to start building your personal AI-powered cookbook.
                            </p>
                        </div>

                        <div className="pt-6">
                            <Link href="/dashboard">
                                <PillButton variant="secondary" className="h-16 px-12 text-xl">
                                    Start Extracting
                                    <ArrowRight className="ml-2 size-6" />
                                </PillButton>
                            </Link>
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
        </BackgroundLayout>
    );
}
