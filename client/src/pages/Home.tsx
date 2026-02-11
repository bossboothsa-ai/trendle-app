import { BottomNav } from "@/components/BottomNav";
import { StoryRail } from "@/components/StoryRail";
import { PostCard } from "@/components/PostCard";
import { usePosts, useUser } from "@/hooks/use-trendle";
import { Bell, Search, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: posts, isLoading } = usePosts();
  const { data: user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
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
      </header>

      <main className="max-w-md mx-auto">
        <StoryRail />
        
        <div className="px-0 pb-20">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-20 px-6">
              <p className="text-muted-foreground">No posts yet. Be the first to share a moment!</p>
            </div>
          ) : (
            posts?.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
