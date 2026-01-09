"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { PillButton } from "@/components/ui/PillButton";
import { verify2FA } from "@/lib/auth";

function TwoFactorVerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const challengeToken = searchParams.get("token");

    useEffect(() => {
        if (!challengeToken) {
            router.push("/login");
        }
    }, [challengeToken, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!challengeToken || code.length !== 6) return;

        setLoading(true);
        setError("");

        try {
            await verify2FA(code, challengeToken);
            await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            router.push("/dashboard");
        } catch {
            setError("Invalid verification code. Please check your app.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard variant="neon" className="w-full max-w-lg p-8 md:p-14">
            <div className="flex flex-col items-center gap-8 mb-12">
                <div className="size-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Shield className="size-10 text-emerald-400" />
                </div>
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-white leading-[0.9]">
                        Secure <span className="font-serif italic text-emerald-400">Access</span>.
                    </h1>
                    <p className="text-white/40 text-lg font-medium">Verify your secondary authentication layer.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 px-4">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.replace(/\D/g, ""));
                            setError("");
                        }}
                        placeholder="000000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-4xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        autoFocus
                    />
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-red-400 text-sm justify-center"
                            >
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <PillButton
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full h-16 text-lg"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            Verify Identity <ArrowRight className="ml-2" />
                        </>
                    )}
                </PillButton>
            </form>

            <div className="text-center mt-10">
                <button
                    onClick={() => router.push("/login")}
                    className="text-white/30 hover:text-white transition-colors text-sm font-medium"
                >
                    Cancel and return to login
                </button>
            </div>
        </GlassCard>
    );
}

export default function TwoFactorVerifyPage() {
    return (
        <BackgroundLayout>
            <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-32 pb-12">
                <Suspense fallback={
                    <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin text-emerald-400" size={32} />
                    </div>
                }>
                    <TwoFactorVerifyContent />
                </Suspense>
            </div>
        </BackgroundLayout>
    );
}
