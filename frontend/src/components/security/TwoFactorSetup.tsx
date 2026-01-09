"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Check, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PillButton } from "@/components/ui/PillButton";
import { getTwoFactorSetup, enableTwoFactor } from "@/lib/api";

interface TwoFactorSetupProps {
    onSuccess: () => void;
}

export const TwoFactorSetup = ({ onSuccess }: TwoFactorSetupProps) => {
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const { data: setupData, isLoading } = useQuery({
        queryKey: ["2fa-setup"],
        queryFn: getTwoFactorSetup,
        staleTime: 0,
    });

    const enableMutation = useMutation({
        mutationFn: (data: { code: string; secret: string }) => enableTwoFactor(data.code, data.secret),
        onSuccess: (data: { backup_codes?: string[] }) => {
            setBackupCodes(data?.backup_codes || []);
            setStep(3);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: () => {
            setError("Invalid verification code. Please try again.");
        }
    });

    const handleVerify = () => {
        if (code.length !== 6) {
            setError("Please enter a 6-digit code.");
            return;
        }
        if (setupData) {
            enableMutation.mutate({ code, secret: setupData.secret });
        }
    };

    const copySecret = () => {
        if (setupData?.secret) {
            navigator.clipboard.writeText(setupData.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <RefreshCw className="animate-spin text-emerald-400 mb-4" size={32} />
                <p className="text-white/40">Initializing secure channel...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-white">Sync Authenticator</h3>
                            <p className="text-white/40 text-sm">Scan the QR code with your preferred authentication app</p>
                        </div>

                        <div className="flex justify-center p-4 bg-white rounded-3xl mx-auto w-fit">
                            {setupData?.qr_code_base64 && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={setupData.qr_code_base64} alt="2FA QR Code" className="size-48" />
                            )}
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">Manual Entry Key</p>
                            <div className="flex items-center justify-between gap-4">
                                <code className="text-emerald-400 font-mono tracking-wider">{setupData?.secret}</code>
                                <button
                                    onClick={copySecret}
                                    className="text-white/20 hover:text-white transition-colors"
                                >
                                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <PillButton className="w-full" onClick={() => setStep(2)}>
                            I&apos;ve scanned it <ChevronRight size={18} className="ml-2" />
                        </PillButton>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-white">Verify Code</h3>
                            <p className="text-white/40 text-sm">Enter the 6-digit code from your app</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.replace(/\D/g, ""));
                                    setError("");
                                }}
                                placeholder="000000"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-3xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <PillButton variant="ghost" className="flex-1" onClick={() => setStep(1)}>
                                Back
                            </PillButton>
                            <PillButton
                                className="flex-[2]"
                                onClick={handleVerify}
                                disabled={enableMutation.isPending || code.length !== 6}
                            >
                                {enableMutation.isPending ? "Verifying..." : "Enable 2FA"}
                            </PillButton>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 text-center"
                    >
                        <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <Check size={32} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">Security Enabled</h3>
                            <p className="text-white/40 text-sm">Neural link secured. Please save these backup codes in a safe place.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 p-4 bg-black/40 rounded-2xl font-mono text-emerald-400/80 border border-white/5">
                            {backupCodes.map((code, idx) => (
                                <div key={idx} className="flex items-center justify-center gap-2">
                                    <span className="text-white/10 text-xs">{idx + 1}.</span>
                                    <span>{code}</span>
                                </div>
                            ))}
                        </div>

                        <PillButton className="w-full" onClick={onSuccess}>
                            All Secure
                        </PillButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
