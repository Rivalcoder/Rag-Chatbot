"use client";
import { motion } from 'framer-motion';
import { Rocket, Satellite, Radio, Globe, ChevronRight, Activity, Clock, ShieldCheck } from 'lucide-react';

const missions = [
    {
        title: "Chandrayaan-3",
        status: "Active",
        date: "2023-08-23",
        desc: "Lunar landing data and telemetry analysis.",
        icon: Rocket,
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20"
    },
    {
        title: "Aditya-L1",
        status: "Online",
        date: "2023-09-02",
        desc: "Solar observation and L1 orbit stability records.",
        icon: Satellite,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20"
    },
    {
        title: "Gaganyaan",
        status: "Standby",
        date: "2024-01-15",
        desc: "Safety protocols and human-rating verification.",
        icon: ShieldCheck,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20"
    }
];

interface MissionListProps {
    onSelectMission?: (missionName: string) => void;
}

export default function MissionList({ onSelectMission }: MissionListProps) {
    return (
        <div className="h-full flex flex-col bg-black/20 glass-morphism rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white font-space flex items-center gap-3">
                    <Rocket className="text-cyan-400" />
                    Mission Control
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/50 font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    LIVE FEED ACTIVE
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {missions.map((mission, idx) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={mission.title}
                        className={`group relative p-4 rounded-2xl border ${mission.border} ${mission.bg} hover:bg-white/5 transition-all duration-300`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-black/40 ${mission.color}`}>
                                    <mission.icon size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">{mission.title}</h3>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/20 ${mission.color}`}>
                                        {mission.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-white/70 text-xs leading-relaxed mb-4">
                            {mission.desc}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                                <Clock size={12} />
                                {mission.date}
                            </div>

                            <button
                                onClick={() => onSelectMission?.(mission.title)}
                                className="flex items-center gap-1 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all group-hover:translate-x-1"
                            >
                                View Data <ChevronRight size={12} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
