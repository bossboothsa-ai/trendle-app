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
        <div className="bg-card rounded-3xl shadow-lg border border-border/50 mx-4 mb-8 p-6">
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

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 w-full pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="font-bold text-xl">{user?.points || 0}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Points</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">127</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Visits
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">{myPosts.length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Moments</div>
              </div>
              {user?.isHost && (
                <>
                  <div className="text-center">
                    <div className="font-bold text-xl">{totalEventsHosted}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Events
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">{totalAttendees}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      Attendees
                    </div>
                  </div>
                </>
              )}
            </div>

            {isMe ? (
              <div className="space-y-3 w-full">
                {/* Host Actions - Show if user is a host */}
                {currentUser?.isHost && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setShowCreateEvent(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-full text-sm font-medium w-full justify-center"
                    >
                      <Calendar className="w-4 h-4" />
                      Create Event
                    </Button>
                    <Link
                      href="/host"
                      className="flex items-center gap-2 px-6 py-3 bg-muted rounded-full text-sm font-medium hover:bg-muted/80 transition-colors w-full justify-center"
                    >
                      <Crown className="w-4 h-4 text-muted-foreground" />
                      Host Dashboard
                    </Link>
                  </div>
                )}

                {/* Host Application Status - Show if application is pending */}
                {!currentUser?.isHost && currentUser?.hostApplicationStatus === "pending" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-800 text-center">
                    <p className="font-medium">Application Pending Review</p>
                    <p className="text-xs mt-1">Approval typically takes 24-48 hours</p>
                  </div>
                )}

                {/* Host Rejected Status - Show if application was rejected */}
                {!currentUser?.isHost && currentUser?.hostApplicationStatus === "rejected" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-full text-sm text-red-800 text-center">
                    <p className="font-medium">Application Rejected</p>
                    <p className="text-xs mt-1">You can reapply after 7 days</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={() => setShowHostApplication(true)}
                    >
                      Reapply
                    </Button>
                  </div>
                )}

                {/* Host Application Button - Show if not already a host and no pending application */}
                {!currentUser?.isHost && !currentUser?.hostApplicationStatus && (
                  <button
                    onClick={() => {
                      console.log("Become a Host button clicked");
                      setShowHostApplication(true);
                      console.log("showHostApplication state:", showHostApplication);
                    }}
                    className="mt-4 flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-sm font-medium hover:from-yellow-500/30 hover:to-orange-500/30 transition-colors w-full justify-center"
                  >
                    <Crown className="w-4 h-4 text-yellow-600" />
                    Become a Host
                  </button>
                )}

                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-muted rounded-full text-sm font-medium hover:bg-muted/80 transition-colors w-full justify-center"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            ) : (
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="lg"
                className={cn(
                  "mt-4 w-full rounded-full font-bold gap-2 py-6 text-base shadow-lg",
                  !isFollowing && "bg-gradient-to-r from-primary to-accent hover:opacity-90 border-none"
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
            <div className="text-center py-12 text-muted-foreground">
              <p>No moments yet.</p>
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
