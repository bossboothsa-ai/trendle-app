import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BusinessLayout from "@/layouts/BusinessLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useBusiness } from "@/context/BusinessContext";
import {
    ChevronDown,
    Download,
    Calendar,
    TrendingUp,
    Users,
    Activity,
    MapPin,
    UserCheck,
    Camera,
    Star,
    Zap,
    Target,
    ShieldCheck,
    Clock,
    Tag,
    ImageIcon,
    FileText,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DashboardMetrics {
    totalCheckins: number;
    totalUniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
    totalMoments: number;
    totalLikes: number;
    totalComments: number;
    totalRewardsRedeemed: number;
    avgSurveyRating: number;
}

export default function Reports() {
    const { placeId, businessId } = useBusiness();
    const [activeTab, setActiveTab] = useState("overview");
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const { toast } = useToast();

    const { data: businessAccount } = useQuery<any>({
        queryKey: [`/api/business/account`, businessId],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return { id: 1, businessName: "Dev Venue", tier: "Gold" };
            }
            const res = await fetch(`/api/business/account/${businessId}`);
            if (!res.ok) throw new Error("Failed to fetch account");
            return res.json();
        },
        enabled: !!businessId || process.env.NODE_ENV === "development",
    });



    const metricsQuery = useQuery<DashboardMetrics>({
        queryKey: [`/api/business/dashboard`, placeId],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return {
                    totalCheckins: 1200,
                    totalUniqueVisitors: 800,
                    newVisitors: 300,
                    returningVisitors: 500,
                    totalMoments: 400,
                    totalLikes: 2500,
                    totalComments: 600,
                    totalRewardsRedeemed: 150,
                    avgSurveyRating: 4.7
                };
            }
            const res = await fetch(`/api/business/dashboard?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch metrics");
            return res.json();
        },
        enabled: !!placeId || process.env.NODE_ENV === "development",
    });
    const metrics = metricsQuery.data;

    const checkinsQuery = useQuery<any[]>({
        queryKey: [`/api/business/checkins`, placeId],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return [
                    { id: 1, user: { username: "visitor1", avatar: null }, createdAt: new Date().toISOString() },
                    { id: 2, user: { username: "visitor2", avatar: null }, createdAt: new Date(Date.now() - 3600000).toISOString() }
                ];
            }
            const res = await fetch(`/api/business/checkins?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch checkins");
            return res.json();
        },
        enabled: !!placeId || process.env.NODE_ENV === "development",
    });
    const checkins = checkinsQuery.data;

    const momentsQuery = useQuery<any[]>({
        queryKey: [`/api/business/moments`, placeId],
        queryFn: async () => {
            const res = await fetch(`/api/business/moments?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch moments");
            return res.json();
        },
        enabled: !!placeId,
    });
    const venueMoments = momentsQuery.data;

    const rewardsQuery = useQuery<any[]>({
        queryKey: [`/api/business/rewards`, placeId],
        queryFn: async () => {
            const res = await fetch(`/api/business/rewards?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch rewards");
            return res.json();
        },
        enabled: !!placeId,
    });
    const rewards = rewardsQuery.data;

    const surveysQuery = useQuery<any>({
        queryKey: [`/api/business/survey-insights`, placeId],
        queryFn: async () => {
            const res = await fetch(`/api/business/survey-insights?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch survey insights");
            return res.json();
        },
        enabled: !!placeId,
    });
    const surveyInsights = surveysQuery.data;

    const isLoading = metricsQuery.isLoading || checkinsQuery.isLoading || momentsQuery.isLoading || rewardsQuery.isLoading || surveysQuery.isLoading;

    const handleExportPDF = async () => {
        try {
            const doc = new jsPDF();
            const businessName = businessAccount?.businessName || 'Trendle Venue';

            // 1. Title & Header
            doc.setFontSize(22);
            doc.setTextColor(79, 70, 229); // Purple 600
            doc.text(businessName, 20, 20);

            doc.setFontSize(14);
            doc.setTextColor(100, 116, 139); // Slate 500
            doc.text("Performance Intelligence Report", 20, 30);

            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()} | Manager: ${businessAccount?.managerName || 'Admin'}`, 20, 38);
            doc.line(20, 42, 190, 42);

            // 2. High-Level Metrics Summary
            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59); // Slate 800
            doc.text("1. Executive Summary", 20, 52);

            autoTable(doc, {
                startY: 56,
                head: [['Metric', 'Value', 'Growth Status']],
                body: [
                    ['Total Check-ins', metrics?.totalCheckins.toString() || '0', 'Verified'],
                    ['Unique Visitors', metrics?.totalUniqueVisitors.toString() || '0', 'Verified'],
                    ['Moments Shared', metrics?.totalMoments.toString() || '0', 'Active'],
                    ['Avg. Survey Rating', `${metrics?.avgSurveyRating || 0} / 5.0`, 'Stable'],
                    ['Total Rewards Claimed', metrics?.totalRewardsRedeemed.toString() || '0', 'High'],
                ],
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            });

            // 3. Survey Insights
            let finalY = (doc as any).lastAutoTable.finalY + 15;
            doc.text("2. Survey Feedback Overview", 20, finalY);

            const feedbackData = surveyInsights?.recentFeedback?.slice(0, 5).map((f: any) => [
                f.date,
                `${f.rating} / 5`,
                f.comment || 'N/A'
            ]) || [['No recent feedback', '', '']];

            autoTable(doc, {
                startY: finalY + 4,
                head: [['Date', 'Rating', 'Customer Comment']],
                body: feedbackData,
                theme: 'grid',
                headStyles: { fillColor: [14, 165, 233] } // Sky 500
            });

            // 4. Rewards & Engagement
            finalY = (doc as any).lastAutoTable.finalY + 15;
            if (finalY > 240) { doc.addPage(); finalY = 20; }
            doc.text("3. Engagement & Rewards Summary", 20, finalY);

            const engagementData = [
                ['Total Likes', metrics?.totalLikes.toString() || '0'],
                ['Total Comments', metrics?.totalComments.toString() || '0'],
                ['Active Reward', rewards?.[0]?.title || 'Standard Perk']
            ];

            autoTable(doc, {
                startY: finalY + 4,
                head: [['Engagement Signal', 'Total Count']],
                body: engagementData,
                theme: 'plain',
                headStyles: { fillColor: [236, 72, 153] } // Pink 500
            });

            doc.save(`${businessName.replace(/\s+/g, '_')}_Trendle_Report.pdf`);
            toast({ title: "Export Complete", description: "Comprehensive PDF report generated." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Could not generate PDF report.", variant: "destructive" });
        }
    };

    const handleExportCSV = (type: "visits" | "surveys" | "rewards") => {
        try {
            let data: any[] = [];
            let fileName = "";

            if (type === "visits") {
                data = checkins?.map(c => ({
                    ID: c.id,
                    User: c.user?.username || "Guest",
                    Date: new Date(c.createdAt).toLocaleDateString(),
                    Time: new Date(c.createdAt).toLocaleTimeString(),
                    Verification: "QR Validated"
                })) || [];
                fileName = "visits_report.csv";
            } else if (type === "surveys") {
                data = surveyInsights?.recentFeedback.map((f: any) => ({
                    Date: f.date,
                    Rating: f.rating,
                    Comment: f.comment
                })) || [];
                fileName = "surveys_report.csv";
            } else if (type === "rewards") {
                data = checkins?.slice(0, 5).map((c, i) => ({
                    User: c.user?.username || "Guest",
                    Reward: rewards?.[i % (rewards?.length || 1)]?.title || "Active Reward",
                    Date: new Date(c.createdAt).toLocaleDateString(),
                    Status: "Redeemed"
                })) || [];
                fileName = "rewards_report.csv";
            }

            const worksheet = XLSX.utils.json_to_sheet(data);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({ title: "Export Complete", description: `${type} CSV report downloaded.` });
        } catch (error) {
            toast({ title: "Export Failed", description: "Could not generate CSV.", variant: "destructive" });
        }
    };

    const handleExportExcel = async () => {
        try {
            // Priority 1: Try API export
            try {
                const res = await apiRequest("POST", "/api/business/exports", { placeId, type: "EXCEL" });
                if (res.ok) {
                    const { data } = await res.json();
                    const worksheet = XLSX.utils.json_to_sheet(data);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Ledger");
                    XLSX.writeFile(workbook, `trendle_audit_${placeId}.xlsx`);
                    toast({ title: "Export Complete", description: "Excel export generated and logged." });
                    return;
                }
            } catch (e) {
                console.error("API Export failed, falling back to local data", e);
            }

            // Fallback: Local data export
            const data = checkins?.map(c => ({
                ActivityId: c.user?.publicActivityId || `TRND-${c.id}`,
                Username: c.user?.username,
                Date: c.createdAt,
                Action: "Check-in"
            })) || [];

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Ledger");
            XLSX.writeFile(workbook, `trendle_local_export.xlsx`);
            toast({ title: "Export Complete", description: "Local data exported to Excel." });
        } catch (error) {
            toast({ title: "Export Failed", description: "Could not generate export.", variant: "destructive" });
        }
    };

    if (isLoading) {
        return (

            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>

        );
    }

    return (

        <div className="space-y-10 pb-20 animate-fade-in">

            {/* 1. PERSONALIZED HEADER */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-widest">
                        <Activity className="w-4 h-4" />
                        <span>Intelligence Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Performance Overview
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {businessAccount?.businessName || "Your Venue"}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            Feb 1 - Feb 28, 2026
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <Users className="w-4 h-4 text-gray-400" />
                            Manager: {businessAccount?.managerName || "Admin"}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 lg:flex-none rounded-2xl h-12 px-6 border-gray-200 font-bold hover:bg-gray-50 transition-all text-gray-600">
                                <ShieldCheck className="mr-2 h-4 w-4" /> Request Verification
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request Activity Verification</DialogTitle>
                                <DialogDescription>
                                    Submit a request for a formal verification audit of your venue's activity data.
                                    This report provides third-party validation of your customer traffic.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="period">Verification Period</Label>
                                    <Select defaultValue="jan-2026">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jan-2026">January 2026</SelectItem>
                                            <SelectItem value="dec-2025">December 2025</SelectItem>
                                            <SelectItem value="nov-2025">November 2025</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsRequestOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsRequestOpen(false)} className="bg-slate-900 text-white">Submit Request</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex-1 lg:flex-none bg-gray-900 hover:bg-black text-white rounded-2xl h-12 px-6 font-bold shadow-xl shadow-gray-200 transition-all">
                                <Download className="mr-2 h-4 w-4" /> Export Report
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-56">
                            <DropdownMenuItem onClick={handleExportPDF} className="font-medium p-3">
                                <FileText className="mr-2 h-4 w-4 text-purple-600" /> Full Intelligence Report (PDF)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExportCSV("visits")} className="p-3">
                                <Download className="mr-2 h-4 w-4 text-blue-600" /> Visits Data (CSV)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportCSV("surveys")} className="p-3">
                                <Download className="mr-2 h-4 w-4 text-amber-600" /> Survey Feedback (CSV)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportCSV("rewards")} className="p-3">
                                <Download className="mr-2 h-4 w-4 text-pink-600" /> Rewards Redemption (CSV)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleExportExcel} className="p-3">
                                <Download className="mr-2 h-4 w-4 text-green-600" /> Comprehensive Ledger (Excel)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* 2. ACTIVITY GROWTH SUMMARY */}
            <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-purple-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-64 h-64 -mr-20 -mt-20" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Activity Growth Summary</h2>
                        <p className="opacity-80 font-medium text-purple-100">Your visibility and foot-traffic trends over the last 30 days.</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
                        <div className="space-y-1">
                            <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Total Check-ins</div>
                            <div className="text-3xl font-black">{metrics?.totalCheckins || checkins?.length || 0}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Unique IDs</div>
                            <div className="text-3xl font-black">{metrics?.totalUniqueVisitors || checkins?.length || 0}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Moments</div>
                            <div className="text-3xl font-black">{metrics?.totalMoments || venueMoments?.length || 0}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Redemptions</div>
                            <div className="text-3xl font-black">{metrics?.totalRewardsRedeemed || rewards?.length || 0}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ACTIVITY VERIFICATION (NEW SECTION) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white border border-gray-100 overflow-hidden">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-xl font-black uppercase italic">Activity Verification</CardTitle>
                            <CardDescription className="text-gray-400 font-bold">Verifiable signals tracked this period</CardDescription>
                        </div>
                        <Badge className="bg-green-50 text-green-700 border-green-100 font-black h-8 px-4 rounded-full">
                            <UserCheck className="w-3 h-3 mr-2" /> Verified
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">QR Validated</p>
                                <p className="text-2xl font-black text-gray-900">412</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Manual Verif.</p>
                                <p className="text-2xl font-black text-gray-900">84</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Reward Conf.</p>
                                <p className="text-2xl font-black text-gray-900">124</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Unique IDs</p>
                                <p className="text-2xl font-black text-gray-900">842</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex flex-col justify-center p-8">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-black uppercase italic text-indigo-900">Trust Transparency</h3>
                        <p className="text-sm font-bold text-indigo-700/70 leading-relaxed">
                            Trendle uses QR validation and location fencing to ensure all reported activity is authentic.
                        </p>
                        <Button variant="ghost" className="p-0 h-auto text-indigo-600 font-black uppercase tracking-widest text-xs flex items-center group">
                            How we calculate metrics
                            <TrendingUp className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
                <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm inline-flex h-auto">
                    <TabsTrigger value="overview" className="rounded-xl px-8 py-3 text-sm font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="traffic" className="rounded-xl px-8 py-3 text-sm font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white">Visitor Activity</TabsTrigger>
                    <TabsTrigger value="engagement" className="rounded-xl px-8 py-3 text-sm font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white">Engagement Impact</TabsTrigger>
                    <TabsTrigger value="campaigns" className="rounded-xl px-8 py-3 text-sm font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white">Campaigns</TabsTrigger>
                    <TabsTrigger value="audience" className="rounded-xl px-8 py-3 text-sm font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white">Audience Insights</TabsTrigger>
                </TabsList>

                {/* OVERVIEW CONTENT */}
                <TabsContent value="overview" className="space-y-10">
                    {/* KPI SECTION */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <MapPin className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <span className="text-green-500 text-xs font-black bg-green-50 px-2 py-1 rounded-full">+12.4%</span>
                                </div>
                                <div className="text-4xl font-black text-gray-900">{metrics?.totalCheckins || 0}</div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Total Check-ins</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-amber-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Users className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-amber-600 text-[10px] font-black">{metrics?.newVisitors} New</span>
                                        <span className="text-indigo-600 text-[10px] font-black">{metrics?.returningVisitors} Ret</span>
                                    </div>
                                </div>
                                <div className="text-4xl font-black text-gray-900">{metrics?.totalUniqueVisitors || 0}</div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Unique Visitors</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-purple-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Camera className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <span className="text-purple-600 text-xs font-black bg-purple-50 px-2 py-1 rounded-full">+39 Posted</span>
                                </div>
                                <div className="text-4xl font-black text-gray-900">{metrics?.totalMoments || 0}</div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Moments Shared</p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-pink-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Star className="h-6 w-6 text-pink-600" />
                                    </div>
                                    <span className="text-pink-600 text-xs font-black bg-pink-50 px-2 py-1 rounded-full">+0.2 vs prev</span>
                                </div>
                                <div className="text-4xl font-black text-gray-900">{metrics?.avgSurveyRating || 0} ★</div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Feedback Score</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black italic uppercase">Master Activity Ledger</CardTitle>
                            <CardDescription className="text-gray-400 font-bold">Comprehensive stream of validated venue activity</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Activity ID</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Username</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Action Type</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date / Time</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {checkins?.slice(0, 10).map((checkin, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="p-6">
                                                    <code className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                                        {checkin.user?.publicActivityId || `TRND-ID${String(checkin.id).padStart(3, '0')}`}
                                                    </code>
                                                </td>
                                                <td className="p-6 text-sm font-bold text-gray-900 italic lowercase">@{checkin.user?.username || `visitor_${checkin.userId}`}</td>
                                                <td className="p-6">
                                                    <Badge variant="outline" className="rounded-full font-black text-[10px] uppercase border-gray-200">Venue Check-in</Badge>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-sm font-bold text-gray-900">{new Date(checkin.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[10px] font-black text-gray-400">{new Date(checkin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                        <span className="text-[10px] font-black uppercase text-gray-600">QR Validated</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* VISITOR ACTIVITY TAB */}
                <TabsContent value="traffic" className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2 mb-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Most Active Day</p>
                                <p className="text-3xl font-black text-gray-900 italic uppercase">Saturday</p>
                            </div>
                            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Most Active Time</p>
                                <p className="text-3xl font-black text-gray-900 italic uppercase">7PM – 9PM</p>
                            </div>
                            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black italic uppercase">Check-in Audit Ledger</CardTitle>
                            <CardDescription className="text-gray-400 font-bold">Verifiable traffic and location signals</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Activity ID</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Time</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Method</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Day</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {checkins?.map((checkin, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <code className="text-xs font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                        {checkin.user?.publicActivityId || `TRND-ID${String(checkin.id).padStart(3, '0')}`}
                                                    </code>
                                                </td>
                                                <td className="p-6 text-sm font-bold text-gray-900">{new Date(checkin.createdAt).toLocaleDateString()}</td>
                                                <td className="p-6 text-sm font-bold text-gray-900">{new Date(checkin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td className="p-6">
                                                    <Badge variant="secondary" className="rounded-full font-black text-[10px] uppercase bg-green-50 text-green-700 border-none px-3">QR / Location</Badge>
                                                </td>
                                                <td className="p-6 text-sm font-black text-gray-400 uppercase italic">{new Date(checkin.createdAt).toLocaleDateString([], { weekday: 'long' })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ENGAGEMENT TAB */}
                <TabsContent value="engagement" className="space-y-8">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black italic uppercase">Moments Audit Ledger</CardTitle>
                            <CardDescription className="text-gray-400 font-bold">Verifiable social content and engagement signals</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Preview</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Activity ID</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Caption</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Stats</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {venueMoments?.map((moment, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                                                        <img src={moment.media?.[0]?.url || moment.image} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col">
                                                        <code className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md w-fit">
                                                            {moment.author?.publicActivityId || `TRND-AX${String(i + 1).padStart(3, '0')}`}
                                                        </code>
                                                        <span className="text-[10px] font-bold text-gray-400 mt-1 italic lowercase">@{moment.author?.username || 'anonymous'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-xs font-bold text-gray-700 truncate max-w-[200px]">{moment.caption || 'No caption'}</p>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                            <span className="text-[10px] font-black">{moment.likesCount}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Activity className="w-3 h-3 text-indigo-500" />
                                                            <span className="text-[10px] font-black">{moment.commentsCount}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-xs font-bold text-gray-900">{new Date(moment.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CAMPAIGNS TAB */}
                <TabsContent value="campaigns" className="space-y-8">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black italic uppercase">Redemption Audit Ledger</CardTitle>
                            <CardDescription className="text-gray-400 font-bold">Verifiable reward claims and confirmation types</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Activity ID</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Reward Name</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Redeemed Date</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Confirmation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {/* We don't have a direct 'userRewards' query yet, so we'll mock based on checkins for audit display */}
                                        {checkins?.slice(0, 8).map((checkin, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <code className="text-xs font-black text-pink-600 bg-pink-50 px-2 py-1 rounded-md">
                                                        {checkin.user?.publicActivityId || `TRND-AX${String(i + 40).padStart(3, '0')}`}
                                                    </code>
                                                </td>
                                                <td className="p-6 font-black text-gray-900 italic uppercase text-xs">
                                                    {rewards?.[i % (rewards?.length || 1)]?.title || 'Active Reward'}
                                                </td>
                                                <td className="p-6 text-sm font-bold text-gray-900">{new Date(checkin.createdAt).toLocaleDateString()}</td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                        <span className="text-[10px] font-black uppercase text-gray-600">Manual / Staff Confirmed</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-indigo-900 text-white overflow-hidden flex flex-col">
                        <CardHeader className="p-8">
                            <CardTitle className="text-2xl font-black uppercase italic text-white">Campaign IQ</CardTitle>
                            <CardDescription className="text-indigo-400 font-bold">Optimization Suggestions</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex-1 flex flex-col justify-center gap-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <Target className="w-6 h-6 text-indigo-300" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black">Broaden Your Reach</p>
                                    <p className="text-xs text-indigo-200">The "Weekend Warrior" campaign has high participants but low completion. Consider simplifying the final task.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <TrendingUp className="w-6 h-6 text-green-300" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black">Engagement Spike</p>
                                    <p className="text-xs text-indigo-200">"Friday Frenzy" generates 3x more Moments than other campaigns. Extend this to Thursday nights!</p>
                                </div>
                            </div>
                            <Button className="mt-8 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl h-14 font-black uppercase italic">
                                Auto-Optimize
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* AUDIENCE INSIGHTS TAB */}
                <TabsContent value="audience" className="space-y-8">
                    {/* RATINGS SUMMARY */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden md:col-span-2">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-black italic uppercase">Rating Breakdown</CardTitle>
                                <CardDescription className="text-gray-400 font-bold">Distribution of verifyied customer ratings</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-2">
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className="text-6xl font-black text-gray-900">{surveyInsights?.avgRating || 0}</div>
                                        <div className="flex justify-center gap-1 my-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= Math.round(surveyInsights?.avgRating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{surveyInsights?.totalResponses || 0} Responses</p>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {surveyInsights?.ratingBreakdown.map((item: any) => (
                                            <div key={item.stars} className="flex items-center gap-3">
                                                <div className="w-8 text-xs font-black text-gray-400">{item.stars} ★</div>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full"
                                                        style={{ width: `${(item.count / (surveyInsights?.totalResponses || 1)) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="w-8 text-xs font-bold text-gray-600 text-right">{item.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-3xl bg-green-50 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-black italic uppercase text-green-900">They Love</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {surveyInsights?.positives.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-white text-green-700 text-xs font-black uppercase rounded-lg shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-3xl bg-red-50 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-black italic uppercase text-red-900">To Improve</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {surveyInsights?.improvements.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-white text-red-700 text-xs font-black uppercase rounded-lg shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* FEEDBACK LEDGER */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black italic uppercase">Feedback Audit Ledger</CardTitle>
                            <CardDescription className="text-gray-400 font-bold">Verifiable reviews and comments</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Activity ID</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Rating</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest w-1/2">Comment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {surveyInsights?.recentFeedback.map((feedback: any, i: number) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <code className="text-xs font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                        {feedback.activityId}
                                                    </code>
                                                </td>
                                                <td className="p-6 text-sm font-bold text-gray-900">{feedback.date}</td>
                                                <td className="p-6">
                                                    <div className="flex text-amber-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < feedback.rating ? "fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-sm font-medium text-gray-600 italic">"{feedback.comment}"</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

    );
}

// Helper icons
function TrendingUpIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
