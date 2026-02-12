import { Home, MapPin, PlusSquare, Gift, User, ClipboardList, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreatePostModal } from "./CreatePostModal";
import { useState } from "react";

export function BottomNav() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-border/50 pb-safe">
        <div className="flex items-center max-w-md mx-auto h-16 px-2">
          <a href="/" className="flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200 text-muted-foreground hover:text-foreground">
            <Home className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Feed</span>
          </a>
          <a href="/explore" className="flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200 text-muted-foreground hover:text-foreground">
            <MapPin className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Explore</span>
          </a>

          <div className="relative -top-5 mx-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/30 text-white hover:scale-105 active:scale-95 transition-transform"
            >
              <PlusSquare className="w-7 h-7" />
            </button>
          </div>

          <a href="/surveys-tasks" className="flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200 text-muted-foreground hover:text-foreground">
            <ClipboardList className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Tasks</span>
          </a>
          <a href="/wallet" className="flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200 text-muted-foreground hover:text-foreground">
            <Wallet className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Wallet</span>
          </a>
          <a href="/profile" className="flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200 text-muted-foreground hover:text-foreground">
            <User className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Profile</span>
          </a>
        </div>
      </div>

      <CreatePostModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
