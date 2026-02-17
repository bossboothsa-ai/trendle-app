import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    Download,
    FileText,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    Shield,
    Mail,
    Ban,
    History,
    MoreHorizontal,
    Send,
    ChevronDown
} from "lucide-react";
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
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AdminSubscriptions() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch subscriptions
    const { data: businesses = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/businesses"],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return [
                    { id: 1, name: "Dev Business", category: "Restaurant", city: "Cape Town", plan: "Enterprise", status: "Active", invoiceStatus: "Paid" },
                    { id: 2, name: "Test Venue", category: "Club", city: "Johannesburg", plan: "Pro", status: "Suspended", invoiceStatus: "Overdue" }
                ];
            }
            const res = await fetch("/api/admin/businesses");
            if (!res.ok) throw new Error("Failed to fetch businesses");
            return res.json();
        }
    });

    const subscriptions = businesses.map((b: any) => ({
        id: b.id,
        business: b.name,
        plan: b.plan || "Pro Plan",
        amount: b.plan === "Enterprise" ? "R2,500" : b.plan === "Basic" ? "R450" : "R950",
        billingCycle: "Monthly",
        nextInvoice: "Mar 1, 2026",
        status: b.status,
        invoiceStatus: b.invoiceStatus || "Paid",
        invoices: [
            {
                id: `INV-2026-${b.id.toString().padStart(4, '0')}`,
                period: "Feb 2026",
                amount: b.plan === "Enterprise" ? "R2,500" : b.plan === "Basic" ? "R450" : "R950",
                status: b.invoiceStatus || "Paid",
                issued: "Feb 1",
                due: "Feb 7"
            }
        ],
        auditLog: []
    }));

    const markPaidMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("POST", `/api/admin/invoices/${id}/mark-paid`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses"] });
            toast({ title: "Success", description: "Invoice marked as paid." });
            setIsMarkPaidOpen(false);
        },
        onError: (err: any) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    // PDF Generation Logic
    const generateInvoice = (invoice: any, business: any) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text("INVOICE", 14, 22);

        doc.setFontSize(10);
        doc.text("Trendle Platform (Pty) Ltd", 14, 32);
        doc.text("Reg: 2024/102938/07", 14, 37);
        doc.text("123 Kloof Street, Gardens", 14, 42);
        doc.text("Cape Town, 8001", 14, 47);
        doc.text("accounts@trendle.co.za", 14, 52);

        // Invoice Details
        doc.setFontSize(10);
        doc.text(`Invoice #: ${invoice.id}`, 140, 32);
        doc.text(`Date Issued: ${invoice.issued}, 2026`, 140, 37);
        doc.text(`Due Date: ${invoice.due}, 2026`, 140, 42);
        doc.text(`Status: ${invoice.status}`, 140, 47);

        // Bill To
        doc.text("Bill To:", 14, 65);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(business.business, 14, 70);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${business.plan} Subscription`, 14, 75);

        // Line Items
        autoTable(doc, {
            startY: 85,
            head: [['Description', 'Period', 'Amount']],
            body: [
                [`Trendle ${business.plan} Subscription`, invoice.period, invoice.amount],
            ],
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] }, // Slate 900
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Total Due: ${invoice.amount}`, 140, finalY);

        // footer / Bank Details
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Payment Instructions:", 14, finalY + 20);
        doc.setFont("helvetica", "normal");
        doc.text("Bank: First National Bank", 14, finalY + 25);
        doc.text("Account Name: Trendle Platform", 14, finalY + 30);
        doc.text("Account Number: 62000000000", 14, finalY + 35);
        doc.text("Branch Code: 250655", 14, finalY + 40);
        doc.text(`Reference: ${invoice.id}`, 14, finalY + 45);

        // Save
        doc.save(`${business.business.replace(/ /g, "_")}_${invoice.id}.pdf`);

        toast({
            title: "Invoice Downloaded",
            description: `Saved ${invoice.id} to your device.`,
        });
    };

    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
    const selectedSub = subscriptions.find((s: any) => s.id === selectedSubId);

    const [actionNote, setActionNote] = useState("");
    const [extendDays, setExtendDays] = useState("3");

    // Dialog States
    const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false);
    const [isMarkOverdueOpen, setIsMarkOverdueOpen] = useState(false);
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);
    const [isReminderOpen, setIsReminderOpen] = useState(false);

    const handleAction = (type: string) => {
        if (!selectedSub) return;

        if (type === "Marked Paid") {
            markPaidMutation.mutate(selectedSub.id);
            return;
        }

        // Other actions are mock for now
        toast({
            title: "Action Completed",
            description: `${type} for ${selectedSub.business}`,
        });

        // Reset states
        setActionNote("");
        setIsMarkPaidOpen(false);
        setIsMarkOverdueOpen(false);
        setIsExtendOpen(false);
        setIsSuspendOpen(false);
        setIsReminderOpen(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>;
            case "Restricted": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Restricted</Badge>;
            case "Suspended": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Suspended</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getInvoiceBadge = (status: string) => {
        switch (status) {
            case "Paid": return <span className="text-green-600 font-bold text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
            case "Unpaid": return <span className="text-slate-500 font-bold text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Unpaid</span>;
            case "Overdue": return <span className="text-red-600 font-bold text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Overdue</span>;
            default: return <span>{status}</span>;
        }
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("Subscriptions Ledger Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.line(20, 32, 190, 32);

            autoTable(doc, {
                startY: 40,
                head: [['Business', 'Plan', 'Monthly Fee', 'Status', 'Next Invoice', 'Invoice Status']],
                body: subscriptions.map(s => [
                    s.business,
                    s.plan,
                    s.amount,
                    s.status,
                    s.nextInvoice,
                    s.invoiceStatus
                ]),
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }
            });

            doc.save("subscriptions_ledger.pdf");
            toast({ title: "Export Complete", description: "Ledger exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["Business", "Plan", "Monthly Fee", "Status", "Next Invoice", "Invoice Status"];
            const rows = subscriptions.map(s => [
                `"${s.business.replace(/"/g, '""')}"`,
                s.plan,
                s.amount,
                s.status,
                s.nextInvoice,
                s.invoiceStatus
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "subscriptions_ledger.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Ledger exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    const handleResendEmail = () => {
        toast({ title: "Email Sent", description: "Invoice copy has been resent to the business." });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Subscriptions</h1>
                    <p className="text-slate-500">Invoice ledger and access control.</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-white border-slate-200 text-slate-700">
                            <Download className="w-4 h-4 mr-2" /> Export Ledger <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={handleExportCSV}>As CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPDF}>As PDF</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Operational Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4 border-slate-200 shadow-sm bg-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Total</p>
                    <p className="text-xl font-bold text-slate-700">R42,500</p>
                </Card>
                <Card className="p-4 border-slate-200 shadow-sm bg-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Businesses</p>
                    <p className="text-xl font-bold text-slate-900">{subscriptions.filter(s => s.status === 'Active').length}</p>
                </Card>
                <Card className="p-4 border-slate-200 shadow-sm bg-white border-l-4 border-l-red-500">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overdue Accounts</p>
                    <p className="text-xl font-bold text-red-600">{subscriptions.filter(s => s.invoiceStatus === 'Overdue').length}</p>
                </Card>
            </div>

            {/* Subscription Table */}
            <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input placeholder="Search business..." className="pl-8 h-9 text-xs bg-white border-slate-200" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Business</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Monthly Fee</th>
                                <th className="px-6 py-3">Access Status</th>
                                <th className="px-6 py-3">Next Invoice</th>
                                <th className="px-6 py-3">Latest Invoice</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {subscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{sub.business}</td>
                                    <td className="px-6 py-4 text-slate-600">{sub.plan}</td>
                                    <td className="px-6 py-4 text-slate-900 font-mono">{sub.amount}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            {getStatusBadge(sub.status)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {sub.nextInvoice}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getInvoiceBadge(sub.invoiceStatus)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-7 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                                    onClick={() => setSelectedSubId(sub.id)}
                                                >
                                                    Manage
                                                </Button>
                                            </SheetTrigger>
                                            {selectedSub && selectedSub.id === sub.id && (
                                                <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
                                                    <SheetHeader className="mb-6">
                                                        <SheetTitle className="text-xl font-bold text-slate-900">Subscription & Invoices</SheetTitle>
                                                        <SheetDescription>
                                                            Manage access and billing for {selectedSub.business}.
                                                        </SheetDescription>
                                                    </SheetHeader>

                                                    <div className="space-y-8">
                                                        {/* Plan Info */}
                                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-slate-500">Current Plan</span>
                                                                <span className="font-bold text-slate-900">{selectedSub.plan}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-slate-500">Monthly Fee</span>
                                                                <span className="font-mono font-bold text-slate-900">{selectedSub.amount}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-slate-500">Next Invoice</span>
                                                                <span className="text-sm font-medium text-slate-900">{selectedSub.nextInvoice}</span>
                                                            </div>
                                                            <Separator className="bg-slate-200" />
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-slate-500">Access Status</span>
                                                                {getStatusBadge(selectedSub.status)}
                                                            </div>
                                                        </div>

                                                        {/* Admin Actions */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 mb-3">Admin Actions</h4>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {/* Mark Paid */}
                                                                <Dialog open={isMarkPaidOpen} onOpenChange={setIsMarkPaidOpen}>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline" className="justify-start text-slate-700">
                                                                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Mark Paid
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Mark Invoice as Paid?</DialogTitle>
                                                                            <DialogDescription>
                                                                                Confirm marking {selectedSub.invoices[0]?.id} as Paid. <br />
                                                                                This will restore full account access if currently restricted.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="py-2">
                                                                            <Label>Payment Reference (Optional)</Label>
                                                                            <Input
                                                                                placeholder="E.g. EFT-123456"
                                                                                value={actionNote}
                                                                                onChange={(e) => setActionNote(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <DialogFooter>
                                                                            <Button variant="outline" onClick={() => setIsMarkPaidOpen(false)}>Cancel</Button>
                                                                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAction("Marked Paid")}>Confirm Payment</Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>

                                                                {/* Mark Overdue */}
                                                                <Dialog open={isMarkOverdueOpen} onOpenChange={setIsMarkOverdueOpen}>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline" className="justify-start text-slate-700">
                                                                            <AlertCircle className="w-4 h-4 mr-2 text-amber-500" /> Mark Overdue
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Mark Invoice as Overdue?</DialogTitle>
                                                                            <DialogDescription>
                                                                                Business will enter 48-hour grace period before restrictions apply.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter>
                                                                            <Button variant="outline" onClick={() => setIsMarkOverdueOpen(false)}>Cancel</Button>
                                                                            <Button variant="destructive" onClick={() => handleAction("Marked Overdue")}>Confirm Overdue</Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>

                                                                {/* Send Reminder */}
                                                                <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline" className="justify-start text-slate-700">
                                                                            <Mail className="w-4 h-4 mr-2 text-blue-500" /> Send Reminder
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Send Payment Reminder</DialogTitle>
                                                                            <DialogDescription>
                                                                                Send email reminder for {selectedSub.invoices[0]?.id}?
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter>
                                                                            <Button variant="outline" onClick={() => setIsReminderOpen(false)}>Cancel</Button>
                                                                            <Button onClick={() => handleAction("Reminder Sent")}>Send Email</Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>

                                                                {/* Extend Due Date */}
                                                                <Dialog open={isExtendOpen} onOpenChange={setIsExtendOpen}>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline" className="justify-start text-slate-700">
                                                                            <Clock className="w-4 h-4 mr-2 text-slate-500" /> Extend Due Date
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Extend Due Date</DialogTitle>
                                                                            <DialogDescription>
                                                                                Grant extra time before overdue logic applies.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="py-2 flex items-center gap-4">
                                                                            <Label>Extend by (Days)</Label>
                                                                            <Input
                                                                                type="number"
                                                                                className="w-24"
                                                                                value={extendDays}
                                                                                onChange={(e) => setExtendDays(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <DialogFooter>
                                                                            <Button variant="outline" onClick={() => setIsExtendOpen(false)}>Cancel</Button>
                                                                            <Button onClick={() => handleAction(`Extended Due Date (+${extendDays} days)`)}>Confirm Extension</Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>

                                                            {/* Suspend / Restrict */}
                                                            <div className="mt-3">
                                                                <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="destructive" className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200">
                                                                            <Ban className="w-4 h-4 mr-2" /> Suspend / Restrict Access
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Suspend or Restrict Access</DialogTitle>
                                                                            <DialogDescription>
                                                                                <b>Restrict</b>: Read-only access. (Recommended for overdue)<br />
                                                                                <b>Suspend</b>: Block login completely.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="py-2">
                                                                            <Label>Reason for Suspension</Label>
                                                                            <Textarea
                                                                                placeholder="E.g. Non-payment after multiple warnings"
                                                                                value={actionNote}
                                                                                onChange={(e) => setActionNote(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <DialogFooter className="gap-2 sm:gap-0">
                                                                            <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
                                                                            <div className="flex gap-2">
                                                                                <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => handleAction("Restricted Access")}>Restrict</Button>
                                                                                <Button variant="destructive" onClick={() => handleAction("Suspended Access")}>Full Suspend</Button>
                                                                            </div>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </div>

                                                        {/* Invoice History */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                                <FileText className="w-4 h-4 text-slate-400" /> Invoice History
                                                            </h4>
                                                            <div className="border rounded-md overflow-hidden">
                                                                <table className="w-full text-left text-xs">
                                                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                                                        <tr>
                                                                            <th className="px-3 py-2">Invoice #</th>
                                                                            <th className="px-3 py-2">Period</th>
                                                                            <th className="px-3 py-2">Amount</th>
                                                                            <th className="px-3 py-2">Status</th>
                                                                            <th className="px-3 py-2 text-right">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100">
                                                                        {selectedSub.invoices?.map((inv: any, i: number) => (
                                                                            <tr key={i} className="hover:bg-slate-50/50">
                                                                                <td className="px-3 py-2 font-mono text-slate-600">{inv.id}</td>
                                                                                <td className="px-3 py-2 text-slate-900">{inv.period}</td>
                                                                                <td className="px-3 py-2 font-mono text-slate-600">{inv.amount}</td>
                                                                                <td className="px-3 py-2">
                                                                                    {inv.status === 'Paid' ? (
                                                                                        <span className="text-green-600 font-bold">Paid</span>
                                                                                    ) : inv.status === 'Overdue' ? (
                                                                                        <span className="text-red-600 font-bold">Overdue</span>
                                                                                    ) : (
                                                                                        <span className="text-slate-500 font-bold">Unpaid</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-3 py-2 text-right">
                                                                                    <div className="flex justify-end gap-1">
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-6 w-6 text-slate-400 hover:text-slate-900"
                                                                                            title="Download PDF"
                                                                                            onClick={() => generateInvoice(inv, selectedSub)}
                                                                                        >
                                                                                            <Download className="w-3 h-3" />
                                                                                        </Button>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="h-6 w-6 text-slate-400 hover:text-slate-900"
                                                                                            title="Resend Email"
                                                                                            onClick={handleResendEmail}
                                                                                        >
                                                                                            <Send className="w-3 h-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {/* Audit Log */}
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                                <History className="w-4 h-4 text-slate-400" /> Action History
                                                            </h4>
                                                            <div className="border rounded-md overflow-hidden bg-slate-50/50">
                                                                <table className="w-full text-left text-xs">
                                                                    <thead className="bg-slate-100 text-slate-500 font-medium border-b">
                                                                        <tr>
                                                                            <th className="px-3 py-2">Date</th>
                                                                            <th className="px-3 py-2">Admin</th>
                                                                            <th className="px-3 py-2">Action</th>
                                                                            <th className="px-3 py-2">Notes</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100">
                                                                        {selectedSub.auditLog?.map((log: any, i: number) => (
                                                                            <tr key={i}>
                                                                                <td className="px-3 py-2 text-slate-500">{log.date}</td>
                                                                                <td className="px-3 py-2 text-slate-900 font-medium">{log.admin}</td>
                                                                                <td className="px-3 py-2 text-slate-700">{log.action}</td>
                                                                                <td className="px-3 py-2 text-slate-500 italic">{log.notes}</td>
                                                                            </tr>
                                                                        ))}
                                                                        {(!selectedSub.auditLog || selectedSub.auditLog.length === 0) && (
                                                                            <tr>
                                                                                <td colSpan={4} className="px-3 py-4 text-center text-slate-400">No recent actions recorded</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <SheetFooter className="mt-8 pb-8">
                                                        <SheetClose asChild>
                                                            <Button type="button">Close</Button>
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
            </Card>
        </div>
    );
}
