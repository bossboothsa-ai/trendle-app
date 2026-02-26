import { Link, useLocation } from "wouter";
import {
    Shield,
    LayoutGrid,
    Building2,
    Users,
    FileText,
    AlertTriangle,
    LogOut,
    Settings,
    CreditCard,
    Activity,
    Ghost,
    CalendarDays
} from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [location] = useLocation();
    const { logoutMutation } = useAuth();

    const sections = [
        {
            title: "Overview",
            items: [
                { icon: LayoutGrid, label: "Dashboard", path: "/admin/dashboard" },
                { icon: Activity, label: "Activity Logs", path: "/admin/activity" }
            ]
        },
        {
            title: "Management",
            items: [
                { icon: Building2, label: "Businesses", path: "/admin/businesses" },
                { icon: Users, label: "Users", path: "/admin/users" },
                { icon: CalendarDays, label: "Events", path: "/admin/events" },
                { icon: Ghost, label: "Host Applications", path: "/admin/host-applications" },
                { icon: CreditCard, label: "Subscriptions", path: "/admin/subscriptions" }
            ]
        },
        {
            title: "System",
            items: [
                { icon: AlertTriangle, label: "Moderation", path: "/admin/moderation" },
                { icon: Settings, label: "Settings", path: "/admin/settings" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar - Purple Theme */}
            <aside className="w-64 bg-[#1a1c2e] text-white hidden md:flex flex-col fixed h-full z-50 shadow-xl border-r border-slate-800">
                <div className="p-6 border-b border-slate-700/50">
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                            <Shield className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Trendle</span>
                        <span className="text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded ml-auto">ADMIN</span>
                    </h1>
                </div>

                <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">{section.title}</h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = location === item.path || location.startsWith(item.path + "/");
                                    const Icon = item.icon;
                                    return (
                                        <Link key={item.path} href={item.path}>
                                            <div className={`
                                                flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group
                                                ${isActive
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-medium translate-x-1"
                                                    : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                                                }
                                            `}>
                                                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`} />
                                                <span className="text-sm">{item.label}</span>
                                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-700/50 bg-[#151726]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-[#1a1c2e]">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate text-white">Administrator</p>
                            <p className="text-xs text-slate-400 truncate">Super Admin Access</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 border border-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-slate-400 transition-all"
                        onClick={() => logoutMutation.mutate()}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout System
                    </Button>
                </div>
            </aside>

            {/* Content - with Sidebar offset */}
            <div className="flex-1 md:ml-64 min-w-0 bg-slate-50/50">
                <main className="p-6 md:p-8 max-w-[1600px] mx-auto animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
