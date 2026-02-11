import { BottomNav } from "@/components/BottomNav";
import { useUser, usePosts } from "@/hooks/use-trendle";
import { Settings, Edit3, Grid, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Profile() {
  const { data: user } = useUser();
  const { data: posts } = usePosts(); // Ideally would filter by author
  const [activeTab, setActiveTab] = useState<"grid" | "saved">("grid");

  // Filter posts to simulate "my posts" (in a real app, API would do this)
  const myPosts = posts?.filter(p => p.author.id === user?.id) || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="p-4 flex justify-between items-center">
        <h1 className="font-display font-bold text-xl">My Profile</h1>
        <button>
          <Settings className="w-6 h-6 text-muted-foreground" />
        </button>
      </header>

      <main>
        {/* Profile Header */}
        <div className="flex flex-col items-center px-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-primary to-accent">
              <div className="w-full h-full rounded-full border-4 border-background overflow-hidden">
                {user?.avatar && <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-background">
              {user?.level}
            </div>
          </div>

          <h2 className="mt-3 text-xl font-bold font-display">{user?.username}</h2>
          <p className="text-sm text-muted-foreground text-center mt-1 max-w-xs">{user?.bio}</p>

          <div className="flex items-center gap-8 mt-6 w-full justify-center border-y border-border/50 py-4">
            <div className="text-center">
              <div className="font-bold text-lg">{myPosts.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">1.2k</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">450</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Following</div>
            </div>
          </div>
          
          <button className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-muted rounded-full text-sm font-medium hover:bg-muted/80 transition-colors">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Content Tabs */}
        <div className="mt-8">
          <div className="flex border-b border-border/50">
            <button 
              onClick={() => setActiveTab("grid")}
              className={cn(
                "flex-1 py-3 flex justify-center border-b-2 transition-colors",
                activeTab === "grid" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
              )}
            >
              <Grid className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveTab("saved")}
              className={cn(
                "flex-1 py-3 flex justify-center border-b-2 transition-colors",
                activeTab === "saved" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
              )}
            >
              <Bookmark className="w-6 h-6" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-0.5 mt-0.5">
            {myPosts.map(post => (
              <div key={post.id} className="aspect-square bg-muted relative group cursor-pointer overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            {/* Fillers for empty state look */}
            {myPosts.length === 0 && Array.from({length: 6}).map((_, i) => (
              <div key={i} className="aspect-square bg-muted/20" />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
