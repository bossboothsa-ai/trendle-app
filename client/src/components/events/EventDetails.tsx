import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Clock, MapPin, Users, QrCode, Navigation,
    X, ChevronLeft, Share2, Heart, MessageCircle, Star,
    CheckCircle, Gift, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    useEvent,
    useEventMoments,
    useAttendEvent,
    useCancelAttendance,
    useCheckInToEvent,
    useRateEvent
} from "@/hooks/use-trendle";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/PostCard";

interface EventDetailsProps {
    eventId: number;
    onClose: () => void;
}

interface Event {
    id: number;
    name: string;
    description?: string;
    coverImage?: string;
    venue?: { name: string; location: string } | null;
    hostName: string;
    category: string;
    startDateTime: string;
    endDateTime: string;
    pointsReward: number;
    status: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    attendeesCount: number;
    postsCount: number;
    isAttending?: boolean;
    isCheckedIn?: boolean;
    promotionTier?: string;
}

export function EventDetails({ eventId, onClose }: EventDetailsProps) {
    const { data: event, isLoading, refetch } = useEvent(eventId);
    const { data: moments } = useEventMoments(eventId);
    const attendEvent = useAttendEvent();
    const cancelAttendance = useCancelAttendance();
    const checkIn = useCheckInToEvent();
    const rateEvent = useRateEvent();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<'about' | 'moments' | 'attendees'>('about');
    const [checkInMethod, setCheckInMethod] = useState<'gps' | 'qr'>('gps');
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [rating, setRating] = useState(0);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleAttend = async () => {
        try {
            await attendEvent.mutateAsync(eventId);
            refetch();
        } catch (error) {
            console.error("Error attending event:", error);
        }
    };

    const handleCancelAttendance = async () => {
        try {
            await cancelAttendance.mutateAsync(eventId);
            refetch();
        } catch (error) {
            console.error("Error cancelling attendance:", error);
        }
    };

    const handleCheckIn = async () => {
        if (checkInMethod === 'gps') {
            // Get user's location
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        await checkIn.mutateAsync({
                            eventId,
                            method: 'gps',
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        refetch();
                    } catch (error) {
                        console.error("GPS check-in error:", error);
                    }
                },
                (error) => {
                    toast({
                        title: "Location Error",
                        description: "Could not get your location. Please enable GPS.",
                        variant: "destructive"
                    });
                }
            );
        } else {
            // QR code check-in - in a real app, this would open a camera
            toast({
                title: "QR Scanner",
                description: "Point your camera at the event QR code",
            });
        }
    };

    const handleRate = async () => {
        if (rating > 0) {
            try {
                await rateEvent.mutateAsync({ eventId, rating });
            } catch (error) {
                console.error("Rating error:", error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
                <div className="animate-pulse text-lg">Loading event...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg mb-4">Event not found</p>
                    <Button onClick={onClose}>Go Back</Button>
                </div>
            </div>
        );
    }

    const isLive = event.status === 'live';
    const isUpcoming = event.status === 'upcoming';
    const canCheckIn = isLive && event.isAttending && !event.isCheckedIn;

    return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
            {/* Header Image */}
            <div className="relative h-72">
                <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 text-white bg-black/30 hover:bg-black/50 rounded-full"
                    onClick={onClose}
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex gap-2">
                    {isLive ? (
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            LIVE
                        </span>
                    ) : isUpcoming ? (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                            UPCOMING
                        </span>
                    ) : null}
                    {event.promotionTier && event.promotionTier === "push" && (
                        <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            Boosted
                        </span>
                    )}
                    {event.promotionTier && event.promotionTier === "featured" && (
                        <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            Premium
                        </span>
                    )}
                </div>

                {/* Event Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium capitalize mb-3 inline-block">
                        {event.category}
                    </span>
                    <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                    <div className="flex items-center gap-2 text-gray-300">
                        <span>Hosted by {event.hostName}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">{formatDate(event.startDateTime)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-medium">{formatTime(event.startDateTime)}</p>
                        </div>
                    </div>
                </div>

                {/* Venue */}
                {event.venue && (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl mb-6">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{event.venue.name}</p>
                            <p className="text-sm text-muted-foreground">{event.venue.location}</p>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-2xl mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-medium">{event.attendeesCount}</span>
                        <span className="text-muted-foreground">attending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-accent" />
                        <span className="font-bold text-accent">{event.pointsReward}</span>
                        <span className="text-muted-foreground">pts</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                    {!event.isAttending && isUpcoming && (
                        <Button
                            className="w-full h-14 text-lg font-bold"
                            onClick={handleAttend}
                            disabled={attendEvent.isPending}
                        >
                            {attendEvent.isPending ? "Joining..." : "I'm Going!"}
                        </Button>
                    )}

                    {event.isAttending && !event.isCheckedIn && (
                        <Button
                            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700"
                            onClick={handleCheckIn}
                            disabled={checkIn.isPending}
                        >
                            {checkIn.isPending ? "Checking in..." : "Check In"}
                        </Button>
                    )}

                    {event.isCheckedIn && (
                        <div className="w-full h-14 bg-green-100 border-2 border-green-500 rounded-xl flex items-center justify-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="font-bold text-green-700">Checked In!</span>
                        </div>
                    )}

                    {event.isAttending && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleCancelAttendance}
                            disabled={cancelAttendance.isPending}
                        >
                            Cancel Attendance
                        </Button>
                    )}
                </div>

                {/* Check-in Method Toggle (when can check in) */}
                {canCheckIn && (
                    <div className="mb-6 p-4 bg-muted rounded-2xl">
                        <p className="font-medium mb-3">Choose check-in method:</p>
                        <div className="flex gap-3">
                            <Button
                                variant={checkInMethod === 'gps' ? 'default' : 'outline'}
                                className="flex-1"
                                onClick={() => setCheckInMethod('gps')}
                            >
                                <Navigation className="w-4 h-4 mr-2" />
                                GPS
                            </Button>
                            <Button
                                variant={checkInMethod === 'qr' ? 'default' : 'outline'}
                                className="flex-1"
                                onClick={() => setCheckInMethod('qr')}
                            >
                                <QrCode className="w-4 h-4 mr-2" />
                                QR Code
                            </Button>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        className={cn(
                            "flex-1 pb-3 text-center font-medium transition-colors",
                            activeTab === 'about'
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground"
                        )}
                        onClick={() => setActiveTab('about')}
                    >
                        About
                    </button>
                    <button
                        className={cn(
                            "flex-1 pb-3 text-center font-medium transition-colors",
                            activeTab === 'moments'
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground"
                        )}
                        onClick={() => setActiveTab('moments')}
                    >
                        Moments ({event.postsCount})
                    </button>
                    <button
                        className={cn(
                            "flex-1 pb-3 text-center font-medium transition-colors",
                            activeTab === 'attendees'
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground"
                        )}
                        onClick={() => setActiveTab('attendees')}
                    >
                        Attendees
                    </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <p className="text-muted-foreground leading-relaxed">
                                {event.description || "No description available."}
                            </p>

                            {/* Rating Section for Completed Events */}
                            {event.status === 'completed' && event.isCheckedIn && (
                                <div className="mt-6 p-4 bg-muted rounded-2xl">
                                    <p className="font-medium mb-3">Rate this event:</p>
                                    <div className="flex gap-2 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-8 h-8 transition-colors",
                                                        star <= rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={handleRate}
                                        disabled={rating === 0 || rateEvent.isPending}
                                    >
                                        {rateEvent.isPending ? "Submitting..." : "Submit Rating"}
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'moments' && (
                        <motion.div
                            key="moments"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {moments && moments.length > 0 ? (
                                moments.map((moment: any) => (
                                    <PostCard key={moment.id} post={moment} />
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-muted-foreground">No moments shared yet</p>
                                    <p className="text-sm text-muted-foreground">Be the first to share!</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'attendees' && (
                        <motion.div
                            key="attendees"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <p className="text-muted-foreground mb-4">
                                {event.attendeesCount} people attending
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                {/* Placeholder for attendee avatars - would need API */}
                                {Array.from({ length: Math.min(event.attendeesCount, 9) }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square bg-muted rounded-xl"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
