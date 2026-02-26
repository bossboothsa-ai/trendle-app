import { StoryRail } from "@/components/StoryRail";
import { PostCard } from "@/components/PostCard";
import { SuggestedUsers } from "@/components/SuggestedUsers";
import { usePosts, useUser, useCurrentUser } from "@/hooks/use-trendle";
import { Bell, Search, Loader2, Briefcase, Home as HomeIcon, Compass, CalendarDays, Gift, Wallet, User as UserIcon, Crown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLaunch } from "@/context/LaunchContext";
import { Header } from "@/components/Header";

export default function Home() {
  const { toast } = useToast();
  const [feedType, setFeedType] = useState<'foryou' | 'following'>('foryou');
  const { data: posts, isLoading } = usePosts(feedType);
  const { data: user } = useUser();
  const { data: currentUser } = useCurrentUser();
  const { isSoftLaunch } = useLaunch();
  const [location] = useLocation();

  const showHost = isSoftLaunch || currentUser?.isHost;

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/home" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: CalendarDays, label: "Events", path: "/events" },
    { icon: Gift, label: "Rewards", path: "/rewards" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
  ];

  if (showHost) {
    navItems.push({ icon: Crown, label: "Host", path: "/host" });
  }
  navItems.push({ icon: UserIcon, label: "Profile", path: "/profile" });

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Trendle" />

      {/* Feed Toggle */}
      <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-md flex items-center justify-center gap-8 border-b border-border/20 pt-2 pb-2">
        <button
          onClick={() => setFeedType('foryou')}
          className={cn(
            "text-base font-bold transition-all relative py-1",
            feedType === 'foryou' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          For You
          {feedType === 'foryou' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
          )}
        </button>
        <button
          onClick={() => setFeedType('following')}
          className={cn(
            "text-base font-bold transition-all relative py-1",
            feedType === 'following' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Following
          {feedType === 'following' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
          )}
        </button>
      </div>

      <main className="max-w-md mx-auto">
        <StoryRail />

        <div className="px-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-20 px-8 mx-4 bg-muted/10 rounded-3xl border border-dashed border-border">
              <Compass className="w-10 h-10 mx-auto mb-4 text-primary/30" />
              <h3 className="text-lg text-weight-bold mb-2">Discovery is beginning!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Moments in your area are starting to trend. Be the first to capture the vibe!
              </p>
            </div>
          ) : (
            posts?.map((post, index) => (
              <Fragment key={post.id}>
                <PostCard post={post as any} />
                {index === 1 && feedType === 'foryou' && <SuggestedUsers />}
              </Fragment>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
