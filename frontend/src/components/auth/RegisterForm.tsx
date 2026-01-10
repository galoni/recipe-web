'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerWithEmail } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Mail, Lock, User } from 'lucide-react';
import { clsx } from 'clsx';

export default function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await registerWithEmail(email, password, fullName);
            // Auto login or ask to login? Usually auto login is better experience but requires separate call or return token.
            // Current draft spec just says "creates new user".
            // Let's redirect to login for MVP or show success.
            setSuccess(true);
            setTimeout(() => router.push('/login'), 2000);
        } catch {
            setError("An error occurred during registration. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                <div className="text-primary text-xl font-bold">Account Created!</div>
                <p className="text-muted-foreground">Redirecting to login...</p>
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center font-medium border border-destructive/20"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/50 py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                    />
                </div>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/50 py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="password"
                        placeholder="Password (min 8 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/50 py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                        minLength={8}
                    />
                </div>
            </div>

            <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                    "relative w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20",
                    loading && "opacity-80 cursor-not-allowed"
                )}
            >
                <span className={clsx("flex items-center justify-center gap-2", loading && "invisible")}>
                    Create Account <ArrowRight className="h-4 w-4" />
                </span>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                )}
            </motion.button>
        </form>
    );
}
