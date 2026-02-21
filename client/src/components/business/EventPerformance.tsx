import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar, Users, MessageCircle, Heart, TrendingUp,
    Star, BarChart3, Clock, MapPin, QrCode, Edit, Trash2,
    Plus, Eye, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    useEvents,
    useEvent,
    useEventMoments,
    useEventAttendees,
    useCreateEvent,
    useAttendEvent,
    useCheckInToEvent
} from "@/hooks/use-trendle";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Event Categories
const EVENT_CATEGORIES = [
    "coffee rave", "networking", "launch", "meetup",
    "workshop", "live music", "food festival", "art exhibition",
    "wellness", "sports", "social", "other"
];

interface EventPerformanceProps {
    venueId: number;
}

export function EventPerformance({ venueId }: EventPerformanceProps) {
    const { data: events, isLoading } = useEvents({ venueId });
    const { toast } = useToast();
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'live':
                return <span className="px-2 py-1 bg-red text-xs font-500 text-white-bold rounded-full">LIVE</span>;
            case 'upcoming':
                return <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">UPCOMING</span>;
            case 'completed':
                return <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">COMPLETED</span>;
            default:
                return null;
        }
    };

    // Filter events for this venue
    const venueEvents = events?.filter(e => e.venueId === venueId) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Event Performance</h2>
                    <p className="text-muted-foreground">Track your venue's events and engagement</p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{venueEvents.length}</p>
                                <p className="text-sm text-muted-foreground">Total Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {venueEvents.reduce((sum, e) => sum + (e.attendeesCount || 0), 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Attendees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <MessageCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {venueEvents.reduce((sum, e) => sum + (e.postsCount || 0), 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Posts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {venueEvents.filter(e => e.status === 'live').length}
                                </p>
                                <p className="text-sm text-muted-foreground">Active Now</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Events List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Events</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Loading events...</div>
                    ) : venueEvents.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">No events yet</p>
                            <Button onClick={() => setShowCreateForm(true)}>
                                Create Your First Event
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {venueEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedEventId(event.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80"}
                                            alt={event.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold">{event.name}</h3>
                                                {getStatusBadge(event.status)}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(event.startDateTime)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {event.attendeesCount} attending
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="w-3 h-3" />
                                                    {event.postsCount} posts
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-accent">{event.pointsReward} pts</span>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Event Modal */}
            {showCreateForm && (
                <CreateEventForm
                    venueId={venueId}
                    onClose={() => setShowCreateForm(false)}
                />
            )}

            {/* Event Details Modal */}
            {selectedEventId && (
                <EventAnalyticsModal
                    eventId={selectedEventId}
                    onClose={() => setSelectedEventId(null)}
                />
            )}
        </div>
    );
}

// Create Event Form
interface CreateEventFormProps {
    venueId: number;
    onClose: () => void;
}

function CreateEventForm({ venueId, onClose }: CreateEventFormProps) {
    const createEvent = useCreateEvent();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        coverImage: '',
        category: 'meetup',
        startDateTime: '',
        endDateTime: '',
        pointsReward: 100,
        postBonusPoints: 50,
        checkInMethod: 'gps',
        location: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEvent.mutateAsync({
                ...formData,
                venueId,
                hostName: 'My Venue', // Would come from business context
                hostType: 'business'
            });
            onClose();
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold">Create Event</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Event Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {EVENT_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-4 py-2 rounded-lg border"
                                value={formData.startDateTime}
                                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full px-4 py-2 rounded-lg border"
                                value={formData.endDateTime}
                                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-in Points</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border"
                                value={formData.pointsReward}
                                onChange={(e) => setFormData({ ...formData, pointsReward: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Post Bonus Points</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border"
                                value={formData.postBonusPoints}
                                onChange={(e) => setFormData({ ...formData, postBonusPoints: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Check-in Method</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border"
                            value={formData.checkInMethod}
                            onChange={(e) => setFormData({ ...formData, checkInMethod: e.target.value })}
                        >
                            <option value="gps">GPS Location</option>
                            <option value="qr">QR Code</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 rounded-lg border"
                            placeholder="https://..."
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={createEvent.isPending}>
                            {createEvent.isPending ? "Creating..." : "Create Event"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Event Analytics Modal
interface EventAnalyticsModalProps {
    eventId: number;
    onClose: () => void;
}

function EventAnalyticsModal({ eventId, onClose }: EventAnalyticsModalProps) {
    const { data: event, isLoading } = useEvent(eventId);
    const { data: attendees } = useEventAttendees(eventId);
    const { data: moments } = useEventMoments(eventId);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{event.name}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        ×
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-muted rounded-xl text-center">
                            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <p className="text-2xl font-bold">{event.attendeesCount}</p>
                            <p className="text-sm text-muted-foreground">Attendees</p>
                        </div>
                        <div className="p-4 bg-muted rounded-xl text-center">
                            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                            <p className="text-2xl font-bold">{event.postsCount}</p>
                            <p className="text-sm text-muted-foreground">Posts</p>
                        </div>
                        <div className="p-4 bg-muted rounded-xl text-center">
                            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                            <p className="text-2xl font-bold">
                                {attendees?.filter((a: any) => a.checkedIn).length || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">Check-ins</p>
                        </div>
                    </div>

                    {/* Engagement Info */}
                    <div className="p-4 bg-muted rounded-xl">
                        <h3 className="font-bold mb-3">Engagement Level</h3>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{
                                        width: `${Math.min(100, (event.postsCount / Math.max(1, event.attendeesCount)) * 100)}%`
                                    }}
                                />
                            </div>
                            <span className="text-sm font-medium">
                                {Math.round((event.postsCount / Math.max(1, event.attendeesCount)) * 100)}%
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {event.postsCount} posts from {event.attendeesCount} attendees
                        </p>
                    </div>

                    {/* Return Intent */}
                    <div className="p-4 bg-muted rounded-xl">
                        <h3 className="font-bold mb-3">Return Intent</h3>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-lg font-bold">4.2</span>
                            <span className="text-muted-foreground">/ 5 average rating</span>
                        </div>
                    </div>

                    {/* Event QR Code */}
                    {event.qrCode && (
                        <div className="p-4 bg-muted rounded-xl text-center">
                            <h3 className="font-bold mb-3">Event QR Code</h3>
                            <div className="bg-white p-4 rounded-xl inline-block">
                                <QrCode className="w-32 h-32 mx-auto" />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{event.qrCode}</p>
                        </div>
                    )}

                    {/* Recent Posts */}
                    {moments && moments.length > 0 && (
                        <div>
                            <h3 className="font-bold mb-3">Recent Posts</h3>
                            <div className="space-y-2">
                                {moments.slice(0, 5).map((moment: any) => (
                                    <div key={moment.id} className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm line-clamp-2">{moment.caption || 'No caption'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
