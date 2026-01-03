"use client";

import { use, useEffect, useState } from "react";
import { getRecipeById } from "@/lib/api";
import { Recipe } from "@/lib/types";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, Users, Flame, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";
import Image from "next/image";
import { Ingredient, Step } from "@/lib/types";

export default function RecipeViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeById(id);
                setRecipe(data);
            } catch (err) {
                console.error("Failed to load recipe", err);
                setError("Recipe not found or could not be loaded.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <BackgroundLayout>
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </BackgroundLayout>
        );
    }

    if (error || !recipe) {
        return (
            <BackgroundLayout>
                <div className="flex-grow flex items-center justify-center p-6">
                    <GlassCard className="p-8 text-center max-w-md">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                        <p className="text-white/60 mb-6">{error}</p>
                        <Link href="/cookbook">
                            <NeonButton>Back to Cookbook</NeonButton>
                        </Link>
                    </GlassCard>
                </div>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <Link href="/cookbook" className="inline-flex items-center text-white/50 hover:text-primary mb-6 transition-colors font-bold">
                    <ChevronLeft className="size-5 mr-1" />
                    Back to Cookbook
                </Link>

                <div className="grid gap-8">
                    {/* Header Card */}
                    <GlassCard className="p-0 overflow-hidden rounded-[2rem]">
                        <div className="aspect-[21/9] w-full relative bg-black/40">
                            {recipe.thumbnail_url && (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={recipe.thumbnail_url}
                                        alt={recipe.title}
                                        fill
                                        className="object-cover opacity-80"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h1 className="text-3xl md:text-5xl font-black font-display text-white mb-4 leading-tight">
                                    {recipe.title}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest text-white/70">
                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                        <Clock className="size-4 text-primary" />
                                        <span>{(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                        <Users className="size-4 text-primary" />
                                        <span>{recipe.servings || 2} servings</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                        <Flame className="size-4 text-orange-500" />
                                        <span>Medium</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                        {/* Ingredients Column */}
                        <div className="space-y-6">
                            <GlassCard className="p-6 h-full rounded-2xl">
                                <h2 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full" />
                                    Ingredients
                                </h2>
                                <ul className="space-y-4">
                                    {recipe.ingredients.map((ing: Ingredient, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                            <div className="size-2 rounded-full bg-primary/50 mt-2 group-hover:bg-primary group-hover:shadow-[0_0_10px_#00f0ff] transition-all" />
                                            <span className="text-blue-100/80 leading-relaxed font-medium">
                                                <span className="text-white font-bold">{ing.quantity} {ing.unit}</span> {ing.item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </div>

                        {/* Instructions Column */}
                        <div className="space-y-6">
                            <GlassCard className="p-8 h-full rounded-2xl">
                                <h2 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-accent rounded-full" />
                                    Instructions
                                </h2>
                                <div className="space-y-8">
                                    {recipe.steps.map((step: Step, i: number) => (
                                        <div key={i} className="relative pl-8 group">
                                            <div className="absolute left-0 top-0 text-3xl font-black text-white/5 group-hover:text-primary/20 transition-colors font-display">
                                                {step.step_number || i + 1}
                                            </div>
                                            <div className="absolute left-[11px] top-10 bottom-[-10px] w-px bg-white/5 group-last:hidden" />
                                            <p className="text-lg text-blue-100/90 leading-relaxed">
                                                {step.instruction}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundLayout>
    );
}
