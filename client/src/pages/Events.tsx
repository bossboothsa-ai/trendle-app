import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Flame, Star, Sparkles, Filter, Search, X } from "lucide-react";
import { useEvents } from "@/hooks/use-trendle";
import { EventsCard } from "@/components/events/EventsCard";
import { EventDetails } from "@/components/events/EventDetails";
import { eventCategories } from "@shared/schema";

const CATEGORY_LABELS: Record<string, string> = {
    "coffee rave": "☕ Coffee Rave",
    "networking": "🤝 Networking",
    "launch": "🚀 Launch",
    "meetup": "👥 Meetup",
    "workshop": "🛠 Workshop",
    "live music": "🎵 Live Music",
    "food festival": "🍽 Food Festival",
    "art exhibition": "🎨 Art Exhibition",
    "wellness": "🧘 Wellness",
    "sports": "⚽ Sports",
    "social": "🎉 Social",
    "other": "✨ Other",
};

export default function Events() {
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming' | 'featured'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const { data: allEvents, isLoading } = useEvents();
    const { data: liveEvents } = useEvents({ status: 'live' });
    const { data: featuredEvents } = useEvents({ featured: true });

    const filteredEvents = allEvents?.filter(event => {
        if (activeFilter === 'live' && event.status !== 'live') return false;
        if (activeFilter === 'upcoming' && event.status !== 'upcoming') return false;
        if (activeFilter === 'featured' && !event.isFeatured) return false;
        if (selectedCategory && event.category !== selectedCategory) return false;
        if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    }) || [];

    const hasLiveEvents = (liveEvents?.length || 0) > 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="px-4 pt-12 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Events</h1>
                            <p className="text-sm text-muted-foreground">Discover & earn points</p>
                        </div>
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                        >
                            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Search */}
                    <AnimatePresence>
                        {showSearch && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3"
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border-none outline-none text-sm"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {[
                            { key: 'all', label: 'All', icon: null },
                            { key: 'live', label: 'Live', icon: Flame },
                            { key: 'upcoming', label: 'Upcoming', icon: Calendar },
                            { key: 'featured', label: 'Featured', icon: Star },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveFilter(tab.key as any)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                        isActive
                                            ? tab.key === 'live'
                                                ? 'bg-red-500 text-white shadow-md'
                                                : 'bg-primary text-primary-foreground shadow-md'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                    }`}
                                >
                                    {Icon && <Icon className="w-3.5 h-3.5" />}
                                    {tab.label}
                                    {tab.key === 'live' && hasLiveEvents && (
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="px-4 pb-24 space-y-6 mt-4">
                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                            !selectedCategory ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                    >
                        All Categories
                    </button>
                    {eventCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-all ${
                                selectedCategory === cat
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                        >
                            {CATEGORY_LABELS[cat] || cat}
                        </button>
                    ))}
                </div>

                {/* Featured Banner (only when no filter active) */}
                {activeFilter === 'all' && !selectedCategory && !searchQuery && featuredEvents && featuredEvents.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <h2 className="font-bold text-base">Featured</h2>
                        </div>
                        <div className="space-y-4">
                            {featuredEvents.slice(0, 2).map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <EventsCard
                                        event={{ ...event, hostName: event.hostName ?? "Trendle" }}
                                        onEventClick={(e) => setSelectedEventId(e.id)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Events List */}
                <div>
                    {activeFilter !== 'all' || selectedCategory || searchQuery ? (
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-bold text-base">
                                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                            </h2>
                            {(selectedCategory || searchQuery) && (
                                <button
                                    onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
                                    className="text-xs text-primary font-medium flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <h2 className="font-bold text-base">All Events</h2>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-16">
                            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                            <p className="font-medium text-muted-foreground">No events found</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">Try a different filter or check back soon</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredEvents.map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <EventsCard
                                        event={{ ...event, hostName: event.hostName ?? "Trendle" }}
                                        onEventClick={(e) => setSelectedEventId(e.id)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Event Details Overlay */}
            <AnimatePresence>
                {selectedEventId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <EventDetails
                            eventId={selectedEventId}
                            onClose={() => setSelectedEventId(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
