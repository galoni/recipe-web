"use client";

import { use, useEffect, useState } from "react";
import { getRecipeById } from "@/lib/api";
import { Recipe } from "@/lib/types";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, Users, Flame, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";
import { cn } from "@/lib/utils";
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
                    <GlassCard className="p-12 text-center max-w-md">
                        <h2 className="text-3xl font-bold text-red-500 mb-4">Error</h2>
                        <p className="text-muted-foreground mb-8 text-lg font-medium">{error}</p>
                        <Link href="/cookbook">
                            <PillButton variant="secondary">Back to Library</PillButton>
                        </Link>
                    </GlassCard>
                </div>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout>
            <div className="container mx-auto px-6 py-12 max-w-7xl pt-32 md:pt-40">
                {/* Back Button */}
                <Link href="/cookbook" className="inline-flex items-center text-muted-foreground hover:text-primary mb-12 transition-all font-bold group text-sm uppercase tracking-[0.2em]">
                    <ChevronLeft className="size-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Library
                </Link>

                <div className="grid gap-12">
                    {/* Header Card */}
                    <GlassCard className="p-0 overflow-hidden relative border-border/30">
                        <div className="aspect-[21/9] w-full relative bg-neutral-900">
                            {recipe.thumbnail_url && (
                                <div className="absolute inset-0">
                                    <Image
                                        src={recipe.thumbnail_url}
                                        alt={recipe.title}
                                        fill
                                        className="object-cover opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-10 md:p-16 w-full">
                                <h1 className="text-5xl md:text-8xl font-bold text-foreground mb-8 leading-[0.9] max-w-4xl">
                                    {recipe.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 4 === 2 ? "font-serif italic font-normal text-primary" : ""}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    <Badge icon={<Clock className="size-4" />} text={`${(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min`} />
                                    <Badge icon={<Users className="size-4" />} text={`${recipe.servings || 2} servings`} />
                                    <Badge icon={<Flame className="size-4" />} text="Neural Verified" primary />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
                        {/* Ingredients Column */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
                                <span className="font-serif italic font-normal text-primary text-4xl">01</span>
                                Ingredients
                            </h2>
                            <GlassCard className="p-10 rounded-[2.5rem]">
                                <ul className="space-y-6">
                                    {recipe.ingredients.map((ing: Ingredient, i: number) => (
                                        <li key={i} className="flex items-start gap-5 group">
                                            <div className="size-2 rounded-full bg-primary/20 mt-2.5 group-hover:bg-primary transition-all duration-500" />
                                            <span className="text-muted-foreground leading-relaxed font-medium text-lg">
                                                <span className="text-white font-bold">{ing.quantity} {ing.unit}</span> {ing.item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </div>

                        {/* Instructions Column */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
                                <span className="font-serif italic font-normal text-primary text-4xl">02</span>
                                Extraction Path
                            </h2>
                            <div className="space-y-8">
                                {recipe.steps.map((step: Step, i: number) => (
                                    <GlassCard key={i} className="p-10 rounded-[2.5rem] group hover:border-primary/30">
                                        <div className="flex gap-8">
                                            <div className="text-5xl font-serif italic text-white/5 group-hover:text-primary/20 transition-all duration-700 shrink-0">
                                                {(step.step_number || i + 1).toString().padStart(2, '0')}
                                            </div>
                                            <p className="text-xl text-muted-foreground/90 group-hover:text-white/90 leading-relaxed font-medium transition-colors">
                                                {step.instruction}
                                            </p>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundLayout>
    );
}

function Badge({ icon, text, primary }: { icon: React.ReactNode, text: string, primary?: boolean }) {
    return (
        <div className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-xl transition-all",
            primary
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-secondary/30 border-border/30 text-muted-foreground/90"
        )}>
            <span className={primary ? "text-primary" : "text-primary"}>{icon}</span>
            <span>{text}</span>
        </div>
    )
}
