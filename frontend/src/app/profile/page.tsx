"use client";

import { Navbar } from "@/components/shared/navbar";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api";
import { User, Mail, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { data: user, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
    });

    if (isLoading) return null;
    if (!user) return (
        <BackgroundLayout>
            <Navbar />
            <div className="flex h-screen items-center justify-center">
                <p className="text-white/50">Please log in to view your profile.</p>
            </div>
        </BackgroundLayout>
    );

    return (
        <BackgroundLayout>
            <Navbar />
            <main className="container mx-auto max-w-4xl pt-32 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 md:p-12 rounded-[3.5rem]"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="size-32 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(0,240,255,0.15)]">
                            <User className="size-16" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                {user.full_name || "Chef Enigma"}
                            </h1>
                            <p className="text-xl text-primary font-serif italic">Kitchen Architect</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileStat icon={<Mail className="size-5" />} label="Email" value={user.email} />
                        <ProfileStat icon={<Shield className="size-5" />} label="Status" value="Verified Pioneer" />
                        <ProfileStat icon={<Clock className="size-5" />} label="Joined" value="Beta Wave v1.0" />
                        <ProfileStat icon={<User className="size-5" />} label="ID" value={String(user.id)} />
                    </div>
                </motion.div>
            </main>
        </BackgroundLayout>
    );
}

function ProfileStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4">
            <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-white/20 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </div>
    );
}
