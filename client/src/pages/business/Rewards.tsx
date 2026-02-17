import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BusinessLayout from "@/layouts/BusinessLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Check,
    X,
    Search,
    Plus,
    Edit,
    Gift,
    Tag,
    ToggleLeft,
    ToggleRight,
    MoreHorizontal,
    TrendingUp,
    Users,
    Heart,
    Download,
    ChevronDown,
    HelpCircle
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useBusiness } from "@/context/BusinessContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Reward {
    id: number;
    title: string;
    description: string;
    cost: number;
    image: string;
    category: string;
    locked: boolean;
    placeId: number;
    redemptionCount?: number;
}

const CATEGORIES = [
    { value: "food", label: "Food & Drink" },
    { value: "merch", label: "Merchandise" },
    { value: "experience", label: "Experience" },
    { value: "vip", label: "VIP Access" },
    { value: "discount", label: "Discount" },
    { value: "airtime", label: "Airtime" },
    { value: "cashout", label: "Cashout" },
];

interface DashboardMetrics {
    totalCheckins: number;
    totalLikes: number;
    totalComments: number;
}

export default function Rewards() {
    const { placeId } = useBusiness();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);

    // Validation State
    const [validationCode, setValidationCode] = useState("");
    const [validationResult, setValidationResult] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        cost: 100,
        image: "",
        category: "food",
    });

    // Fetch Rewards
    const { data: rewards, isLoading } = useQuery<(Reward & { redemptionCount: number })[]>({
        queryKey: [`/api/business/rewards`, placeId],
        queryFn: async () => {
            const res = await fetch(`/api/business/rewards?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch rewards");
            return res.json();
        },
        enabled: !!placeId,
    });

    // Fetch Metrics for Impact Report
    const { data: metrics } = useQuery<DashboardMetrics>({
        queryKey: [`/api/business/dashboard`, placeId],
        queryFn: async () => {
            const res = await fetch(`/api/business/dashboard?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch metrics");
            return res.json();
        },
        enabled: !!placeId,
    });

    // Calculate Impact Metrics
    const totalGiven = rewards?.reduce((acc, r) => acc + (r.redemptionCount || 0), 0) || 0;
    const activeCheckins = metrics?.totalCheckins || 0;
    const activeEngagement = (metrics?.totalLikes || 0) + (metrics?.totalComments || 0);

    // Create/Update Reward Mutation
    const saveRewardMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = { ...data, placeId: Number(placeId) };
            if (editingReward) {
                return apiRequest("PUT", `/api/business/rewards/${editingReward.id}`, payload);
            } else {
                return apiRequest("POST", `/api/business/rewards`, payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/rewards`, placeId] });
            toast({ title: editingReward ? "Reward updated" : "Reward created" });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to save reward.", variant: "destructive" });
        }
    });

    // Toggle Status Mutation
    const toggleStatusMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiRequest("PATCH", `/api/business/rewards/${id}/toggle`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/rewards`, placeId] });
            toast({ title: "Status updated" });
        }
    });

    // Validate Reward Mutation
    const validateMutation = useMutation({
        mutationFn: async (code: string) => {
            const res = await apiRequest("POST", "/api/business/rewards/validate", {
                code,
                placeId: Number(placeId)
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Invalid code");
            }
            return await res.json();
        },
        onSuccess: (data) => {
            setValidationResult(data);
            toast({ title: "Valid Reward!", description: `Verified for ${data.user?.username}` });
        },
        onError: (error: Error) => {
            setValidationResult(null);
            toast({ title: "Invalid Code", description: error.message, variant: "destructive" });
        }
    });

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("Venue Rewards Catalog", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.text(`Venue ID: ${placeId}`, 20, 33);
            doc.line(20, 38, 190, 38);

            autoTable(doc, {
                startY: 45,
                head: [['ID', 'Title', 'Category', 'Cost (PTS)', 'Redemptions', 'Status']],
                body: rewards?.map(r => [
                    r.id,
                    r.title,
                    r.category,
                    r.cost.toString(),
                    (r.redemptionCount || 0).toString(),
                    r.locked ? 'Paused' : 'Active'
                ]) || [],
                theme: 'striped',
                headStyles: { fillColor: [236, 72, 153] } // Pink 500
            });

            doc.save(`rewards_${placeId}.pdf`);
            toast({ title: "Export Complete", description: "Rewards catalog exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["ID", "Title", "Category", "Cost", "Redemptions", "Status"];
            const rows = rewards?.map(r => [
                r.id,
                `"${r.title.replace(/"/g, '""')}"`,
                r.category,
                r.cost,
                r.redemptionCount || 0,
                r.locked ? 'Paused' : 'Active'
            ]) || [];

            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `rewards_${placeId}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Rewards catalog exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    const handleValidate = (e: React.FormEvent) => {
        e.preventDefault();
        validateMutation.mutate(validationCode);
    };

    const resetForm = () => {
        setEditingReward(null);
        setFormData({ title: "", description: "", cost: 100, image: "", category: "food" });
    };

    const handleCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleEdit = (reward: Reward) => {
        setEditingReward(reward);
        setFormData({
            title: reward.title,
            description: reward.description,
            cost: reward.cost,
            image: reward.image,
            category: reward.category,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveRewardMutation.mutate(formData);
    };

    if (isLoading) {
        return (

            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>

        );
    }

    return (

        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Rewards</h2>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs p-4 rounded-xl border-gray-100 shadow-xl">
                                    <p className="font-bold text-gray-900 mb-1">What are Rewards?</p>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Incentives customers can claim using points earned at your venue. High-value rewards drive repeat visits and customer loyalty.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-muted-foreground">Manage your venue's loyalty offerings</p>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={!rewards?.length}>
                                <Download className="mr-2 h-4 w-4" /> Export
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-40">
                            <DropdownMenuItem onClick={handleExportCSV}>As CSV</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPDF}>As PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-pink-600">
                        <Plus className="mr-2 h-4 w-4" /> Add Reward
                    </Button>
                </div>
            </div>

            {/* Reward Validation Section */}
            <Card className="border-none shadow-md bg-white overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Check className="h-5 w-5 text-green-600" />
                        Validate Redemption
                    </CardTitle>
                    <CardDescription>Enter the customer's redemption code to verify and complete the transaction.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleValidate} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="code" className="font-bold text-gray-700">Redemption Code</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="code"
                                    placeholder="e.g. 123456"
                                    className="pl-10 h-11 text-lg tracking-widest font-mono"
                                    value={validationCode}
                                    onChange={(e) => setValidationCode(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" size="lg" className="h-11 bg-gray-900 hover:bg-gray-800" disabled={validateMutation.isPending}>
                            {validateMutation.isPending ? "Verifying..." : "Verify Code"}
                        </Button>
                    </form>

                    {validationResult && (
                        <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-green-100 p-2 rounded-full">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-green-900">Valid Redemption</h4>
                                <p className="text-green-800">
                                    <span className="font-semibold">{validationResult.reward.title}</span> for <span className="font-semibold">@{validationResult.user.username}</span>
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    Transaction ID: VAL-{validationCode} • {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Campaign Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Gift className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">Total Rewards Claimed</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{totalGiven}</div>
                        <p className="text-xs text-purple-700/70 mt-1">Directly incentivized visits</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">App-Driven Check-ins</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{activeCheckins}</div>
                        <p className="text-xs text-blue-700/70 mt-1">In-venue activity recorded</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-5 w-5 text-pink-600" />
                            <span className="text-sm font-medium text-pink-900">Social Engagement</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{activeEngagement}</div>
                        <p className="text-xs text-pink-700/70 mt-1">Likes & Comments generated</p>
                    </CardContent>
                </Card>
            </div>

            {!rewards?.length ? (
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-none rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                        <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
                            <Gift className="h-10 w-10 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-bold text-pink-900 mb-2">No rewards created</h3>
                        <p className="text-base text-pink-800/70 max-w-sm mx-auto mb-8">Add rewards to incentivize customer visits and build loyalty.</p>
                        <Button onClick={handleCreate} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 shadow-lg shadow-pink-200">
                            Add First Reward
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rewards.map((reward) => (
                        <Card key={reward.id} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-none shadow-sm rounded-2xl bg-white overflow-hidden relative flex flex-col h-full">
                            <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                                <img
                                    src={reward.image}
                                    alt={reward.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                <div className="absolute top-3 right-3 z-10">
                                    <Badge variant={!reward.locked ? "default" : "secondary"} className={`${!reward.locked ? "bg-green-500/90 hover:bg-green-600 text-white" : "bg-gray-900/50 backdrop-blur-md text-white"} border-none shadow-lg px-2 py-0.5`}>
                                        {!reward.locked ? "Active" : "Paused"}
                                    </Badge>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 z-10 flex text-white justify-between items-end">
                                    <span className="font-extrabold text-2xl drop-shadow-md">{reward.cost} <span className="text-xs font-normal opacity-80">PTS</span></span>
                                </div>
                            </div>
                            <CardHeader className="pb-2 pt-4 px-5 flex-1">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-pink-500 uppercase tracking-wider">
                                        <Tag className="w-3 h-3" />
                                        <span>{reward.category}</span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-2 text-gray-300 hover:text-gray-600">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl">
                                            <DropdownMenuItem onClick={() => handleEdit(reward)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleStatusMutation.mutate(reward.id)}>
                                                {reward.locked ? (
                                                    <><ToggleLeft className="mr-2 h-4 w-4" /> Activate</>
                                                ) : (
                                                    <><ToggleRight className="mr-2 h-4 w-4" /> Pause</>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-lg font-bold leading-tight text-gray-900">{reward.title}</CardTitle>
                                <CardDescription className="line-clamp-2 text-xs text-gray-500 mt-1">{reward.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="px-5 pb-5 mt-auto text-xs text-gray-500">
                                <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Redeemed</span>
                                    <span className="text-xs font-bold text-gray-900">{reward.redemptionCount || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-2 mt-2 border-t border-gray-50">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Exposure Gained</span>
                                    <span className="text-xs font-bold text-purple-600 uppercase">High Impact</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-3xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{editingReward ? "Edit Reward" : "Add New Reward"}</DialogTitle>
                        <DialogDescription>
                            {editingReward ? "Update reward details" : "Create a new reward for your customers"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="font-bold text-gray-700 ml-1">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Free Coffee"
                                className="h-12 rounded-xl"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="font-bold text-gray-700 ml-1">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-bold text-gray-700 ml-1">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the reward..."
                                className="rounded-xl resize-none"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cost" className="font-bold text-gray-700 ml-1">Cost (Points)</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                                    className="h-12 rounded-xl"
                                    required
                                    min={0}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image" className="font-bold text-gray-700 ml-1">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="h-12 rounded-xl"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={saveRewardMutation.isPending}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 font-bold text-lg"
                            >
                                {saveRewardMutation.isPending ? "Saving..." : editingReward ? "Save Changes" : "Create Reward"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
}

// Custom icons
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
