import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    Users,
    Building2,
    MapPin,
    Camera,
    Gift,
    FileText,
    AlertTriangle,
    QrCode,
    Map
} from "lucide-react";

export default function AdminDashboard() {
    const { toast } = useToast();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
                    <p className="text-slate-500">Real-time verification and integrity capabilities.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    <span className="text-sm font-medium text-slate-600">System Operational</span>
                </div>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                    { label: "Active Businesses", value: "42", icon: Building2 },
                    { label: "Registered Users", value: "2,318", icon: Users },
                    { label: "Total Check-ins", value: "18,452", icon: MapPin },
                    { label: "Moments Posted", value: "4,112", icon: Camera },
                    { label: "Rewards Redeemed", value: "1,084", icon: Gift },
                    { label: "Surveys Completed", value: "982", icon: FileText },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
                                </div>
                                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
                                    <Icon className="w-4 h-4" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Verification Breakdown */}
                <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-3">
                        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Verification Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {[
                                { label: "QR Verified Check-ins", count: "15,220", icon: QrCode, color: "text-green-600" },
                                { label: "Location Verified", count: "2,110", icon: Map, color: "text-blue-600" },
                                { label: "Manual Confirmations", count: "1,122", icon: Users, color: "text-orange-500" },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${item.color}`} />
                                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 font-mono">{item.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Suspicious Activity Alerts */}
                <Card className="lg:col-span-2 border-red-100 shadow-sm bg-white rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-red-50 bg-red-50/30 pb-3 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <CardTitle className="text-sm font-bold text-red-900 uppercase tracking-wider">Suspicious Activity Alerts</CardTitle>
                        </div>
                        <span className="text-xs font-bold bg-white text-red-600 px-2 py-1 rounded-md border border-red-100">Live</span>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Public ID</th>
                                    <th className="px-4 py-3">Business</th>
                                    <th className="px-4 py-3">Flag Reason</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { id: "TRND-AX054", business: "Ember & Oak", reason: "5 check-ins in 2 minutes", date: "Today, 10:42 AM" },
                                    { id: "TRND-AX112", business: "Lunar Lounge", reason: "Excess manual confirmations", date: "Jan 12, 14:20" },
                                    { id: "TRND-AX099", business: "Café Rise", reason: "Duplicate image hash detected", date: "Jan 10, 09:15" },
                                ].map((alert, i) => (
                                    <tr key={i} className="hover:bg-red-50/10 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{alert.id}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{alert.business}</td>
                                        <td className="px-4 py-3 text-red-600 font-medium">{alert.reason}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{alert.date}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => toast({ title: "Coming Soon", description: "Detailed alert view is being implemented." })}
                                                className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded px-2 py-1 bg-white hover:bg-slate-50"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
