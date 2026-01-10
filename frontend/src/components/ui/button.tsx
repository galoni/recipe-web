import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "xl" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    {
                        "bg-primary text-primary-foreground shadow-glow hover:brightness-110": variant === "primary",
                        "bg-secondary text-foreground shadow-soft hover:brightness-110": variant === "secondary",
                        "border-2 border-border bg-transparent hover:bg-muted text-foreground": variant === "outline",
                        "hover:bg-muted text-muted-foreground": variant === "ghost",
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "danger",
                        "h-9 px-4 text-[10px]": size === "sm",
                        "h-12 px-6 text-xs": size === "md",
                        "h-14 px-8 text-sm": size === "lg",
                        "h-16 px-10 text-base": size === "xl",
                        "h-10 w-10 min-w-10 p-0 rounded-full": size === "icon",
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
