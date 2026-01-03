"use client";

import { Navbar } from "@/components/shared/navbar";
import { PillButton } from "@/components/ui/PillButton";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { SearchBar } from "@/components/ui/search-bar";
import { RecipeCard } from "@/components/shared/recipe-card";
import { exploreRecipes } from "@/lib/api";
import { Recipe } from "@/lib/types";

import { Sparkles, ChefHat, Zap, Monitor, ArrowRight, Check, X, Play, Youtube, Instagram, Cpu, Compass } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const workflowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: workflowRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <BackgroundLayout>
      <Navbar />

      <main className="flex-grow flex flex-col pt-20 md:pt-32">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 lg:py-32 flex flex-col items-center justify-center overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-1/4 left-10 md:left-20 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl rotate-[-12deg]"
            >
              <div className="flex items-center gap-2">
                <Youtube className="size-4 text-red-500" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Neural Source</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute bottom-1/3 right-10 md:right-20 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl rotate-[8deg]"
            >
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Processing v4.2</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
              transition={{ duration: 9, repeat: Infinity }}
              className="absolute top-1/2 right-[15%] px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl rotate-[-5deg] hidden lg:block"
            >
              <div className="flex items-center gap-2">
                <Instagram className="size-4 text-pink-500" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Visual Hook</span>
              </div>
            </motion.div>
          </div>

          <div className="container px-6 relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10"
            >
              <Sparkles className="size-3.5 text-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">Now in Private Beta</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-8 leading-[0.9]"
            >
              Your <span className="font-serif italic text-primary">own</span> <br />
              Creative Kitchen.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/50 max-w-2xl mb-14 leading-relaxed font-medium"
            >
              Stop pausing videos. Extract ingredients instantly with neural parsing. The evolution of the home cook begins here.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-2xl mb-12"
            >
              <SearchBar
                onSearch={(q) => router.push(`/explore?q=${encodeURIComponent(q)}`)}
                placeholder="Find existing recipes..."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/register">
                <PillButton size="lg" className="h-16 px-12 text-lg">
                  Start Extracting
                  <ArrowRight className="ml-2 size-5" />
                </PillButton>
              </Link>
              <Link href="/explore">
                <PillButton variant="secondary" size="lg" className="h-16 px-12 text-lg">
                  Explore Library
                </PillButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* RECENT DISCOVERIES SECTION */}
        <section className="py-20 relative overflow-hidden">
          <div className="container px-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                  <Compass className="size-4" /> Fresh Mentions
                </h3>
                <h2 className="text-4xl font-bold text-white">Community <span className="font-serif italic text-primary">Discoveries</span>.</h2>
              </div>
              <Link href="/explore">
                <PillButton variant="ghost" className="text-white/40 hover:text-white">
                  View All <ArrowRight className="ml-2 size-4" />
                </PillButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RecentDiscoveries />
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <InfiniteMarquee
          items={["Neural Parsing", "Smart Inventory", "Kitchen Display", "Cinematic AI", "Global Cookbook", "Recipe Sync"]}
          speed={60}
          className="border-y border-white/5 my-10"
        />

        {/* WORKFLOW SECTION */}
        <section ref={workflowRef} className="py-24 relative bg-white/[0.02] overflow-hidden">
          <div className="container px-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-stretch">
              <div className="relative">
                <motion.div
                  style={{ y: y1 }}
                  className="sticky top-40 rounded-[3rem] overflow-hidden border border-white/10 shadow-premium aspect-[4/5] md:aspect-video lg:aspect-square group"
                >
                  <Image
                    src="/ai_workflow_abstract.png"
                    alt="AI Workflow"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="size-24 rounded-full bg-primary/20 backdrop-blur-3xl border border-primary/30 flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(0,240,255,0.2)]"
                    >
                      <Play className="size-10 text-primary fill-primary ml-1" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col gap-12 py-20">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-7xl font-bold text-white leading-tight"
                >
                  From <span className="font-serif italic font-normal">Streaming</span> <br />
                  to the Stove.
                </motion.h2>

                <div className="flex flex-col gap-16">
                  <WorkflowStep
                    number="01"
                    title="Paste Your Link"
                    desc="Drop any cooking tutorial URL. From YouTube to Instagram, we've got you covered."
                    delay={0.1}
                  />
                  <WorkflowStep
                    number="02"
                    title="Neural Parsing"
                    desc="Our AI watches the video frame-by-frame, identifying ingredients and techniques in milliseconds."
                    delay={0.2}
                  />
                  <WorkflowStep
                    number="03"
                    title="Cinematic Cooking"
                    desc="A distraction-free interface designed for your tablet or kitchen display."
                    delay={0.3}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-32 relative">
          <div className="container px-6 max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-8xl font-bold text-white mb-8">Built for <span className="font-serif italic font-normal text-primary">Mastery</span>.</h2>
              <p className="text-white/40 text-2xl max-w-3xl mx-auto font-medium leading-relaxed">Every tool you need to build your digital heritage collection using cutting-edge vision models.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="size-8" />}
                title="Neural Extraction"
                desc="Proprietary AI models that understand kitchen terminology and visual context."
              />
              <FeatureCard
                icon={<ChefHat className="size-8" />}
                title="Smart Inventory"
                desc="Automatically cross-references extracted items with your digital pantry."
              />
              <FeatureCard
                icon={<Monitor className="size-8" />}
                title="Kitchen Overlay"
                desc="A bold, high-contrast UI that stays readable even from across the room."
              />
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION */}
        <section className="py-32 relative overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 size-[1000px] border border-white/5 rounded-full pointer-events-none"
          />

          <div className="container px-6 max-w-5xl mx-auto relative z-10">
            <div className="glass-card rounded-[4rem] p-12 md:p-24 overflow-hidden relative border-white/10 shadow-premium">
              <motion.div
                style={{ y: y2 }}
                className="absolute top-0 right-0 p-10 opacity-[0.03]"
              >
                <Monitor className="size-80 text-primary" />
              </motion.div>

              <h2 className="text-5xl md:text-8xl font-bold text-white mb-20 text-center">
                The <span className="font-serif italic font-normal">Upgrade</span>.
              </h2>

              <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="p-12 md:p-16 bg-background/60 backdrop-blur-3xl">
                  <h3 className="text-xs font-bold text-white/40 mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                    <X className="size-4 text-destructive" /> The Old Way
                  </h3>
                  <ul className="space-y-8">
                    <ComparisonItem text="Pausing videos every 5 seconds" />
                    <ComparisonItem text="Messy notes on napkins" />
                    <ComparisonItem text="Screen turning off mid-cook" />
                    <ComparisonItem text="Searching for that 'one' video" />
                  </ul>
                </div>
                <div className="p-12 md:p-16 bg-primary/5 backdrop-blur-3xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                  <h3 className="text-xs font-bold text-primary mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Check className="size-4" /> The ChefStream Way
                  </h3>
                  <ul className="space-y-8">
                    <ComparisonItem text="Instant neural extraction" active />
                    <ComparisonItem text="Clean, digital cookbook" active />
                    <ComparisonItem text="Hands-free cinematic mode" active />
                    <ComparisonItem text="Universal search \u0026 AI tags" active />
                  </ul>
                </div>
              </div>

              <div className="mt-24 text-center">
                <Link href="/register">
                  <PillButton size="lg" className="h-20 px-20 text-2xl shadow-[0_20px_60px_-15px_rgba(0,240,255,0.3)]">
                    Join the Evolution
                  </PillButton>
                </Link>
                <p className="mt-8 text-white/20 text-sm font-bold uppercase tracking-[0.2em]">Free during closed beta</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </BackgroundLayout>
  );
}

