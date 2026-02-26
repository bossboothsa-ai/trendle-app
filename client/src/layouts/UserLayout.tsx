import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";
import { InstallPWA } from "@/components/InstallPWA";

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Main Content Area */}
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden relative">
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
