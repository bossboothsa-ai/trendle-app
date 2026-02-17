import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BusinessLayout from "@/layouts/BusinessLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Plus,
    Edit,
    Trash2,
    CheckSquare,
    Camera,
    Users,
    MoreHorizontal,
    MessageSquare,
    Zap,
    Calendar as CalendarIcon,
    ShieldCheck,
    Eye,
    Target,
    Award,
    Download,
    ChevronDown
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

interface Task {
    id: number;
    title: string;
    description: string;
    points: number;
    type: string;
    active: boolean;
    placeId: number;
    startDate?: string | null;
    endDate?: string | null;
    maxParticipants?: number | null;
    verificationMethod: string;
}

const TASK_TYPES = [
    { value: "check-in", label: "Check-In", icon: CheckSquare },
    { value: "moment", label: "Post a Moment", icon: Camera },
    { value: "feedback", label: "Leave Feedback", icon: MessageSquare },
    { value: "reward", label: "Reward Participation", icon: Award },
];

const VERIFICATION_METHODS = [
    { value: "QR Verified", label: "QR Verified", icon: ShieldCheck },
    { value: "Location Verified", label: "Location Verified", icon: Target },
    { value: "Manual Confirmation", label: "Manual Confirmation", icon: Users },
];

export default function Tasks() {
    const { placeId } = useBusiness();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        points: 50,
        type: "check-in",
        startDate: "",
        endDate: "",
        maxParticipants: "",
        verificationMethod: "QR Verified",
        active: true,
    });

    // Fetch Tasks
    const { data: tasks, isLoading } = useQuery<(Task & { completionCount: number })[]>({
        queryKey: [`/api/business/tasks`, placeId],
        enabled: !!placeId,
    });

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("Venue Tasks Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.text(`Venue ID: ${placeId}`, 20, 33);
            doc.line(20, 38, 190, 38);

            autoTable(doc, {
                startY: 45,
                head: [['ID', 'Title', 'Type', 'Points', 'Method', 'Status']],
                body: tasks?.map(t => [
                    t.id,
                    t.title,
                    t.type,
                    t.points.toString(),
                    t.verificationMethod,
                    t.active ? 'Active' : 'Paused'
                ]) || [],
                theme: 'striped',
                headStyles: { fillColor: [147, 51, 234] } // Purple 600
            });

            doc.save(`tasks_${placeId}.pdf`);
            toast({ title: "Export Complete", description: "Task list exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["ID", "Title", "Type", "Points", "Method", "Status"];
            const rows = tasks?.map(t => [
                t.id,
                `"${t.title.replace(/"/g, '""')}"`,
                t.type,
                t.points,
                t.verificationMethod,
                t.active ? 'Active' : 'Paused'
            ]) || [];

            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `tasks_${placeId}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Task list exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    // Create/Update Task Mutation
    const saveTaskMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                ...data,
                placeId: Number(placeId),
                maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
                points: parseInt(data.points) || 0
            };
            if (editingTask) {
                return apiRequest("PUT", `/api/business/tasks/${editingTask.id}`, payload);
            } else {
                return apiRequest("POST", `/api/business/tasks`, payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/tasks`, placeId] });
            toast({ title: editingTask ? "Campaign updated" : "Campaign created" });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to save campaign.", variant: "destructive" });
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiRequest("DELETE", `/api/business/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/tasks`, placeId] });
            toast({ title: "Campaign deleted" });
        }
    });

    const resetForm = () => {
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            points: 50,
            type: "check-in",
            startDate: "",
            endDate: "",
            maxParticipants: "",
            verificationMethod: "QR Verified",
            active: true
        });
    };

    const handleCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            points: task.points,
            type: task.type,
            startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
            endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : "",
            maxParticipants: task.maxParticipants ? task.maxParticipants.toString() : "",
            verificationMethod: task.verificationMethod,
            active: task.active,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION
        if (!formData.title || !formData.description) {
            toast({ title: "Validation Error", description: "Title and description are required.", variant: "destructive" });
            return;
        }

        if (formData.points < 0) {
            toast({ title: "Validation Error", description: "Points must be a positive number.", variant: "destructive" });
            return;
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (end < start) {
                toast({ title: "Validation Error", description: "End date must be after start date.", variant: "destructive" });
                return;
            }
        }

        saveTaskMutation.mutate(formData);
    };

    const getTypeIcon = (type: string) => {
        const found = TASK_TYPES.find(t => t.value === type);
        const Icon = found ? found.icon : CheckSquare;
        return <Icon className="w-4 h-4" />;
    };

    const getTypeLabel = (type: string) => {
        const found = TASK_TYPES.find(t => t.value === type);
        return found ? found.label : type;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-6xl mx-auto">
            <div className="flex justify-between items-end border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground">Manage activities for your customers</p>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={!tasks?.length}>
                                <Download className="mr-2 h-4 w-4" /> Export
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-40">
                            <DropdownMenuItem onClick={handleExportCSV}>As CSV</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportPDF}>As PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        <Plus className="mr-2 h-4 w-4" /> Create Task
                    </Button>
                </div>
            </div>

            {!tasks?.length ? (
                <Card className="bg-gray-50/50 border-dashed border-2 border-gray-200 rounded-[2rem] shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                            <Target className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No active campaigns</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 font-medium italic">Deploy daily tasks to boost venue discovery and social presence.</p>
                        <Button onClick={handleCreate} variant="outline" className="rounded-full px-8 border-gray-200 font-bold hover:bg-white">
                            Setup First Task
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tasks.map((task) => (
                        <Card key={task.id} className="group hover:border-gray-200 transition-all duration-300 border border-gray-100 shadow-sm rounded-[2rem] bg-white overflow-hidden flex flex-col">
                            <CardHeader className="pb-4 pt-6 px-8 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className="flex items-center gap-1.5 bg-gray-50 border-gray-100 text-gray-600 rounded-lg py-1.5 px-3 font-bold text-[10px] uppercase tracking-wider">
                                        {getTypeIcon(task.type)}
                                        {getTypeLabel(task.type)}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-full">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-gray-100 shadow-xl">
                                            <DropdownMenuItem onClick={() => handleEdit(task)} className="rounded-xl font-bold py-2">
                                                <Edit className="mr-2 h-4 w-4" /> Edit Campaign
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-gray-50" />
                                            <DropdownMenuItem onClick={() => deleteMutation.mutate(task.id)} className="text-red-600 focus:text-red-700 focus:bg-red-50 rounded-xl font-bold py-2">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-xl font-black text-gray-900 leading-tight mb-2 uppercase italic">{task.title}</CardTitle>
                                <CardDescription className="line-clamp-2 h-10 text-gray-500 text-sm font-medium leading-relaxed italic">“{task.description}”</CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                                <div className="mt-auto space-y-6">
                                    <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reward</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-gray-900 tracking-tighter">{task.points}</span>
                                                <span className="text-[10px] font-black text-indigo-500 uppercase">Trendle Points</span>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${task.active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100 shadow-inner'}`}>
                                            {task.active ? "● Active" : "Paused"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50/70 p-4 rounded-2xl text-left border border-gray-50">
                                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1 items-center flex gap-1"><Users className="w-2.5 h-2.5" /> Participants</div>
                                            <div className="text-lg font-black text-gray-900 tracking-tight">{task.completionCount || 0} <span className="text-[10px] text-gray-400 font-bold">/ {task.maxParticipants || "∞"}</span></div>
                                        </div>
                                        <div className="bg-indigo-50/30 p-4 rounded-2xl text-left border border-indigo-50/50">
                                            <div className="text-[9px] text-indigo-400 uppercase font-black tracking-widest mb-1 items-center flex gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Verification</div>
                                            <div className="text-[10px] font-black text-indigo-700 truncate">{task.verificationMethod}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
                    <div className="flex flex-col md:flex-row h-full">

                        {/* FORM SIDE */}
                        <div className="p-10 md:w-3/5 bg-white space-y-8 overflow-y-auto max-h-[85vh]">
                            <DialogHeader className="space-y-2 border-b border-gray-50 pb-6">
                                <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">{editingTask ? "Refine Campaign" : "New Campaign Task"}</DialogTitle>
                                <DialogDescription className="text-gray-500 font-medium italic">
                                    Drive intentional in-venue activity with clear rewards.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Campaign Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g., Sunset Check-In"
                                            className="rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Task Type</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                                        >
                                            <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/50 font-bold">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl p-2 border-gray-100">
                                                {TASK_TYPES.map(type => (
                                                    <SelectItem key={type.value} value={type.value} className="rounded-lg font-bold py-2">
                                                        <div className="flex items-center gap-2">
                                                            <type.icon className="w-4 h-4 text-gray-400" />
                                                            <span>{type.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the action users must complete at your venue."
                                        className="rounded-xl border-gray-100 bg-gray-50/30 font-medium italic min-h-[100px] focus:bg-white"
                                        required
                                    />
                                    <p className="text-[9px] font-bold text-gray-400 italic">Clear instructions help users complete tasks successfully.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="points" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Points Reward</Label>
                                        <Input
                                            id="points"
                                            type="number"
                                            value={formData.points}
                                            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                            className="rounded-xl border-gray-100 bg-gray-50/50 font-black"
                                            required
                                            min={0}
                                        />
                                        <p className="text-[9px] font-bold text-gray-400 italic">Points users earn after completion.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="verification" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verification Method</Label>
                                        <Select
                                            value={formData.verificationMethod}
                                            onValueChange={(value) => setFormData({ ...formData, verificationMethod: value })}
                                        >
                                            <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/50 font-bold">
                                                <SelectValue placeholder="Verification" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl p-2 border-gray-100">
                                                {VERIFICATION_METHODS.map(method => (
                                                    <SelectItem key={method.value} value={method.value} className="rounded-lg font-bold py-2">
                                                        <div className="flex items-center gap-2">
                                                            <method.icon className="w-4 h-4 text-indigo-400" />
                                                            <span>{method.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="rounded-xl border-gray-100 bg-gray-50/50 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">End Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="rounded-xl border-gray-100 bg-gray-50/50 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="max" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Max Participants (Optional)</Label>
                                        <Input
                                            id="max"
                                            type="number"
                                            value={formData.maxParticipants}
                                            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                            placeholder="Unlimited"
                                            className="rounded-xl border-gray-100 bg-gray-50/50 font-bold"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 self-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-tight text-gray-900">Visibility</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase italic leading-none">{formData.active ? "Active Now" : "Paused"}</span>
                                        </div>
                                        <Switch
                                            checked={formData.active}
                                            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-gray-900 text-white rounded-full py-6 font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg" disabled={saveTaskMutation.isPending}>
                                    {saveTaskMutation.isPending ? "Validating..." : (editingTask ? "Update Campaign" : "Deploy Task")}
                                </Button>
                            </form>
                        </div>

                        {/* PREVIEW SIDE */}
                        <div className="hidden md:flex md:w-2/5 bg-gray-50/80 p-10 flex-col items-center justify-center border-l border-gray-100 relative overflow-hidden">
                            <div className="absolute top-10 left-10 flex items-center gap-2">
                                <Eye className="w-3 h-3 text-gray-300" />
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Real-time Preview</span>
                            </div>

                            <div className="w-full max-w-[280px] space-y-4">
                                <p className="text-[9px] font-bold text-gray-400 uppercase text-center mb-4 tracking-wider">How this appears to users</p>

                                {/* MOCK MOBILE TASK CARD */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                                {getTypeIcon(formData.type)}
                                            </div>
                                            <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                                                <Zap className="w-2.5 h-2.5 fill-amber-700" />
                                                <span className="text-[10px] font-black">{formData.points || 0}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <h4 className="text-sm font-black text-gray-900 uppercase italic leading-tight">
                                                {formData.title || "Task Title"}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 font-medium italic leading-relaxed line-clamp-3">
                                                {formData.description || "Describe what users need to do..."}
                                            </p>
                                        </div>

                                        <div className="pt-2">
                                            <div className="w-full h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Start Action</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-1">
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Verified via {formData.verificationMethod}</span>
                                            <div className="flex -space-x-1.5">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-4 h-4 rounded-full border-2 border-white bg-gray-200" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* MOCK UI DECORATION */}
                                <div className="flex justify-center gap-2 pt-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                </div>
                            </div>

                            <div className="absolute bottom-10 px-10 text-center">
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">
                                    Preview automatically updates as you type
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>

    );
}
