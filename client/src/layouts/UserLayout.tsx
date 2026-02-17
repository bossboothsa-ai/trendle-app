import { Link, useLocation } from "wouter";
import { Home, Compass, Gift, Wallet, User as UserIcon, Settings } from "lucide-react";
import { useDemo } from "@/context/DemoContext";

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    const [location] = useLocation();
    const { isDemoMode } = useDemo();

    const navItems = [
        { icon: Home, label: "Home", path: "/home" },
        { icon: Compass, label: "Explore", path: "/explore" },
        { icon: Gift, label: "Rewards", path: "/rewards" },
        { icon: Wallet, label: "Wallet", path: "/wallet" },
        { icon: UserIcon, label: "Profile", path: "/profile" },
        { icon: Settings, label: "Settings", path: "/settings" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {isDemoMode && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-black/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-2xl flex items-center gap-2 pointer-events-none animate-bounce">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    ✨ Trendle Live Preview
                </div>
            )}
            {/* Main Content Area */}
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden relative">
                {children}
            </main>

            {/* Bottom Navigation (Mobile First) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => {
                    const isActive = location === item.path;
                    return (
                        <Link key={item.path} href={item.path}>
                            <div className={`flex flex-col items-center justify-center space-y-1 cursor-pointer transition-colors ${isActive ? "text-purple-600" : "text-gray-400 hover:text-gray-600"}`}>
                                <item.icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                                {/* <span className="text-[10px] font-medium">{item.label}</span> */}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Desktop Message (Optional) */}
            <div className="hidden md:flex fixed top-0 left-0 h-full w-full -z-10 items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                    <p>Mobile-first experience</p>
                </div>
            </div>
        </div>
    );
}
