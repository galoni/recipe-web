"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Shield,
    ChevronLeft,
    Smartphone,
    AlertTriangle,
    Fingerprint,
    Clock,
    Bell
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { PillButton } from "@/components/ui/PillButton";
import { SessionCard } from "@/components/security/SessionCard";
import {
    getCurrentUser,
    getActiveSessions,
    revokeSession,
    revokeAllOtherSessions,
    disableTwoFactor,
    toggleSecurityNotifications
} from "@/lib/api";
import { User, Session } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { TwoFactorSetup } from "@/components/security/TwoFactorSetup";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SecuritySettingsPage() {
    const queryClient = useQueryClient();
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false);

    const router = useRouter();

    const { data: user, isLoading: userLoading } = useQuery<User | null>({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
    });

    const { data: sessions, isLoading: sessionsLoading } = useQuery<Session[]>({
        queryKey: ["sessions"],
        queryFn: getActiveSessions,
        enabled: !!user, // Only fetch sessions if user exists
    });

    useEffect(() => {
        if (!userLoading && !user) {
            router.push('/login');
        }
    }, [user, userLoading, router]);

    const revokeMutation = useMutation({
        mutationFn: revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });

    const revokeOthersMutation = useMutation({
        mutationFn: revokeAllOtherSessions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });

    const disable2FAMutation = useMutation({
        mutationFn: disableTwoFactor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });

    const toggleNotificationsMutation = useMutation({
        mutationFn: toggleSecurityNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });

    const isInitialLoading = (userLoading && !user) || (sessionsLoading && !sessions);

    if (isInitialLoading) {
        return (
            <BackgroundLayout>
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout>
            <Navbar />
            <main className="container mx-auto max-w-4xl pt-32 p-6">
                <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Control Center</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                <Shield className="size-6" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-foreground">
                                    Neural <span className="font-serif italic text-emerald-400">Security</span>
                                </h1>
                                <p className="text-muted-foreground/70 font-medium">Manage access and cryptographic protocols</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        {/* 2FA Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Shield size={14} className="text-emerald-400" />
                                <h3 className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">Authentication Layers</h3>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-border/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded-2xl bg-secondary/30 flex items-center justify-center text-muted-foreground">
                                        <Smartphone className="size-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Two-Factor Authentication</h4>
                                        <p className="text-sm text-muted-foreground/70">Add an extra layer of security to your account</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${user?.is_2fa_enabled
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-secondary/30 text-muted-foreground/70 border-border/30"
                                        }`}>
                                        {user?.is_2fa_enabled ? "Active" : "Disabled"}
                                    </span>
                                    {user?.is_2fa_enabled ? (
                                        <PillButton
                                            variant="ghost"
                                            size="sm"
                                            type="button"
                                            className="h-10 text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20"
                                            onClick={() => setIsDisable2FAModalOpen(true)}
                                            disabled={disable2FAMutation.isPending}
                                        >
                                            {disable2FAMutation.isPending ? "Disabling..." : "Disable"}
                                        </PillButton>
                                    ) : (
                                        <PillButton
                                            variant="ghost"
                                            size="sm"
                                            type="button"
                                            className="h-10"
                                            onClick={() => setIs2FAModalOpen(true)}
                                        >
                                            Configure
                                        </PillButton>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Notifications Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Bell size={14} className="text-emerald-400" />
                                <h3 className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">Communication Prefs</h3>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-border/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="size-12 rounded-2xl bg-secondary/30 flex items-center justify-center text-muted-foreground">
                                        <Bell className="size-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Security Alerts</h4>
                                        <p className="text-sm text-muted-foreground/70">Email notifications for new logins and 2FA changes</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => user && toggleNotificationsMutation.mutate(!user.security_notifications_enabled)}
                                        disabled={toggleNotificationsMutation.isPending || !user}
                                        className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${user?.security_notifications_enabled ? 'bg-emerald-500' : 'bg-secondary/40'
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: user?.security_notifications_enabled ? 24 : 4 }}
                                            className="size-4 bg-white rounded-full absolute top-1 shadow-sm"
                                        />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Active Sessions */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-emerald-400" />
                                    <h3 className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">Authorized Devices</h3>
                                </div>
                                {sessions && sessions.length > 1 && (
                                    <button
                                        onClick={() => revokeOthersMutation.mutate()}
                                        className="text-[10px] font-bold text-red-400/60 hover:text-red-400 uppercase tracking-wider transition-colors"
                                    >
                                        Revoke All Others
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {sessions?.map((session) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onRevoke={(id) => revokeMutation.mutate(id)}
                                        isRevoking={revokeMutation.isPending}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Security Log Stub */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <AlertTriangle size={14} className="text-emerald-400" />
                                <h3 className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">Incident Log</h3>
                            </div>
                            <div className="p-8 rounded-[2rem] border border-border/20 bg-white/[0.01] flex flex-col items-center justify-center text-center gap-4">
                                <div className="size-12 rounded-full bg-secondary/30 flex items-center justify-center text-muted-foreground/50">
                                    <Fingerprint size={24} />
                                </div>
                                <div>
                                    <h5 className="text-white font-medium mb-1">Audit Trail</h5>
                                    <p className="text-sm text-muted-foreground/50 max-w-xs">Detailed security event logging is currently being synchronized.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </main>

            <Modal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                title="Initialize 2FA Protocol"
            >
                <TwoFactorSetup
                    onSuccess={() => setIs2FAModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isDisable2FAModalOpen}
                onClose={() => setIsDisable2FAModalOpen(false)}
                title="Deactivate 2FA Protocol"
            >
                <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-4">
                        <AlertTriangle className="text-red-400 shrink-0" size={24} />
                        <div>
                            <h4 className="text-red-400 font-bold text-sm mb-1">Security Degradation Warning</h4>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Disabling 2FA will significantly reduce your account&apos;s protection against unauthorized access.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <PillButton
                            variant="primary"
                            className="bg-red-500 hover:bg-red-600 text-white border-none"
                            onClick={() => {
                                disable2FAMutation.mutate();
                                setIsDisable2FAModalOpen(false);
                            }}
                            disabled={disable2FAMutation.isPending}
                        >
                            Confirm Deactivation
                        </PillButton>
                        <PillButton
                            variant="secondary"
                            onClick={() => setIsDisable2FAModalOpen(false)}
                        >
                            Cancel
                        </PillButton>
                    </div>
                </div>
            </Modal>
        </BackgroundLayout>
    );
}
