import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BusinessLayout from "@/layouts/BusinessLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    MessageCircle,
    Flag,
    MoreHorizontal,
    Calendar as CalendarIcon,
    Filter,
    Camera as CameraIcon,
    HelpCircle
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBusiness } from "@/context/BusinessContext";
import { useToast } from "@/hooks/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Moment {
    id: number;
    userId: number;
    username: string;
    userAvatar: string;
    image: string;
    caption: string;
    likesCount: number;
    commentsCount: number;
    timestamp: string;
}

export default function Moments() {
    const { placeId } = useBusiness();
    const { toast } = useToast();
    const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<string>("latest");
    const itemsPerPage = 12; // Adjusted for better grid layout

    const { data: moments, isLoading } = useQuery<Moment[]>({
        queryKey: [`/api/business/moments`, placeId],
        enabled: !!placeId,
    });

    const sortedMoments = moments ? [...moments].sort((a, b) => {
        if (sortBy === "latest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (sortBy === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        if (sortBy === "liked") return b.likesCount - a.likesCount;
        if (sortBy === "commented") return b.commentsCount - a.commentsCount;
        return 0;
    }) : [];

    const handleReport = async (momentId: number) => {
        try {
            await fetch(`/api/business/moments/${momentId}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: "Inappropriate content" }),
            });

            toast({
                title: "Reported",
                description: "This moment has been flagged for review.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to report moment.",
                variant: "destructive",
            });
        }
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Moments</h2>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs p-4 rounded-xl border-gray-100 shadow-xl">
                                    <p className="font-bold text-gray-900 mb-1">What are Moments?</p>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">User-generated content from customers at your venue. High-quality moments increase your venue's visibility on the Trendle feed.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-muted-foreground">
                        {moments?.length || 0} moments shared at your venue
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-xl border-gray-200">
                                <Filter className="mr-2 h-4 w-4 text-purple-600" />
                                {sortBy === "latest" && "Latest"}
                                {sortBy === "oldest" && "Oldest"}
                                {sortBy === "liked" && "Most Liked"}
                                {sortBy === "commented" && "Most Commented"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => setSortBy("latest")}>Latest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("liked")}>Most Liked</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("commented")}>Most Commented</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Moments Grid */}
            {!moments?.length ? (
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                        <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-6 animate-bounce-slow">
                            <CameraIcon className="h-10 w-10 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No moments yet</h3>
                        <p className="text-base text-gray-500 max-w-sm mx-auto mb-8">When customers share photos, they'll appear here. Encourage them to tag your venue!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {sortedMoments
                            ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((moment) => (
                                <Card
                                    key={moment.id}
                                    className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none rounded-2xl bg-white shadow-sm"
                                    onClick={() => setSelectedMoment(moment)}
                                >
                                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                                        <img
                                            src={moment.image}
                                            alt={moment.caption}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <div className="text-white text-xs font-medium truncate w-full">
                                                {moment.caption}
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-3">
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-100/50">
                                                {moment.userAvatar ? (
                                                    <img src={moment.userAvatar} alt={moment.username} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-gradient-to-br from-purple-400 to-pink-400" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black tracking-tight text-gray-900 truncate flex-1 uppercase italic">{moment.username}</span>
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-50/80 rounded-xl px-2 py-1.5 justify-center border border-gray-100/50">
                                            <div className="flex items-center gap-1 text-[10px] font-black text-gray-700">
                                                <Heart className="h-3 w-3 text-pink-500 fill-pink-500" />
                                                <span>{moment.likesCount}</span>
                                            </div>
                                            <div className="w-[1px] h-2 bg-gray-200"></div>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-gray-700">
                                                <MessageCircle className="h-3 w-3 text-blue-500" />
                                                <span>{moment.commentsCount}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>

                    {/* Pagination Controls */}
                    {sortedMoments && sortedMoments.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-4 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCurrentPage(p => Math.max(1, p - 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="rounded-full px-6"
                            >
                                Previous
                            </Button>
                            <span className="text-sm font-medium text-gray-500">
                                Page {currentPage} of {Math.ceil(sortedMoments.length / itemsPerPage)}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCurrentPage(p => Math.min(Math.ceil(sortedMoments.length / itemsPerPage), p + 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage >= Math.ceil(sortedMoments.length / itemsPerPage)}
                                className="rounded-full px-6"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Sheet */}
            <Sheet open={!!selectedMoment} onOpenChange={() => setSelectedMoment(null)}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    {selectedMoment && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <SheetTitle>Moment Details</SheetTitle>
                                <SheetDescription>
                                    Posted on {new Date(selectedMoment.timestamp).toLocaleString()}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                    src={selectedMoment.image}
                                    alt={selectedMoment.caption}
                                    className="w-full h-auto max-h-[500px] object-contain"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                        {selectedMoment.userAvatar ? (
                                            <img src={selectedMoment.userAvatar} alt={selectedMoment.username} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-purple-400 to-pink-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{selectedMoment.username}</h4>
                                        <p className="text-xs text-muted-foreground">Gold Member</p>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleReport(selectedMoment.id)} className="text-red-600">
                                            <Flag className="mr-2 h-4 w-4" />
                                            Report Content
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-900">{selectedMoment.caption}</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">#brunch</Badge>
                                    <Badge variant="secondary" className="text-xs">#friends</Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t px-1">
                                <h4 className="text-sm font-semibold mb-3">Engagement Stats</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-pink-50 rounded-lg flex items-center gap-3">
                                        <Heart className="h-5 w-5 text-pink-500" />
                                        <div>
                                            <p className="text-lg font-bold text-pink-700">{selectedMoment.likesCount}</p>
                                            <p className="text-xs text-pink-600">Total Likes</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3">
                                        <MessageCircle className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="text-lg font-bold text-blue-700">{selectedMoment.commentsCount}</p>
                                            <p className="text-xs text-blue-600">Comments</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
