import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const ModernInput = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, type, ...props }, ref) => {
        return (
            <div className="relative flex items-center w-full group">
                {icon && (
                    <div className="absolute left-4 text-muted-foreground/50 group-focus-within:text-primary transition-all duration-500">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-14 w-full rounded-2xl border border-border/30 bg-secondary/30 px-4 py-2 text-lg text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-500 backdrop-blur-xl",
                        icon && "pl-14",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
ModernInput.displayName = "ModernInput";
