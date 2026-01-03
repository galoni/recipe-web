"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { NeonButton } from "@/components/ui/NeonButton";
import { ModernInput } from "@/components/ui/ModernInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Youtube, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { useEffect } from "react";

export default function Dashboard() {
    const [videoUrl, setVideoUrl] = useState("");
    const router = useRouter();

    const { data: user, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <BackgroundLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </BackgroundLayout>
        );
    }

    const handleGenerate = () => {
        if (!videoUrl) return;
        const params = new URLSearchParams();
        params.set("url", videoUrl);
        router.push(`/recipe/generate?${params.toString()}`);
    };

    return (
        <BackgroundLayout>
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center p-6 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl"
                >
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-bold tracking-wider mb-6"
                        >
                            <Sparkles className="size-4" />
                            <span>AI KITCHEN INTERFACE</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
                            Initialize Recipe extraction
                        </h1>
                        <p className="text-blue-200/60 text-lg">
                            System ready. Input source video stream below.
                        </p>
                    </div>

                    <GlassCard variant="neon" className="p-8 rounded-3xl backdrop-blur-xl border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary/80 uppercase tracking-widest ml-1">Video Source URL</label>
                                <ModernInput
                                    icon={<Youtube className="size-5" />}
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                    className="bg-black/40 border-primary/20 focus:border-primary/50 text-lg h-14"
                                />
                            </div>

                            <NeonButton
                                onClick={handleGenerate}
                                size="lg"
                                className="w-full h-14 text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                            >
                                EXTRACT DATA
                            </NeonButton>
                        </div>
                    </GlassCard>
                </motion.div>
            </main>
        </BackgroundLayout>
    );
}
