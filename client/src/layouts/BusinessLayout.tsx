import { Link, useLocation } from "wouter";
import { LayoutDashboard, Store, Users, BarChart3, Settings, LogOut, Camera, FileText, CheckSquare, Gift, CreditCard, HelpCircle, CalendarDays } from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLaunch } from "@/context/LaunchContext";

interface BusinessLayoutProps {
    children: ReactNode;
}

export default function BusinessLayout({ children }: BusinessLayoutProps) {
    const [location] = useLocation();
    const { logoutMutation, user } = useAuth();
    const { isSoftLaunch } = useLaunch();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/business/dashboard" },
        { icon: CalendarDays, label: "Events", path: "/business/events" },
        { icon: Camera, label: "Moments", path: "/business/moments" },
        { icon: FileText, label: "Surveys", path: "/business/surveys" },
        { icon: CheckSquare, label: "Tasks", path: "/business/tasks" },
        { icon: Gift, label: "Rewards", path: "/business/rewards" },
        { icon: Users, label: "Audience", path: "/business/audience-insights" },
        { icon: BarChart3, label: "Analytics", path: "/business/reports" },
    ];

    const secondaryNavItems = [
        { icon: CreditCard, label: "Billing & Subscription", path: "/business/billing" },
        { icon: Settings, label: "Settings", path: "/business/settings" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full shadow-xl z-50">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Store className="w-6 h-6 text-purple-400" />
                        Trendle <span className="text-xs bg-purple-600 px-1.5 py-0.5 rounded ml-1 text-white">BIZ</span>
                    </h1>
                </div>

                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location === item.path;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${isActive ? "bg-purple-600 text-white shadow-md font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </div>
                            </Link>
                        );
                    })}

                    <div className="pt-4 pb-2 border-t border-slate-700/50 my-2" />

                    {secondaryNavItems.map((item) => {
                        const isActive = location === item.path;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${isActive ? "bg-purple-600 text-white shadow-md font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-700 bg-slate-900">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                            {user?.username?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-slate-400 truncate">Business Owner</p>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border-0"
                        onClick={() => logoutMutation.mutate()}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Content Content - with Sidebar offset */}
            <div className="flex-1 md:ml-64 min-w-0">
                {/* Header with Status Badge */}
                <header className="hidden md:flex bg-white h-16 border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-40 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 transition-all hover:bg-purple-100 group">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Growth Plan • Active</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-600 rounded-full h-10 w-10 p-0">
                            <HelpCircle className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
                    <div className="flex items-center gap-2">
                        <Store className="w-5 h-5 text-purple-400" />
                        <span className="font-bold">Trendle Biz</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Active</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-white h-8 w-8 p-0" onClick={() => logoutMutation.mutate()}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </header>

                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
