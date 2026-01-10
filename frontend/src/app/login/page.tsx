"use client";

import LoginForm from '@/components/auth/LoginForm';
import SocialLoginButton from '@/components/auth/SocialLoginButton';
import Link from 'next/link';
import { BackgroundLayout } from '@/components/shared/BackgroundLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChefHat } from 'lucide-react';

export default function LoginPage() {
    return (
        <BackgroundLayout>
            <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-32 pb-12">
                <GlassCard variant="neon" className="w-full max-w-lg p-8 md:p-14">
                    <div className="flex flex-col items-center gap-8 mb-12">
                        <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <ChefHat className="size-10 text-primary" />
                        </div>
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-[0.9]">
                                Welcome <span className="font-serif italic text-primary">Back</span>.
                            </h1>
                            <p className="text-muted-foreground text-lg font-medium">Access your global heritage cookbook.</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <SocialLoginButton />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                                <span className="bg-background/20 backdrop-blur-xl px-4 text-muted-foreground/60">
                                    Or verify via email
                                </span>
                            </div>
                        </div>

                        <LoginForm />
                    </div>

                    <div className="text-center text-sm font-medium mt-10">
                        <p className="text-muted-foreground text-lg font-medium">
                            No access?{' '}
                            <Link href="/register" className="font-bold text-primary hover:text-foreground transition-colors">
                                Create Identity
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </BackgroundLayout>
    );
}
