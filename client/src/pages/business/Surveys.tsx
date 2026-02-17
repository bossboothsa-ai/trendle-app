import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BusinessLayout from "@/layouts/BusinessLayout";
import SurveyBuilder, { SurveyFormData } from "@/components/business/SurveyBuilder";
import SurveyInsights from "@/components/business/SurveyInsights";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Edit,
    Trash2,
    BarChart3,
    MoreHorizontal,
    ClipboardList,
    Download,
    ChevronDown,
    HelpCircle
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useBusiness } from "@/context/BusinessContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Survey {
    id: number;
    title: string;
    description: string;
    points: number;
    active: boolean;
    questions: any[];
    responseCount?: number;
    createdAt: string;
}

export default function Surveys() {
    const { placeId } = useBusiness();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [isInsightsOpen, setIsInsightsOpen] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

    // Fetch Surveys
    const { data: surveys, isLoading } = useQuery<Survey[]>({
        queryKey: [`/api/business/surveys`, placeId],
        enabled: !!placeId,
    });

    // Create/Update Survey Mutation
    const saveSurveyMutation = useMutation({
        mutationFn: async (data: SurveyFormData) => {
            const payload = { ...data, placeId };
            if (selectedSurvey) {
                return apiRequest("PUT", `/api/business/surveys/${selectedSurvey.id}`, payload);
            } else {
                return apiRequest("POST", `/api/business/surveys`, payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/surveys`, placeId] });
            toast({ title: selectedSurvey ? "Survey updated" : "Survey created" });
            setIsBuilderOpen(false);
            setSelectedSurvey(null);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to save survey.", variant: "destructive" });
        }
    });

    // Toggle Status Mutation
    const toggleStatusMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiRequest("PATCH", `/api/business/surveys/${id}/toggle`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/surveys`, placeId] });
            toast({ title: "Status updated" });
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiRequest("DELETE", `/api/business/surveys/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/surveys`, placeId] });
            toast({ title: "Survey deleted" });
        }
    });

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.text("Venue Surveys Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.text(`Venue ID: ${placeId}`, 20, 33);
            doc.line(20, 38, 190, 38);

            autoTable(doc, {
                startY: 45,
                head: [['ID', 'Title', 'Status', 'Points', 'Responses', 'Created']],
                body: surveys?.map(s => [
                    s.id,
                    s.title,
                    s.active ? 'Active' : 'Paused',
                    s.points.toString(),
                    (s.responseCount || 0).toString(),
                    new Date(s.createdAt).toLocaleDateString()
                ]) || [],
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            });

            doc.save(`surveys_${placeId}.pdf`);
            toast({ title: "Export Complete", description: "Survey list exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["ID", "Title", "Status", "Points", "Responses", "Created"];
            const rows = surveys?.map(s => [
                s.id,
                `"${s.title.replace(/"/g, '""')}"`,
                s.active ? 'Active' : 'Paused',
                s.points,
                s.responseCount || 0,
                s.createdAt
            ]) || [];

            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `surveys_${placeId}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Survey list exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    const handleCreate = () => {
        setSelectedSurvey(null);
        setIsBuilderOpen(true);
    };

    const handleEdit = (survey: Survey) => {
        setSelectedSurvey(survey);
        setIsBuilderOpen(true);
    };

    const handleInsights = (survey: Survey) => {
        setSelectedSurvey(survey);
        setIsInsightsOpen(true);
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
            <div className="flex justify-between items-end border-b border-gray-100 pb-8">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 italic uppercase">Insight Surveys</h2>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-5 w-5 text-muted-foreground mr-2 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs p-4 rounded-xl border-gray-100 shadow-xl">
                                    <p className="font-bold text-gray-900 mb-1">What are Insight Surveys?</p>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Gather direct feedback from customers at your venue. Surveys help you understand customer satisfaction and improve your venue experience.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-gray-500 font-medium">Gather qualitative feedback directly from your venue's visitors.</p>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={!surveys?.length}>
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
                        <Plus className="mr-2 h-4 w-4" /> Create Survey
                    </Button>
                </div>
            </div>

            {!surveys?.length ? (
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                        <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
                            <ClipboardList className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">No surveys created</h3>
                        <p className="text-base text-indigo-700/70 max-w-sm mx-auto mb-8">Create your first survey to start engaging customers and gathering valuable insights.</p>
                        <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-lg shadow-indigo-200">
                            Create Survey
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {surveys.map((survey) => (
                        <Card key={survey.id} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                            <div className={`h-2 w-full ${survey.active ? 'bg-green-500' : 'bg-gray-200'}`} />
                            <CardHeader className="pb-3 pt-5">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={`${survey.active ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"} rounded-lg px-2 py-0.5`}>
                                        {survey.active ? "Active" : "Paused"}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-400 hover:text-gray-600">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl">
                                            <DropdownMenuItem onClick={() => handleEdit(survey)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleInsights(survey)}>
                                                <BarChart3 className="mr-2 h-4 w-4" /> Insights
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => toggleStatusMutation.mutate(survey.id)}>
                                                {survey.active ? "Pause Survey" : "Activate Survey"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteMutation.mutate(survey.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="text-xl font-bold leading-tight text-gray-900">{survey.title}</CardTitle>
                                <CardDescription className="line-clamp-2 h-10 mt-1 text-gray-500">{survey.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3 mb-4">
                                    <div className="text-center">
                                        <span className="block font-bold text-gray-900 text-lg">{survey.points}</span>
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Points</span>
                                    </div>
                                    <div className="h-8 w-[1px] bg-gray-200"></div>
                                    <div className="text-center">
                                        <span className="block font-bold text-gray-900 text-lg">{survey.responseCount || 0}</span>
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Responses</span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-2 border-indigo-50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 rounded-xl font-bold transition-all"
                                    onClick={() => handleInsights(survey)}
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" /> View Insights
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Builder Sheet */}
            <Sheet open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto" side="right">
                    <SheetHeader>
                        <SheetTitle>{selectedSurvey ? "Edit Survey" : "Create New Survey"}</SheetTitle>
                        <SheetDescription>
                            Design your survey questions and rewards.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <SurveyBuilder
                            initialData={selectedSurvey ? {
                                title: selectedSurvey.title,
                                description: selectedSurvey.description,
                                points: selectedSurvey.points,
                                accessRequirement: "open_to_all",
                                questions: selectedSurvey.questions || []
                            } : undefined}
                            onSubmit={(data) => saveSurveyMutation.mutate(data)}
                            isLoading={saveSurveyMutation.isPending}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Insights Dialog */}
            <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Survey Insights: {selectedSurvey?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedSurvey && <SurveyInsights surveyId={selectedSurvey.id} />}
                </DialogContent>
            </Dialog>

        </div>

    );
}
