
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    MapPin,
    Mail,
    Phone,
    ShieldCheck,
    CreditCard,
    Activity,
    Users,
    Star,
    Download,
    ChevronDown
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SubscriptionPanel from "@/components/admin/SubscriptionPanel";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BusinessDetails() {
    const params = useParams<{ id: string }>();
    const businessId = parseInt(params.id || "0");
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [, setLocation] = useLocation();

    // State
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);

    const { data: business, isLoading } = useQuery({
        queryKey: [`/api/admin/businesses/${businessId}`],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return {
                    id: businessId,
                    name: "Dev Business Details",
                    status: "active",
                    city: "Cape Town",
                    publicId: `TRND-${businessId}`,
                    contactEmail: "dev@example.com",
                    contactPhone: "0123456789",
                    address: "123 Dev Street",
                    plan: "Enterprise",
                    monthlyFee: "2500"
                };
            }
            const res = await fetch(`/api/admin/businesses/${businessId}`);
            if (!res.ok) throw new Error("Failed to fetch business");
            return res.json();
        }
    });

    const actionMutation = useMutation({
        mutationFn: async ({ action }: { action: string }) => {
            // Emulate API delay
            await new Promise(r => setTimeout(r, 600));
            const res = await fetch(`/api/admin/businesses/${businessId}/${action}`, { method: "POST" });
            if (!res.ok) throw new Error(`Failed to ${action}`);
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [`/api/admin/businesses/${businessId}`] });
            setIsSuspendOpen(false);

            let message = "";
            switch (variables.action) {
                case "suspend": message = "Business has been suspended."; break;
                case "activate": message = "Business has been reactivated."; break;
                default: message = "Action successful.";
            }
            toast({ title: "Success", description: message });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to perform action.", variant: "destructive" });
        }
    });

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text(`${business.name} Profile Report`, 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.line(20, 32, 190, 32);

            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.text("Business Details", 20, 42);

            autoTable(doc, {
                startY: 48,
                head: [['Field', 'Value']],
                body: [
                    ['Business Name', business.name],
                    ['Public ID', business.publicId || `#${business.id}`],
                    ['Status', business.status],
                    ['City', business.city],
                    ['Category', business.category || 'N/A'],
                    ['Plan', business.plan],
                    ['Monthly Fee', `R${business.monthlyFee}`],
                    ['Contact Email', business.contactEmail || 'N/A'],
                    ['Contact Phone', business.contactPhone || 'N/A'],
                    ['Address', business.address || 'N/A']
                ],
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42] }
            });

            doc.save(`${business.name.replace(/\s+/g, '_')}_profile.pdf`);
            toast({ title: "Export Complete", description: "Business profile exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const data = [
                ["Field", "Value"],
                ["Business Name", business.name],
                ["Public ID", business.publicId || `#${business.id}`],
                ["Status", business.status],
                ["City", business.city],
                ["Category", business.category || 'N/A'],
                ["Plan", business.plan],
                ["Monthly Fee", `R${business.monthlyFee}`],
                ["Contact Email", business.contactEmail || 'N/A'],
                ["Contact Phone", business.contactPhone || 'N/A'],
                ["Address", business.address || 'N/A']
            ];

            const csvContent = data.map(row => row.join(",")).join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${business.name.replace(/\s+/g, '_')}_profile.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Business profile exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!business) return <div className="p-8">Business not found</div>;

    const handleEdit = () => {
        toast({ title: "Coming Soon", description: "Edit Profile feature is in development." });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-6">
                <Link href="/admin/businesses">
                    <Button variant="ghost" className="pl-0 text-slate-500 hover:text-slate-900 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Businesses
                    </Button>
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            {business.name}
                            <Badge className={`
                                ${business.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}
                                border-none font-medium
                            `}>
                                {business.status.toUpperCase()}
                            </Badge>
                        </h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {business.city} • <span className="font-mono">ID: {business.publicId || `#${business.id}`}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-white border-slate-200 text-slate-700">
                                    <Download className="w-4 h-4 mr-2" /> Export <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={handleExportCSV}>As CSV</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportPDF}>As PDF</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {business.status === 'active' ? (
                            <Button
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => setIsSuspendOpen(true)}
                            >
                                Suspend Business
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                onClick={() => actionMutation.mutate({ action: "activate" })}
                            >
                                Activate Business
                            </Button>
                        )}
                        <Button
                            className="bg-slate-900 text-white hover:bg-slate-800"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* --- LEFT COLUMN: INFO & STATS --- */}
                <div className="col-span-2 space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Visits</p>
                                    <p className="text-2xl font-bold text-slate-900">1,248</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Avg Rating</p>
                                    <p className="text-2xl font-bold text-slate-900">4.8</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Active Campaigns</p>
                                    <p className="text-2xl font-bold text-slate-900">3</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Verification Breakdown */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                Verification Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 font-medium">QR Code Scans</span>
                                        <span className="text-slate-900 font-bold">82%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[82%]" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">High trust factor. Most users verify via QR.</p>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 font-medium">GPS Location Match</span>
                                        <span className="text-slate-900 font-bold">14%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[14%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 font-medium">Manual Confirmations</span>
                                        <span className="text-slate-900 font-bold">4%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[4%]" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact & Info */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Email Address</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-900">{business.contactEmail || "N/A"}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Phone Number</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-900">{business.contactPhone || "N/A"}</span>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-slate-500">Address</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-900">{business.address || "N/A"}, {business.city}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN: SUBSCRIPTION & ACTIONS --- */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-purple-400" />
                                Subscription
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Current Plan</p>
                                <p className="text-2xl font-bold">{business.plan || "Basic"}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Status</p>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-none mt-1">
                                    Active • Auto-renew
                                </Badge>
                            </div>
                            <Separator className="bg-slate-700" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-xs">Monthly Fee</p>
                                    <p className="font-mono">R{business.monthlyFee || "0"}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Next Invoice</p>
                                    <p className="font-mono">Mar 01</p>
                                </div>
                            </div>
                            <Button
                                className="w-full bg-white text-slate-900 hover:bg-slate-200 mt-2"
                                onClick={() => setIsSubscriptionOpen(true)}
                            >
                                Manage Subscription
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                                    <div>
                                        <p className="text-slate-900 font-medium">Profile Updated</p>
                                        <p className="text-slate-500 text-xs">2 hours ago by Admin</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                                    <div>
                                        <p className="text-slate-900 font-medium">Subscription Renewed</p>
                                        <p className="text-slate-500 text-xs">1 day ago via Stripe</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
                                    <div>
                                        <p className="text-slate-900 font-medium">Login Detected</p>
                                        <p className="text-slate-500 text-xs">3 days ago from Cape Town</p>
                                    </div>
                                </div>
                            </div>
                            <Link href={`/admin/activity?businessId=${businessId}`}>
                                <Button variant="ghost" className="w-full mt-4 text-slate-500">
                                    View All Logs
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- SHEETS & MODALS --- */}
            <SubscriptionPanel
                businessId={businessId}
                open={isSubscriptionOpen}
                onOpenChange={setIsSubscriptionOpen}
            />

            <AlertDialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Suspend this business?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will block access to their business portal and hide their venue from the app. They will not be billed while suspended.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-amber-600 hover:bg-amber-700"
                            onClick={() => actionMutation.mutate({ action: "suspend" })}
                        >
                            Suspend Business
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
