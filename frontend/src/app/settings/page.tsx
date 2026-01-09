"use client";

import { Navbar } from "@/components/shared/navbar";
import { BackgroundLayout } from "@/components/shared/BackgroundLayout";
import { Settings, Bell, Lock, Eye, Palette, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { PillButton } from "@/components/ui/PillButton";

export default function SettingsPage() {
    return (
        <BackgroundLayout>
            <Navbar />
            <main className="container mx-auto max-w-4xl pt-32 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 md:p-12 rounded-[3.5rem]"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Settings className="size-6" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Interface <span className="font-serif italic text-primary">Control</span></h1>
                    </div>

                    <div className="space-y-4">
                        <SettingsGroup title="System">
                            <SettingsItem icon={<Palette />} title="Appearance" desc="Configure neural interface color space" value="Holographic Dark" />
                            <SettingsItem icon={<Globe />} title="Region" desc="Synchronize with local culinary databases" value="Global / EN" />
                        </SettingsGroup>

                        <SettingsGroup title="Security \u0026 Privacy">
                            <SettingsItem icon={<Lock />} title="Neural Encryption" desc="Manage biometric and cryptographic access" action="Manage" />
                            <SettingsItem icon={<Eye />} title="Visibility" desc="Control recipe broadcast settings" value="Private Library" />
                        </SettingsGroup>

                        <SettingsGroup title="Notifications">
                            <SettingsItem icon={<Bell />} title="Kitchen Alerts" desc="Synchronize step completion pings" value="Enabled" />
                        </SettingsGroup>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                        <PillButton className="px-8">Save Waveform</PillButton>
                    </div>
                </motion.div>
            </main>
        </BackgroundLayout>
    );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4 pt-4 first:pt-0">
            <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] px-4">{title}</h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
}

function SettingsItem({ icon, title, desc, value, action }: { icon: React.ReactNode, title: string, desc: string, value?: string, action?: string }) {
    return (
        <div className="group p-4 md:p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-primary transition-colors">
                    {icon}
                </div>
                <div>
                    <h4 className="text-white font-bold mb-0.5">{title}</h4>
                    <p className="text-sm text-white/30 font-medium">{desc}</p>
                </div>
            </div>
            {value && <span className="text-xs font-bold text-primary px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">{value}</span>}
            {action && <PillButton variant="ghost" size="sm" className="text-xs h-9 px-4">{action}</PillButton>}
        </div>
    );
}
