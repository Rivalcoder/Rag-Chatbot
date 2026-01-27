"use client";
import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocUploaderProps {
    onUploadSuccess?: () => void;
}

export default function DocUploader({ onUploadSuccess }: DocUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string>("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        setUploading(true);
        setStatus("Initializing Upload...");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setStatus(`Success: ${data.filename} ingested!`);
                onUploadSuccess?.();
            } else {
                setStatus(`Error: ${data.detail}`);
            }
        } catch (error) {
            setStatus("Upload Failed! Check Backend.");
        } finally {
            setUploading(false);
            // Clear status after 3 seconds
            setTimeout(() => setStatus(""), 3000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
        >
            <div className="p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Upload size={120} />
                </div>

                <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 text-white font-space">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                        <FileText className="text-orange-500" size={24} />
                    </div>
                    <span>Data Uplink</span>
                </h3>

                <p className="text-white/40 text-sm mb-8 leading-relaxed font-medium">
                    Injection of telemetric PDF records into the Neural Core.
                </p>

                <div className="flex flex-col gap-5">
                    <label className={`
                        relative cursor-pointer overflow-hidden
                        flex flex-col items-center justify-center
                        w-full h-44 rounded-[2rem]
                        border-2 border-dashed border-white/5 hover:border-orange-500/30 bg-white/[0.02] hover:bg-white/[0.04]
                        transition-all duration-500 group/drop
                        ${uploading ? 'opacity-50 pointer-events-none' : ''}
                    `}>
                        <div className="flex flex-col items-center gap-4 text-white/30 group-hover/drop:text-white transition-all duration-500 z-10">
                            <div className="p-5 rounded-2xl bg-white/5 group-hover/drop:scale-110 group-hover/drop:bg-orange-500/10 group-hover/drop:text-orange-500 transition-all duration-500">
                                <Upload size={32} />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-base font-bold">Deploy New Module</span>
                                <span className="text-[10px] uppercase tracking-widest opacity-50">PDF FORMAT ONLY</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover/drop:opacity-100 transition-opacity duration-500" />
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                    </label>

                    {uploading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-center gap-4 text-orange-400 text-sm font-mono"
                        >
                            <Loader2 className="animate-spin" size={18} />
                            <span className="uppercase tracking-widest">Encrypting and Injecting...</span>
                        </motion.div>
                    )}
                    {status && !uploading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border ${status.includes("Success") ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
                        >
                            {status.includes("Success") ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span className="truncate">{status}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.01] text-[10px] text-white/20 uppercase tracking-[0.4em] font-mono text-center flex items-center justify-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                UPLINK SECURE
            </div>
        </motion.div>
    );
}