function RecentDiscoveries() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await exploreRecipes();
        setRecipes(data.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return Array(3).fill(0).map((_, i) => (
      <div key={i} className="h-96 rounded-[3.5rem] bg-white/5 animate-pulse border border-white/5" />
    ));
  }

  return (
    <AnimatePresence>
      {recipes.map((recipe, idx) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
        >
          <RecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function WorkflowStep({ number, title, desc, delay }: { number: string, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="flex gap-10 group"
    >
      <span className="text-2xl font-serif italic text-primary/20 group-hover:text-primary transition-all duration-500 scale-150 origin-top-left">{number}</span>
      <div className="space-y-4">
        <h4 className="text-3xl font-bold text-white group-hover:translate-x-2 transition-transform duration-500">{title}</h4>
        <p className="text-xl text-white/30 leading-relaxed font-medium group-hover:text-white/50 transition-colors duration-500">{desc}</p>
      </div>
    </motion.div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -15 }}
      className="glass-card p-12 rounded-[3.5rem] group border-white/5 hover:border-primary/20 transition-all duration-700 hover:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]"
    >
      <div className="size-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/30 mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-700 shadow-inner">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-primary transition-colors duration-500">{title}</h3>
      <p className="text-xl text-white/30 leading-relaxed font-medium group-hover:text-white/50 transition-colors duration-500">{desc}</p>
    </motion.div>
  )
}

function ComparisonItem({ text, active }: { text: string, active?: boolean }) {
  return (
    <motion.li
      whileHover={{ x: 10 }}
      className={cn(
        "flex items-center gap-6 text-xl font-medium transition-all duration-500",
        active ? "text-white" : "text-white/20"
      )}
    >
      <div className={cn(
        "size-8 rounded-full flex items-center justify-center border transition-all duration-500",
        active ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/5 text-white/10"
      )}>
        {active ? <Check className="size-5" /> : <X className="size-4" />}
      </div>
      {text}
    </motion.li>
  )
}
