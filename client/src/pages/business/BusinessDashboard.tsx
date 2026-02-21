import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
    BarChart3,
    TrendingUp,
    Users,
    Heart,
    Zap,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Trophy,
    Eye,
    MessageCircle
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import BusinessLayout from "@/layouts/BusinessLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBusiness } from "@/context/BusinessContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface DashboardMetrics {
    totalCheckins: number;
    totalUniqueVisitors: number;
    newVisitors: number;
    returningVisitors: number;
    totalMoments: number;
    totalLikes: number;
    totalComments: number;
    totalRewardsRedeemed: number;
    avgSurveyRating: number;
    recentActivity?: {
        id: string;
        user: string;
        avatar: string;
        action: string;
        time: string;
        amount: string;
        type: "checkin" | "redemption";
    }[];
    insights?: {
        topReward: { title: string; count: number } | null;
        topTask: { title: string; count: number } | null;
        topPost: { caption: string; likes: number } | null;
    };
}

interface DailyMetric {
    date: string;
    visits: number;
}

export default function BusinessDashboard() {
    const { toast } = useToast();
    const { placeId } = useBusiness();

    // Fetch KPI Metrics
    const { data: metrics, isLoading: loadingMetrics } = useQuery<DashboardMetrics>({
        queryKey: [`/api/business/dashboard`, placeId],
        queryFn: async () => {
            const res = await fetch(`/api/business/dashboard?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch metrics");
            return res.json();
        },
        enabled: !!placeId,
    });

    // Fetch Daily Analytics for Charts
    const { data: dailyMetrics, isLoading: loadingDaily } = useQuery<DailyMetric[]>({
        queryKey: [`/api/business/analytics/daily`, placeId],
        queryFn: async () => {
            const res = await fetch(`/api/business/analytics/daily?placeId=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch daily metrics");
            return res.json();
        },
        enabled: !!placeId,
    });

    const kpiData = [
        {
            title: "Total Check-ins",
            value: metrics?.totalCheckins || 0,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50",
            trend: "+12.5%",
            trendUp: true
        },
        {
            title: "Unique Visitors",
            value: metrics?.totalUniqueVisitors || 0,
            icon: Eye,
            color: "text-amber-500",
            bg: "bg-amber-50",
            trend: "+8.2%",
            trendUp: true
        },
        {
            title: "Moments Shared",
            value: metrics?.totalMoments || 0,
            icon: BarChart3,
            color: "text-purple-500",
            bg: "bg-purple-50",
            trend: "-2.4%",
            trendUp: false
        },
        {
            title: "Engagement",
            value: metrics ? metrics.totalLikes + metrics.totalComments : 0,
            icon: Heart,
            color: "text-pink-500",
            bg: "bg-pink-50",
            trend: "+24.1%",
            trendUp: true
        },
    ];

    if (loadingMetrics || loadingDaily) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in">

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Card key={index} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${item.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {item.trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                        {item.trend}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">{item.value}</h3>
                                    <p className="text-sm font-medium text-gray-400">{item.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Growth Drivers Section */}
            <section>
                <div className="flex items-center space-x-2 mb-6">
                    <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <h3 className="text-lg font-bold text-gray-800">Visibility & Impact Engines</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Top Reward */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-white/60 px-2 py-1 rounded-lg">High Impact Perk</span>
                                <Trophy className="w-5 h-5 text-amber-500" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{metrics?.insights?.topReward?.title || "No data"}</h4>
                            <p className="text-sm text-gray-500 mb-4">Most effective foot-traffic driver</p>
                            <div className="text-2xl font-bold text-gray-900">{metrics?.insights?.topReward?.count || 0} <span className="text-sm font-normal text-gray-400">Claims</span></div>
                        </CardContent>
                    </Card>

                    {/* Top Task */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-white/60 px-2 py-1 rounded-lg">Engagement Driver</span>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{metrics?.insights?.topTask?.title || "No data"}</h4>
                            <p className="text-sm text-gray-500 mb-4">Highest completion frequency</p>
                            <div className="text-2xl font-bold text-gray-900">{metrics?.insights?.topTask?.count || 0} <span className="text-sm font-normal text-gray-400">Accomplished</span></div>
                        </CardContent>
                    </Card>

                    {/* Most Engaged */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-white/60 px-2 py-1 rounded-lg">Viral Moment</span>
                                <Heart className="w-5 h-5 text-pink-500" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">{metrics?.insights?.topPost?.caption || "No posts yet"}</h4>
                            <p className="text-sm text-gray-500 mb-4">Highest visibility post</p>
                            <div className="text-2xl font-bold text-gray-900">{metrics?.insights?.topPost?.likes || 0} <span className="text-sm font-normal text-gray-400">Likes Received</span></div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visitor Flow Chart */}
                <Card className="border-none shadow-sm rounded-3xl">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Audience Composition</CardTitle>
                                <CardDescription>New vs Returning behavior breakdown</CardDescription>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <Users className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">New Visitors</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">{metrics?.newVisitors || 0}</div>
                                <p className="text-[10px] text-gray-500 mt-1">First time at your venue</p>
                            </div>
                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Returning</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">{metrics?.returningVisitors || 0}</div>
                                <p className="text-[10px] text-gray-500 mt-1">Repeat visibility impact</p>
                            </div>
                        </div>
                        <div className="h-[200px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyMetrics || []}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                        stroke="#9CA3AF"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#9CA3AF"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visits"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorVisits)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Engagement Velocity */}
                <Card className="border-none shadow-sm rounded-3xl">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Visibility Growth</CardTitle>
                                <CardDescription>Viral potential and social reach</CardDescription>
                            </div>
                            <div className="p-2 bg-pink-50 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-pink-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 mt-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Heart className="w-4 h-4 text-pink-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Likes Generated</p>
                                        <p className="text-[10px] text-gray-500">Across all venue posts</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-gray-900">{metrics?.totalLikes || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <MessageCircle className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Active Conversations</p>
                                        <p className="text-[10px] text-gray-500">Comments and feedback</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-gray-900">{metrics?.totalComments || 0}</span>
                            </div>
                            <div className="mt-2 p-4 bg-purple-900 text-white rounded-2xl shadow-inner">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">Efficiency Score</span>
                                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div className="text-3xl font-black mt-2">High</div>
                                <p className="text-[10px] opacity-70 mt-1">Your promotions are driving peak engagement.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Live Activity Feed */}
            <Card className="border-none shadow-sm rounded-3xl mt-8">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">Live Activity</CardTitle>
                            <CardDescription>Real-time customer interactions</CardDescription>
                        </div>
                        <div className="p-2 bg-green-50 rounded-xl">
                            <Zap className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!metrics?.recentActivity?.length ? (
                        <div className="p-8 text-center text-muted-foreground">No recent activity</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {metrics.recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    onClick={() => toast({ title: "Activity Detail", description: `Viewing activity for @${activity.user}` })}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarImage src={activity.avatar} />
                                            <AvatarFallback>{activity.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                @{activity.user} <span className="font-normal text-gray-500">{activity.action}</span>
                                            </p>
                                            <p className="text-xs text-gray-400">{new Date(activity.time).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className={
                                        activity.type === 'checkin'
                                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                    }>
                                        {activity.amount}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
