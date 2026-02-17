import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";

interface CreateBusinessSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateBusinessSheet({ open, onOpenChange }: CreateBusinessSheetProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("info");

    const [formData, setFormData] = useState({
        // Business Info
        businessName: "",
        category: "Restaurant",
        city: "Cape Town",
        address: "",
        phone: "",
        contactEmail: "",
        // Account Setup
        loginEmail: "",
        password: "", // Auto-generated ideal
        sendWelcomeEmail: true,
        // Subscription
        plan: "Pro",
        monthlyFee: 950,
        invoiceDueDays: 7,
        gracePeriod: 48,
        // Activation
        status: "active"
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch("/api/admin/businesses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to create business");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/businesses"] });
            toast({ title: "Business Created", description: "Account setup and welcome email sent." });
            onOpenChange(false);
            // Reset form
            setFormData({
                businessName: "", category: "Restaurant", city: "Cape Town", address: "", phone: "", contactEmail: "",
                loginEmail: "", password: "", sendWelcomeEmail: true,
                plan: "Pro", monthlyFee: 950, invoiceDueDays: 7, gracePeriod: 48, status: "active"
            });
            setActiveTab("info");
        }
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-update fee based on plan
            if (field === "plan") {
                if (value === "Basic") newData.monthlyFee = 450;
                if (value === "Pro") newData.monthlyFee = 950;
                if (value === "Enterprise") newData.monthlyFee = 2500;
            }
            return newData;
        });
    };

    const handleNext = () => {
        if (activeTab === "info") setActiveTab("account");
        else if (activeTab === "account") setActiveTab("subscription");
        else if (activeTab === "subscription") setActiveTab("activation");
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[600px] sm:w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Create New Business</SheetTitle>
                    <SheetDescription>Set up a new venue partner, account, and subscription.</SheetDescription>
                </SheetHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="subscription">Billing</TabsTrigger>
                        <TabsTrigger value="activation">Finish</TabsTrigger>
                    </TabsList>

                    {/* === STEP 1: BUSINESS INFO === */}
                    <TabsContent value="info" className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Business Name</Label>
                            <Input value={formData.businessName} onChange={e => handleChange("businessName", e.target.value)} placeholder="e.g. The Grind Coffee" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <Select value={formData.category} onValueChange={v => handleChange("category", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                                        <SelectItem value="Cafe">Cafe</SelectItem>
                                        <SelectItem value="Bar">Bar</SelectItem>
                                        <SelectItem value="Nightlife">Nightlife</SelectItem>
                                        <SelectItem value="Retail">Retail</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>City</Label>
                                <Select value={formData.city} onValueChange={v => handleChange("city", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cape Town">Cape Town</SelectItem>
                                        <SelectItem value="Johannesburg">Johannesburg</SelectItem>
                                        <SelectItem value="Durban">Durban</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Address</Label>
                            <Input value={formData.address} onChange={e => handleChange("address", e.target.value)} placeholder="Street address" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Contact Email</Label>
                                <Input value={formData.contactEmail} onChange={e => handleChange("contactEmail", e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
                            </div>
                        </div>
                        <Button className="w-full mt-4" onClick={handleNext}>Next: Account Setup</Button>
                    </TabsContent>

                    {/* === STEP 2: ACCOUNT SETUP === */}
                    <TabsContent value="account" className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Login Email (Username)</Label>
                            <Input value={formData.loginEmail} onChange={e => handleChange("loginEmail", e.target.value)} placeholder="admin@venue.com" />
                            <p className="text-xs text-slate-500">This will be used for the Business Portal login.</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>Temporary Password</Label>
                            <div className="flex gap-2">
                                <Input value={formData.password} onChange={e => handleChange("password", e.target.value)} type="text" placeholder="Auto-generated" />
                                <Button variant="outline" onClick={() => handleChange("password", Math.random().toString(36).slice(-8))}>Generate</Button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <input type="checkbox" id="welcome" checked={formData.sendWelcomeEmail} onChange={e => handleChange("sendWelcomeEmail", e.target.checked)} className="rounded border-slate-300" />
                            <Label htmlFor="welcome">Send Welcome Email with credentials</Label>
                        </div>
                        <Button className="w-full mt-4" onClick={handleNext}>Next: Subscription</Button>
                    </TabsContent>

                    {/* === STEP 3: SUBSCRIPTION === */}
                    <TabsContent value="subscription" className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Subscription Plan</Label>
                            <Select value={formData.plan} onValueChange={v => handleChange("plan", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic (R450/m)</SelectItem>
                                    <SelectItem value="Pro">Pro (R950/m)</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise (R2500/m)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Monthly Fee (ZAR)</Label>
                                <Input type="number" value={formData.monthlyFee} onChange={e => handleChange("monthlyFee", parseInt(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Due Days</Label>
                                <Input type="number" value={formData.invoiceDueDays} onChange={e => handleChange("invoiceDueDays", parseInt(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Grace (Hours)</Label>
                                <Input type="number" value={formData.gracePeriod} onChange={e => handleChange("gracePeriod", parseInt(e.target.value))} />
                            </div>
                        </div>
                        <Separator />
                        <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-600">
                            <p><strong>First Invoice:</strong> Will be generated automatically upon activation.</p>
                            <p><strong>Cycle:</strong> Monthly from today.</p>
                        </div>
                        <Button className="w-full mt-4" onClick={handleNext}>Next: Activation</Button>
                    </TabsContent>

                    {/* === STEP 4: ACTIVATION === */}
                    <TabsContent value="activation" className="space-y-4 py-4">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Initial Status</Label>
                                <Select value={formData.status} onValueChange={v => handleChange("status", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active Immediately</SelectItem>
                                        <SelectItem value="draft">Save as Draft (No Login)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>Creating venue: <strong>{formData.businessName || "Untitled"}</strong></li>
                                    <li>Account: <strong>{formData.loginEmail || "No email"}</strong></li>
                                    <li>Plan: <strong>{formData.plan} @ R{formData.monthlyFee}</strong></li>
                                    <li>Status: <strong>{formData.status.toUpperCase()}</strong></li>
                                </ul>
                            </div>

                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                                onClick={() => createMutation.mutate(formData)}
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                                Create Business
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
