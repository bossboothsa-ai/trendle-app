import { BottomNav } from "@/components/BottomNav";
import { StoryRail } from "@/components/StoryRail";
import { PostCard } from "@/components/PostCard";
import { SuggestedUsers } from "@/components/SuggestedUsers";
import { usePosts, useUser } from "@/hooks/use-trendle";
import { Bell, Search, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [feedType, setFeedType] = useState<'foryou' | 'following'>('foryou');
  const { data: posts, isLoading } = usePosts(feedType);
  const { data: user } = useUser();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trendle
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-6 h-6 text-foreground" />
            </button>
            <Link href="/notifications" className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <Bell className="w-6 h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
            </Link>
          </div>
        </div>

        {/* Feed Toggle */}
        <div className="flex items-center justify-center gap-8 border-t border-border/20 pt-2 pb-1">
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
      </header>

      <main className="max-w-md mx-auto">
        <StoryRail />

        <div className="px-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-20 px-6">
              <p className="text-muted-foreground">No posts yet. Be the first to share a moment!</p>
            </div>
          ) : (
            posts?.map((post, index) => (
              <Fragment key={post.id}>
                <PostCard post={post} />
                {index === 1 && feedType === 'foryou' && <SuggestedUsers />}
              </Fragment>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
