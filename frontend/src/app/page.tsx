"use client";

import { Navbar } from "@/components/shared/navbar";
import { NeonButton } from "@/components/ui/NeonButton";

import { Sparkles, ChefHat, Zap, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";

export default function LandingPage() {

  return (
    <BackgroundLayout>
      <Navbar />

      <main className="flex-grow flex flex-col pt-20">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 lg:py-32 flex flex-col items-center justify-center">

          <div className="container px-6 relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* New "Holographic" Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-10 group"
            >
              <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full animate-pulse" />
              <div className="relative px-6 py-2 rounded-full border border-primary/30 bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                <Sparkles className="size-4 text-cyan-400 animate-spin-slow" />
                <span className="text-cyan-100 font-bold tracking-widest text-sm uppercase">Next Gen Kitchen AI</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 font-display leading-[0.9]"
            >
              YouTube to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-shine bg-[size:200%_auto]">
                Real Food.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-2xl text-blue-100/60 max-w-2xl mb-12 leading-relaxed font-light"
            >
              Stop pausing videos. Extract ingredients instantly. <br />
              The first cooking assistant from the year 3000.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center"
            >
              <Link href="/register">
                <NeonButton size="lg" className="w-64 h-16 text-xl rounded-full shadow-[0_0_40px_rgba(0,240,255,0.3)] hover:shadow-[0_0_60px_rgba(0,240,255,0.5)] border-none">
                  Get Started Free
                </NeonButton>
              </Link>
              <Link href="/login">
                <button className="text-white/60 hover:text-white font-medium transition-colors border-b border-transparent hover:border-white/40 pb-1">
                  Existing User? Log In
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID - Simplified & Cleaner */}
        <section className="py-20 relative">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureItem
                icon={<Zap className="size-8" />}
                title="Instant Sync"
                desc="Paste a URL. Get a recipe. Zero friction."
                delay={0.7}
              />
              <FeatureItem
                icon={<Monitor className="size-8" />}
                title="Focus Mode"
                desc="Big text. High contrast. Hands-free."
                delay={0.8}
              />
              <FeatureItem
                icon={<ChefHat className="size-8" />}
                title="AI Chef"
                desc="Understands context, nuance, and technique."
                delay={0.9}
              />
            </div>
          </div>
        </section>
      </main>
    </BackgroundLayout>
  );
}

import { ReactNode } from "react";

function FeatureItem({ icon, title, desc, delay }: { icon: ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center text-cyan-300 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 font-display">{title}</h3>
      <p className="text-white/50 leading-relaxed">{desc}</p>
    </motion.div>
  )
}
