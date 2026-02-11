import { useNotifications } from "@/hooks/use-trendle";
import { ArrowLeft, Heart, MessageCircle, UserPlus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { data: notifications, isLoading } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-4 h-4 text-white fill-white" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-white fill-white" />;
      case "follow": return <UserPlus className="w-4 h-4 text-white" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "like": return "bg-accent";
      case "comment": return "bg-blue-500";
      case "follow": return "bg-primary";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-4 flex items-center gap-4 z-10">
        <Link href="/">
          <button className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>
        <h1 className="font-display font-bold text-xl">Activity</h1>
      </header>

      <main className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notifications?.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No new notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications?.map((notif) => (
              <div key={notif.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                    {/* Placeholder for actor avatar - in real app would join actor data */}
                    <div className="w-full h-full bg-gray-200" /> 
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background",
                    getColor(notif.type)
                  )}>
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold">Someone</span> {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
