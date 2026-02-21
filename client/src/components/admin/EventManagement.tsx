import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar, Users, TrendingUp, BarChart3, Star, CheckCircle,
    XCircle, Clock, MapPin, Eye, Sparkles, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    useEvents,
    usePlatformEventAnalytics
} from "@/hooks/use-trendle";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function EventManagement() {
    const { data: events, isLoading, refetch } = useEvents();
    const { data: analytics } = usePlatformEventAnalytics();
    const { toast } = useToast();

    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredEvents = events?.filter(event => {
        if (filterStatus !== 'all' && event.status !== filterStatus) return false;
        if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    }) || [];

    const pendingEvents = events?.filter(e => e.status === 'upcoming' && !e.approvedBy) || [];

    const handleApprove = async (eventId: number, approved: boolean) => {
        try {
            const url = buildUrl(api.events.approve.path, { id: eventId });
            await apiRequest(api.events.approve.method, url, {
                body: JSON.stringify({ approved })
            });
            toast({
                title: approved ? "Event Approved" : "Event Rejected",
                description: approved
                    ? "The event is now visible to users."
                    : "The event has been rejected.",
            });
            refetch();
            setSelectedEvent(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not update event status",
                variant: "destructive"
            });
        }
    };

    const handleFeature = async (eventId: number, featured: boolean) => {
        try {
            const url = buildUrl(api.events.update.path, { id: eventId });
            await apiRequest(api.events.update.method, url, {
                body: JSON.stringify({ isFeatured: featured })
            });
            toast({
                title: featured ? "Event Featured" : "Event Unfeatured",
            });
            refetch();
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not update event",
                variant: "destructive"
            });
        }
    };

    const handleTrending = async (eventId: number, trending: boolean) => {
        try {
            const url = buildUrl(api.events.update.path, { id: eventId });
            await apiRequest(api.events.update.method, url, {
                body: JSON.stringify({ isTrending: trending })
            });
            toast({
                title: trending ? "Event Trending" : "Event Untrending",
            });
            refetch();
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not update event",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Event Management</h2>
                    <p className="text-muted-foreground">Manage platform events and monitor performance</p>
                </div>
            </div>

            {/* Platform Analytics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <Calendar className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{analytics?.activeEventsToday || 0}</p>
                                <p className="text-sm text-muted-foreground">Active Today</p>
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
                                <p className="text-2xl font-bold">{analytics?.totalCheckInsToday || 0}</p>
                                <p className="text-sm text-muted-foreground">Check-ins Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{analytics?.totalAttendees || 0}</p>
                                <p className="text-sm text-muted-foreground">Total Attendees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {analytics?.venueParticipationRate ? Math.round(analytics.venueParticipationRate) : 0}%
                                </p>
                                <p className="text-sm text-muted-foreground">Venue Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Approvals */}
            {pendingEvents.length > 0 && (
                <Card className="border-yellow-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-600">
                            <Clock className="w-5 h-5" />
                            Pending Approval ({pendingEvents.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-4 border rounded-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&q=80"}
                                            alt={event.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold">{event.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {event.hostName} - {formatDate(event.startDateTime)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-green-600 border-green-600 hover:bg-green-50"
                                            onClick={() => handleApprove(event.id, true)}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                            onClick={() => handleApprove(event.id, false)}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Events List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Events</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="pl-9 pr-4 py-2 border rounded-lg text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-3 py-2 border rounded-lg text-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Loading events...</div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No events found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=80&q=80"}
                                            alt={event.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold">{event.name}</h3>
                                                {event.isFeatured && (
                                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                                )}
                                                {event.isTrending && (
                                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {event.hostName} - {event.category}
                                            </p>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(event.startDateTime)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {event.attendeesCount}
                                                </span>
                                                <Badge variant={
                                                    event.status === 'live' ? 'destructive' :
                                                        event.status === 'upcoming' ? 'default' :
                                                            'secondary'
                                                }>
                                                    {event.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleFeature(event.id, !event.isFeatured)}
                                        >
                                            {event.isFeatured ? 'Unfeature' : 'Feature'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleTrending(event.id, !event.isTrending)}
                                        >
                                            {event.isTrending ? 'Untrend' : 'Trend'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
