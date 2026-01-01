"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Youtube, Play, Zap, ChefHat, Sparkles, Wand2 } from "lucide-react";
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
    <div className="flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Navbar />

      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[10%] size-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] size-[500px] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow flex flex-col items-center pt-24 pb-32">
        <section className="w-full max-w-7xl px-6 flex flex-col items-center relative">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass border border-primary/20 text-primary-dark dark:text-primary text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-glow"
          >
            <Sparkles className="size-4" />
            <span>Powered by Gemini 2.0</span>
          </motion.div>

          {/* Hero Heading */}
          <div className="text-center space-y-8 mb-16 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-8xl font-black leading-[1.1] tracking-tighter text-text-main font-outfit"
            >
              Watch. Cook. <br />
              <span className="text-primary italic relative">
                Seamlessly.
                <div className="absolute -bottom-2 inset-x-0 h-3 bg-primary/20 -skew-x-12 -z-10" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto font-medium"
            >
              Convert any YouTube cooking video into a focused, ad-free <span className="text-text-main font-bold">Cooking Mode</span> with AI-extracted ingredients and steps.
            </motion.p>
          </div>

          {/* Mega Input Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2.5rem] blur-2xl opacity-20" />

            <div className="relative group p-3 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl rounded-[2rem] border-2 border-border shadow-2xl focus-within:border-primary/50 transition-all">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="flex-1 flex items-center px-6 py-4 w-full">
                  <Youtube className="text-red-500 mr-4 h-7 w-7 flex-shrink-0" />
                  <input
                    type="text"
                    className="w-full bg-transparent border-none text-text-main placeholder-text-muted/50 text-xl focus:outline-none font-bold"
                    placeholder="Paste YouTube Link..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                </div>
                <Button
                  onClick={handleGenerate}
                  className="w-full md:w-auto h-16 md:h-auto px-10 py-5 rounded-[1.5rem] bg-primary hover:bg-primary-dark text-white text-lg font-black shadow-glow group-hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                  <Wand2 className="size-6" />
                  Extract Recipe
                </Button>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {[
                { icon: Zap, label: "Instant Extraction" },
                { icon: ChefHat, label: "Smart Ingredients" },
                { icon: Play, label: "Focused View" }
              ].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={i}
                  className="flex items-center gap-2.5 text-sm font-black text-text-muted uppercase tracking-widest bg-muted/30 px-4 py-2 rounded-full border border-border"
                >
                  <item.icon className="size-4 text-primary" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Demo Video Section (Optional visual) */}
        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 w-full max-w-5xl px-6"
        >
          <div className="relative p-2 bg-muted/50 border border-border rounded-[3rem] shadow-2xl overflow-hidden aspect-video">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
            <div className="w-full h-full bg-surface-dark flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="size-24 bg-white/10 rounded-full flex items-center justify-center glass shadow-glow mx-auto mb-6">
                  <Play className="size-10 fill-white text-white ml-2" />
                </div>
                <h3 className="text-2xl font-black text-white font-outfit">See it in action</h3>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-20 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="text-3xl font-black font-outfit text-primary">ChefStream</div>
            <p className="text-text-muted max-w-xs">Elevating your home cooking experience through AI innovation.</p>
          </div>
          <div className="flex gap-10 text-sm font-bold text-text-muted uppercase tracking-widest">
            <Link href="#" className="hover:text-primary">Docs</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
          </div>
          <div className="text-xs font-medium text-text-muted/50 uppercase tracking-widest">
            © 2026 ChefStream AI. Built with Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
}
