"use client";
import { useState, useEffect } from 'react';
import DocUploader from "@/components/DocUploader";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, CheckCircle, Trash2, Shield, Search, Database } from "lucide-react";

interface Document {
    name: string;
    size: string;
    date: string;
    pages?: number;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDocuments = async () => {
        try {
            const res = await fetch("http://localhost:8000/documents");
            const data = await res.json();
            setDocuments(data.documents);
        } catch (e) {
            console.error("Failed to fetch docs", e);
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (filename: string) => {
        if (!confirm(`Are you sure you want to permanently delete ${filename}?`)) return;
        try {
            const res = await fetch(`http://localhost:8000/documents/${filename}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchDocuments();
            }
        } catch (e) {
            console.error("Failed to delete doc", e);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 p-8 pb-12 w-full max-w-7xl mx-auto flex flex-col gap-10">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black font-space text-white tracking-tighter"
                    >
                        ISRO <span className="text-orange-500">ARCHIVES</span>
                    </motion.h1>
                    <p className="text-white/40 font-mono text-sm mt-2 uppercase tracking-widest">
                        Official Mission Intelligence Repository
                    </p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder="Search archives..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Control Center (Uploader) */}
                <div className="w-full lg:w-80 shrink-0">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4 font-mono flex items-center gap-2">
                            <Database size={14} /> Data Injection
                        </h3>
                        <DocUploader onUploadSuccess={fetchDocuments} />
                    </motion.div>
                </div>

                {/* Main Repository List */}
                <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                            <Shield size={14} /> Verified PDF Records
                        </h3>
                        <span className="text-[10px] text-white/20 font-mono">{filteredDocs.length} Total Modules</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredDocs.map((doc, i) => (
                                <motion.div
                                    key={doc.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] hover:border-white/10 transition-all group overflow-hidden relative"
                                >
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-white font-space tracking-tight">{doc.name}</div>
                                            <div className="text-white/40 text-xs font-mono flex items-center gap-3 mt-1.5">
                                                <span className="bg-white/5 px-2 py-0.5 rounded-md text-white/60">{doc.size}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {doc.date}</span>
                                                {doc.pages && (
                                                    <span className="text-orange-400/60 uppercase tracking-tighter">{doc.pages} Pages</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => deleteDocument(doc.name)}
                                            className="p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <div className="text-green-500 px-2">
                                            <CheckCircle size={24} />
                                        </div>
                                    </div>

                                    {/* Hover Decorative Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredDocs.length === 0 && !loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-20 rounded-[3rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-white/20 gap-4"
                            >
                                <Database size={48} className="opacity-20" />
                                <div className="text-center font-space">
                                    <div className="text-lg font-bold">No Neural Records Found</div>
                                    <div className="text-sm opacity-50">Archive is currently empty or query returned zero matches</div>
                                </div>
                            </motion.div>
                        )}

                        {loading && (
                            <div className="flex items-center justify-center py-20 text-orange-500">
                                <span className="animate-spin mr-3">◌</span>
                                <span className="font-mono text-sm uppercase tracking-widest">Retrieving Encrypted Archives...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
