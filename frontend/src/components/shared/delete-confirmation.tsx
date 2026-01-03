"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    isDeleting?: boolean;
}

export function DeleteConfirmation({ isOpen, onClose, onConfirm, title, isDeleting }: DeleteConfirmationProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-[2.5rem] border border-border shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="size-14 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600">
                                    <AlertTriangle className="size-7" />
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                    <X className="size-5" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black font-outfit text-text-main">Delete recipe?</h3>
                                <p className="text-text-muted font-medium">
                                    Are you sure you want to remove <span className="text-text-main font-bold">"{title}"</span>? This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1 h-14 rounded-2xl font-black border-none bg-muted dark:bg-muted/10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 h-14 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white shadow-glow-red"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
