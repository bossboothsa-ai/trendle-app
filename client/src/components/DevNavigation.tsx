import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Store, Shield, Sparkles } from "lucide-react";
import { useDemo } from "@/context/DemoContext";

export function DevNavigation() {
    const [location] = useLocation();
    const { isDemoMode, setIsDemoMode } = useDemo();

    if (process.env.NODE_ENV !== "development") return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-black/90 p-2 px-3 rounded-full backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10">
            <Link href="/home">
                <Button
                    variant={location.startsWith("/home") || location === "/" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full h-9 w-9 p-0"
                    title="User App"
                >
                    <Home className="h-4 w-4" />
                </Button>
            </Link>
            <Link href="/business/dashboard">
                <Button
                    variant={location.startsWith("/business") ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full h-9 w-9 p-0"
                    title="Business Dashboard"
                >
                    <Store className="h-4 w-4" />
                </Button>
            </Link>
            <Link href="/admin/dashboard">
                <Button
                    variant={location.startsWith("/admin") ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full h-9 w-9 p-0"
                    title="Admin Panel"
                >
                    <Shield className="h-4 w-4" />
                </Button>
            </Link>

            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            <Button
                variant={isDemoMode ? "default" : "ghost"}
                size="sm"
                className={`rounded-full px-3 h-9 text-[10px] font-black tracking-widest flex items-center gap-2 transition-all ${isDemoMode ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-0 shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "text-slate-400"}`}
                onClick={() => {
                    setIsDemoMode(!isDemoMode);
                    window.location.reload(); // Reload to ensure all queries are intercepted
                }}
            >
                <Sparkles className={`h-3 w-3 ${isDemoMode ? "animate-spin-slow" : ""}`} />
                {isDemoMode ? "DEMO ACTIVE" : "ENABLE DEMO"}
            </Button>
        </div>
    );
}
