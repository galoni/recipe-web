import LoginForm from '@/components/auth/LoginForm';
import SocialLoginButton from '@/components/auth/SocialLoginButton';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-background font-sans">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-float" />

            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-md space-y-8 glass p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black tracking-tighter text-foreground font-display">Welcome Back</h1>
                    <p className="text-muted-foreground font-medium text-lg">Sign in to continue your cooking journey</p>
                </div>

                <div className="space-y-8">
                    <SocialLoginButton />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                            <span className="bg-transparent px-4 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <LoginForm />
                </div>

                <div className="text-center text-sm font-medium">
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-bold text-primary hover:text-primary/80 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
