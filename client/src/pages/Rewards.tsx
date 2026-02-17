import { useRewards, useCurrentUser, useRedeemReward } from "@/hooks/use-trendle";
import { Lock, Gift, Sparkles, Loader2, ChevronLeft, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Rewards() {
  const { data: rewards, isLoading } = useRewards();
  const { data: user } = useCurrentUser();
  const redeem = useRedeemReward();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "Best Sellers" },
    { id: "discount", label: "Discounts" },
    { id: "product", label: "Products" },
    { id: "experience", label: "Experiences" },
    { id: "airtime", label: "Mobile" },
  ];

  const filteredRewards = activeCategory === "all"
    ? rewards
    : rewards?.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-24">
      {/* Dynamic Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-30 border-b border-border/50 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-foreground">Rewards Vault</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={() => toast({ title: "Coming Soon", description: "Search filtering for rewards is being implemented." })}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Balance Sticky Card */}
        <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-[2.5rem] shadow-xl shadow-primary/20 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Available Points</p>
              <div className="text-4xl font-display font-extrabold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                {user?.points || 0}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Membership</p>
              <p className="font-bold text-sm bg-white/20 px-3 py-1 rounded-full">{user?.level}</p>
            </div>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex overflow-x-auto gap-3 pb-6 no-scrollbar -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border shadow-sm",
                activeCategory === cat.id
                  ? "bg-foreground text-background border-foreground shadow-foreground/10"
                  : "bg-white text-muted-foreground border-border/50 hover:border-muted-foreground/30"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reward Grid */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-44 bg-muted rounded-[2rem] animate-pulse" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredRewards?.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={user?.points || 0}
                  onRedeem={() => redeem.mutate(reward.id)}
                  isRedeeming={redeem.isPending}
                />
              ))}
            </AnimatePresence>
          )}
          {filteredRewards?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-bold text-muted-foreground">No rewards in this category yet</p>
            </div>
          )}
        </div>
      </div>    </div>
  );
}

function RewardCard({ reward, userPoints, onRedeem, isRedeeming }: any) {
  const canAfford = userPoints >= reward.cost;
  const isLocked = reward.locked;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "bg-white rounded-[2rem] p-5 flex flex-col gap-4 border transition-all duration-300",
        canAfford ? "border-border/50 shadow-lg shadow-black/5" : "border-border/30 opacity-75"
      )}
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-3xl bg-muted overflow-hidden flex-shrink-0 shadow-inner">
          <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg leading-tight tracking-tight text-[#1A1C1E]">{reward.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">{reward.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest",
              canAfford ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {reward.cost} points
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/60 capitalize">{reward.category}</span>
          </div>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "w-full rounded-2xl font-bold h-12 text-sm transition-all shadow-md",
              canAfford
                ? "bg-foreground text-background hover:bg-foreground/90 shadow-foreground/10"
                : "bg-muted text-muted-foreground hover:bg-muted opacity-50 shadow-none cursor-not-allowed"
            )}
            disabled={!canAfford || isLocked}
          >
            {isLocked ? <Lock className="w-4 h-4 mr-2" /> : null}
            {isLocked ? "Unlocks at Gold Level" : canAfford ? "Claim Reward" : "Not Enough Points"}
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0 max-w-[90vw] sm:max-w-md">
          <div className="bg-primary p-8 text-white relative">
            <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-extrabold tracking-tight">Confirm Redemption</DialogTitle>
              <DialogDescription className="text-white/80 font-medium pt-1">
                Ready to treat yourself?
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-3xl">
              <img src={reward.image} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-foreground">{reward.title}</p>
                <p className="text-xs font-bold text-primary">{reward.cost} pts will be deducted</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed px-2">
                By confirming, you agree to the reward terms. A gift code or voucher will be generated instantly and stored in your wallet.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                  onClick={onRedeem}
                  disabled={isRedeeming}
                >
                  {isRedeeming ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Confirm Redemption"}
                </Button>
                <Button variant="ghost" className="text-muted-foreground font-bold" disabled={isRedeeming}>
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
