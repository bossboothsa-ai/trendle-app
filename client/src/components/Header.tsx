import { Bell, Briefcase, Search, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HeaderProps {
    title?: string;
    showSearch?: boolean;
    showNotifications?: boolean;
    showMessages?: boolean;
    showBusiness?: boolean;
    className?: string;
}

export function Header({ 
    title = "Trendle", 
    showSearch = true, 
    showNotifications = true, 
    showMessages = true,
    showBusiness = true,
    className 
}: HeaderProps) {
    const { toast } = useToast();

    return (
        <header className={cn(
            "sticky top-0 z-[9999] w-full header-glow h-16 px-4 flex items-center",
            className
        )}>
            <div className="flex items-center justify-between w-full max-w-md mx-auto">
                <Link href="/home">
                    <h1 className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer">
                        {title}
                    </h1>
                </Link>
                
                <div className="flex items-center gap-2">
                    {showBusiness && (
                        <Link href="/business/login">
                            <button 
                                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors" 
                                title="Business Portal"
                            >
                                <Briefcase className="w-5 h-5 text-foreground" />
                            </button>
                        </Link>
                    )}
                    
                    {showSearch && (
                        <button
                            onClick={() => toast({ title: "Coming Soon", description: "Search feature is under development." })}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Search className="w-5 h-5 text-foreground" />
                        </button>
                    )}

                    {showMessages && (
                        <Link href="/messages">
                            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors relative">
                                <MessageSquare className="w-5 h-5 text-foreground" />
                            </button>
                        </Link>
                    )}
                    
                    {showNotifications && (
                        <Link href="/notifications">
                            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors relative">
                                <Bell className="w-5 h-5 text-foreground" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[var(--bg-surface)]"></span>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
