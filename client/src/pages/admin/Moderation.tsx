import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Check,
    X,
    AlertTriangle,
    Flag,
    Shield,
    Users,
    MessageSquare,
    Clock,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Ban,
    AlertOctagon,
    FileText,
    History,
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

export default function AdminModeration() {
    const { toast } = useToast();
    const [selectedTab, setSelectedTab] = useState("pending");

    // Mock Data - Enhanced Case Structure
    const queryClient = useQueryClient();

    // Fetch Cases
    const { data: cases = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/moderation"],
        queryFn: async () => {
            const res = await fetch("/api/admin/moderation");
            if (!res.ok) throw new Error("Failed to fetch cases");
            return res.json();
        }
    });

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading moderation queue...</div>;

    // Action State
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [actionNote, setActionNote] = useState("");
    const [isWarnOpen, setIsWarnOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);
    const [isEscalateOpen, setIsEscalateOpen] = useState(false);

    const actionMutation = useMutation({
        mutationFn: async ({ id, action, notes }: { id: string, action: string, notes?: string }) => {
            await apiRequest("POST", `/api/admin/moderation/${id}/${action}`, { notes });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/moderation"] });
            toast({ title: "Action Verified", description: "Case status updated successfully." });
            setIsWarnOpen(false);
            setIsSuspendOpen(false);
            setIsEscalateOpen(false);
            setActionNote("");
            setSelectedCase(null);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update case status.", variant: "destructive" });
        }
    });

    const handleAction = (actionType: string) => {
        if (!selectedCase) return;

        // Map UI action names to API action slugs
        let apiAction = "resolve";
        if (actionType === "Dismissed") apiAction = "dismiss";
        else if (actionType === "Content Removed") apiAction = "resolve";
        else if (actionType === "Removed & Warned") apiAction = "warn";
        else if (actionType === "Suspended User") apiAction = "suspend";
        else if (actionType === "Escalate") apiAction = "escalate";

        actionMutation.mutate({
            id: selectedCase.id,
            action: apiAction,
            notes: actionNote
        });
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' });
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("Moderation Queue Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.text(`Tab: ${selectedTab}`, 20, 33);
            doc.line(20, 37, 275, 37);

            const activeCases = selectedTab === 'pending' ? pendingCases :
                selectedTab === 'investigating' ? investigatingCases :
                    selectedTab === 'resolved' ? resolvedCases : suspendedCases;

            autoTable(doc, {
                startY: 45,
                head: [['Case ID', 'Type', 'Reporter', 'User', 'Content', 'Status', 'Timestamp']],
                body: activeCases.map((c: any) => [
                    c.id,
                    c.type,
                    c.reporter,
                    c.content.username,
                    c.content.text || c.content.caption,
                    c.status || 'Pending',
                    c.timestamp
                ]),
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }
            });

            doc.save(`moderation_${selectedTab}_report.pdf`);
            toast({ title: "Export Complete", description: `Moderation ${selectedTab} list exported to PDF.` });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["Case ID", "Type", "Reporter", "User", "Content", "Status", "Timestamp"];
            const activeCases = selectedTab === 'pending' ? pendingCases :
                selectedTab === 'investigating' ? investigatingCases :
                    selectedTab === 'resolved' ? resolvedCases : suspendedCases;

            const rows = activeCases.map((c: any) => [
                c.id,
                c.type,
                c.reporter,
                `"${c.content.username.replace(/"/g, '""')}"`,
                `"${(c.content.text || c.content.caption).replace(/"/g, '""')}"`,
                c.status || 'Pending',
                c.timestamp
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map((row: any[]) => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `moderation_${selectedTab}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: `Moderation ${selectedTab} list exported to CSV.` });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    // Filter cases
    const pendingCases = cases.filter(c => !c.status || c.status === "pending" || c.status === "Pending Review");
    const investigatingCases = cases.filter(c => c.status === "investigating");
    const resolvedCases = cases.filter(c => c.status === "resolved" || c.status === "dismissed" || c.status === "Resolved" || c.status === "Dismissed");
    const suspendedCases = cases.filter(c => c.status === "suspended"); // If we track suspended status specifically on the case

    const renderCases = (caseList: any[], emptyMsg: string, EmptyIcon: any) => {
        if (caseList.length === 0) {
            return (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <EmptyIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">List Empty</h3>
                    <p className="text-slate-500">{emptyMsg}</p>
                </div>
            );
        }
        return caseList.map((item) => (
            <Card key={item.id} className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                {/* Case Header */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-white font-mono text-slate-500 border-slate-200">
                            {item.id}
                        </Badge>
                        <Badge className={`${item.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'} border-transparent hover:bg-opacity-80`}>
                            {item.type}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">|</span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Reported {item.timestamp}
                        </span>
                        {item.status && item.status !== "pending" && (
                            <Badge variant="secondary" className="uppercase text-[10px]">{item.status}</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source:</span>
                        <span className="text-xs font-bold text-slate-700">{item.reporter}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Left: Evidence Panel */}
                    <div className="p-6 flex-1 border-b lg:border-b-0 lg:border-r border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Content Evidence
                        </h4>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
                            <div className="flex gap-4">
                                {item.content.image && (
                                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                        <img src={item.content.image} alt="Evidence" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-slate-900">{item.content.username}</span>
                                        <span className="text-xs text-slate-400">at {item.content.business}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3 py-1 mb-2">
                                        "{item.content.caption || item.content.text}"
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Badge variant="secondary" className="text-[10px] h-5 bg-slate-200 text-slate-600">
                                            ID: {item.content.user}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3">
                            <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h5 className="text-sm font-bold text-red-900">Detection Summary</h5>
                                <p className="text-sm text-red-700 mt-1">{item.detection.summary}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Context & Actions */}
                    <div className="w-full lg:w-80 bg-slate-50/30 p-6 flex flex-col justify-between">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <History className="w-4 h-4" /> User History
                            </h4>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Prior Reports</span>
                                    <span className="font-bold text-slate-900">{item.userHistory.reports}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Warnings</span>
                                    <span className={`font-bold ${item.userHistory.warnings > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{item.userHistory.warnings}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Suspensions</span>
                                    <span className="font-bold text-slate-900">{item.userHistory.suspensions}</span>
                                </div>
                                <Separator className="bg-slate-200 my-2" />
                                <div className="text-xs text-slate-500">
                                    Last Incident: <span className="font-medium text-slate-700">{item.userHistory.lastIncident}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {/* Only show actions for pending/investigating cases */}
                            {(!item.status || item.status === 'pending' || item.status === 'investigating' || item.status === 'Pending Review') ? (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="w-full bg-white text-slate-600 border-slate-200" onClick={() => { setSelectedCase(item); handleAction("Dismissed"); }}>
                                            Dismiss
                                        </Button>
                                        <Button variant="outline" className="w-full bg-white text-slate-600 border-slate-200" onClick={() => { setSelectedCase(item); handleAction("Content Removed"); }}>
                                            Remove Only
                                        </Button>
                                    </div>

                                    <Dialog open={isWarnOpen} onOpenChange={setIsWarnOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setSelectedCase(item)}>
                                                <AlertTriangle className="w-4 h-4 mr-2" /> Remove & Warn
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Remove Content & Warn User</DialogTitle>
                                                <DialogDescription>
                                                    This will remove the content and issue a formal warning to <b>{selectedCase?.content.username}</b>.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-2">
                                                <Label>Warning Message (Email)</Label>
                                                <Textarea
                                                    placeholder="Your content violated our community guidelines..."
                                                    value={actionNote}
                                                    onChange={(e) => setActionNote(e.target.value)}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsWarnOpen(false)}>Cancel</Button>
                                                <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => handleAction("Removed & Warned")}>Send Warning</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" className="w-full" onClick={() => setSelectedCase(item)}>
                                                <Ban className="w-4 h-4 mr-2" /> Remove & Suspend
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Suspend User Account</DialogTitle>
                                                <DialogDescription>
                                                    <b>Action:</b> Immediate Suspension<br />
                                                    <b>User:</b> {selectedCase?.content.username} ({selectedCase?.content.user})
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="bg-red-50 p-3 rounded-md border border-red-100 text-sm text-red-800 mb-4">
                                                This user has <b>{selectedCase?.userHistory.warnings} prior warnings</b>. Suspension is recommended.
                                            </div>
                                            <div className="py-2">
                                                <Label>Internal Reason Log</Label>
                                                <Input
                                                    placeholder="E.g. Repeated spam violations"
                                                    value={actionNote}
                                                    onChange={(e) => setActionNote(e.target.value)}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
                                                <Button variant="destructive" onClick={() => handleAction("Suspended User")}>Confirm Suspension</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-600 text-xs" onClick={() => { setSelectedCase(item); handleAction("Escalate"); }}>
                                        Refer for Investigation
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center p-2 bg-slate-100 rounded text-slate-500 text-sm italic">
                                    Case {item.status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        ));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Moderation Queue</h1>
                    <p className="text-slate-500">Enforce platform integrity and review flagged content.</p>
                </div>
                <div className="flex items-center gap-4">
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
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                        <span className="text-sm font-bold text-slate-700">{pendingCases.length} Pending Cases</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full" onValueChange={setSelectedTab}>
                <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending Review</TabsTrigger>
                    <TabsTrigger value="investigating" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Under Investigation</TabsTrigger>
                    <TabsTrigger value="resolved" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Resolved</TabsTrigger>
                    <TabsTrigger value="suspended" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Suspended Users</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-6">
                    {renderCases(pendingCases, "No pending moderation cases.", Shield)}
                </TabsContent>

                <TabsContent value="investigating" className="space-y-6">
                    {renderCases(investigatingCases, "No active investigations.", Search)}
                </TabsContent>

                <TabsContent value="resolved" className="space-y-6">
                    {renderCases(resolvedCases, "No resolved cases found.", Check)}
                </TabsContent>

                <TabsContent value="suspended" className="space-y-6">
                    {renderCases(suspendedCases, "No suspended users in recent history.", Ban)}
                </TabsContent>
            </Tabs>
        </div>
    );
}
