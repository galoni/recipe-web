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
                    "rounded-xl border backdrop-blur-md transition-all duration-300",
                    // Default: Subtle glass
                    variant === "default" && "bg-card/40 border-white/10 shadow-soft hover:bg-card/50",
                    // Neon: Glowing border and darker bg
                    variant === "neon" && "bg-black/60 border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-primary/80",
                    // Ghost: Very minimal
                    variant === "ghost" && "bg-transparent border-transparent hover:bg-white/5",
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
