"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-lg p-8 md:p-10 rounded-[3rem] pointer-events-auto relative overflow-hidden"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {title && (
                                <h2 className="text-2xl font-bold text-white mb-6 pr-12">{title}</h2>
                            )}

                            <div className="relative z-10">
                                {children}
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-20 -right-20 size-64 bg-primary/5 blur-[100px] pointer-events-none" />
                            <div className="absolute -top-20 -left-20 size-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
