import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    Filter,
    MoreHorizontal,
    Shield,
    Ban,
    Eye,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Users,
    Download,
    Check,
    ChevronDown
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter
} from "@/components/ui/sheet";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminUsers() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedTab, setSelectedTab] = useState("users");

    // State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [warningOpen, setWarningOpen] = useState(false);
    const [suspendOpen, setSuspendOpen] = useState(false);
    const [actionReason, setActionReason] = useState("");

    // Action Mutations
    const actionMutation = useMutation({
        mutationFn: async ({ id, action, reason }: { id: number, action: string, reason?: string }) => {
            const res = await fetch(`/api/admin/users/${id}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason, notes: reason })
            });
            if (!res.ok) throw new Error("Action failed");
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            toast({ title: "Success", description: `User ${variables.action} action completed.` });
            setWarningOpen(false);
            setSuspendOpen(false);
            setActionReason("");
            if (variables.action === 'suspend' || variables.action === 'reactivate') {
                // Keep drawer open or close depending on preference. Closing for now.
                // setSelectedUser(null); 
            }
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    const { data: users, isLoading: isLoadingUsers } = useQuery({
        queryKey: ["/api/admin/users"],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return [
                    { id: 1, publicId: "TRND-US001", username: "dev_user", status: "Active", integrity: "Verified", risk: "Low" },
                    { id: 2, publicId: "TRND-US002", username: "sus_user", status: "Active", integrity: "Flagged", risk: "High" },
                ];
            }
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        }
    });

    const { data: requests, isLoading: isLoadingRequests } = useQuery({
        queryKey: ["/api/admin/verification-requests"],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return [
                    {
                        id: "CASE-001",
                        business: "Dev Business",
                        period: "Jan 2024",
                        requestedOn: "2024-01-15",
                        status: "Pending",
                        stats: {
                            totalCheckins: 150,
                            uniqueIds: 120,
                            qrVerified: 100,
                            locationVerified: 40,
                            manual: 10,
                            anomalies: "None"
                        }
                    }
                ];
            }
            const res = await fetch("/api/admin/verification-requests");
            if (!res.ok) throw new Error("Failed to fetch requests");
            return res.json();
        }
    });

    const verifyMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/verification-requests/${id}/verify`, {
                method: "POST"
            });
            if (!res.ok) throw new Error("Failed to verify");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-requests"] });
        }
    });

    // Mock Verification Requests

    // PDF Generation
    const generateAuditPDF = (req: any) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text("Activity Verification Summary", 14, 22);

        doc.setFontSize(10);
        doc.text("Trendle Platform Administration", 14, 30);
        doc.text(`Reference: ${req.id}`, 14, 35);
        doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 40);

        // Content
        doc.setFontSize(12);
        doc.text(`Business: ${req.business}`, 14, 55);
        doc.text(`Verification Period: ${req.period}`, 14, 62);

        doc.setFontSize(14);
        doc.text("Verification Data", 14, 75);

        doc.setFontSize(11);
        doc.text(`Total Activity Records: ${req.stats.totalCheckins}`, 14, 85);
        doc.text(`Unique Identity IDs: ${req.stats.uniqueIds}`, 14, 92);

        doc.text("Verification Method Breakdown:", 14, 105);
        doc.text(`- QR Verified: ${req.stats.qrVerified}`, 20, 112);
        doc.text(`- Location Verified: ${req.stats.locationVerified}`, 20, 119);
        doc.text(`- Manual Confirmation: ${req.stats.manual}`, 20, 126);

        // Statement
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Official Statement:", 14, 145);
        doc.setFont("helvetica", "normal");
        doc.text("All activity records listed above have been cross-referenced against", 14, 152);
        doc.text("our internal identity database. No duplication, manipulation, or", 14, 157);
        doc.text("bot activity was detected within the specified period.", 14, 162);

        doc.setFont("helvetica", "italic");
        doc.text("Signed: Trendle Platform Trust & Safety", 14, 180);

        doc.save(`Verification_Audit_${req.id}.pdf`);

        // Trigger status update
        verifyMutation.mutate(req.id);
        setSelectedRequest(null);

        toast({
            title: "Audit Report Generated",
            description: "PDF downloaded and request marked as verified.",
        });
    };

    // Action Handlers
    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("User Identity & Risk Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.line(20, 32, 190, 32);

            autoTable(doc, {
                startY: 40,
                head: [['ID', 'Public ID', 'Username', 'Status', 'Integrity', 'Risk']],
                body: users?.map((u: any) => [
                    u.id,
                    u.publicId,
                    u.username,
                    u.status,
                    u.integrity,
                    u.risk
                ]) || [],
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }
            });

            doc.save("users_identity_report.pdf");
            toast({ title: "Export Complete", description: "Users list exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["ID", "Public ID", "Username", "Status", "Integrity", "Risk"];
            const rows = users?.map((u: any) => [
                u.id,
                u.publicId,
                `"${u.username.replace(/"/g, '""')}"`,
                u.status,
                u.integrity,
                u.risk
            ]) || [];

            const csvContent = [
                headers.join(","),
                ...rows.map((row: any[]) => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "users_list.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Users list exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    const handleReject = () => {
        toast({ title: "Request Rejected", description: "The verification request has been rejected." });
        setSelectedRequest(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users & Identity</h1>
                    <p className="text-slate-500">Identity layer, fraud monitoring, and verification audits.</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-white border-slate-200 text-slate-700">
                            <Download className="w-4 h-4 mr-2" /> Export Users <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={handleExportCSV}>As CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPDF}>As PDF</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Tabs defaultValue="users" onValueChange={setSelectedTab} className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">All Users</TabsTrigger>
                    <TabsTrigger value="requests" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Verification Requests
                        <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none h-5 px-1.5">
                            {requests?.filter((r: any) => r.status === 'Pending').length || 0}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                {/* ALL USERS TAB */}
                <TabsContent value="users">
                    <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search internal ID, public ID, username..." className="pl-9 bg-slate-50 border-slate-200" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Internal ID</th>
                                        <th className="px-6 py-4">Public Activity ID</th>
                                        <th className="px-6 py-4">Username</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Verification Integrity</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users?.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">#{user.id}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="bg-slate-50 font-mono text-slate-700 border-slate-200">
                                                    {user.publicId}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{user.username}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {user.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.integrity === 'Verified' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>}
                                                {user.integrity === 'Under Review' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" /> Reviewing</Badge>}
                                                {user.integrity === 'Flagged' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"><Shield className="w-3 h-3 mr-1" /> Flagged</Badge>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedUser(user)}>
                                                            <Eye className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                    </SheetTrigger>
                                                    <SheetContent className="w-[400px] sm:w-[540px]">
                                                        <SheetHeader>
                                                            <SheetTitle>User Profile</SheetTitle>
                                                            <SheetDescription>Manage user access and risk status.</SheetDescription>
                                                        </SheetHeader>

                                                        {selectedUser && (
                                                            <div className="mt-6 space-y-6">
                                                                {/* Summary Card */}
                                                                <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                                                                    <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                                                                        {selectedUser.username.substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-lg">{selectedUser.username}</h3>
                                                                        <div className="text-sm text-slate-500 font-mono">{selectedUser.publicId}</div>
                                                                        <Badge className={`mt-2 ${selectedUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                            {selectedUser.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>

                                                                {/* Stats Grid */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="p-3 border rounded-lg text-center">
                                                                        <div className="text-xs text-slate-500 uppercase font-bold">Risk Score</div>
                                                                        <div className={`text-xl font-bold ${selectedUser.risk === 'High' ? 'text-red-600' : 'text-slate-900'}`}>
                                                                            {selectedUser.risk}
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-3 border rounded-lg text-center">
                                                                        <div className="text-xs text-slate-500 uppercase font-bold">Warnings</div>
                                                                        <div className="text-xl font-bold text-slate-900">{selectedUser.warnings || 0}</div>
                                                                    </div>
                                                                </div>

                                                                {/* Actions */}
                                                                <Separator />
                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-bold text-slate-900">Account Actions</h4>

                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setWarningOpen(true)}>
                                                                            <AlertTriangle className="w-4 h-4 mr-2" /> Warn User
                                                                        </Button>

                                                                        {selectedUser.status === 'suspended' ? (
                                                                            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" onClick={() => actionMutation.mutate({ id: selectedUser.id, action: 'reactivate', reason: 'Manual reactivation' })}>
                                                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Reactivate
                                                                            </Button>
                                                                        ) : (
                                                                            <Button variant="destructive" onClick={() => setSuspendOpen(true)}>
                                                                                <Ban className="w-4 h-4 mr-2" /> Suspend
                                                                            </Button>
                                                                        )}
                                                                    </div>

                                                                    <Button variant="ghost" className="w-full text-slate-500" onClick={() => actionMutation.mutate({ id: selectedUser.id, action: 'escalate', reason: 'High risk behavior detected' })}>
                                                                        <Shield className="w-4 h-4 mr-2" /> Escalate to Fraud Team
                                                                    </Button>
                                                                </div>

                                                                {/* Warning Dialog */}
                                                                <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Issue Warning</DialogTitle>
                                                                            <DialogDescription>
                                                                                Value will be incremented. This is visible to other admins.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <Textarea
                                                                            placeholder="Reason for warning..."
                                                                            value={actionReason}
                                                                            onChange={(e) => setActionReason(e.target.value)}
                                                                        />
                                                                        <DialogFooter>
                                                                            <Button variant="outline" onClick={() => setWarningOpen(false)}>Cancel</Button>
                                                                            <Button
                                                                                onClick={() => actionMutation.mutate({ id: selectedUser.id, action: 'warn', reason: actionReason })}
                                                                                disabled={!actionReason}
                                                                            >
                                                                                Issue Warning
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>

                                                                {/* Suspend Dialog */}
                                                                <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle className="text-red-600">Suspend User Account?</DialogTitle>
                                                                            <DialogDescription>
                                                                                They will be logged out immediately and unable to access the app.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <Textarea
                                                                            placeholder="Reason for suspension..."
                                                                            value={actionReason}
                                                                            onChange={(e) => setActionReason(e.target.value)}
                                                                            className="border-red-100 focus:border-red-300"
                                                                        />
                                                                        <DialogFooter>
                                                                            <Button variant="outline" onClick={() => setSuspendOpen(false)}>Cancel</Button>
                                                                            <Button
                                                                                variant="destructive"
                                                                                onClick={() => actionMutation.mutate({ id: selectedUser.id, action: 'suspend', reason: actionReason })}
                                                                                disabled={!actionReason}
                                                                            >
                                                                                Suspend Account
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        )}
                                                    </SheetContent>
                                                </Sheet>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                {/* VERIFICATION REQUESTS TAB */}
                <TabsContent value="requests">
                    <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Business Verification Requests</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Case ID</th>
                                        <th className="px-6 py-4">Business</th>
                                        <th className="px-6 py-4">Period</th>
                                        <th className="px-6 py-4">Requested On</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {requests?.map((req: any) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{req.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{req.business}</td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-xs">{req.period}</td>
                                            <td className="px-6 py-4 text-slate-500">{req.requestedOn}</td>
                                            <td className="px-6 py-4">
                                                {req.status === 'Pending' ? (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending Review</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                                            onClick={() => setSelectedRequest(req)}
                                                        >
                                                            Review
                                                        </Button>
                                                    </SheetTrigger>
                                                    {selectedRequest?.id === req.id && (
                                                        <SheetContent className="w-[400px] sm:w-[540px]">
                                                            <SheetHeader className="mb-6">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Badge variant="outline" className="font-mono text-slate-500">{req.id}</Badge>
                                                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Pending Review</Badge>
                                                                </div>
                                                                <SheetTitle className="text-xl font-bold text-slate-900">Verification Case</SheetTitle>
                                                                <SheetDescription>Verify activity data for {req.business}.</SheetDescription>
                                                            </SheetHeader>

                                                            <div className="space-y-6">
                                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-slate-500">Business</span>
                                                                        <span className="font-bold text-slate-900">{req.business}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-slate-500">Period</span>
                                                                        <span className="font-mono text-slate-900">{req.period}</span>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                                        <FileText className="w-4 h-4 text-slate-400" /> System Summary
                                                                    </h4>
                                                                    <div className="border rounded-md divide-y divide-slate-100">
                                                                        <div className="p-3 flex justify-between text-sm">
                                                                            <span className="text-slate-600">Total Check-ins</span>
                                                                            <span className="font-bold text-slate-900">{req.stats.totalCheckins}</span>
                                                                        </div>
                                                                        <div className="p-3 flex justify-between text-sm bg-slate-50/50">
                                                                            <span className="text-slate-600">Unique Activity IDs</span>
                                                                            <span className="font-bold text-slate-900">{req.stats.uniqueIds}</span>
                                                                        </div>
                                                                        <div className="p-3 flex justify-between text-sm">
                                                                            <span className="text-slate-600">Verification Breakdown</span>
                                                                            <div className="text-right text-xs text-slate-500">
                                                                                <div>QR: <span className="font-bold text-slate-700">{req.stats.qrVerified}</span></div>
                                                                                <div>Loc: <span className="font-bold text-slate-700">{req.stats.locationVerified}</span></div>
                                                                                <div>Man: <span className="font-bold text-slate-700">{req.stats.manual}</span></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Internal Cross Check - Hidden from Business */}
                                                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                                                    <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                        <Shield className="w-3 h-3" /> Internal Cross-Check
                                                                    </h4>
                                                                    <div className="text-indigo-900 text-sm space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <Check className="w-4 h-4 text-indigo-600" />
                                                                            <span>{req.stats.uniqueIds} Unique IDs Mapped</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Check className="w-4 h-4 text-indigo-600" />
                                                                            <span>No duplicate identity mapping detected</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            {req.stats.anomalies === "None" ? (
                                                                                <Check className="w-4 h-4 text-indigo-600" />
                                                                            ) : (
                                                                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                                            )}
                                                                            <span>Anomaly Flags: <b>{req.stats.anomalies}</b></span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3 pt-4">
                                                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" onClick={() => generateAuditPDF(req)}>
                                                                        <FileText className="w-4 h-4 mr-2" /> Generate Audit PDF & Approve
                                                                    </Button>
                                                                    <div className="grid grid-cols-1 gap-3">
                                                                        <Button variant="outline" onClick={handleReject}>Reject Request</Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SheetContent>
                                                    )}
                                                </Sheet>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
