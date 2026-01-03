"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { StepCard } from "@/components/ui/step-card";
import { Youtube, Zap, ChefHat, Sparkles, Smartphone, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const router = useRouter();

  const handleGenerate = () => {
    if (!videoUrl) return;
    router.push(`/dashboard?url=${encodeURIComponent(videoUrl)}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* HERO SECTION */}
        <section className="relative w-full py-32 lg:py-48 flex flex-col items-center justify-center overflow-hidden">
          {/* Background Ambience */}
          <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-float opacity-60" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-float opacity-60" style={{ animationDelay: "2s" }} />
          </div>

          <div className="container px-6 relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest mb-8 shadow-glow"
            >
              <Sparkles className="size-3.5" />
              <span>AI-Powered Cooking Assistant</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground mb-6 font-display max-w-5xl"
            >
              Turn YouTube into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-500">
                Cooking Mode.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
            >
              Stop pausing and rewinding. Get a clean list of ingredients
              and step-by-step instructions from any video instantly.
            </motion.p>

            {/* INPUT FIELD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-card border border-border rounded-2xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="pl-4 pr-3 text-muted-foreground">
                  <Youtube className="size-6" />
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 text-lg font-medium h-12"
                  placeholder="Paste YouTube URL here..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <Button
                  onClick={handleGenerate}
                  size="lg"
                  className="h-12 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform active:scale-95"
                >
                  Generate
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-32 bg-secondary/30 border-y border-border/50 relative overflow-hidden">
          <div className="container px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black font-display text-foreground mb-6">How it works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Transform complexity into simplicity in just three steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <StepCard
                number={1}
                title="Paste Link"
                description="Copy any cooking video URL from YouTube and paste it into ChefStream."
              />
              <StepCard
                number={2}
                title="AI Processing"
                description="Our Gemini 2.0 AI analyzes the video to extract ingredients and precise steps."
              />
              <StepCard
                number={3}
                title="Start Cooking"
                description="Follow the interactive guide with hands-free mode and timers tailored for you."
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-32 container px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-black font-display text-foreground mb-6 leading-tight">
                Built for the <br />
                <span className="text-primary">Modern Kitchen</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                ChefStream isn&apos;t just a transcriber. It&apos;s an intelligent companion that understands context,
                timing, and the nuance of cooking.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={ChefHat}
                  title="Smart Detection"
                  description="Identifies ingredients even if they aren't explicitly listed."
                />
                <FeatureCard
                  icon={Smartphone}
                  title="Mobile First"
                  description="Designed to look perfect on your phone while you cook."
                />
                <FeatureCard
                  icon={Zap}
                  title="Instant Sync"
                  description="Save recipes to your personal cookbook forever."
                />
                <FeatureCard
                  icon={Monitor}
                  title="Focus Mode"
                  description="Distraction-free interface designed for messy hands."
                />
              </div>
            </div>

            {/* Visual element for features */}
            <div className="md:w-1/2 relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-primary/10 to-secondary/10 border border-white/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 backdrop-blur-3xl" />
                <div className="relative z-10 p-10 text-center">
                  <div className="size-24 bg-background rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 rotate-12">
                    <ChefHat className="size-12 text-primary" />
                  </div>
                  <div className="glass-card p-6 rounded-2xl max-w-xs mx-auto -rotate-3 transition-transform hover:rotate-0 duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">1</div>
                      <div className="h-2 w-24 bg-muted rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-muted rounded-full" />
                      <div className="h-2 w-3/4 bg-muted rounded-full" />
                      <div className="h-2 w-5/6 bg-muted rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 px-6 bg-secondary/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="text-2xl font-black font-display text-foreground tracking-tighter">ChefStream</span>
              <p className="text-muted-foreground text-sm mt-2">© 2026 ChefStream AI. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
