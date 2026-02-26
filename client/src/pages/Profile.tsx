import { useUser, usePosts, useFollowUser, useUnfollowUser, useCurrentUser, useHostEvents } from "@/hooks/use-trendle";
import { Settings, Edit3, Award, MapPin, Gift, UserPlus, UserMinus, ChevronLeft, Crown, Sparkles, Calendar, Users } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { useState } from "react";
import { EditProfileModal } from "@/components/EditProfileModal";
import { HostApplicationFlow } from "@/components/HostApplicationFlow";
import { CreateHostEventModal } from "@/components/CreateHostEventModal";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const profileId = params.id ? parseInt(params.id) : undefined;

  const { data: currentUser } = useCurrentUser();
  const isMe = !profileId || profileId === currentUser?.id;

  const { data: user, isLoading: userLoading } = useUser(profileId);
  const { data: posts, isLoading: postsLoading } = usePosts('all', undefined, profileId || currentUser?.id);
  const { data: hostEvents } = useHostEvents();

  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showHostApplication, setShowHostApplication] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const myPosts = posts || [];
  const isFollowing = user?.hasFollowed;

  // Calculate host stats
  const totalEventsHosted = hostEvents?.length || 0;
  const totalAttendees = hostEvents?.reduce((sum, event) => sum + (event.attendeesCount || 0), 0) || 0;

  if (userLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="p-4 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {!isMe && (
            <button onClick={() => window.history.back()} className="p-2 hover:bg-muted rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="font-display font-bold text-xl">
            {isMe ? "My Profile" : `${user?.username}'s Profile`}
          </h1>
        </div>

        {isMe ? (
          <Link href="/settings" className="p-2 hover:bg-muted rounded-full transition-colors">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </Link>
        ) : (
          <div className="w-10" /> // Spacer
        )}
      </header>

      <main>
        {/* Profile Header */}
        <div className="glass-card mx-4 mb-8 p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-primary to-accent">
                <div className="w-full h-full rounded-full border-4 border-background overflow-hidden">
                  {user?.avatar && <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-background flex items-center gap-1">
                <Award className="w-3 h-3" />
                {user?.level}
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-display">{user?.username}</h2>
              {user?.isHost && (
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Social Host
                  </Badge>
                  {user?.hostVerified && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Verified Host
                    </Badge>
                  )}
                </div>
              )}
              {user?.publicActivityId && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md text-xs font-mono text-muted-foreground">
                  ID: {user.publicActivityId}
                </div>
              )}
              <p className="text-sm text-muted-foreground max-w-md">{user?.bio || "No bio yet."}</p>
            </div>

            {/* Points Display - Only show for self */}
            {isMe && (
              <div className="bg-muted rounded-2xl px-6 py-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">{user?.points} points</span>
              </div>
            )}

            {/* Stats - Refined 4-column grid for standard alignment */}
            <div className="grid grid-cols-4 gap-2 w-full pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="font-bold text-lg text-weight-bold">127</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1 mt-1">
                  Visits
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-weight-bold">{myPosts.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Moments</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-weight-bold">{totalEventsHosted}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Events</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-weight-bold">{totalAttendees}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">People</div>
              </div>
            </div>

            {/* Primary Actions (Strictly ordered below stats) */}
            <div className="w-full pt-4 space-y-3">
              {isMe ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditProfile(true)}
                    className="w-full h-12 rounded-xl font-bold border-border/50 text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  
                  {currentUser?.isHost ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => setShowCreateEvent(true)}
                        className="flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold shadow-md"
                      >
                        <Calendar className="w-4 h-4" />
                        Create Event
                      </Button>
                      <Link
                        href="/host"
                        className="flex items-center justify-center gap-2 h-12 bg-muted rounded-xl font-bold hover:bg-muted/80 transition-colors"
                      >
                        <Crown className="w-4 h-4 text-muted-foreground" />
                        Host Panel
                      </Link>
                    </div>
                  ) : currentUser?.hostApplicationStatus === "pending" ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center animate-pulse">
                          <Calendar className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-800">Application Under Review</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Status: Waiting Approval</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Your Social Host application is being verified. Approval takes 24–48 hours after payment check.
                      </p>
                    </div>
                  ) : currentUser?.hostApplicationStatus === "rejected" ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-red-800">Application Correction Needed</h4>
                      <p className="text-xs text-red-600 mt-1 mb-3">Please review your submission and reapply in 7 days.</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full rounded-lg border-red-200 text-red-700 font-bold h-9"
                        onClick={() => setShowHostApplication(true)}
                      >
                        View Details
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowHostApplication(true)}
                      className="w-full h-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl font-bold text-yellow-700 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Crown className="w-4 h-4 text-yellow-600" />
                      Become a Host
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className={cn(
                    "w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all",
                    !isFollowing && "bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none text-white"
                  )}
                  onClick={() => isFollowing ? unfollowUser.mutate(user!.id) : followUser.mutate(user!.id)}
                  disabled={followUser.isPending || unfollowUser.isPending}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-5 h-5" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - Phase 6 Requirement */}
        <div className="flex items-center justify-center gap-8 border-y border-border/30 bg-card py-3 mb-6">
          <button className="text-sm font-bold text-foreground relative py-1">
            Moments
            <span className="absolute -bottom-3 left-0 right-0 h-[2px] bg-primary" />
          </button>
          {user?.isHost && (
            <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors py-1">
              Events
            </button>
          )}
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors py-1">
            Rewards
          </button>
        </div>

        {/* Vertical Timeline of Posts */}
        <div className="space-y-8">
          <div className="px-6">
            <h3 className="text-lg font-bold font-display mb-4">
              {isMe ? "My Moments" : `${user?.username}'s Moments`}
            </h3>
          </div>
          {myPosts.map(post => (
            <PostCard key={post.id} post={post as any} />
          ))}
          {myPosts.length === 0 && (
            <div className="text-center py-20 px-8 text-muted-foreground bg-muted/10 mx-4 rounded-3xl border border-dashed border-border">
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary/30" />
              <h4 className="text-weight-bold text-foreground mb-1">Begin your Discovery</h4>
              <p className="text-xs leading-relaxed max-w-[200px] mx-auto">
                Capture your first vibe to share with the Trendle community.
              </p>
            </div>
          )}
        </div>
      </main>

      <EditProfileModal open={showEditProfile} onOpenChange={setShowEditProfile} />
      <HostApplicationFlow open={showHostApplication} onOpenChange={setShowHostApplication} />
      <CreateHostEventModal open={showCreateEvent} onOpenChange={setShowCreateEvent} />
    </div>
  );
}
