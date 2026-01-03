"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { PillButton } from "@/components/ui/PillButton";
import { ModernInput } from "@/components/ui/ModernInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Youtube, Sparkles, ArrowRight } from "lucide-react";
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

            <main className="flex-grow flex flex-col items-center justify-center p-6 pt-32 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl"
                >
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase mb-10"
                        >
                            <Sparkles className="size-3.5 text-primary animate-pulse" />
                            <span>Neural Extraction Suite</span>
                        </motion.div>
                        <h1 className="text-6xl md:text-7xl font-bold text-white leading-[0.9] mb-8">
                            Initialize <br />
                            <span className="font-serif italic text-primary">extraction</span>.
                        </h1>
                        <p className="text-white/40 text-xl max-w-lg mx-auto font-medium">
                            Paste your source video stream below to begin neural processing.
                        </p>
                    </div>

                    <GlassCard variant="neon" className="p-10 md:p-14">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Video Source URL</label>
                                <ModernInput
                                    icon={<Youtube className="size-6 text-white/20" />}
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                    className="bg-white/5 border-white/10 focus:border-primary/50 text-xl h-16 rounded-2xl"
                                />
                            </div>

                            <PillButton
                                onClick={handleGenerate}
                                size="lg"
                                className="w-full h-16 text-xl"
                            >
                                Process Stream
                                <ArrowRight className="ml-2 size-6" />
                            </PillButton>
                        </div>
                    </GlassCard>
                </motion.div>
            </main>
        </BackgroundLayout>
    );
}
