
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
    Search,
    Filter,
    MoreHorizontal,
    LayoutDashboard,
    CreditCard,
    FileText,
    Key,
    AlertTriangle,
    ShieldCheck,
    Trash2,
    Plus,
    Loader2,
    Clock,
    Download,
    ChevronDown
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import CreateBusinessSheet from "@/components/admin/CreateBusinessSheet";
import SubscriptionPanel from "@/components/admin/SubscriptionPanel";

export default function AdminBusinesses() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [location, setLocation] = useLocation();

    // State for Modals/Sheets
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
    const [suspendId, setSuspendId] = useState<number | null>(null);
    const [deactivateId, setDeactivateId] = useState<number | null>(null);

    const { data: businesses, isLoading } = useQuery({
        queryKey: ["/api/admin/businesses"],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return [
                    {
                        id: 1,
                        name: "Dev Business",
                        category: "Restaurant",
                        city: "Cape Town",
                        plan: "Gold",
                        status: "active",
                        invoiceStatus: "Paid",
                        lastActivity: "2 min ago",
                        verification: "Verified"
                    },
                    {
                        id: 2,
                        name: "Test Venue",
                        category: "Club",
                        city: "Johannesburg",
                        plan: "Silver",
                        status: "suspended",
                        invoiceStatus: "Unpaid",
                        lastActivity: "2 days ago",
                        verification: "Pending"
                    }
                ];
            }
            const res = await fetch("/api/admin/businesses");
            if (!res.ok) throw new Error("Failed to fetch businesses");
            return res.json();
        }
    });

    // Fetch pending businesses
    const { data: pendingBusinesses, isLoading: isPendingLoading } = useQuery({
        queryKey: ["/api/admin/businesses/pending"],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return [
                    {
                        id: 3,
                        businessName: "New Burger Joint",
                        category: "Restaurant",
                        city: "Durban",
                        email: "owner@burgerjoint.com",
                        contactPerson: "John Doe",
                        contactPhone: "0123456789"
                    }
                ];
            }
            const res = await fetch("/api/admin/businesses/pending");
            if (!res.ok) throw new Error("Failed to fetch pending businesses");
            return res.json();
        }
    });

    // Approval mutation
    const approveMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/admin/businesses/${id}/approve`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to approve business");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses/pending"] });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses"] });
            toast({
                title: "Business Approved",
                description: "The business can now access their dashboard.",
            });
        },
        onError: () => {
            toast({
                title: "Approval Failed",
                description: "Failed to approve business. Please try again.",
                variant: "destructive",
            });
        }
    });

    // Rejection mutation
    const rejectMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/admin/businesses/${id}/reject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: "Application did not meet requirements" }),
            });
            if (!res.ok) throw new Error("Failed to reject business");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses/pending"] });
            toast({
                title: "Business Rejected",
                description: "The business application has been rejected.",
            });
        },
        onError: () => {
            toast({
                title: "Rejection Failed",
                description: "Failed to reject business. Please try again.",
                variant: "destructive",
            });
        }
    });

    const actionMutation = useMutation({
        mutationFn: async ({ id, action }: { id: number, action: string }) => {
            // Emulate API delay for realism
            await new Promise(r => setTimeout(r, 600));

            const res = await fetch(`/api/admin/businesses/${id}/${action}`, { method: "POST" });
            if (!res.ok) throw new Error(`Failed to ${action}`);
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses"] });

            // Close modals
            setSuspendId(null);
            setDeactivateId(null);

            let message = "";
            switch (variables.action) {
                case "suspend": message = "Business has been suspended."; break;
                case "activate": message = "Business has been reactivated."; break;
                case "deactivate": message = "Business has been permanently deactivated."; break;
                case "reset-password": message = "Password reset email sent to owner."; break;
                default: message = "Action successful.";
            }

            toast({ title: "Success", description: message });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to perform action. Please try again.", variant: "destructive" });
        }
    });

    // Action Handlers
    const handleViewBusiness = (id: number) => setLocation(`/admin/businesses/${id}`);
    const handleViewSubscription = (id: number) => setSubscriptionId(id);
    const handleViewLogs = (id: number) => setLocation(`/admin/activity?businessId=${id}`);
    const handleResetPassword = (id: number) => actionMutation.mutate({ id, action: "reset-password" });
    const handleSuspend = (id: number) => setSuspendId(id); // Opens modal
    const handleDeactivate = (id: number) => setDeactivateId(id); // Opens modal
    const handleActivate = (id: number) => actionMutation.mutate({ id, action: "activate" });

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' });
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("Venue Partners Master Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.line(20, 32, 275, 32);

            autoTable(doc, {
                startY: 40,
                head: [['ID', 'Name', 'Category', 'City', 'Plan', 'Status', 'Invoice', 'Verification']],
                body: businesses?.map((b: any) => [
                    b.id,
                    b.name,
                    b.category,
                    b.city,
                    b.plan,
                    b.status,
                    b.invoiceStatus,
                    b.verification
                ]) || [],
                theme: 'striped',
                headStyles: { fillColor: [5, 150, 105] } // Emerald 600
            });

            doc.save("businesses_master_report.pdf");
            toast({ title: "Export Complete", description: "Businesses list exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["ID", "Name", "Category", "City", "Plan", "Status", "Invoice", "Verification"];
            const rows = businesses?.map((b: any) => [
                b.id,
                `"${b.name.replace(/"/g, '""')}"`,
                b.category,
                b.city,
                b.plan,
                b.status,
                b.invoiceStatus,
                b.verification
            ]) || [];

            const csvContent = [
                headers.join(","),
                ...rows.map((row: any[]) => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "businesses_list.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Businesses list exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-slate-400" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Businesses</h1>
                    <p className="text-slate-500">Manage venue partners, subscriptions, and operational status.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search businesses..." className="pl-9 w-[280px] bg-white border-slate-200" />
                    </div>
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
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Business
                    </Button>
                </div>
            </div>

            {/* Pending Business Approvals */}
            {pendingBusinesses && pendingBusinesses.length > 0 && (
                <Card className="mb-6 border-blue-200 bg-blue-50/50">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Pending Business Approvals ({pendingBusinesses.length})
                        </h2>
                        <div className="space-y-3">
                            {pendingBusinesses.map((business: any) => (
                                <div key={business.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900">{business.businessName}</div>
                                        <div className="text-sm text-slate-600 mt-1">
                                            {business.category} • {business.city} • {business.email}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Contact: {business.contactPerson} • {business.contactPhone}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                            onClick={() => approveMutation.mutate(business.id)}
                                            disabled={approveMutation.isPending}
                                        >
                                            {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                            onClick={() => rejectMutation.mutate(business.id)}
                                            disabled={rejectMutation.isPending}
                                        >
                                            {rejectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}

            <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Business</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {businesses?.map((business: any) => (
                                <tr key={business.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div
                                            className="font-bold text-slate-900 cursor-pointer hover:text-emerald-600"
                                            onClick={() => handleViewBusiness(business.id)}
                                        >
                                            {business.name}
                                        </div>
                                        <div className="text-xs text-slate-500">{business.category} • {business.city}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="border-slate-200 text-slate-600 font-normal capitalize">
                                            {business.plan}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`
                                            ${business.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                                            ${business.status === 'suspended' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                                            ${business.status === 'deactivated' ? 'bg-slate-100 text-slate-700 hover:bg-slate-100' : ''}
                                            border-none shadow-none font-medium capitalize
                                        `}>
                                            {business.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${business.invoiceStatus === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            {business.invoiceStatus}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                        {business.lastActivity}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="text-sm font-semibold text-blue-600 hover:underline">
                                                    {business.verification}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 p-3 bg-white border-slate-200 shadow-lg">
                                                <h4 className="font-semibold text-sm mb-2 text-slate-900">Verification Breakdown</h4>
                                                <div className="space-y-2 text-sm text-slate-600">
                                                    <div className="flex justify-between"><span>QR Scans</span> <span className="font-mono text-slate-900">82%</span></div>
                                                    <div className="flex justify-between"><span>GPS Match</span> <span className="font-mono text-slate-900">14%</span></div>
                                                    <div className="flex justify-between"><span>Manual</span> <span className="font-mono text-slate-900">2%</span></div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 shadow-md">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleViewBusiness(business.id)} className="cursor-pointer">
                                                    <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" />
                                                    View Business
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleViewSubscription(business.id)} className="cursor-pointer">
                                                    <CreditCard className="w-4 h-4 mr-2 text-slate-500" />
                                                    View Subscription
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleViewLogs(business.id)} className="cursor-pointer">
                                                    <FileText className="w-4 h-4 mr-2 text-slate-500" />
                                                    View Activity Logs
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleResetPassword(business.id)} className="cursor-pointer">
                                                    <Key className="w-4 h-4 mr-2 text-slate-500" />
                                                    Reset Password
                                                </DropdownMenuItem>
                                                {business.status === 'active' ? (
                                                    <DropdownMenuItem
                                                        className="text-amber-600 focus:text-amber-700 focus:bg-amber-50 cursor-pointer"
                                                        onClick={() => handleSuspend(business.id)}
                                                    >
                                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                                        Suspend Business
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                                                        onClick={() => handleActivate(business.id)}
                                                    >
                                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                                        Activate Business
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                                                    onClick={() => handleDeactivate(business.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Deactivate
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* --- Modals & Sheets --- */}

            <CreateBusinessSheet
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />

            <SubscriptionPanel
                businessId={subscriptionId}
                open={!!subscriptionId}
                onOpenChange={(open) => !open && setSubscriptionId(null)}
            />

            {/* Suspend Alert */}
            <AlertDialog open={!!suspendId} onOpenChange={(open) => !open && setSuspendId(null)}>
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
                            onClick={() => suspendId && actionMutation.mutate({ id: suspendId, action: "suspend" })}
                        >
                            Suspend Business
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Deactivate Alert */}
            <AlertDialog open={!!deactivateId} onOpenChange={(open) => !open && setDeactivateId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Permanently Deactivate?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. usage of this account will be permanently disabled, but historical data will be retained for audits.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deactivateId && actionMutation.mutate({ id: deactivateId, action: "deactivate" })}
                        >
                            Deactivate Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}
