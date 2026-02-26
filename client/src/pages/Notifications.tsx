import { useNotifications } from "@/hooks/use-trendle";
import { ArrowLeft, Heart, MessageCircle, UserPlus, Loader2, Bell } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";

export default function Notifications() {
  const { data: notifications, isLoading, error } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-4 h-4 text-white fill-white" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-white fill-white" />;
      case "follow": return <UserPlus className="w-4 h-4 text-white" />;
      default: return <Heart className="w-4 h-4 text-white" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "like": return "bg-pink-accent";
      case "comment": return "bg-purple-electric";
      case "follow": return "bg-purple-primary";
      default: return "bg-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <header className="sticky top-0 header-glow h-16 px-4 flex items-center gap-3 z-10 mb-4 rounded-xl">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="font-display font-bold text-lg">Activity</h1>
        </header>
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-electric" />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <header className="sticky top-0 header-glow h-16 px-4 flex items-center gap-3 z-10 mb-4 rounded-xl">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="font-display font-bold text-lg">Activity</h1>
        </header>
        <div className="text-center py-12 glass-card p-6">
          <p className="text-red-400 font-medium">Unable to load activity.</p>
        </div>
      </PageShell>
    );
  }

  if (!notifications?.length) {
    return (
      <PageShell>
        <header className="sticky top-0 header-glow h-16 px-4 flex items-center gap-3 z-10 mb-4 rounded-xl">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="font-display font-bold text-lg">Activity</h1>
        </header>
        <div className="text-center py-16 px-6 glass-card mt-4 flex flex-col items-center">
          <Bell className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-bold text-lg mb-1">No activity yet</h3>
          <p className="text-sm text-muted-foreground max-w-[200px]">You'll see likes, follows, and rewards updates here.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header className="sticky top-0 header-glow h-16 px-4 flex items-center gap-3 z-10 mb-4 rounded-xl">
        <Link href="/">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="font-display font-bold text-lg">Activity</h1>
      </header>

      <div className="space-y-3">
        {notifications?.map((notif) => (
          <div key={notif.id} className="flex items-start gap-4 p-4 glass-card hover:bg-white/5 transition-colors">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0" /> 
              <div className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#140A2E]",
                getColor(notif.type)
              )}>
                {getIcon(notif.type)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[14px] leading-snug">
                <span className="font-bold">Someone</span> {notif.message}
              </p>
              <p className="text-[12px] text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
