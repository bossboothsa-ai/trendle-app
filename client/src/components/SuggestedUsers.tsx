import { useSuggestedUsers, useFollowUser, useUnfollowUser, useUser } from "@/hooks/use-trendle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SuggestedUsers() {
    const { data: users, isLoading } = useSuggestedUsers();
    const followUser = useFollowUser();
    const unfollowUser = useUnfollowUser();
    const { data: currentUser } = useUser();

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!users || users.length === 0) return null;

    return (
        <div className="bg-card/50 border border-border/50 rounded-3xl p-6 mx-4 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Suggested Creators</h3>
                <Button variant="ghost" size="sm" className="text-primary font-semibold">See All</Button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {users.map((user: any) => {
                    const isFollowing = user.hasFollowed; // Note: Ensure backend/hook provides this or handle via secondary logic

                    return (
                        <motion.div
                            key={user.id}
                            whileHover={{ y: -4 }}
                            className="flex-shrink-0 w-32 bg-background border border-border/50 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm"
                        >
                            <Avatar className="w-16 h-16 mb-3 border-2 border-primary/20 p-1">
                                <AvatarImage src={user.avatar} className="rounded-full overflow-hidden" />
                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                            </Avatar>
                            <div className="font-bold text-sm truncate w-full mb-1">{user.username}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
                                {user.level}
                            </div>
                            <Button
                                size="sm"
                                variant={isFollowing ? "ghost" : "outline"}
                                className={cn(
                                    "w-full h-8 rounded-lg text-xs font-bold gap-1",
                                    isFollowing ? "text-muted-foreground hover:text-destructive" : "border-primary/50 text-primary hover:bg-primary hover:text-white"
                                )}
                                onClick={() => isFollowing ? unfollowUser.mutate(user.id) : followUser.mutate(user.id)}
                                disabled={followUser.isPending || unfollowUser.isPending}
                            >
                                {isFollowing ? (
                                    <>
                                        <UserMinus className="w-3 h-3" />
                                        Unfollow
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-3 h-3" />
                                        Follow
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
