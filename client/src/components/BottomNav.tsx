import { Home, MapPin, PlusSquare, Gift, User, Settings, Wallet, CalendarDays, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreatePostModal } from "./CreatePostModal";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCurrentUser } from "@/hooks/use-trendle";
import { useLaunch } from "@/context/LaunchContext";

export function BottomNav() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [location] = useLocation();
  const { data: currentUser } = useCurrentUser();
  const { isSoftLaunch } = useLaunch();

  const showHost = isSoftLaunch || currentUser?.isHost;

  const navItems = [
    { icon: Home, label: "Feed", path: "/home" },
    { icon: MapPin, label: "Explore", path: "/explore" },
    { icon: CalendarDays, label: "Events", path: "/events" },
    { icon: Gift, label: "Rewards", path: "/rewards" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 header-glow border-t border-white/5 pb-safe">
        <div className="flex items-center max-w-md mx-auto h-16 px-2">
          {navItems.slice(0, 2).map((item) => (
            <Link key={item.path} href={item.path} className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200",
              location === item.path ? "nav-item-active font-bold" : "text-muted-foreground hover:text-foreground"
            )}>
              <item.icon className="w-6 h-6" strokeWidth={location === item.path ? 2.5 : 2} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}

          <div className="relative -top-5 mx-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/30 text-white hover:scale-105 active:scale-95 transition-transform"
            >
              <PlusSquare className="w-7 h-7" />
            </button>
          </div>

          {navItems.slice(2).map((item) => (
            <Link key={item.path} href={item.path} className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200",
              location === item.path ? "nav-item-active font-bold" : "text-muted-foreground hover:text-foreground"
            )}>
              <item.icon className="w-6 h-6" strokeWidth={location === item.path ? 2.5 : 2} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}

          {/* Show Host Dashboard if user is a host or in demo mode */}
          {showHost ? (
            <Link href="/host" className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200",
              location === "/host" ? "nav-item-active" : "text-muted-foreground hover:text-foreground"
            )}>
              <Crown className="w-6 h-6" strokeWidth={location === "/host" ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Host</span>
            </Link>
          ) : (
            <Link href="/profile" className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-colors duration-200",
              location === "/profile" || location.startsWith("/profile/") ? "nav-item-active" : "text-muted-foreground hover:text-foreground"
            )}>
              <User className="w-6 h-6" strokeWidth={location === "/profile" ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          )}
        </div>
      </div>

      <CreatePostModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
