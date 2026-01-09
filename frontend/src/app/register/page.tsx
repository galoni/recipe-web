"use client";

import RegisterForm from '@/components/auth/RegisterForm';
import SocialLoginButton from '@/components/auth/SocialLoginButton';
import Link from 'next/link';
import { BackgroundLayout } from '@/components/shared/BackgroundLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles } from 'lucide-react';

export default function RegisterPage() {
    return (
        <BackgroundLayout>
            <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-32 pb-12">
                <GlassCard variant="neon" className="w-full max-w-lg p-8 md:p-14">
                    <div className="flex flex-col items-center gap-8 mb-12">
                        <div className="size-20 rounded-3xl bg-secondary/10 flex items-center justify-center border border-white/10">
                            <Sparkles className="size-10 text-primary" />
                        </div>
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[0.9]">
                                Secure <span className="font-serif italic text-primary">Access</span>.
                            </h1>
                            <p className="text-white/40 text-lg font-medium">Initialize your global culinary heritage.</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <SocialLoginButton />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                                <span className="bg-background/20 backdrop-blur-xl px-4 text-white/30">
                                    Or create Identity
                                </span>
                            </div>
                        </div>

                        <RegisterForm />
                    </div>

                    <div className="text-center text-sm font-medium mt-10">
                        <p className="text-white/30 text-lg font-medium">
                            Already verified?{' '}
                            <Link href="/login" className="font-bold text-primary hover:text-white transition-colors">
                                Authenticate
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </BackgroundLayout>
    );
}
