import { Link, useLocation } from "wouter";
import { Home, MapPin, PlusSquare, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreatePostModal } from "./CreatePostModal";
import { useState } from "react";

export function BottomNav() {
  const [location] = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div className={cn(
          "flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}>
          <Icon className={cn("w-6 h-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-border/50 pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto h-16 px-2">
          <NavItem href="/" icon={Home} label="Feed" />
          <NavItem href="/explore" icon={MapPin} label="Explore" />
          
          <div className="relative -top-5">
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/30 text-white hover:scale-105 active:scale-95 transition-transform"
            >
              <PlusSquare className="w-7 h-7" />
            </button>
          </div>

          <NavItem href="/rewards" icon={Gift} label="Rewards" />
          <NavItem href="/profile" icon={User} label="Profile" />
        </div>
      </div>

      <CreatePostModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
