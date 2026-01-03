"use client";

import { Recipe } from "@/lib/types";
import { motion } from "framer-motion";
import { Clock, Users, Play, Trash2, ChevronRight, Globe, Lock } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
    recipe: Recipe;
    onDelete?: (id: string | number) => void;
    onTogglePublic?: (id: string | number, currentStatus: boolean) => void;
}

export function RecipeCard({ recipe, onDelete, onTogglePublic }: RecipeCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -10 }}
            className="group relative glass-card p-0 overflow-hidden border-white/5 shadow-premium transition-all duration-700"
        >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                {recipe.thumbnail_url ? (
                    <Image
                        src={recipe.thumbnail_url}
                        alt={recipe.title}
                        fill
                        className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="size-16 text-white/10" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />

                {/* Privacy Badge */}
                <div className={cn(
                    "absolute top-6 left-6 px-3 py-1.5 rounded-full backdrop-blur-xl border flex items-center gap-2 transition-all duration-500",
                    recipe.is_public !== false
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-white/5 border-white/10 text-white/40"
                )}>
                    {recipe.is_public !== false ? <Globe className="size-3" /> : <Lock className="size-3" />}
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                        {recipe.is_public !== false ? "Public" : "Private"}
                    </span>
                </div>

                {/* Actions (Top Right) */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    {onTogglePublic && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (recipe.id) onTogglePublic(recipe.id, !!recipe.is_public);
                            }}
                            className="size-10 rounded-full bg-black/40 backdrop-blur-xl text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center border border-white/10"
                            title={recipe.is_public !== false ? "Make Private" : "Make Public"}
                        >
                            {recipe.is_public !== false ? <Lock className="size-4" /> : <Globe className="size-4" />}
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (recipe.id) onDelete(recipe.id);
                            }}
                            className="size-10 rounded-full bg-black/40 backdrop-blur-xl text-white/40 hover:bg-destructive hover:text-white transition-all flex items-center justify-center border border-white/10"
                            title="Delete Recipe"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-10 space-y-6">
                <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-white line-clamp-1 group-hover:text-primary transition-all duration-500">
                        {recipe.title}
                    </h3>
                    <p className="text-lg text-white/30 line-clamp-2 leading-relaxed font-medium">
                        {recipe.description || "Synthesized neural recipe extraction complete."}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Clock className="size-3.5 text-primary" />
                        <span>{(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)}m</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Users className="size-3.5 text-primary" />
                        <span>{recipe.servings || 2}</span>
                    </div>
                </div>

                <div className="pt-4">
                    <Link href={`/recipe/${recipe.id}`}>
                        <PillButton variant="secondary" className="w-full h-16 text-lg group/btn">
                            Access Vault
                            <ChevronRight className="size-6 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </PillButton>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
