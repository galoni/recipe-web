import RegisterForm from '@/components/auth/RegisterForm';
import SocialLoginButton from '@/components/auth/SocialLoginButton';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/2" />

            <div className="w-full max-w-md space-y-8 glass p-8 rounded-3xl shadow-xl border-border/50">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
                    <p className="text-muted-foreground">Start saving your favorite recipes</p>
                </div>

                <div className="space-y-6">
                    <SocialLoginButton />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground rounded-full border border-border">
                                Or sign up using email
                            </span>
                        </div>
                    </div>

                    <RegisterForm />
                </div>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
