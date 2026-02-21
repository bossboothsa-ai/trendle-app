import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Calendar, Users, TrendingUp, Plus, MoreVertical,
  Zap, Star, Clock, MapPin, Eye, Edit, Trash2, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHostEvents, useHostAnalytics, useCurrentUser } from "@/hooks/use-trendle";
import { CreateHostEventModal } from "@/components/CreateHostEventModal";
import { promotionPricing } from "@shared/schema";

export default function HostDashboard() {
  const [, setLocation] = useLocation();
  const { data: currentUser } = useCurrentUser();
  const { data: events, isLoading } = useHostEvents();
  const { data: analytics } = useHostAnalytics();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Check if user is a host
  const isHost = currentUser?.isHost;

  if (!isHost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Become a Social Host</h2>
            <p className="text-muted-foreground mb-4">
              Transform your account to host social experiences at partner venues.
            </p>
            <Button className="w-full" onClick={() => setLocation("/profile")}>
              Go to Profile to Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const upcomingEvents = events?.filter(e => e.status === "upcoming") || [];
  const pastEvents = events?.filter(e => e.status === "completed" || e.status === "cancelled") || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="px-4 pt-12 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Host Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your social experiences
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics?.upcomingEvents || 0}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics?.totalAttendees || 0}</p>
                  <p className="text-xs text-muted-foreground">Attendees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics?.completedEvents || 0}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics?.totalPromotions || 0}</p>
                  <p className="text-xs text-muted-foreground">Promotions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Host Info */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                <div className="w-full h-full rounded-full bg-background overflow-hidden">
                  <img
                    src={currentUser?.hostAvatar || currentUser?.avatar}
                    alt={currentUser?.hostName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {currentUser?.hostName}
                  {currentUser?.hostVerified && <Star className="w-4 h-4 text-blue-500 fill-blue-500" />}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {currentUser?.hostBio || "Social Host on Trendle"}
                </p>
              </div>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                <Crown className="w-3 h-3 mr-1" />
                Host
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <div>
          <h2 className="font-bold text-lg mb-3">Upcoming Events</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-medium text-muted-foreground">No upcoming events</p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event: any, i: number) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex gap-4">
                        {/* Event Image */}
                        <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                          {event.coverImage ? (
                            <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                              <Calendar className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold truncate">{event.name}</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {event.venue?.name || "Venue"}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(event.startDateTime).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendeesCount || 0} attending
                            </div>
                          </div>

                          {/* Promotion Status */}
                          {event.promotionTier && event.promotionTier !== "basic" ? (
                            <Badge className="mt-2 bg-purple-500/20 text-purple-600 text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              {event.promotionTier} promoted
                            </Badge>
                          ) : (
                            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Promote
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="font-bold text-lg mb-3">Past Events</h2>
            <div className="space-y-3">
              {pastEvents.slice(0, 3).map((event: any, i: number) => (
                <Card key={event.id} className="opacity-70">
                  <CardContent className="pt-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                        {event.coverImage ? (
                          <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate">{event.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {event.attendeesCount || 0} attended
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Promotion Pricing Info */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Boost Your Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-background rounded-lg">
                <p className="font-bold text-sm">Free</p>
                <p className="text-xs text-muted-foreground">Basic</p>
              </div>
              <div className="p-2 bg-background rounded-lg border border-primary/30">
                <p className="font-bold text-sm">R4.99</p>
                <p className="text-xs text-muted-foreground">Push</p>
              </div>
              <div className="p-2 bg-background rounded-lg border border-yellow-500/30">
                <p className="font-bold text-sm">R14.99</p>
                <p className="text-xs text-muted-foreground">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Event Modal */}
      <CreateHostEventModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
