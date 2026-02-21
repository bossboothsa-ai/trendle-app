import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
    event: {
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
    };
    onEventClick?: (event: any) => void;
}

export function EventsCard({ event, onEventClick }: EventCardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
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

    const getStatusBadge = () => {
        switch (event.status) {
            case 'live':
                return (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE NOW
                    </span>
                );
            case 'upcoming':
                return (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        UPCOMING
                    </span>
                );
            case 'completed':
                return (
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
                        COMPLETED
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onEventClick?.(event)}
            className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-xl bg-card"
        >
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    {getStatusBadge()}
                </div>

                {/* Featured/Trending Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {event.isTrending && (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                        </span>
                    )}
                    {event.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                        </span>
                    )}
                    {event.promotionTier && event.promotionTier === "push" && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Boosted
                        </span>
                    )}
                    {event.promotionTier && event.promotionTier === "featured" && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Premium
                        </span>
                    )}
                </div>

                {/* Category */}
                <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white capitalize">
                        {event.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.name}</h3>

                {/* Host */}
                <p className="text-sm text-muted-foreground mb-3">
                    Hosted by <span className="font-medium text-foreground">{event.hostName}</span>
                </p>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.startDateTime)}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(event.startDateTime)}</span>
                </div>

                {/* Venue */}
                {event.venue && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.venue.name}</span>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{event.attendeesCount}</span>
                            <span className="text-muted-foreground">attending</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm">
                        <span className="text-accent font-bold">{event.pointsReward}</span>
                        <span className="text-muted-foreground">pts</span>
                    </div>
                </div>

                {/* Attending Status */}
                {event.isAttending && (
                    <div className="mt-3 p-2 bg-primary/10 rounded-lg text-center">
                        {event.isCheckedIn ? (
                            <span className="text-sm font-medium text-green-600">
                                ✓ Checked In
                            </span>
                        ) : (
                            <span className="text-sm font-medium text-primary">
                                You're Attending
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Events List Component
interface EventsListProps {
    events: any[];
    onEventClick?: (event: any) => void;
    title?: string;
}

export function EventsList({ events, onEventClick, title }: EventsListProps) {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No events found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {title && (
                <h2 className="text-xl font-bold">{title}</h2>
            )}
            <div className="grid grid-cols-1 gap-4">
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <EventsCard event={event} onEventClick={onEventClick} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
