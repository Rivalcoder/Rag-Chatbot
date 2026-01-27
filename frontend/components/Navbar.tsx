"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Database, Rocket, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const navItems = [
    { name: 'Mission Control', path: '/', icon: Home },
    { name: 'Live Chat', path: '/chat', icon: MessageSquare },
    { name: 'Showcase', path: '/showcase', icon: Rocket },
    { name: 'Archives', path: '/documents', icon: Database },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: -100 },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
            >
                <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-full py-3 px-6 shadow-2xl shadow-cyan-500/10 flex items-center gap-2 md:gap-8">

                    <div className="flex items-center gap-3 mr-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-orange-500/20">
                            ISRO
                        </div>
                        <span className="font-space font-bold text-white hidden md:block tracking-widest">INTERLINK</span>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`
                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                    ${isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
                  `}
                                >
                                    <item.icon size={16} className={isActive ? 'text-cyan-400' : ''} />
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="bg-nav"
                                            className="absolute inset-0 bg-white/10 rounded-full border border-white/10 -z-10"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl pt-24 px-8 md:hidden flex flex-col gap-4"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`
                    p-4 rounded-xl border border-white/10 flex items-center gap-4 text-lg font-space
                    ${pathname === item.path ? 'bg-cyan-500/20 border-cyan-500/50 text-white' : 'text-white/60'}
                  `}
                            >
                                <item.icon size={24} />
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
