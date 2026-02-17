import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Star, ThumbsUp, TrendingUp } from "lucide-react";

interface SurveyInsightsProps {
    surveyId: number;
}

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];

export default function SurveyInsights({ surveyId }: SurveyInsightsProps) {
    // Mock data for visualization
    const mockRatingData = [
        { rating: "5", count: 45, color: '#10B981' },
        { rating: "4", count: 30, color: '#34D399' },
        { rating: "3", count: 10, color: '#FCD34D' },
        { rating: "2", count: 5, color: '#F87171' },
        { rating: "1", count: 2, color: '#EF4444' },
    ];

    const mockChoiceData = [
        { name: "Service", value: 40 },
        { name: "Food", value: 35 },
        { name: "Ambiance", value: 15 },
        { name: "Price", value: 10 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Responses Card */}
                <Card className="bg-purple-50 border-purple-100 shadow-sm">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                            <ThumbsUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">92</h3>
                        <p className="text-sm text-gray-500 font-medium">Total Responses</p>
                    </CardContent>
                </Card>

                {/* Avg Rating Card */}
                <Card className="bg-green-50 border-green-100 shadow-sm">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                            <Star className="h-5 w-5 text-green-600 fill-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">4.2</h3>
                        <p className="text-sm text-gray-500 font-medium">Average Rating</p>
                    </CardContent>
                </Card>

                {/* Completion Rate Card */}
                <Card className="bg-blue-50 border-blue-100 shadow-sm">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">88%</h3>
                        <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm border-gray-100">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Rating Distribution</CardTitle>
                        <CardDescription>How customers rated this survey</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockRatingData} layout="vertical" margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="rating" type="category" width={40} tick={{ fontSize: 14, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                                        {mockRatingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-100">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Key Improvement Areas</CardTitle>
                        <CardDescription>Top feedback categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={mockChoiceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {mockChoiceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                            {mockChoiceData.map((entry, index) => (
                                <div key={index} className="flex items-center text-xs font-medium bg-gray-50 px-2 py-1 rounded-full text-gray-600">
                                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {entry.name} ({entry.value}%)
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trendle Suggests */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold text-indigo-900">Trendle Suggests</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-indigo-800 leading-relaxed">
                        Based on recent feedback, customers love the <strong>Service</strong> but feel the <strong>Ambiance</strong> could be improved.
                        Consider hosting a themed event like "Sunset Jazz" to boost atmosphere scores!
                    </p>
                </CardContent>
            </Card>

            <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="px-0">
                    <CardTitle className="text-lg font-bold">Recent Feedback</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            AC
                                        </div>
                                        <span className="font-semibold text-sm text-gray-900">Anonymous Customer</span>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">2 days ago</span>
                                </div>
                                <p className="text-sm text-gray-600 italic">"Great atmosphere, but the music was a bit too loud for conversation. Would love to see more dessert options!"</p>
                                <div className="mt-3 flex gap-2">
                                    <Badge variant="outline" className="text-[10px] text-gray-500 font-normal">Service</Badge>
                                    <Badge variant="outline" className="text-[10px] text-gray-500 font-normal">Music</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
