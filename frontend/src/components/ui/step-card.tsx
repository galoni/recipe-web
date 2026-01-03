"use client";

interface StepCardProps {
    number: number;
    title: string;
    description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 rounded-3xl glass-card border border-white/5 bg-card/40 dark:bg-card/20 backdrop-blur-md">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-transparent absolute -top-4 -right-4 select-none">
                    {number}
                </span>
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-6 shadow-glow">
                    {number}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 font-display">{title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}
