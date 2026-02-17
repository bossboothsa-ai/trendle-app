import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BusinessLayout from "@/layouts/BusinessLayout";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Building2,
    Mail,
    Lock,
    Save,
    Bell,
    Settings as SettingsIcon,
    Calendar,
    Users,
    ShieldCheck,
    CreditCard,
    ChevronRight,
    HelpCircle,
    Info,
    Camera,
    Image as ImageIcon,
    Clock,
    Phone,
    MapPin,
    Trophy,
    BadgeCheck,
    LogOut,
    Eye,
    Smartphone,
    History,
    Shield,
    User,
    Building,
    Key,
    Activity,
    HelpCircle as QuestionCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BusinessAccount {
    id: number;
    email: string;
    businessName: string;
    category: string;
}

export default function Settings() {
    const [location, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const businessId = parseInt(localStorage.getItem("businessId") || "1");

    const { data: account, isLoading } = useQuery<BusinessAccount>({
        queryKey: [`/api/business/account/${businessId}`],
        enabled: !!businessId,
    });

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        category: "",
        description: "The premier destination for specialty coffee and late-night creative sessions in the heart of De Waterkant.",
        phone: "+27 21 456 7890",
        address: "123 Waterkant Street, Cape Town",
    });

    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    useEffect(() => {
        if (account) {
            setFormData(prev => ({
                ...prev,
                businessName: account.businessName,
                email: account.email,
                category: account.category,
            }));
        }
    }, [account]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: Partial<BusinessAccount>) => {
            return apiRequest("PUT", `/api/business/account/${businessId}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/business/account/${businessId}`] });
            toast({ title: "Profile updated", description: "Your changes have been saved." });
            if (formData.businessName) {
                localStorage.setItem("businessName", formData.businessName);
            }
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
        }
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate({
            businessName: formData.businessName,
            category: formData.category
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("businessId");
        localStorage.removeItem("businessName");
        localStorage.removeItem("placeId");
        setLocation("/business/login");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-5xl mx-auto pb-20 animate-fade-in">
            {/* 1. PAGE HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-widest">
                        <SettingsIcon className="w-4 h-4" />
                        <span>Account & Venue Settings</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-1">{formData.businessName || "Ember & Oak Lounge"}</h2>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-5 h-5 text-blue-500" />
                                <span>Managed by <span className="text-gray-900">Emily R.</span> (Manager)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>Active Since: <span className="text-gray-900">Jan 13, 2026</span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => setIsPreviewOpen(true)}
                        className="flex-1 md:flex-none border-gray-200 rounded-2xl h-12 px-6 font-bold hover:bg-gray-50"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        View Public Profile
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Settings */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 2. BUSINESS PROFILE SECTION */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="pt-8 px-8 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl font-extrabold">Business Profile</CardTitle>
                            </div>
                            <CardDescription className="text-base font-medium text-gray-500">
                                This information appears on your public Trendle venue profile to help customers find and engage with you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <form onSubmit={handleSaveProfile} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessName" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Business Name</Label>
                                        <Input
                                            id="businessName"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-500/20 text-lg font-medium transition-all"
                                            placeholder="Venue name"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Venue Category</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[
                                                { id: "Coffee", label: "Coffee", icon: "☕", sub: "Cafes & Roasteries" },
                                                { id: "Restaurant", label: "Eat", icon: "🍕", sub: "Dining & Quick Bites" },
                                                { id: "Nightlife", label: "Drink", icon: "🍸", sub: "Bars & Social Clubs" },
                                                { id: "Experience", label: "Play", icon: "🎡", sub: "Active Entertainment" },
                                                { id: "Retail", label: "Shop", icon: "🛍️", sub: "Boutiques & Stores" },
                                                { id: "Beauty", label: "Glow", icon: "💅", sub: "Salons & Wellness" },
                                            ].map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                                    className={cn(
                                                        "flex flex-col items-start p-5 rounded-2xl border-2 transition-all gap-3 relative overflow-hidden",
                                                        formData.category === cat.id
                                                            ? "border-purple-600 bg-purple-50 text-purple-700 shadow-md shadow-purple-100 ring-2 ring-purple-600/10"
                                                            : "border-gray-100 bg-white text-gray-500 hover:border-purple-200 hover:bg-purple-50/10 hover:shadow-sm"
                                                    )}
                                                >
                                                    <span className="text-3xl">{cat.icon}</span>
                                                    <div className="text-left">
                                                        <span className="block text-sm font-black uppercase tracking-tight leading-none mb-1">{cat.label}</span>
                                                        <span className="block text-[10px] font-bold text-gray-400 leading-tight">{cat.sub}</span>
                                                    </div>
                                                    {formData.category === cat.id && (
                                                        <div className="absolute top-2 right-2">
                                                            <div className="bg-purple-600 rounded-full p-1 shadow-lg">
                                                                <Check className="w-2 h-2 text-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <Label htmlFor="description" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Public Description</Label>
                                        <span className="text-xs font-semibold text-gray-400">{formData.description.length}/160</span>
                                    </div>
                                    <Textarea
                                        id="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 160) })}
                                        className="rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-500/20 text-base font-medium resize-none p-4"
                                        placeholder="Tell customers what makes your venue special..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Contact Email</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                value={formData.email}
                                                disabled
                                                className="h-14 rounded-2xl bg-gray-100/50 border-transparent text-gray-500 pl-11 shadow-none"
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-help">
                                                            <Info className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="rounded-xl border-gray-100">
                                                        Email is locked for security. Contact support to update.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Phone Number (Optional)</Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white pl-11 font-medium"
                                                placeholder="+27 21..."
                                            />
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>



                                <div className="space-y-6">
                                    <Label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Venue Branding</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="group relative h-40 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30 hover:bg-purple-50/30 hover:border-purple-200 transition-all flex flex-col items-center justify-center cursor-pointer">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                <Camera className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">Upload Venue Logo</span>
                                            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Recommended: 512x512</span>
                                        </div>
                                        <div className="group relative h-40 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/30 hover:bg-blue-50/30 hover:border-blue-200 transition-all flex flex-col items-center justify-center cursor-pointer">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                <ImageIcon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600">Upload Cover Photo</span>
                                            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Recommended: 1200x400</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-2 mb-2 ml-1 text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Operating Hours</Label>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { day: 'Mon - Fri', hours: '07:00 - 22:00' },
                                            { day: 'Saturday', hours: '08:00 - 23:00' },
                                            { day: 'Sunday', hours: '10:00 - 20:00' },
                                            { day: 'Public Holidays', hours: 'Closed' }
                                        ].map((item) => (
                                            <button key={item.day} type="button" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all text-left">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">{item.day}</p>
                                                    <p className="font-bold text-gray-900">{item.hours}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        disabled={updateProfileMutation.isPending}
                                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl h-14 px-10 text-lg font-bold shadow-xl shadow-gray-200 transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
                                    >
                                        <Save className="mr-2 h-5 w-5" />
                                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* 3. NOTIFICATIONS SECTION */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="pt-8 px-8 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
                                    <Bell className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl font-extrabold">Notifications</CardTitle>
                            </div>
                            <CardDescription className="text-base font-medium text-gray-500">
                                Choose what alerts your team receives. Manage how Trendle keeps you informed about your venue's performance and customer activity.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 pt-4 space-y-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 ml-1 border-b border-gray-50 pb-2">
                                    <Smartphone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Activity Alerts</span>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { label: "New Moments", desc: "When customers tag your venue in a post", checked: true },
                                        { label: "Survey Responses", desc: "When you receive new feedback ratings", checked: true },
                                        { label: "Reward Redemptions", desc: "Real-time alerts for claimed perks", checked: true },
                                        { label: "Campaign Completions", desc: "When a daily task is successfully finished", checked: false },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 hover:bg-gray-50/80 transition-colors border border-transparent hover:border-pink-100">
                                            <div className="space-y-0.5">
                                                <Label className="text-lg font-bold text-gray-900">{item.label}</Label>
                                                <p className="text-sm font-medium text-gray-500">{item.desc}</p>
                                            </div>
                                            <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-pink-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 ml-1 border-b border-gray-50 pb-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Summary Reports</span>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { label: "Weekly Performance Summary", desc: "A comprehensive look at traffic and engagement", checked: true },
                                        { label: "Monthly Promotion Overview", desc: "Detailed breakdown of promotion impact and costs", checked: true },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 hover:bg-gray-50/80 transition-colors border border-transparent hover:border-blue-100">
                                            <div className="space-y-0.5">
                                                <Label className="text-lg font-bold text-gray-900">{item.label}</Label>
                                                <p className="text-sm font-medium text-gray-500">{item.desc}</p>
                                            </div>
                                            <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-blue-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Secondary Settings */}
                <div className="space-y-8">



                    {/* 4. SECURITY SECTION */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="pt-8 px-8 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl font-extrabold">Security</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 pt-4 space-y-8">
                            <div className="space-y-4">
                                <div className="p-5 border border-gray-100 rounded-[2rem] bg-gray-50/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900">Password</h4>
                                        <ShieldCheck className="w-4 h-4 text-gray-300" />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Last changed 3 months ago</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="w-full rounded-xl border-gray-200 font-bold hover:bg-white bg-white text-sm shadow-none"
                                    >
                                        Change Password
                                    </Button>
                                </div>

                                <div className="p-5 border border-gray-100 rounded-[2rem] bg-gray-50/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900">Two-Factor Auth</h4>
                                        <Badge className="bg-gray-200 text-gray-600 border-none px-2 rounded-md font-bold text-[10px]">NOT ENABLED</Badge>
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 mb-4">Add an extra layer of protection to your account.</p>
                                    <Button variant="outline" className="w-full rounded-xl border-gray-200 font-bold hover:bg-white bg-white text-sm shadow-none">
                                        Enable 2FA
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2 ml-1">
                                    <History className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Session Activity</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-50/50 border border-green-100">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">Chrome – Cape Town</p>
                                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Active Now</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 opacity-60">
                                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-500 truncate">Safari – London</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">2 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sign Out Action */}
                    <div className="grid gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDocModalOpen(true)}
                            className="h-16 rounded-[2rem] border-gray-100 text-blue-600 hover:bg-blue-50/50 font-bold transition-all flex items-center justify-center gap-2 shadow-none"
                        >
                            <HelpCircle className="w-5 h-5" />
                            Browse Documentation
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="h-16 rounded-[2rem] bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out of Venue
                        </Button>
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[3rem] bg-transparent shadow-none">
                    <div className="relative h-[80vh] flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />
                        <div className="w-full h-full max-w-[340px] border-[8px] border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl bg-white relative">
                            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 z-20 flex justify-center">
                                <div className="w-24 h-4 bg-black rounded-b-xl"></div>
                            </div>

                            <div className="h-full overflow-y-auto no-scrollbar pt-10 pb-12">
                                <div className="relative h-48 bg-gray-100">
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                        <ImageIcon className="w-12 h-12 opacity-30" />
                                    </div>
                                    <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-3xl shadow-lg">
                                        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic">
                                            {formData.businessName.charAt(0)}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-14 px-6 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{formData.businessName}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-purple-100 text-purple-700 border-none rounded-lg text-[10px] font-black uppercase">
                                                {formData.category || 'Venue'}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                                <MapPin className="w-3 h-3" />
                                                <span>1.2km away</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium text-gray-500 leading-relaxed italic border-l-2 border-purple-100 pl-4">
                                        "{formData.description}"
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Points</p>
                                            <p className="text-xl font-black text-gray-900">1,200</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Active Deals</p>
                                            <p className="text-xl font-black text-gray-900">4</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Active Rewards</h4>
                                        {[1, 2].map(i => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-gray-900 uppercase">Season Special Reward</p>
                                                    <p className="text-[10px] font-bold text-gray-400">150 Points required</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-50 px-6 flex items-center justify-between">
                                <div className="h-2 w-12 bg-gray-100 rounded-full mx-auto" />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* PASSWORD CHANGE MODAL */}
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none bg-white shadow-2xl">
                    <DialogHeader className="mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase italic text-gray-900">Security Update</DialogTitle>
                        <DialogDescription className="font-bold text-gray-400">Update your venue's dashboard password.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Current Password</Label>
                            <Input
                                type="password"
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-blue-500/20"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">New Password</Label>
                            <Input
                                type="password"
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-blue-500/20"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirm Password</Label>
                            <Input
                                type="password"
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-blue-500/20"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex-col sm:flex-col gap-3">
                        <Button
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-2xl h-14 font-black uppercase italic shadow-xl shadow-gray-200"
                            onClick={() => {
                                if (passwordData.new !== passwordData.confirm) {
                                    toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
                                    return;
                                }
                                if (passwordData.new.length < 8) {
                                    toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" });
                                    return;
                                }
                                toast({ title: "Success", description: "Password updated successfully." });
                                setIsPasswordModalOpen(false);
                            }}
                        >
                            Update Password
                        </Button>
                        <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)} className="w-full font-bold text-gray-400">Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DOCUMENTATION MODAL */}
            <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 border-none bg-white shadow-2xl overflow-hidden">
                    <div className="bg-blue-600 p-8 text-white relative">
                        <HelpCircle className="w-24 h-24 absolute -right-4 -bottom-4 opacity-10" />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Business Guide</h2>
                        <p className="font-bold opacity-80 text-blue-100">Mastering your Trendle Venue dashboard</p>
                    </div>

                    <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar space-y-10">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-amber-500" />
                                <h3 className="text-xl font-black text-gray-900">How rewards work</h3>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Rewards are the primary driver of repeat visits. When customers earn enough points through check-ins and moments, they can claim active rewards. Ensure your staff is briefed on how to "confirm" a redemption on the user's phone.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Activity className="w-6 h-6 text-purple-600" />
                                <h3 className="text-xl font-black text-gray-900">How surveys work</h3>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Use surveys to gather qualitative feedback. We recommend keeping surveys under 5 questions for maximum response rates. "Must Check-In" access ensures that only customers physically at your venue can leave feedback.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Smartphone className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-xl font-black text-gray-900">Security & Privacy</h3>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                All stats and metrics on your dashboard are verified via GPS and QR signals. Activity IDs enable you to lookup specific interactions for verification purposes.
                            </p>
                        </section>

                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <h4 className="font-black text-gray-900 mb-2 uppercase text-xs tracking-widest">Best Practice Pro Tip</h4>
                            <p className="text-sm font-bold text-gray-600 italic">
                                "Venues that respond to Moments by 'Liking' customer posts see a 40% increase in return visit frequency."
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <Button onClick={() => setIsDocModalOpen(false)} className="bg-gray-900 text-white rounded-2xl h-12 px-8 font-black uppercase italic">
                            Got it, thanks!
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Helper icons
function FileText(props: any) {
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
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
