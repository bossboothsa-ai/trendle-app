import { useState } from "react";
import { useRequestCashout, useCurrentUser } from "@/hooks/use-trendle";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Banknote,
    Smartphone,
    PhoneCall,
    ChevronRight,
    AlertCircle,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CashoutFlowProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Step = "method" | "details" | "confirm" | "success";
type Method = "bank" | "mobile" | "airtime";

export function CashoutFlow({ open, onOpenChange }: CashoutFlowProps) {
    const [step, setStep] = useState<Step>("method");
    const [method, setMethod] = useState<Method | null>(null);
    const [amount, setAmount] = useState<string>("500");
    const [details, setDetails] = useState({
        accountName: "",
        accountNumber: "",
        bankName: "",
        mobileNumber: "",
        network: ""
    });

    const { data: user } = useCurrentUser();
    const cashout = useRequestCashout();

    const minThreshold = 500;
    const canAfford = (user?.points || 0) >= parseInt(amount);
    const isValidAmount = parseInt(amount) >= minThreshold;

    const reset = () => {
        setStep("method");
        setMethod(null);
    };

    const handleMethodSelect = (m: Method) => {
        setMethod(m);
        setStep("details");
    };

    const handleNext = () => {
        if (step === "details") setStep("confirm");
    };

    const handleSubmit = () => {
        if (!method) return;
        cashout.mutate({
            amount: parseInt(amount),
            type: method,
            details: details
        }, {
            onSuccess: () => setStep("success")
        });
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setTimeout(reset, 500);
        }}>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary p-6 text-white relative">
                    <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full blur-2xl flex items-center justify-center -translate-y-1/2 translate-x-1/2" />
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display font-bold">Withdraw Rewards</DialogTitle>
                        <DialogDescription className="text-white/70">
                            Direct payout to your wallet or bank
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === "method" && (
                            <motion.div
                                key="method"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <p className="text-sm font-bold text-foreground mb-2">Select Payout Method</p>
                                <MethodButton
                                    icon={<Banknote />}
                                    title="Bank Transfer"
                                    description="3-5 Business Days"
                                    onClick={() => handleMethodSelect("bank")}
                                />
                                <MethodButton
                                    icon={<Smartphone />}
                                    title="Mobile Money"
                                    description="Instant Payout"
                                    onClick={() => handleMethodSelect("mobile")}
                                />
                                <MethodButton
                                    icon={<PhoneCall />}
                                    title="Airtime Top-up"
                                    description="Instant Recharge"
                                    onClick={() => handleMethodSelect("airtime")}
                                />
                                <div className="mt-6 p-4 bg-muted rounded-2xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        A minimum of <span className="font-bold">{minThreshold} points</span> is required for any cashout request. Processing fees may apply.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === "details" && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="font-bold flex justify-between">
                                        Amount to Cash Out
                                        <span className="text-primary font-display">{amount} pts</span>
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="rounded-xl h-12 border-border/50 focus:ring-primary shadow-sm"
                                    />
                                    {!canAfford && (
                                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3 h-3" /> Insufficient balance (Available: {user?.points})
                                        </p>
                                    )}
                                    {!isValidAmount && (
                                        <p className="text-[10px] text-orange-500 font-bold flex items-center gap-1 mt-1">
                                            <AlertCircle className="w-3 h-3" /> Minimum cashout is {minThreshold} pts
                                        </p>
                                    )}
                                </div>

                                {method === "bank" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Bank Name</Label>
                                            <Input
                                                placeholder="e.g. Standard Bank"
                                                value={details.bankName}
                                                onChange={(e) => setDetails({ ...details, bankName: e.target.value })}
                                                className="rounded-xl h-11 border-border/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">Account Number</Label>
                                            <Input
                                                placeholder="10-digit number"
                                                value={details.accountNumber}
                                                onChange={(e) => setDetails({ ...details, accountNumber: e.target.value })}
                                                className="rounded-xl h-11 border-border/50"
                                            />
                                        </div>
                                    </div>
                                )}

                                {(method === "mobile" || method === "airtime") && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Phone Number</Label>
                                            <Input
                                                placeholder="e.g. +27 82 123 4567"
                                                value={details.mobileNumber}
                                                onChange={(e) => setDetails({ ...details, mobileNumber: e.target.value })}
                                                className="rounded-xl h-11 border-border/50"
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    className="w-full h-12 rounded-xl mt-4 font-bold"
                                    disabled={!canAfford || !isValidAmount}
                                    onClick={handleNext}
                                >
                                    Review Request <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setStep("method")}>
                                    Back to methods
                                </Button>
                            </motion.div>
                        )}

                        {step === "confirm" && (
                            <motion.div
                                key="confirm"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 text-center"
                            >
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <Banknote className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-xl">Confirm Payout</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        You are requesting to withdraw <span className="font-bold text-foreground">{amount} points</span> (≈ R {parseInt(amount) / 10}) via <span className="font-bold text-foreground capitalize">{method}</span>.
                                    </p>
                                </div>
                                <div className="bg-muted p-4 rounded-2xl text-left space-y-2">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Details</p>
                                    <p className="text-sm font-bold">
                                        {method === "bank" ? `${details.bankName} - ${details.accountNumber}` : details.mobileNumber}
                                    </p>
                                </div>
                                <Button
                                    className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
                                    onClick={handleSubmit}
                                    disabled={cashout.isPending}
                                >
                                    {cashout.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Confirm & Send"}
                                </Button>
                                <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setStep("details")}>
                                    Change Details
                                </Button>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 text-center py-4"
                            >
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-2xl">Awesome!</h3>
                                    <p className="text-sm text-muted-foreground mt-2 px-6">
                                        Your payout request has been received. You'll receive a notification once it's approved.
                                    </p>
                                </div>
                                <Button
                                    className="w-full h-12 rounded-xl mt-4 font-bold"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Back to Wallet
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MethodButton({ icon, title, description, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group group-active:scale-95 shadow-sm shadow-black/5"
        >
            <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors flex items-center justify-center">
                {icon}
            </div>
            <div className="text-left flex-1">
                <p className="font-bold text-sm tracking-tight">{title}</p>
                <p className="text-xs text-muted-foreground font-medium">{description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
    );
}
