import { useQuery } from "@tanstack/react-query";
import { useBusiness } from "@/context/BusinessContext";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    ChevronDown,
    Star,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    User,
    Calendar as CalendarIcon,
    Filter
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FeedbackItem {
    id: string;
    activityId: string;
    rating: number;
    comment: string;
    date: string;
}

interface ReputationSnapshot {
    avgRating: number;
    totalResponses: number;
    ratingBreakdown: {
        stars: number;
        count: number;
    }[];
    positives: string[];
    improvements: string[];
    recentFeedback: FeedbackItem[];
    monthlyTrends: { month: string; avgRating: number }[];
}

export default function AudienceInsights() {
    const { placeId } = useBusiness();
    const { toast } = useToast();

    const { data: snapshot, isLoading } = useQuery<ReputationSnapshot>({
        queryKey: [`/api/business/survey-insights`, placeId],
        queryFn: async () => {
            // DEV MODE MOCK
            if (process.env.NODE_ENV === "development") {
                return {
                    avgRating: 4.8,
                    totalResponses: 1250,
                    ratingBreakdown: [
                        { stars: 5, count: 950 },
                        { stars: 4, count: 200 },
                        { stars: 3, count: 50 },
                        { stars: 2, count: 30 },
                        { stars: 1, count: 20 }
                    ],
                    positives: ["Great service", "Lovely atmosphere", "Friendly staff"],
                    improvements: ["Wait time", "Parking"],
                    recentFeedback: [
                        { id: "1", activityId: "1", rating: 5, comment: "Amazing experience!", date: new Date().toISOString() },
                        { id: "2", activityId: "2", rating: 4, comment: "Good but crowded.", date: new Date().toISOString() }
                    ],
                    monthlyTrends: [
                        { month: "Jan", avgRating: 4.5 },
                        { month: "Feb", avgRating: 4.8 }
                    ]
                };
            }
            const res = await fetch(`/api/business/survey-insights?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch insights");
            return res.json();
        },
        enabled: !!placeId || process.env.NODE_ENV === "development",
    });

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59); // Slate 800
            doc.text("Audience Insights Report", 20, 20);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // Slate 500
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
            doc.text(`Venue ID: ${placeId}`, 20, 33);
            doc.line(20, 38, 190, 38);

            // Summary Stats
            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.text("Reputation Summary", 20, 48);

            autoTable(doc, {
                startY: 52,
                head: [['Metric', 'Value']],
                body: [
                    ['Average Rating', `${snapshot?.avgRating} / 5.0`],
                    ['Total Responses', snapshot?.totalResponses.toString() || '0'],
                ],
                theme: 'striped',
                headStyles: { fillColor: [245, 158, 11] } // Amber 500
            });

            // Feedback Table
            const finalY = (doc as any).lastAutoTable.finalY + 15;
            doc.text("Recent Customer Feedback", 20, finalY);

            autoTable(doc, {
                startY: finalY + 4,
                head: [['Activity ID', 'Rating', 'Comment', 'Date']],
                body: snapshot?.recentFeedback.map((f: FeedbackItem) => [
                    f.activityId,
                    `${f.rating} Stars`,
                    f.comment,
                    new Date(f.date).toLocaleDateString()
                ]) || [],
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229] } // Indigo 600
            });

            doc.save(`audience_insights_${placeId}.pdf`);
            toast({ title: "Export Complete", description: "Audience insights exported to PDF." });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate PDF.", variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        try {
            const headers = ["Activity ID", "Rating", "Comment", "Date"];
            const rows = snapshot?.recentFeedback.map((f: FeedbackItem) => [
                f.activityId,
                f.rating,
                `"${f.comment.replace(/"/g, '""')}"`,
                f.date
            ]) || [];

            const csvContent = [
                headers.join(","),
                ...rows.map((row: any[]) => row.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `audience_insights_${placeId}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Export Complete", description: "Audience insights exported to CSV." });
        } catch (error) {
            console.error("CSV Export Error:", error);
            toast({ title: "Export Failed", description: "Failed to generate CSV.", variant: "destructive" });
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        className={`w-3 h-3 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                    />
                ))}
            </div>
        );
    };

    if (isLoading || !snapshot) {
        return (

            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
            </div>

        );
    }

    return (

        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fade-in">

            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-8 gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 italic uppercase">Audience Insights</h2>
                    <p className="text-gray-500 font-medium">Privacy-first aggregate visibility into your venue's reputation and customer voice.</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full px-6 border-gray-200 hover:bg-gray-50 gap-2">
                            <Download className="w-4 h-4" />
                            Export
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl w-40">
                        <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                            As CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                            As PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT COL: RATINGS SUMMARY */}
                <div className="space-y-10 lg:col-span-1">

                    {/* 1. OVERALL RATING */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Star className="w-3 h-3" /> Overall Reputation
                        </h3>
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <div className="text-5xl font-black text-gray-900 flex items-center gap-2 mb-2">
                                {snapshot.avgRating} <span className="text-3xl text-amber-400">★</span>
                            </div>
                            <p className="text-sm font-bold text-gray-500">Average Rating</p>
                            <Badge variant="secondary" className="mt-4 bg-gray-50 text-gray-600 border-none font-bold">
                                Based on {snapshot.totalResponses} responses
                            </Badge>
                        </div>
                    </section>

                    {/* 2. RATING BREAKDOWN */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Rating Breakdown</h3>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                            {snapshot.ratingBreakdown.map((item: any) => (
                                <div key={item.stars} className="flex items-center justify-between text-sm font-bold">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>{item.stars} Stars</span>
                                    </div>
                                    <span className="text-gray-900">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. TRENDS */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Reputation Over Time</h3>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
                            {snapshot.monthlyTrends.map((trend: any) => (
                                <div key={trend.month} className="flex justify-between items-center py-1">
                                    <span className="text-sm font-bold text-gray-500">{trend.month}</span>
                                    <span className="text-sm font-black text-gray-900">Avg: {trend.avgRating} <span className="text-amber-400">★</span></span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* RIGHT COL: FEEDBACK & THEMES */}
                <div className="lg:col-span-2 space-y-12">

                    {/* 4. SENTIMENT THEMES */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-green-600/70 flex items-center gap-2">
                                <ThumbsUp className="w-3 h-3" /> Positive Mentions
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {snapshot.positives.map((p: string) => (
                                    <span key={p} className="px-4 py-2 bg-green-50 text-green-700 text-xs font-black rounded-xl border border-green-100">
                                        • {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-amber-600/70 flex items-center gap-2">
                                <ThumbsDown className="w-3 h-3" /> Area for Improvement
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {snapshot.improvements.map((i: string) => (
                                    <span key={i} className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-black rounded-xl border border-amber-100">
                                        • {i}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5. RECENT FEEDBACK LIST */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-400" /> Recent Customer Voice
                            </h3>
                            <Filter className="w-4 h-4 text-gray-300" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-transparent">
                                        <th className="py-4 pr-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Activity ID</th>
                                        <th className="py-4 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Rating</th>
                                        <th className="py-4 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Comment</th>
                                        <th className="py-4 pl-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50/50">
                                    {snapshot.recentFeedback.map((feedback: FeedbackItem) => (
                                        <tr key={feedback.id} className="group hover:bg-gray-50/30 transition-colors">
                                            <td className="py-5 pr-4">
                                                <code className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                    {feedback.activityId}
                                                </code>
                                            </td>
                                            <td className="py-5 px-4">
                                                {renderStars(feedback.rating)}
                                            </td>
                                            <td className="py-5 px-4 font-bold text-sm text-gray-700 italic leading-relaxed">
                                                “{feedback.comment}”
                                            </td>
                                            <td className="py-5 pl-4 text-[10px] font-black text-gray-400 text-right uppercase">
                                                {feedback.date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="pt-20 text-center">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                    Verified Reputation Signal • Trendle protocol
                </div>
            </footer>
        </div>

    );
}
