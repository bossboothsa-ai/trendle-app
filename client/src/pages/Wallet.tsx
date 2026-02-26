import { useCurrentUser, useTransactions, useCashouts } from "@/hooks/use-trendle";
import {
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet as WalletIcon,
    History,
    TrendingUp,
    Gift,
    CircleUser,
    Banknote,
    Clock,
    CheckCircle2,
    XCircle,
    CreditCard,
    PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { CashoutFlow } from "@/components/CashoutFlow";

export default function Wallet() {
    const { data: user } = useCurrentUser();
    const { data: transactions, isLoading: isTransactionsLoading } = useTransactions();
    const { data: cashouts } = useCashouts();
    const [isCashoutOpen, setIsCashoutOpen] = useState(false);

    // Conversion: 100 points = R10 (Approx $0.50)
    const estimatedValue = ((user?.points || 0) / 10).toFixed(2);

    return (
        <div className="min-h-screen bg-[#F8F9FC] pb-24">
            {/* Premium Header */}
            <div className="bg-gradient-to-br from-primary to-accent text-white p-6 pb-20 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <WalletIcon className="w-5 h-5" />
                        </div>
                        <h1 className="font-display font-bold text-xl tracking-tight">My Wallet</h1>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md"
                        onClick={() => window.location.href = "/rewards"}
                    >
                        <Gift className="w-5 h-5 text-white" />
                    </Button>
                </div>

                <div className="relative z-10 text-center">
                    <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wider">Available Balance</p>
                    <div className="text-6xl font-display font-extrabold flex items-center justify-center gap-3 mb-2">
                        {user?.points || 0}
                        <span className="text-xl font-medium opacity-60">pts</span>
                    </div>
                    <p className="text-white/90 text-lg font-semibold bg-white/10 inline-block px-5 py-2 rounded-full backdrop-blur-md border border-white/20">
                        ≈ R {estimatedValue} Value
                    </p>
                </div>
            </div>

            <div className="px-4 -mt-10 relative z-20">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCashoutOpen(true)}
                        className="bg-white rounded-3xl p-6 shadow-lg shadow-primary/5 flex flex-col items-center gap-3 border border-border/50 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Banknote className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm text-foreground">Cash Out</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = "/rewards"}
                        className="bg-white rounded-3xl p-6 shadow-lg shadow-accent/5 flex flex-col items-center gap-3 border border-border/50 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                            <Gift className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm text-foreground">Redeem</span>
                    </motion.button>
                </div>

                {/* Stats Row */}
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-border/50 flex items-center justify-around mb-8">
                    <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Lifetime</p>
                        <p className="font-display font-bold text-lg text-primary">12,450</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Redeemed</p>
                        <p className="font-display font-bold text-lg text-accent">8,200</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Rank</p>
                        <p className="font-display font-bold text-lg text-foreground">Top 5%</p>
                    </div>
                </div>

                {/* History Tabs */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="font-display font-bold text-xl">History</h2>
                        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">View All</Button>
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="w-full bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-border/50 h-11">
                            <TabsTrigger value="all" className="flex-1 rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
                            <TabsTrigger value="earned" className="flex-1 rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Earned</TabsTrigger>
                            <TabsTrigger value="redeemed" className="flex-1 rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Redeemed</TabsTrigger>
                            <TabsTrigger value="cashout" className="flex-1 rounded-xl text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Payouts</TabsTrigger>
                        </TabsList>

                        <div className="mt-4 space-y-3">
                            {isTransactionsLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-16 bg-muted animate-pulse rounded-2xl" />
                                ))
                            ) : (
                                <TabsContent value="all" className="m-0 space-y-3">
                                    {transactions?.map((tx: any) => (
                                        <TransactionItem key={tx.id} tx={tx} />
                                    ))}
                                    {(!transactions || transactions.length === 0) && <EmptyHistory />}
                                </TabsContent>
                            )}
                            {/* Other tab contents filtered client-side for simplicity in mock */}
                            <TabsContent value="earned" className="m-0 space-y-3">
                                {transactions?.filter((tx: any) => tx.type === 'earned').map((tx: any) => (
                                    <TransactionItem key={tx.id} tx={tx} />
                                ))}
                            </TabsContent>
                            <TabsContent value="redeemed" className="m-0 space-y-3">
                                {transactions?.filter((tx: any) => tx.type === 'redeemed').map((tx: any) => (
                                    <TransactionItem key={tx.id} tx={tx} />
                                ))}
                            </TabsContent>
                            <TabsContent value="cashout" className="m-0 space-y-3">
                                {transactions?.filter((tx: any) => tx.type === 'cashout').map((tx: any) => (
                                    <TransactionItem key={tx.id} tx={tx} />
                                ))}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>

            <CashoutFlow open={isCashoutOpen} onOpenChange={setIsCashoutOpen} />        </div>
    );
}

function TransactionItem({ tx }: { tx: any }) {
    const isPositive = tx.type === 'earned';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    tx.type === 'earned' ? "bg-green-50 text-green-600" :
                        tx.type === 'cashout' ? "bg-blue-50 text-blue-600" :
                            "bg-accent/10 text-accent"
                )}>
                    {tx.type === 'earned' ? <ArrowDownLeft className="w-6 h-6" /> :
                        tx.type === 'cashout' ? <Banknote className="w-6 h-6" /> :
                            <Gift className="w-6 h-6" />}
                </div>
                <div>
                    <p className="font-bold text-sm tracking-tight">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground font-medium">{format(new Date(tx.date), 'MMM d, h:mm a')}</span>
                        <span className={cn(
                            "text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md",
                            tx.status === 'completed' ? "bg-green-100 text-green-700" :
                                tx.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                                    "bg-red-100 text-red-700"
                        )}>
                            {tx.status}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cn(
                "font-display font-extrabold text-base",
                isPositive ? "text-green-600" : "text-foreground"
            )}>
                {isPositive ? "+" : "-"}{tx.amount}
            </div>
        </motion.div>
    );
}

function EmptyHistory() {
    return (
        <div className="text-center py-6 px-4">
            <p className="font-bold text-muted-foreground mb-6 text-sm">
                Earn points by visiting places and completing moments.
            </p>
            
            <div className="grid gap-3 text-left">
                {/* Airtime Placeholder */}
                <div className="reward-card rounded-2xl p-4 flex items-center justify-between opacity-80 backdrop-blur-sm grayscale-[30%] pointer-events-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <PhoneCall className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">Airtime & Data</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Unlocks at 500 pts</p>
                        </div>
                    </div>
                </div>

                {/* Cash Rewards Placeholder */}
                <div className="reward-card rounded-2xl p-4 flex items-center justify-between opacity-80 backdrop-blur-sm grayscale-[30%] pointer-events-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">Cash Rewards</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Unlocks at 1000 pts</p>
                        </div>
                    </div>
                </div>

                {/* Venue Discounts Placeholder */}
                <div className="reward-card rounded-2xl p-4 flex items-center justify-between opacity-80 backdrop-blur-sm grayscale-[30%] pointer-events-none">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">Venue Discounts</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Unlocks at 250 pts</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
