"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { generateRecipe, saveRecipe, getCurrentUser } from "@/lib/api";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Flame, Check, Play, Info, Tag, Timer, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const videoUrl = searchParams.get("url");
    const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const { data: recipe, isLoading, error } = useQuery({
        queryKey: ["recipe", videoUrl],
        queryFn: () => generateRecipe(videoUrl || ""),
        enabled: !!videoUrl,
        retry: false,
    });

    const { data: user } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

    const toggleIngredient = (idx: number) => {
        setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleSave = async () => {
        if (!recipe || isSaving) return;
        setIsSaving(true);
        try {
            await saveRecipe(recipe);
            setIsSaved(true);
            setTimeout(() => {
                router.push('/cookbook');
            }, 1500);
        } catch (err) {
            console.error("Failed to save recipe", err);
            alert("Failed to save to cookbook.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!videoUrl) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="size-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <Info className="size-10 text-secondary" />
                </div>
                <h2 className="text-3xl font-black mb-2 font-outfit">No Video URL</h2>
                <p className="text-text-muted mb-8 max-w-md">Please provide a valid YouTube cooking video URL to begin the extraction process.</p>
                <Link href="/">
                    <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary-dark text-white font-bold shadow-glow">
                        Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 size-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 size-64 bg-secondary/10 rounded-full blur-[100px] animate-pulse transition-delay-500" />
                </div>

                <div className="relative">
                    <div className="size-24 border-[6px] border-primary/20 border-t-primary rounded-full animate-spin mb-8"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Flame className="size-8 text-primary animate-pulse" />
                    </div>
                </div>

                <h2 className="text-3xl font-black font-outfit text-text-main animate-pulse">Analyzing the Chef...</h2>
                <p className="text-text-muted mt-3 text-lg">Gemini AI is watching the video and extracting the magic.</p>

                <div className="mt-12 w-full max-w-md space-y-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 15, ease: "linear" }}
                            className="h-full bg-primary"
                        />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-text-muted uppercase tracking-widest">
                        <span>Reading Transcripts</span>
                        <span>Organizing Steps</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-8 rounded-3xl border-2 border-red-100 bg-red-50/50 dark:bg-red-900/10 text-center max-w-lg shadow-xl"
                >
                    <div className="size-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Info className="size-8" />
                    </div>
                    <h2 className="text-2xl font-black mb-3 font-outfit text-red-600">Generation Failed</h2>
                    <p className="text-red-700/80 mb-8 leading-relaxed">
                        {(error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "We couldn't extract the recipe from this video. It might be due to missing captions or a length restriction."}
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="rounded-full px-8 border-red-200 text-red-600 hover:bg-red-50 font-bold">
                            Try Another Video
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header / Hero Section */}
            <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-surface-light to-muted dark:from-surface-dark dark:to-background-dark border border-border shadow-soft overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Flame className="size-64 text-primary" />
                </div>

                <div className="relative flex flex-col md:flex-row gap-10 items-center">
                    {/* Video Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="w-full md:w-[400px] flex-shrink-0 group cursor-pointer lg:sticky lg:top-24"
                    >
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                            {recipe?.thumbnail_url ? (
                                <img src={recipe.thumbnail_url} alt={recipe.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                            ) : (
                                <div className="w-full h-full bg-surface-dark flex items-center justify-center">
                                    <Play className="size-16 text-primary/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <a href={videoUrl} target="_blank" rel="noreferrer" className="size-20 rounded-full glass flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="size-10 fill-current ml-1" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Metadata */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl md:text-5xl font-black font-outfit text-text-main leading-tight tracking-tight"
                            >
                                {recipe?.title}
                            </motion.h1>
                            <p className="text-lg text-text-muted italic max-w-2xl leading-relaxed">
                                {recipe?.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-surface-dark border border-border shadow-sm">
                                <Clock className="size-5 text-primary" />
                                <span className="font-bold text-sm">{(recipe?.prep_time_minutes || 0) + (recipe?.cook_time_minutes || 0)} min total</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-surface-dark border border-border shadow-sm">
                                <Users className="size-5 text-primary" />
                                <span className="font-bold text-sm">{recipe?.servings || 2} servings</span>
                            </div>
                            {recipe?.dietary_tags?.map((tag) => (
                                <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-primary/10 text-primary-dark dark:text-primary border border-primary/20 text-xs font-black uppercase tracking-widest">
                                    <Tag className="size-3" />
                                    {tag}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={user ? handleSave : () => router.push('/login')}
                                disabled={isSaving || isSaved}
                                className={`rounded-2xl px-8 h-14 font-black shadow-glow transition-all ${isSaved ? 'bg-secondary' : 'bg-primary hover:bg-primary-dark'
                                    }`}
                            >
                                {isSaving ? (
                                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                ) : isSaved ? (
                                    <Check className="size-5 mr-2" />
                                ) : (
                                    <Save className="size-5 mr-2" />
                                )}
                                {isSaved ? 'Saved to Cookbook' : user ? 'Save to Cookbook' : 'Login to Save'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* LEFT: Ingredients */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] border border-border shadow-soft overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black font-outfit flex items-center gap-2">
                                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                                        <Check className="size-5 text-white" />
                                    </div>
                                    Ingredients
                                </h2>
                                <span className="text-xs font-black text-text-muted uppercase tracking-tighter">
                                    {Object.keys(checkedIngredients).filter(k => checkedIngredients[Number(k)]).length} / {recipe?.ingredients.length} Done
                                </span>
                            </div>

                            <ul className="space-y-4">
                                {recipe?.ingredients.map((ing, idx) => {
                                    const isChecked = checkedIngredients[idx];
                                    return (
                                        <motion.li
                                            key={idx}
                                            onClick={() => toggleIngredient(idx)}
                                            className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-all cursor-pointer select-none"
                                        >
                                            <div className={`mt-0.5 size-6 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked
                                                ? 'bg-primary border-primary'
                                                : 'bg-white dark:bg-muted/20 border-border group-hover:border-primary/50'
                                                }`}>
                                                {isChecked && <Check className="size-4 text-white font-bold" />}
                                            </div>
                                            <div className="flex-1 space-y-0.5">
                                                <div className={`text-base font-bold leading-snug transition-all ${isChecked ? 'text-text-muted line-through opacity-60' : 'text-text-main'
                                                    }`}>
                                                    {ing.quantity} {ing.unit} {ing.item}
                                                </div>
                                                {ing.notes && (
                                                    <div className="text-xs text-text-muted italic">{ing.notes}</div>
                                                )}
                                            </div>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <Button className="w-full py-8 text-lg font-black rounded-3xl bg-secondary hover:bg-secondary/90 text-white shadow-xl hover:shadow-glow transition-all">
                        <Tag className="mr-2" /> Add to Shopping List
                    </Button>
                </div>

                {/* RIGHT: Instructions */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-3xl font-black font-outfit">Cooking Steps</h2>
                        <div className="flex gap-2">
                            <div className="px-4 py-2 rounded-xl bg-muted text-text-muted text-sm font-bold flex items-center gap-2">
                                <Timer className="size-4" /> {recipe?.cook_time_minutes} min cook
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {recipe?.steps.map((step, idx) => (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="group relative bg-surface-light dark:bg-surface-dark rounded-[2rem] border border-border p-8 hover:border-primary/30 transition-all"
                            >
                                <div className="flex gap-8 items-start">
                                    <div className="flex-shrink-0 relative">
                                        <div className="size-12 rounded-2xl bg-muted dark:bg-muted/10 text-text-muted flex items-center justify-center font-black text-xl font-outfit group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                                            {idx + 1}
                                        </div>
                                        <div className="absolute top-0 right-0 size-3 bg-primary rounded-full border-2 border-white scale-0 group-hover:scale-100 transition-transform" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap gap-3">
                                            {step.duration_seconds && (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-200/50">
                                                    <Timer className="size-3" />
                                                    {Math.floor(step.duration_seconds / 60)}:{(step.duration_seconds % 60).toString().padStart(2, '0')} Timer
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xl text-text-main dark:text-gray-100 leading-relaxed font-medium">
                                            {step.instruction}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased overflow-x-hidden min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-[1280px] mx-auto p-4 lg:p-10 pt-24 pb-32">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }>
                    <DashboardContent />
                </Suspense>
            </main>
        </div>
    );
}
