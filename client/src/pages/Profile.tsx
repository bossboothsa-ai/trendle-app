import { useUser, usePosts, useFollowUser, useUnfollowUser, useCurrentUser } from "@/hooks/use-trendle";
import { Settings, Edit3, Award, MapPin, Gift, UserPlus, UserMinus, ChevronLeft } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { useState } from "react";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Profile() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const profileId = params.id ? parseInt(params.id) : undefined;

  const { data: currentUser } = useCurrentUser();
  const isMe = !profileId || profileId === currentUser?.id;

  const { data: user, isLoading: userLoading } = useUser(profileId);
  const { data: posts, isLoading: postsLoading } = usePosts('all', undefined, profileId || currentUser?.id);

  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const [showEditProfile, setShowEditProfile] = useState(false);

  const myPosts = posts || [];
  const isFollowing = user?.hasFollowed;

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
            <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border/50">
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
              <div className="text-center">
                <div className="font-bold text-xl">12</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
                  <Gift className="w-3 h-3" />
                  Rewards
                </div>
              </div>
            </div>

            {isMe ? (
              <button
                onClick={() => setShowEditProfile(true)}
                className="mt-4 flex items-center gap-2 px-8 py-3 bg-muted rounded-full text-sm font-medium hover:bg-muted/80 transition-colors w-full justify-center"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
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

      <EditProfileModal open={showEditProfile} onOpenChange={setShowEditProfile} />    </div>
  );
}
