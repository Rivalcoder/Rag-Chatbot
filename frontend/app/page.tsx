"use client";
import { motion } from "framer-motion";
import { Rocket, Sparkles, ArrowRight, Database, Globe, Shield, Cpu, Zap } from 'lucide-react';
import Link from 'next/link';
import MissionList from "@/components/MissionList";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-20 px-6">

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center gap-8"
      >


        {/* Main Title */}
        <div className="relative">
          <h1 className="text-6xl md:text-9xl font-black font-space tracking-tighter text-white mb-2 leading-[0.9]">
            ISRO <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 animate-gradient-x">CORE</span>
          </h1>
          <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 opacity-20 hidden md:block">
            <Rocket size={120} className="text-orange-500 -rotate-45" />
          </div>
        </div>

        <p className="text-xl md:text-3xl text-white/50 font-light max-w-3xl leading-relaxed font-space">
          Next-generation Neural Core for <span className="text-white border-b border-orange-500/50 pb-1">Space Exploration</span>.
          Analyze, simulate, and retrieve mission intelligence in milliseconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mt-12 w-full max-w-xl">
          <Link href="/chat" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full px-10 py-6 bg-white text-black text-xl font-black rounded-[2rem] overflow-hidden flex items-center justify-center gap-4 transition-all"
            >
              <span className="relative z-10 flex items-center gap-3 tracking-tight">
                ACCESS NEURAL CHAT <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </motion.button>
          </Link>

          <Link href="/showcase" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05, y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-10 py-6 bg-transparent border-2 border-white/10 text-white text-xl font-bold rounded-[2rem] backdrop-blur-sm transition-all flex items-center justify-center gap-4 hover:border-white/20"
            >
              MISSION ARCHIVES <Database size={24} />
            </motion.button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24 text-left border-t border-white/5 pt-16 px-12 w-full glass-morphism rounded-[3rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <Cpu size={20} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Inter-connected Network</span>
            </div>
            <span className="text-5xl font-black text-white font-space tracking-tighter uppercase">Offline Core</span>
            <span className="text-sm text-white/30 font-medium">Encrypted Mesh Node Active</span>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Zap size={20} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Sequential Analysis</span>
            </div>
            <span className="text-5xl font-black text-white font-space tracking-tighter uppercase">Streaming</span>
            <span className="text-sm text-white/30 font-medium">Priority Neural Processing</span>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Shield size={20} />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Multi-Layered Checking</span>
            </div>
            <span className="text-5xl font-black text-white font-space tracking-tighter uppercase">Verified</span>
            <span className="text-sm text-white/30 font-medium">3-Tier Protocol Validation</span>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full">
          {[
            { title: "Neural Uplink", icon: Sparkles, desc: "Direct neural interface for ultra-fast mission data streaming.", color: "from-blue-500 to-cyan-500" },
            { title: "Core Sync", icon: Rocket, desc: "Synchronize multiple mission cores for collaborative intelligence.", color: "from-orange-500 to-red-500" },
            { title: "Deep Archive", icon: Database, desc: "E-byte scale storage with cryptographic verification layers.", color: "from-purple-500 to-indigo-500" },
            { title: "Global Mesh", icon: Globe, desc: "Seamless integration with global satellite tracking networks.", color: "from-green-500 to-emerald-500" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3 mb-6 shadow-lg shadow-white/5`}>
                <feature.icon className="text-white w-full h-full" />
              </div>

              <h3 className="text-2xl font-black text-white mb-3 font-space">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {feature.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-white/20 group-hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">
                System Ready <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unique Highlight Feature Card */}
        <div className="w-full mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-[3.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-orange-500/20" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full -ml-40 -mb-40 transition-all duration-1000 group-hover:bg-cyan-500/20" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
                    <Zap size={24} />
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-400 tracking-[0.3em] uppercase">Advanced Module</span>
                </div>
                <h2 className="text-5xl font-black text-white font-space mb-6 leading-tight">
                  Quantum Mission <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">Architecture</span>
                </h2>
                <p className="text-white/50 text-lg leading-relaxed mb-8">
                  Our proprietary neural lattice processing allows for simultaneous multi-mission telemetry analysis with 99.9% prediction accuracy for ISRO payloads.
                </p>
                <div className="flex flex-wrap gap-4">
                  {['Real-time Tracking', 'Orbital Prediction', 'Safety Auditing'].map((tag) => (
                    <div key={tag} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/80 hover:bg-white/10 transition-colors cursor-default">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-[3rem] bg-black/40 border border-white/10 p-4 relative overflow-hidden group/viz">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="h-full w-full rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-8 overflow-hidden">
                    {/* Abstract Visualization */}
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-full border-2 border-dashed border-cyan-500/20 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute w-3/4 h-3/4 border-2 border-dashed border-orange-500/20 rounded-full"
                      />
                      <div className="w-1/2 h-1/2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse" />
                      <Cpu size={80} className="text-white/20 relative z-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission Control Section */}
        <div className="w-full mt-24 mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 justify-between">
            <div>
              <h2 className="text-4xl font-black font-space text-white uppercase tracking-tighter">Mission <span className="text-cyan-400">Control Center</span></h2>
              <p className="text-white/40 font-mono text-sm mt-2 tracking-widest uppercase">Live Operational Telemetry</p>
            </div>
            <div className="h-px hidden md:block flex-1 bg-white/5 mx-8" />
            <Link href="/showcase">
              <button className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-all uppercase tracking-widest">
                View All Missions <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          <div className="w-full">
            <MissionList />
          </div>
        </div>

      </motion.div>
    </div>
  );
}
