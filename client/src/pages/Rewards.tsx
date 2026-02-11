import { BottomNav } from "@/components/BottomNav";
import { useRewards, useUser, useRedeemReward } from "@/hooks/use-trendle";
import { Lock, Gift, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Rewards() {
  const { data: rewards, isLoading } = useRewards();
  const { data: user } = useUser();
  const redeem = useRedeemReward();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="bg-primary text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center">
          <h1 className="text-lg font-medium opacity-90 mb-2">Current Balance</h1>
          <div className="text-5xl font-display font-extrabold flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            {user?.points || 0}
          </div>
          <p className="text-sm opacity-80 bg-white/20 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm">
            {user?.level} Member
          </p>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/50 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Daily Bonus</p>
              <p className="text-xs text-muted-foreground">Come back tomorrow</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full text-xs h-8" disabled>
            Claimed
          </Button>
        </div>

        <h2 className="font-display font-bold text-xl mb-4 px-2">Reward Vault</h2>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="h-24 bg-muted rounded-xl animate-pulse" />
          ) : (
            rewards?.map((reward) => (
              <RewardCard 
                key={reward.id} 
                reward={reward} 
                userPoints={user?.points || 0} 
                onRedeem={() => redeem.mutate(reward.id)}
                isRedeeming={redeem.isPending}
              />
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function RewardCard({ reward, userPoints, onRedeem, isRedeeming }: any) {
  const canAfford = userPoints >= reward.cost;
  const isLocked = reward.locked;

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-card rounded-2xl p-4 flex gap-4 border transition-colors",
        canAfford ? "border-border shadow-sm" : "border-border/50 opacity-80"
      )}
    >
      <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
        <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base">{reward.title}</h3>
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-md",
              canAfford ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {reward.cost} pts
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{reward.description}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className={cn(
                "w-full mt-2 rounded-lg text-xs font-bold h-8",
                canAfford ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground hover:bg-muted"
              )}
              disabled={!canAfford || isLocked}
            >
              {isLocked ? <Lock className="w-3 h-3 mr-1" /> : null}
              {canAfford ? "Redeem Reward" : "Not Enough Points"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redeem {reward.title}?</DialogTitle>
              <DialogDescription>
                This will cost {reward.cost} points. A voucher code will be sent to your email.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={onRedeem} disabled={isRedeeming}>
                {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Confirm Redemption"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
