import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "xl";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    {
                        "bg-primary text-white shadow-glow hover:brightness-110": variant === "primary",
                        "bg-secondary text-white shadow-soft hover:brightness-110": variant === "secondary",
                        "border-2 border-border bg-transparent hover:bg-muted text-text-main": variant === "outline",
                        "hover:bg-muted text-text-muted": variant === "ghost",
                        "bg-red-500 text-white hover:bg-red-600": variant === "danger",
                        "h-9 px-4 text-[10px]": size === "sm",
                        "h-12 px-6 text-xs": size === "md",
                        "h-14 px-8 text-sm": size === "lg",
                        "h-16 px-10 text-base": size === "xl",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
