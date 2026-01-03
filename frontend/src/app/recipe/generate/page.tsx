"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateRecipe, saveRecipe } from "@/lib/api";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

import { Suspense } from "react";

function GenerateContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const videoUrl = searchParams.get("url");
    const [status, setStatus] = useState<"analyzing" | "saving" | "redirecting" | "error">("analyzing");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!videoUrl) {
            router.push("/dashboard");
            return;
        }

        const processVideo = async () => {
            try {
                // 1. Analyze Video
                setStatus("analyzing");
                const extractedRecipe = await generateRecipe(videoUrl);

                // 2. Save Recipe
                setStatus("saving");
                // Check if it already has an ID (sometimes backend saves automatically)
                let savedRecipe = extractedRecipe;
                if (!savedRecipe.id) {
                    savedRecipe = await saveRecipe(extractedRecipe);
                }

                // 3. Redirect
                setStatus("redirecting");
                setTimeout(() => {
                    router.push(`/recipe/${savedRecipe.id}`);
                }, 1000);

            } catch (err: unknown) {
                console.error("Generation failed:", err);
                setStatus("error");
                const errorMessage = err instanceof Error ? err.message : "Failed to process video. Please try again.";
                setError(errorMessage);
            }
        };

        processVideo();
    }, [videoUrl, router]);

    return (
        <div className="flex-grow flex items-center justify-center p-6">
            <GlassCard className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-6">

                {/* STATUS ICONS */}
                <div className="relative size-24 flex items-center justify-center">
                    {status === "error" ? (
                        <div className="size-20 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50">
                            <AlertTriangle className="size-10 text-red-400" />
                        </div>
                    ) : status === "redirecting" ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="size-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50"
                        >
                            <CheckCircle2 className="size-10 text-green-400" />
                        </motion.div>
                    ) : (
                        <>
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                            <div className="absolute inset-2 rounded-full border-4 border-accent/20 border-b-accent animate-spin-reverse" />
                            <Loader2 className="size-8 text-white animate-pulse" />
                        </>
                    )}
                </div>

                {/* STATUS TEXT */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-display text-white">
                        {status === "analyzing" && "Analyzing Stream..."}
                        {status === "saving" && "Compiling Data..."}
                        {status === "redirecting" && "Recipe Ready!"}
                        {status === "error" && "Extraction Failed"}
                    </h2>
                    <p className="text-blue-200/60 text-sm">
                        {status === "analyzing" && "Our AI is watching the video for you."}
                        {status === "saving" && "formatting ingredients and instructions."}
                        {status === "redirecting" && "Taking you to the kitchen."}
                        {status === "error" && error}
                    </p>
                </div>

                {status === "error" && (
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-primary hover:text-primary/80 font-bold hover:underline"
                    >
                        Try Another Video
                    </button>
                )}

            </GlassCard>
        </div>
    )
}

export default function GeneratePage() {
    return (
        <BackgroundLayout>
            <Suspense fallback={
                <div className="flex-grow flex items-center justify-center p-6">
                    <Loader2 className="size-8 text-white animate-spin" />
                </div>
            }>
                <GenerateContent />
            </Suspense>
        </BackgroundLayout>
    );
}
