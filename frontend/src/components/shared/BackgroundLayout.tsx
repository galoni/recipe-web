"use client";

import { motion } from "framer-motion";

export function BackgroundLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full flex flex-col font-sans bg-background selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Global Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
                {/* Deep Gradient Base */}
                <div className="absolute inset-0 bg-background" />

                {/* Aurora Orbs - Large, soft, and slow */}
                <motion.div
                    animate={{
                        x: [0, 100, -100, 0],
                        y: [0, -50, 50, 0],
                        scale: [1, 1.2, 0.8, 1],
                        opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[200px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 100, 0],
                        y: [0, 50, -50, 0],
                        scale: [1, 0.8, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear", delay: 5 }}
                    className="absolute bottom-[-30%] right-[-10%] w-[1200px] h-[1200px] bg-accent/20 rounded-full blur-[240px]"
                />

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grain-y.com/images/grain-dark.png')] mix-blend-overlay" />
            </div>

            <div className="relative z-10 flex-grow flex flex-col">
                {children}
            </div>
        </div>
    );
}
