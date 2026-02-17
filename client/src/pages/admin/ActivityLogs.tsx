import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Search,
    Filter,
    Calendar,
    CheckCircle2,
    Clock,
    UserCheck,
    MapPin,
    AlertTriangle,
    Eye,
    Shield,
    FileText,
    Download,
    Terminal,
    Hash,
    MoreHorizontal,
    ChevronDown
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminActivityLogs() {
    const { toast } = useToast();
    // Mock Data - Enhanced Forensic Ledger
    const { data: logs = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/activity"],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return [
                    {
                        id: "LOG-001",
                        activityId: "ACT-88219",
                        business: "Ember & Oak",
                        user: "TRND-US892",
                        username: "Sarah Jenkins",
                        action: "Check-in",
                        verified: "QR Verified",
                        riskFlag: null,
                        date: "2024-02-14 14:32",
                        details: { device: "iPhone 14 Pro", ip: "192.168.1.45", hash: "a1b2c3d4", notes: "Verified scan at heavy traffic time." }
                    },
                    {
                        id: "LOG-002",
                        activityId: "ACT-88220",
                        business: "The Power Mill",
                        user: "TRND-US104",
                        username: "Mike Ross",
                        action: "Reward Redeemed",
                        verified: "Staff Confirm",
                        riskFlag: "Velocity",
                        date: "2024-02-14 14:35",
                        details: { device: "Samsung S23", ip: "10.0.0.12", notes: "Redeemed 2 rewards in 5 mins. Flagged for review." }
                    },
                    {
                        id: "LOG-003",
                        activityId: "ACT-88221",
                        business: "Neon Dreams",
                        user: "TRND-US001",
                        username: "Jessica Pearson",
                        action: "Moment Posted",
                        verified: "Location Verified",
                        riskFlag: null,
                        date: "2024-02-14 14:40",
                        details: { device: "Pixel 8", ip: "172.16.0.5", hash: "f9e8d7c6" }
                    }
                ];
            }
            const res = await fetch("/api/admin/activity");
            if (!res.ok) throw new Error("Failed to fetch activity logs");
            return res.json();
        }
    });



    const [location] = useLocation();
    const [selectedLog, setSelectedLog] = useState<any>(null);

    // Extract businessId from query string
    const searchParams = new URLSearchParams(window.location.search);
    const businessIdFilter = searchParams.get("businessId");

    const filteredLogs = useMemo(() => {
        if (!businessIdFilter) return logs;
        return logs.filter(log => {
            if (businessIdFilter === "1" && log.business === "Ember & Oak") return true;
            return false;
        });
    }, [businessIdFilter, logs]);

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' });
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("Master Activity Logs Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.line(20, 32, 275, 32);

            autoTable(doc, {
                startY: 40,
                head: [['Log ID', 'Activity ID', 'Business', 'User', 'Action', 'Verification', 'Risk', 'Date']],
                body: filteredLogs.map(l => [
                    l.id,
                    l.activityId,
                    l.business,
                    `${l.username} (${l.user})`,
                    l.action,
                    l.verified,
                    l.riskFlag || '-',
                    l.date
                ]),
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }
            });

            doc.save("activity_logs_report.pdf");
            toast({ title: "Export Complete", description: "Activity logs exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["Log ID", "Activity ID", "Business", "User", "Action", "Verification", "Risk", "Date"];
            const rows = filteredLogs.map(l => [
                l.id,
                l.activityId,
                `"${l.business.replace(/"/g, '""')}"`,
                `"${l.username} (${l.user})"`,
                l.action,
                l.verified,
                l.riskFlag || '-',
                l.date
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "activity_logs.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Activity logs exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading activity logs...</div>;

    const getVerificationIcon = (type: string) => {
        switch (type) {
            case "QR Verified": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case "Location Verified": return <MapPin className="w-4 h-4 text-blue-600" />;
            case "Staff Confirm": return <UserCheck className="w-4 h-4 text-purple-600" />;
            case "Image Hash": return <Hash className="w-4 h-4 text-orange-600" />;
            default: return <Shield className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity Logs</h1>
                    <p className="text-slate-500">Master ledger of all platform events.</p>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-white border-slate-200 text-slate-700">
                                <Download className="w-4 h-4 mr-2" /> Export Logs <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={handleExportCSV}>As CSV</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPDF}>As PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden flex flex-col h-full">
                {/* Filters Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search logs by ID, activity, or user..."
                            className="pl-9 bg-white border-slate-200"
                            defaultValue={businessIdFilter ? `Filtering by Business ID: ${businessIdFilter}` : ""}
                        />
                    </div>
                    {businessIdFilter && (
                        <Button variant="ghost" onClick={() => window.location.href = "/admin/activity"}>
                            Clear Filter
                        </Button>
                    )}
                    <div className="flex gap-2 shrink-0">
                        <Select>
                            <SelectTrigger className="w-[160px] bg-white">
                                <SelectValue placeholder="Action Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="check-in">Check-in</SelectItem>
                                <SelectItem value="reward">Reward Redeemed</SelectItem>
                                <SelectItem value="moment">Moment Posted</SelectItem>
                                <SelectItem value="survey">Survey Completed</SelectItem>
                                <SelectItem value="system">System Flag</SelectItem>
                                <SelectItem value="admin">Admin Action</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[160px] bg-white">
                                <SelectValue placeholder="Verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="qr">QR Verified</SelectItem>
                                <SelectItem value="location">Location Verified</SelectItem>
                                <SelectItem value="staff">Staff Confirmed</SelectItem>
                                <SelectItem value="hash">Image Hash</SelectItem>
                                <SelectItem value="manual">Manual Override</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="bg-white border-slate-200 text-slate-700 w-10 p-0 shrink-0">
                            <Calendar className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Log ID</th>
                                <th className="px-4 py-3">Activity ID</th>
                                <th className="px-4 py-3">Business</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Action Type</th>
                                <th className="px-4 py-3">Verification</th>
                                <th className="px-4 py-3">Risk Flag</th>
                                <th className="px-4 py-3 text-right">Date & Time</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors group">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.id}</td>
                                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">{log.activityId}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{log.business}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 text-xs">{log.username}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">{log.action}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getVerificationIcon(log.verified)}
                                            <span className="text-xs font-medium text-slate-600">{log.verified}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.riskFlag ? (
                                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 flex w-fit items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> {log.riskFlag}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500 text-xs font-mono">
                                        {log.date}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-slate-400 hover:text-slate-900"
                                                    onClick={() => setSelectedLog(log)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </SheetTrigger>
                                            {selectedLog?.id === log.id && (
                                                <SheetContent className="w-[400px] sm:w-[540px]">
                                                    <SheetHeader className="mb-6 space-y-4">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="font-mono text-slate-500">
                                                                {log.id}
                                                            </Badge>
                                                            {log.riskFlag && (
                                                                <Badge className="bg-red-100 text-red-700 border-transparent">
                                                                    Risk: {log.riskFlag}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <SheetTitle className="text-xl font-bold text-slate-900">Activity Detail</SheetTitle>
                                                            <SheetDescription>Forensic record of platform event.</SheetDescription>
                                                        </div>
                                                    </SheetHeader>

                                                    <div className="space-y-6">
                                                        {/* Primary Details */}
                                                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Public Activity ID</div>
                                                                <div className="font-mono font-medium text-slate-900">{log.activityId}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Timestamp</div>
                                                                <div className="font-mono font-medium text-slate-900">{log.date}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">User</div>
                                                                <div className="font-bold text-slate-900">{log.username}</div>
                                                                <div className="text-xs text-slate-500 font-mono">{log.user}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Business</div>
                                                                <div className="font-bold text-slate-900">{log.business}</div>
                                                            </div>
                                                        </div>

                                                        {/* Verification Info */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                                <Shield className="w-4 h-4 text-slate-400" /> Verification
                                                            </h4>
                                                            <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {getVerificationIcon(log.verified)}
                                                                    <span className="font-medium text-slate-700">{log.verified}</span>
                                                                </div>
                                                                <span className="text-xs text-slate-400 font-mono">Verified by System</span>
                                                            </div>
                                                        </div>

                                                        {/* Technical / Forensic Data */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                                <Terminal className="w-4 h-4 text-slate-400" /> Forensic Data
                                                            </h4>
                                                            <div className="bg-slate-900 text-slate-300 rounded-lg p-3 font-mono text-xs space-y-2">
                                                                <div className="flex justify-between">
                                                                    <span>Device:</span>
                                                                    <span className="text-white">{log.details?.device || "Unknown"}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>IP Address:</span>
                                                                    <span className="text-white">{log.details?.ip || "Unknown"}</span>
                                                                </div>
                                                                {log.details?.hash && (
                                                                    <div className="flex justify-between">
                                                                        <span>Content Hash:</span>
                                                                        <span className="text-white truncate max-w-[200px]">{log.details.hash}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Admin Notes */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                                <FileText className="w-4 h-4 text-slate-400" /> Admin Notes
                                                            </h4>
                                                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-900 italic">
                                                                {log.details?.notes || "No notes attached."}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <SheetFooter className="mt-8">
                                                        <SheetClose asChild>
                                                            <Button type="button" className="w-full">Close Drawer</Button>
                                                        </SheetClose>
                                                    </SheetFooter>
                                                </SheetContent>
                                            )}
                                        </Sheet>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center font-mono">
                    System Audit Trail • Logs are immutable and retained for legal compliance.
                </div>
            </Card>
        </div>
    );
}
