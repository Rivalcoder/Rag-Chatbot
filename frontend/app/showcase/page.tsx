"use client";
import { motion } from "framer-motion";
import { Calendar, Rocket, Database, ArrowRight } from "lucide-react";
import Link from "next/link";

const missions = [
    {
        title: "Chandrayaan-3",
        date: "2023-08-23 (Landing)",
        status: "Mission Successful",
        desc: "Lunar south pole soft landing and roving mission. Proved tech for future base building.",
        color: "from-orange-500 to-yellow-500",
        file: "Chandrayaan-3_Mission_Profile.pdf",
        details: ["Safe & Soft Landing", "Rover Deployment", "In-situ Experiments"]
    },
    {
        title: "Aditya-L1",
        date: "2023-09-02 (Launch)",
        status: "Space Observatory",
        desc: "Solar observation mission at Lagrange point L1. Studying coronal heating and solar wind.",
        color: "from-yellow-400 to-orange-600",
        file: "PSLV-C57_Brochure.pdf",
        details: ["L1 Halo Orbit", "Solar Corona Study", "X-ray Monitoring"]
    },
    {
        title: "Gaganyaan",
        date: "2024-01-15 (Safety Protocol v2)",
        status: "Human-Rated",
        desc: "Indian Human Spaceflight Programme. Low Earth orbit mission for 3 crew members.",
        color: "from-blue-500 to-cyan-500",
        file: "Gaganyaan_Safety_Protocols_v2.pdf",
        details: ["Crew Escape System", "Life Support System", "Human Rating LVM3"]
    }
];

export default function ShowcasePage() {
    return (
        <div className="flex-1 p-8 pb-12 w-full max-w-7xl mx-auto">

            <div className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-4"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    Verified Mission Database
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-extrabold font-space text-white mb-4 tracking-tighter"
                >
                    Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Showcase</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/50 max-w-2xl mx-auto text-lg"
                >
                    Detailed technical archives of India's premier space missions.
                    Select a module to analyze telemetric records and safety protocols.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {missions.map((mission, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl"
                    >
                        {/* Background Decorative Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                        {/* Top Gradient Banner */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${mission.color}`} />

                        <div className="p-8 flex flex-col h-full relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${mission.color} shadow-lg shadow-orange-500/10`}>
                                    <Rocket className="text-white" size={28} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                                        {mission.status}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-orange-400/80 text-[10px] font-mono">
                                        <Calendar size={12} />
                                        {mission.date}
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-3 font-space tracking-tight">{mission.title}</h2>

                            <p className="text-white/60 text-sm leading-relaxed mb-6">
                                {mission.desc}
                            </p>

                            <div className="space-y-3 mb-8 flex-1">
                                {mission.details.map((detail, dIdx) => (
                                    <div key={dIdx} className="flex items-center gap-3 text-xs text-white/40 group-hover:text-white/60 transition-colors">
                                        <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${mission.color}`} />
                                        {detail}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Link href={`/chat?mission=${mission.title}`}>
                                    <button className={`w-full py-4 rounded-2xl bg-gradient-to-r ${mission.color} text-white font-bold text-sm shadow-xl shadow-orange-500/5 hover:shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2`}>
                                        Launch Neural Analysis <ArrowRight size={18} />
                                    </button>
                                </Link>
                                <div className="text-center">
                                    <span className="text-[10px] text-white/20 font-mono uppercase tracking-[0.3em]">
                                        Data: {mission.file}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${mission.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none`} />
                    </motion.div>
                ))}
            </div>

            {/* Bottom Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-20 p-10 rounded-[3rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent text-center"
            >
                <Database className="mx-auto text-white/20 mb-4" size={40} />
                <h3 className="text-2xl font-bold text-white/80 mb-2">Extended Mission Intelligence</h3>
                <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
                    Our AI models are trained on thousands of pages of ISRO technical documentation,
                    enabling precise mission outcome simulations and safety auditing.
                </p>
            </motion.div>

        </div>
    );
}
