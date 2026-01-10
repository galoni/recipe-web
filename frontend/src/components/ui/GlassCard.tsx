import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "neon" | "ghost";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-700",
                    // Default: Subtle glass
                    variant === "default" && "bg-white/[0.03] border-border/30 shadow-premium hover:bg-white/[0.05]",
                    // Neon: Glowing border and darker bg (Renamed or repurposed for Premium)
                    variant === "neon" && "bg-background/60 border-border/30 shadow-premium hover:border-primary/30",
                    // Ghost: Very minimal
                    variant === "ghost" && "bg-transparent border-transparent hover:bg-white/[0.03]",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";
