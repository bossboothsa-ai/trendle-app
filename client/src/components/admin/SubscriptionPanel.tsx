import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPanelProps {
    businessId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SubscriptionPanel({ businessId, open, onOpenChange }: SubscriptionPanelProps) {
    const { toast } = useToast();
    const [plan, setPlan] = useState("Pro");
    const [status, setStatus] = useState("Active");

    // In a real app, fetch subscription details by businessId here
    // useEffect(() => { if (businessId) fetch(...) }, [businessId]);

    const handleSave = () => {
        toast({ title: "Subscription Updated", description: "Changes have been saved successfully." });
        onOpenChange(false);
    };

    if (!businessId) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[500px] sm:w-[500px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Subscription Management</SheetTitle>
                    <SheetDescription>Manage plan, billing, and invoices for Business ID: #{businessId}</SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Current Status Card */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Current Status</p>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none mt-1">
                                {status.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-500">Next Billing</p>
                            <p className="font-semibold text-slate-900">Mar 01, 2026</p>
                        </div>
                    </div>

                    {/* Plan Selection */}
                    <div className="space-y-2">
                        <Label>Subscription Plan</Label>
                        <Select value={plan} onValueChange={setPlan}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Basic">
                                    <div className="flex justify-between w-full items-center mr-2">
                                        <span>Basic Plan</span>
                                        <span className="text-slate-400 text-xs">R450/m</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="Pro">
                                    <div className="flex justify-between w-full items-center mr-2">
                                        <span>Pro Plan</span>
                                        <span className="text-slate-400 text-xs">R950/m</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="Enterprise">
                                    <div className="flex justify-between w-full items-center mr-2">
                                        <span>Enterprise</span>
                                        <span className="text-slate-400 text-xs">R2,500/m</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Billing Details */}
                    <div className="space-y-2">
                        <Label>Billing Details</Label>
                        <div className="bg-slate-50 p-3 rounded-md border border-slate-100 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Billing Address</span>
                                <span className="text-sm font-medium text-slate-900 text-right">123 Main St, Cape Town</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Tax ID / VAT</span>
                                <span className="text-sm font-medium text-slate-900 text-right">491029384</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Contact Email</span>
                                <span className="text-sm font-medium text-slate-900 text-right">accounts@business.com</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <span>Invoice Method</span>
                                <span className="flex items-center gap-1"><FileIcon className="w-3 h-3" /> Manual Invoice</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Invoices List */}
                    <div>
                        <h4 className="font-medium text-sm text-slate-900 mb-3">Recent Invoices</h4>
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors text-sm">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="w-4 h-4 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-700">INV-2026-00{i}</p>
                                            <p className="text-xs text-slate-500">Feb 01, 2026 • R950.00</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100">Paid</Badge>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-8">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button onClick={handleSave} className="bg-slate-900 text-white">Save Changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function FileIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
    )
}
