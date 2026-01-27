"use client";
import ChatInterface from "@/components/ChatInterface";
import { motion } from "framer-motion";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ChatContent() {
    const searchParams = useSearchParams();
    const mission = searchParams.get('mission');
    const initialQuery = mission ? `Tell me everything about the ${mission} mission.` : null;

    return (
        <ChatInterface externalQuery={initialQuery} />
    );
}

export default function ChatPage() {
    return (
        <div className="w-full max-w-7xl mx-auto h-[calc(100dvh-5rem)] flex flex-col p-2 md:p-4 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 h-full rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl"
            >
                <Suspense fallback={<div className="flex items-center justify-center h-full text-white/50 font-mono">LOADING MISSION INTERFACE...</div>}>
                    <ChatContent />
                </Suspense>

                {/* Background ambient light specific to chat */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-3xl -z-10 pointer-events-none" />
            </motion.div>
        </div>
    );
}
