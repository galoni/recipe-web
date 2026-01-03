import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-full font-bold transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]",
                    // Sizes
                    size === "sm" && "h-10 px-6 text-sm",
                    size === "md" && "h-12 px-8 text-base",
                    size === "lg" && "h-14 px-10 text-lg",

                    // Variants
                    variant === "primary" && "bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsla(var(--primary),0.3)] hover:brightness-105",
                    variant === "secondary" && "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                    variant === "outline" && "border-2 border-primary text-primary bg-transparent hover:bg-primary/5",
                    variant === "ghost" && "hover:bg-white/5 text-white/70 hover:text-white",

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

PillButton.displayName = "PillButton";
