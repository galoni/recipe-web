"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
    items: string[];
    direction?: "left" | "right";
    speed?: number;
    className?: string;
}

export function InfiniteMarquee({
    items,
    direction = "left",
    speed = 40,
    className,
}: MarqueeProps) {
    return (
        <div className={cn("relative overflow-hidden whitespace-nowrap py-10", className)}>
            <motion.div
                className="inline-flex gap-20 items-center pr-20"
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
            >
                {/* Render items multiple times to create the infinite effect */}
                {[...items, ...items, ...items, ...items].map((item, idx) => (
                    <span
                        key={idx}
                        className="text-4xl md:text-6xl font-bold text-white/10 uppercase tracking-tighter hover:text-primary transition-colors cursor-default select-none"
                    >
                        {item}
                    </span>
                ))}
            </motion.div>

            {/* Gradients for fading edges */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
    );
}
