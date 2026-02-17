import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
    LayoutDashboard,
    Camera,
    ClipboardList,
    CheckSquare,
    Gift,
    BarChart3,
    Settings,
    LogOut,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useBusiness } from "@/context/BusinessContext";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

interface BusinessAccount {
    id: number;
    businessName: string;
    invoiceStatus: string;
    subscriptionStatus: string;
}

interface BusinessLayoutProps {
    children: ReactNode;
}

const navItems = [
    { path: "/business/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/business/moments", label: "Moments", icon: Camera },
    { path: "/business/surveys", label: "Surveys", icon: ClipboardList },
    { path: "/business/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/business/rewards", label: "Rewards", icon: Gift },
    { path: "/business/audience-insights", label: "Audience Insights", icon: Users },
    { path: "/business/reports", label: "Reports", icon: BarChart3 },
    { path: "/business/settings", label: "Settings", icon: Settings },
];

export default function BusinessLayout({ children }: BusinessLayoutProps) {
    const [location, setLocation] = useLocation();
    const { dateRange, setDateRange } = useBusiness();
    const businessId = parseInt(localStorage.getItem("businessId") || "1");
    // Fetch business details for status check
    const { data: business } = useQuery<BusinessAccount>({
        queryKey: [`/api/business/account/${businessId}`],
    });

    const handleLogout = () => {
        localStorage.removeItem("businessId");
        localStorage.removeItem("businessName");
        localStorage.removeItem("placeId");
        setLocation("/business/login");
    };

    const isActive = (path: string) => location === path;

    return (
        <div className="flex h-screen bg-gray-50/50 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm z-20">
                {/* Branding */}
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl shadow-lg shadow-purple-200 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                            <span className="text-white text-xl font-bold tracking-tighter">T</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Trendle</h1>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Business</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Link key={item.path} href={item.path}>
                                <a
                                    className={`
                                        flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                                        ${active
                                            ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${active ? "text-purple-300" : "text-gray-400 group-hover:text-purple-500"} transition-colors`} />
                                    <span className="font-medium tracking-wide text-sm">{item.label}</span>
                                </a>
                            </Link>
                        );
                    })}
                </nav>

                {/* Updates / User */}
                <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <p className="text-xs font-semibold text-purple-900 mb-1">{business?.businessName || localStorage.getItem("businessName") || "Business"}</p>
                    <p className="text-[10px] text-purple-700/70">Premium Plan Active</p>
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-gray-50">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 py-5 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {navItems.find(i => i.path === location)?.label || "Dashboard"}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-6">
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        <div className="h-8 w-[1px] bg-gray-200"></div>
                        <div className="flex items-center space-x-3 pl-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-900">Emily R.</p>
                                <p className="text-xs text-gray-500">Manager</p>
                            </div>
                            <div className="w-10 h-10 ring-2 ring-white shadow-md rounded-full overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Status Banners */}
                {business?.invoiceStatus === "Overdue" && (
                    <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-amber-900">Payment Overdue</p>
                            <p className="text-xs text-amber-700">Your account is in a grace period. Please settle your invoice to avoid service interruption.</p>
                        </div>
                        <Link href="/business/settings">
                            <Button size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100 bg-white">
                                Pay Now
                            </Button>
                        </Link>
                    </div>
                )}

                {business?.invoiceStatus === "Due" && (
                    <div className="bg-blue-50 border-b border-blue-200 px-8 py-3 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-blue-900">Invoice Due Soon</p>
                            <p className="text-xs text-blue-700">Your monthly subscription invoice is generated and due shortly.</p>
                        </div>
                        <Link href="/business/settings">
                            <Button size="sm" variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-100 bg-white">
                                View Invoice
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
