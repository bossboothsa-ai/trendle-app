import { Link, useLocation } from "wouter";
import {
    LayoutDashboard,
    Building2,
    Users,
    ClipboardList,
    ShieldAlert,
    CreditCard,
    Settings,
    LogOut,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [location] = useLocation();

    const sections = [
        {
            title: "Operations",
            items: [
                { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
                { href: "/admin/businesses", label: "Businesses", icon: Building2 },
                { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
            ]
        },
        {
            title: "Compliance & Integrity",
            items: [
                { href: "/admin/users", label: "Users", icon: Users },
                { href: "/admin/activity", label: "Activity Logs", icon: ClipboardList },
                { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
            ]
        },
        {
            title: "Platform",
            items: [
                { href: "/admin/settings", label: "System Settings", icon: Settings },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col fixed h-full z-10 shadow-xl border-r border-slate-800">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        Trendle Control
                    </h1>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mt-1 ml-7">Super Admin Panel</p>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-8 overflow-y-auto">
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location === item.href;

                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <a className={cn(
                                                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-lg group",
                                                isActive
                                                    ? "bg-slate-800 text-white shadow-sm border-l-2 border-indigo-500"
                                                    : "hover:bg-slate-800/50 hover:text-white text-slate-400 border-l-2 border-transparent"
                                            )}>
                                                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                                                {item.label}
                                            </a>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <button className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                    <div className="mt-4 px-3 text-[10px] text-slate-600 font-mono">
                        v2.4.0-admin<br />
                        IP: 192.168.1.1<br />
                        <span className="text-indigo-900/40">SECURE_CONNECTION</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto bg-slate-50">
                <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
