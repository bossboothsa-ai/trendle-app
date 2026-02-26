import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";
import { InstallPWA } from "@/components/InstallPWA";

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0 relative text-white">
            {/* Background Particles (Phase 8: Subtle Glow Base) */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-white/20 blur-[2px] animate-float opacity-30" />
                <div className="absolute top-[70%] right-[15%] w-3 h-3 rounded-full bg-purple-electric/20 blur-[3px] animate-[float_40s_ease-in-out_infinite_alternate] opacity-40" />
                <div className="absolute top-[40%] right-[40%] w-1.5 h-1.5 rounded-full bg-pink-accent/20 blur-[1px] animate-[float_25s_ease-in-out_infinite_alternate] opacity-30" />
                <div className="absolute bottom-[20%] left-[30%] w-2.5 h-2.5 rounded-full bg-lavender/10 blur-[2px] animate-float opacity-20" style={{ animationDelay: '5s' }} />
            </div>

            {/* Main Content Area */}
            <main className="max-w-md mx-auto min-h-screen glass-dark shadow-xl overflow-hidden relative border-x-0 sm:border-x border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    key={window.location.pathname}
                >
                    {children}
                </motion.div>
            </main>

            {/* Bottom Navigation (Mobile First) */}
            <BottomNav />
            <InstallPWA />

            {/* Desktop Message (Optional) */}
            <div className="hidden md:flex fixed top-0 left-0 h-full w-full -z-10 items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                    <p>Mobile-first experience</p>
                </div>
            </div>
        </div>
    );
}
