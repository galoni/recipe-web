import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    glow?: boolean;
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, glow = true, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
                    // Sizes
                    size === "sm" && "h-9 px-4 text-sm",
                    size === "md" && "h-11 px-8 text-base",
                    size === "lg" && "h-14 px-10 text-lg",

                    // Variants
                    variant === "primary" && "bg-primary text-primary-foreground hover:brightness-110",
                    variant === "primary" && glow && "shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]",

                    variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",

                    variant === "outline" && "border border-primary text-primary bg-transparent hover:bg-primary/10",
                    variant === "outline" && glow && "shadow-[inset_0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",

                    variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",

                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

NeonButton.displayName = "NeonButton";
