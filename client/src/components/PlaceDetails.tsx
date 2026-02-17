import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, MapPin, Coffee, Moon, Utensils, ShoppingBag,
    Sparkles, HeartPulse, Scissors, Info, Star, ChevronLeft,
    CheckSquare, Trophy, Heart, MessageCircle, MoreHorizontal, Flag, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Place {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    image: string;
    rating: number; // This might be hardcoded in list, but we fetch real one
    pointsPerVisit: number;
    gallery: string[];
    distance: string;
}

interface PlaceStats {
    checkins: number;
    posts: number;
    rating: number;
    rewards: number;
}

interface Reward {
    id: number;
    title: string;
    description: string;
    cost: number;
    image: string;
    placeId: number;
    locked: boolean;
}

interface Task {
    id: number;
    title: string;
    description: string;
    points: number;
    type: string;
    active: boolean;
    placeId: number;
}

interface Post {
    id: number;
    caption: string;
    image: string;
    likesCount: number;
    commentsCount: number;
    user: {
        avatar: string; // Note: mock storage might return 'avatar' or 'image' for user? Check mockStorage.
        username: string;
    };
}

interface PlaceDetailsProps {
    place: Place;
    onClose: () => void;
}

export function PlaceDetails({ place, onClose }: PlaceDetailsProps) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("overview");

    // Fetch Real Stats
    const { data: stats } = useQuery<PlaceStats>({
        queryKey: [`/api/places/${place.id}/stats`],
    });

    // Fetch Rewards
    const { data: rewards } = useQuery<Reward[]>({
        queryKey: ["/api/rewards"],
        select: (allRewards) => allRewards.filter(r => r.placeId === place.id && !r.locked),
    });

    // Fetch Tasks
    const { data: tasks } = useQuery<Task[]>({
        queryKey: ["/api/daily-tasks"],
        select: (allTasks) => allTasks.filter(t => t.placeId === place.id && t.active),
    });

    // Fetch Moments
    const { data: moments } = useQuery<Post[]>({
        queryKey: [`/api/posts`, { placeId: place.id }],
    });

    // Check-in Mutation
    const checkinMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/checkins", { placeId: place.id });
            return await res.json();
        },
        onSuccess: () => {
            toast({
                title: "Checked In!",
                description: `You earned ${place.pointsPerVisit} points!`,
            });
            queryClient.invalidateQueries({ queryKey: [`/api/places/${place.id}/stats`] });
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        }
    });

    // Redeem Mutation
    const redeemMutation = useMutation({
        mutationFn: async (rewardId: number) => {
            const res = await apiRequest("POST", `/api/rewards/${rewardId}/redeem`, { type: "voucher" });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to redeem");
            }
            return await res.json();
        },
        onSuccess: () => {
            toast({
                title: "Reward Redeemed!",
                description: "Check your profile for the code.",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Redemption Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    });

    const getIcon = (cat: string) => {
        switch (cat) {
            case "Coffee": return <Coffee className="w-4 h-4" />;
            case "Nightlife": return <Moon className="w-4 h-4" />;
            case "Food": return <Utensils className="w-4 h-4" />;
            case "Fashion": return <ShoppingBag className="w-4 h-4" />;
            case "Beauty": return <Sparkles className="w-4 h-4" />;
            case "Wellness": return <HeartPulse className="w-4 h-4" />;
            case "Grooming": return <Scissors className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[0px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-full sm:h-[90vh]"
            >
                {/* Header Image */}
                <div className="relative h-64 shrink-0">
                    <img src={place.image} className="w-full h-full object-cover" alt={place.name} />

                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pt-12 sm:pt-6 bg-gradient-to-b from-black/60 to-transparent">
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors">
                                <MoreHorizontal className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 flex items-center gap-1.5">
                                {getIcon(place.category)}
                                {place.category}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold">{stats?.rating || place.rating}</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white leading-tight">{place.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-300 mt-2">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{place.distance} • {place.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Earn</span>
                        <span className="text-xl font-extrabold text-purple-600">{place.pointsPerVisit} PTS</span>
                    </div>
                    <Button
                        onClick={() => checkinMutation.mutate()}
                        disabled={checkinMutation.isPending}
                        className="bg-gray-900 text-white hover:bg-gray-800 rounded-2xl px-8 shadow-lg shadow-gray-200 transition-all active:scale-95"
                    >
                        {checkinMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
                        Check In
                    </Button>
                </div>

                {/* Content Tabs */}
                <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
                    <Tabs defaultValue="overview" className="flex flex-col h-full" onValueChange={setActiveTab}>
                        <div className="px-6 pt-4 bg-white border-b border-gray-100 shrink-0">
                            <TabsList className="bg-transparent h-auto p-0 w-full justify-start gap-6 border-b-2 border-transparent">
                                {["Overview", "Rewards", "Campaigns", "Moments"].map(tab => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab.toLowerCase()}
                                        className="bg-transparent border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 text-gray-400 rounded-none px-0 py-3 font-semibold data-[state=active]:shadow-none transition-all hover:text-gray-600"
                                    >
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                        <div className="text-2xl font-bold text-gray-900">{stats?.checkins || 0}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Check-ins</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                        <div className="text-2xl font-bold text-gray-900">{stats?.posts || 0}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Moments</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                        <div className="text-2xl font-bold text-gray-900">{stats?.rating || "-"}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Rating</div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-lg mb-3">About</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {place.description || "Discover the magic of this local favorite. Perfect for creators and trendsetters looking for authentic vibes."}
                                    </p>
                                </div>

                                {/* Gallery Preview */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg">Gallery</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {place.gallery && place.gallery.length > 0 ? (
                                            place.gallery.map((img: string, idx: number) => (
                                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                                    <img src={img} className="w-full h-full object-cover" loading="lazy" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-8 text-gray-400 bg-gray-100 rounded-2xl border border-dashed text-sm">No images available</div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="rewards" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {!rewards?.length ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Trophy className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-bold text-gray-900">No active rewards</h3>
                                        <p className="text-sm text-gray-500 mt-1">Check back later for special offers.</p>
                                    </div>
                                ) : (
                                    rewards.map(reward => (
                                        <div key={reward.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                                            <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                                <img src={reward.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-gray-900 truncate">{reward.title}</h4>
                                                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-none">{reward.cost} PTS</Badge>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-3">{reward.description}</p>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 rounded-lg text-xs w-full sm:w-auto"
                                                    onClick={() => redeemMutation.mutate(reward.id)}
                                                    disabled={redeemMutation.isPending}
                                                >
                                                    {redeemMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Redeem"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="campaigns" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {!tasks?.length ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <CheckSquare className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-bold text-gray-900">No active campaigns</h3>
                                        <p className="text-sm text-gray-500 mt-1">Follow this venue for updates.</p>
                                    </div>
                                ) : (
                                    tasks.map(task => (
                                        <div key={task.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400" />
                                            <div className="flex justify-between items-start mb-2 pl-2">
                                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-gray-500 border-gray-200">
                                                    {task.type}
                                                </Badge>
                                                <Badge className="bg-orange-400 hover:bg-orange-500 text-white border-none">+{task.points} PTS</Badge>
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-lg pl-2 mb-1">{task.title}</h4>
                                            <p className="text-sm text-gray-600 pl-2 mb-4">{task.description}</p>
                                            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl">Start Task</Button>
                                        </div>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="moments" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {!moments?.length ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <MessageCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="font-bold text-gray-900">No moments yet</h3>
                                        <p className="text-sm text-gray-500 mt-1">Be the first to share a moment here!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {moments.map(moment => (
                                            <div key={moment.id} className="aspect-[4/5] rounded-2xl overflow-hidden relative group bg-gray-100">
                                                <img src={moment.image} className="w-full h-full object-cover" loading="lazy" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
                                                            {moment.user?.avatar && <img src={moment.user.avatar} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <span className="text-xs text-white truncate font-medium">{moment.user?.username}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-white/90 text-xs">
                                                        <div className="flex items-center gap-1">
                                                            <Heart className="w-3 h-3 fill-white" /> {moment.likesCount}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MessageCircle className="w-3 h-3 fill-white" /> {moment.commentsCount}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </motion.div>
        </div>
    );
}
