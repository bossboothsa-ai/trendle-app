import { useState } from "react";
import BusinessLayout from "@/layouts/BusinessLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CreditCard,
    FileText,
    BadgeCheck,
    Download,
    TrendingUp,
    Calendar,
    ChevronRight,
    Search
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useBusiness } from "@/context/BusinessContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BusinessBilling() {
    const { businessId, placeId } = useBusiness();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: businessAccount, isLoading: isAccountLoading } = useQuery<any>({
        queryKey: [`/api/business/account`, businessId],
        queryFn: async () => {
            const res = await fetch(`/api/business/account/${businessId}`);
            if (!res.ok) throw new Error("Failed to fetch account");
            return res.json();
        },
        enabled: !!businessId,
    });

    const { data: invoices = [], isLoading: isInvoicesLoading } = useQuery<any[]>({
        queryKey: [`/api/business/invoices`, businessId],
        queryFn: async () => {
            const res = await fetch(`/api/business/invoices?businessId=${businessId}`);
            if (!res.ok) throw new Error("Failed to fetch invoices");
            return res.json();
        },
        enabled: !!businessId,
    });

    const updateSubMutation = useMutation({
        mutationFn: async (plan: string) => {
            const res = await apiRequest("POST", "/api/business/subscription/manage", { businessId, plan });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/account`, businessId] });
            toast({ title: "Subscription Updated", description: "Successfully changed your growth plan." });
        }
    });

    const handleDownloadInvoice = (invoice: any) => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(79, 70, 229);
            doc.text("Trendle Business Invoice", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Invoice ID: ${invoice.id}`, 20, 30);
            doc.text(`Date: ${invoice.date}`, 20, 35);
            doc.text(`Business: ${businessAccount?.businessName || 'Trendle Venue'}`, 20, 40);

            autoTable(doc, {
                startY: 50,
                head: [['Description', 'Qty', 'Unit Price', 'Amount']],
                body: [
                    [`${businessAccount?.subscriptionPlan || 'Growth'} Plan Subscription`, '1', `R${invoice.amount}`, `R${invoice.amount}`],
                    ['Platform Access & Analytics', '1', 'Included', 'R0.00'],
                    ['Automated Rewards Management', '1', 'Included', 'R0.00'],
                ],
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            });

            doc.save(`${invoice.id}_${businessAccount?.businessName || 'Trendle'}.pdf`);
            toast({ title: "Download Started", description: "Your PDF invoice is being generated." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportAllData = async () => {
        toast({ title: "Export Scheduled", description: "A comprehensive data dump is being prepared." });
    };

    if (isAccountLoading || isInvoicesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-5xl mx-auto pb-20 animate-fade-in">
            {/* 1. PAGE HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-widest">
                        <CreditCard className="w-4 h-4" />
                        <span>Billing & Subscription</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-1">Financial Center</h2>
                        <p className="text-gray-500 font-medium">Manage your growth plan, payments and invoices.</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleExportAllData}
                        className="flex-1 md:flex-none border-gray-200 rounded-2xl h-12 px-6 font-bold hover:bg-gray-50"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Plan & Payments */}
                <div className="lg:col-span-1 space-y-8">
                    {/* PLAN OVERVIEW */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-gray-900 text-white">
                        <CardHeader className="pt-8 px-8">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <TrendingUp className="h-6 w-6 text-purple-400" />
                                </div>
                                <Badge className="bg-purple-500 text-white border-none rounded-lg px-3 py-1 font-bold">ACTIVE</Badge>
                            </div>
                            <div className="mt-6">
                                <CardTitle className="text-2xl font-extrabold text-white">Growth Plan</CardTitle>
                                <CardDescription className="text-gray-400 font-medium text-lg">R250.00 / month</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-medium italic">Next Billing Date</span>
                                    <span className="text-white font-bold">Mar 1, 2026</span>
                                </div>
                                <Separator className="bg-white/10" />
                                <ul className="space-y-3">
                                    {[
                                        "Advanced Analytics",
                                        "Unlimited Moments",
                                        "Custom Reward Rules",
                                        "Verified Activity Reports"
                                    ].map(feature => (
                                        <li key={feature} className="flex items-center gap-2 text-sm font-medium">
                                            <BadgeCheck className="w-4 h-4 text-purple-400" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    onClick={() => updateSubMutation.mutate("pro")}
                                    disabled={updateSubMutation.isPending}
                                    className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-2xl font-black uppercase italic h-14 mt-6 transition-all shadow-lg shadow-black/20"
                                >
                                    {updateSubMutation.isPending ? "Updating..." : "Manage Subscription"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* PAYMENT METHOD */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="pt-8 px-8 pb-4">
                            <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                Payment Method
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 bg-slate-200 rounded-md flex items-center justify-center font-bold text-[10px] text-slate-500">VISA</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">•••• 4242</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Expires 12/28</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="font-bold text-purple-600 hover:bg-purple-50 rounded-xl">Edit</Button>
                            </div>
                            <Button
                                onClick={() => toast({ title: "Feature Locked", description: "Payment updates are currently disabled in dev mode." })}
                                variant="outline"
                                className="w-full mt-4 rounded-2xl border-gray-100 h-12 font-bold hover:bg-gray-50"
                            >
                                Add Backup Method
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Invoices */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="pt-8 px-8 pb-0 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-extrabold">Invoice Center</CardTitle>
                                <CardDescription className="text-base font-medium text-gray-500">
                                    Access and download your historical billing statements.
                                </CardDescription>
                            </div>
                            <div className="relative w-48 hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Search ID..." className="pl-9 rounded-xl border-gray-100 h-10 bg-gray-50 focus:bg-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="hover:bg-transparent border-gray-100">
                                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 py-4 px-6">Date</TableHead>
                                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 py-4 px-6">Invoice ID</TableHead>
                                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 py-4 px-6">Amount</TableHead>
                                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 py-4 px-6">Status</TableHead>
                                            <TableHead className="text-right px-6"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow key={invoice.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                                                <TableCell className="font-bold text-gray-700 py-5 px-6">{invoice.date}</TableCell>
                                                <TableCell className="font-mono text-xs text-gray-500 py-5 px-6">{invoice.id}</TableCell>
                                                <TableCell className="font-bold text-gray-900 py-5 px-6">{invoice.amount}</TableCell>
                                                <TableCell className="py-5 px-6">
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-lg text-[10px] font-black uppercase">
                                                        {invoice.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right py-5 px-6">
                                                    <Button
                                                        onClick={() => handleDownloadInvoice(invoice)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 px-4 rounded-xl text-purple-600 hover:bg-purple-50 font-bold gap-2"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        PDF
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* PROMOTION IMPACT (Placeholder for billing data) */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-purple-50/50 border border-purple-100">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-200">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-extrabold text-gray-900">Promotion Impact Analytics</h4>
                                    <p className="text-gray-600 font-medium">Your current plan includes detailed attribution reporting. See exactly how much revenue your rewards are driving.</p>
                                    <Button variant="ghost" className="p-0 h-auto text-purple-600 font-bold hover:text-purple-700 hover:bg-transparent flex items-center gap-1 mt-2">
                                        Go to Analytics <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
