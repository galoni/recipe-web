"use client";

import { Recipe } from "@/lib/types";
import { motion } from "framer-motion";
import { Clock, Users, Play, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecipeCardProps {
    recipe: Recipe;
    onDelete?: (id: string | number) => void;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="group relative bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500"
        >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {recipe.thumbnail_url ? (
                    <img
                        src={recipe.thumbnail_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="size-12 text-primary/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Deletion Button (Top Right) */}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (recipe.id) onDelete(recipe.id);
                        }}
                        className="absolute top-4 right-4 size-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                    >
                        <Trash2 className="size-5" />
                    </Button>
                )}
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-5">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-display text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {recipe.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                        {recipe.description || "No description provided."}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-transparent">
                        <Clock className="size-3.5 text-primary" />
                        <span>{(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)}m</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-transparent">
                        <Users className="size-3.5 text-primary" />
                        <span>{recipe.servings || 2}</span>
                    </div>
                </div>

                <div className="pt-2">
                    <Link href={`/recipe/${recipe.id}`}>
                        <Button className="w-full h-14 rounded-2xl bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground font-bold transition-all group/btn flex items-center justify-center gap-2">
                            Cook Now
                            <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
