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
            <div className="flex-grow flex items-center justify-center p-4">
                <GlassCard variant="neon" className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-2xl">
                    <div className="flex flex-col items-center gap-6 mb-8">
                        <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                            <Sparkles className="size-8 text-accent" />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-display">Join the Future</h1>
                            <p className="text-blue-200/60 font-medium">Create your AI cookbook account</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <SocialLoginButton />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="bg-transparent px-4 text-muted-foreground/50">
                                    Or with email
                                </span>
                            </div>
                        </div>

                        <RegisterForm />
                    </div>

                    <div className="text-center text-sm font-medium mt-8">
                        <p className="text-muted-foreground">
                            Already joined?{' '}
                            <Link href="/login" className="font-bold text-primary hover:text-cyan-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </BackgroundLayout>
    );
}
