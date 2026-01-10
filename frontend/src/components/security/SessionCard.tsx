"use client";

import { Monitor, Smartphone, Globe, Clock, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

interface Session {
    id: string;
    device_type: string;
    browser_name: string;
    browser_version: string;
    os_name: string;
    os_version: string;
    ip_address: string;
    location_city: string | null;
    location_country: string | null;
    last_active_at: string;
    is_current?: boolean;
}

interface SessionCardProps {
    session: Session;
    onRevoke?: (id: string) => void;
    isRevoking?: boolean;
}

export const SessionCard = ({ session, onRevoke, isRevoking }: SessionCardProps) => {
    const Icon = session.device_type === "Mobile" ? Smartphone : Monitor;

    const lastActiveDate = new Date(session.last_active_at);
    const formattedDate = lastActiveDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-5 rounded-2xl border transition-all duration-300 ${session.is_current
                ? "bg-secondary/40 border-border/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
                : "bg-black/20 border-border/20 hover:border-border/30"
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className={`p-3 rounded-xl ${session.is_current ? "bg-secondary/40 text-white" : "bg-secondary/30 text-muted-foreground"}`}>
                        <Icon size={24} />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">
                                {session.browser_name} on {session.os_name}
                            </h4>
                            {session.is_current && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                    Current Session
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Globe size={14} />
                                <span>{session.ip_address}</span>
                            </div>

                            {(session.location_city || session.location_country) && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    <span>
                                        {session.location_city}{session.location_city && session.location_country ? ', ' : ''}{session.location_country}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                <span>Last active: {formattedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {!session.is_current && onRevoke && (
                    <button
                        onClick={() => onRevoke(session.id)}
                        disabled={isRevoking}
                        className="p-2 rounded-lg text-muted-foreground/70 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                        title="Revoke access"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};
