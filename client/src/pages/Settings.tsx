import { useUser, useUpdateUser, usePointsHistory, useRedemptionHistory } from "@/hooks/use-trendle";
import { BottomNav } from "@/components/BottomNav";
import { ChevronRight, Bell, Shield, User as UserIcon, Award, LogOut, Info, Trash2, Mail, Lock, Clock, Gift, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
        <h3 className="px-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        <div className="bg-card border-y border-border/50 divide-y divide-border/30">
            {children}
        </div>
    </div>
);

const Item = ({ icon: Icon, label, value, onClick, danger }: any) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors text-left"
    >
        <div className="flex items-center gap-4">
            <div className={cn("p-2 rounded-xl", danger ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary")}>
                <Icon className="w-5 h-5" />
            </div>
            <span className={cn("font-medium", danger && "text-red-500")}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-sm text-muted-foreground">{value}</span>}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
    </button>
);

const ToggleItem = ({ icon: Icon, label, checked, onChange }: any) => (
    <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Icon className="w-5 h-5" />
            </div>
            <span className="font-medium">{label}</span>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} />
    </div>
);

export default function SettingsPage() {
    const { data: user } = useUser();
    const updateUser = useUpdateUser();
    const { data: pointsHistory } = usePointsHistory();
    const { data: redemptions } = useRedemptionHistory();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const [viewHistory, setViewHistory] = useState<'points' | 'rewards' | null>(null);
    const [viewContent, setViewContent] = useState<'points-info' | 'help' | 'privacy' | null>(null);

    // Email Edit State
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");

    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    // Privacy Select State
    const [privacySelect, setPrivacySelect] = useState<'moments' | 'comments' | null>(null);

    const handleUpdateEmail = () => {
        if (!newEmail || !newEmail.includes("@")) {
            toast({ title: "Invalid email", variant: "destructive" });
            return;
        }
        updateUser.mutate({ id: user!.id, data: { email: newEmail } }, {
            onSuccess: () => {
                setIsEmailModalOpen(false);
                toast({ title: "Verification required for new email", description: "Please check your inbox." });
            }
        });
    };

    const handleUpdatePassword = () => {
        if (passwordData.new.length < 8) {
            toast({ title: "Value too short", description: "Password must be at least 8 characters.", variant: "destructive" });
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            toast({ title: "Passwords mismatch", description: "New password and confirmation do not match.", variant: "destructive" });
            return;
        }

        // Mocking a successful password update
        toast({ title: "Password updated successfully" });
        setIsPasswordModalOpen(false);
        setPasswordData({ current: "", new: "", confirm: "" });
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 p-4 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                    <ChevronRight className="w-6 h-6 rotate-180" />
                </Button>
                <h1 className="font-display font-bold text-xl">Settings</h1>
            </header>

            <main className="py-6">
                <Section title="Account">
                    <Item
                        icon={Mail}
                        label="Email"
                        value={user?.email}
                        onClick={() => {
                            setNewEmail(user?.email || "");
                            setIsEmailModalOpen(true);
                        }}
                    />
                    <Item
                        icon={Lock}
                        label="Change Password"
                        onClick={() => setIsPasswordModalOpen(true)}
                    />
                    <Item icon={LogOut} label="Log Out" danger onClick={() => setLocation("/")} />
                    <Item icon={Trash2} label="Delete Account" danger onClick={() => toast({ title: "Coming soon", description: "Account deletion is being implemented." })} />
                </Section>

                <Section title="Notifications">
                    <ToggleItem
                        icon={Bell}
                        label="Likes"
                        checked={user?.notificationSettings?.likes}
                        onChange={(chk: boolean) => updateUser.mutate({ id: user!.id, data: { notificationSettings: { ...user!.notificationSettings, likes: chk } } })}
                    />
                    <ToggleItem
                        icon={Bell}
                        label="Comments"
                        checked={user?.notificationSettings?.comments}
                        onChange={(chk: boolean) => updateUser.mutate({ id: user!.id, data: { notificationSettings: { ...user!.notificationSettings, comments: chk } } })}
                    />
                    <ToggleItem
                        icon={Bell}
                        label="Follows"
                        checked={user?.notificationSettings?.follows}
                        onChange={(chk: boolean) => updateUser.mutate({ id: user!.id, data: { notificationSettings: { ...user!.notificationSettings, follows: chk } } })}
                    />
                </Section>

                <Section title="Privacy">
                    <div className="px-6 py-4 flex flex-col gap-1">
                        <Label className="text-sm font-medium">Who can see my profile</Label>
                        <div className="flex gap-2 mt-2">
                            {['Public', 'Private'].map((option) => (
                                <Button
                                    key={option}
                                    variant={user?.isPrivate === (option === 'Private') ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full h-8 text-xs px-4"
                                    onClick={() => updateUser.mutate({ id: user!.id, data: { isPrivate: option === 'Private' } })}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Item
                        icon={Shield}
                        label="Who can see my moments"
                        value={user?.privacySettings?.canSeeMoments}
                        onClick={() => setPrivacySelect('moments')}
                    />

                    <Item
                        icon={Shield}
                        label="Who can see my comments"
                        value={user?.privacySettings?.canComment}
                        onClick={() => setPrivacySelect('comments')}
                    />

                    <ToggleItem
                        icon={Award}
                        label="Show my points publicly"
                        checked={user?.privacySettings?.showPoints}
                        onChange={(chk: boolean) => updateUser.mutate({ id: user!.id, data: { privacySettings: { ...user!.privacySettings, showPoints: chk } } })}
                    />
                </Section>

                <Section title="Rewards & Points">
                    <Item icon={Award} label="Points History" onClick={() => setViewHistory('points')} />
                    <Item icon={Gift} label="Redemption History" onClick={() => setViewHistory('rewards')} />
                </Section>

                <Section title="About Trendle">
                    <Item icon={Info} label="How points work" onClick={() => setViewContent('points-info')} />
                    <Item icon={Info} label="Help & Support" onClick={() => setViewContent('help')} />
                    <Item icon={Info} label="Terms & Privacy" onClick={() => setViewContent('privacy')} />
                </Section>
            </main>

            <Dialog open={!!viewHistory} onOpenChange={(open) => !open && setViewHistory(null)}>
                <DialogContent className="sm:max-w-md bg-background border-none shadow-2xl rounded-3xl h-[60vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-border/50">
                        <DialogTitle className="font-display text-xl">
                            {viewHistory === 'points' ? "Points History" : "Redemption History"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {viewHistory === 'points' ? (
                            pointsHistory?.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold">{item.reason}</div>
                                            <div className="text-xs text-muted-foreground">{format(new Date(item.createdAt), 'MMM d, h:mm a')}</div>
                                        </div>
                                    </div>
                                    <div className="font-display font-bold text-primary">+{item.amount}</div>
                                </div>
                            ))
                        ) : (
                            redemptions?.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <Gift className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold">{item.reward.title}</div>
                                            <div className="text-xs text-muted-foreground">{format(new Date(item.redeemedAt), 'MMM d, yyyy')}</div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            ))
                        )}
                        {((viewHistory === 'points' && pointsHistory?.length === 0) || (viewHistory === 'rewards' && redemptions?.length === 0)) && (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No history yet.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!viewContent} onOpenChange={(open) => !open && setViewContent(null)}>
                <DialogContent className="sm:max-w-2xl bg-background border-none shadow-2xl rounded-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-border/50">
                        <DialogTitle className="font-display text-xl">
                            {viewContent === 'points-info' ? "How Points Work" :
                                viewContent === 'help' ? "Help & Support" : "Terms & Privacy"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 text-sm leading-relaxed">
                        {viewContent === 'points-info' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold mb-2">What are Trendle Points?</h4>
                                    <p className="text-muted-foreground">Trendle points are our way of rewarding you for exploring Cape Town, sharing your experiences, and growing our creator community. The more active you are, the more you earn!</p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold mb-3">How to Earn</h4>
                                    <div className="overflow-hidden rounded-2xl border border-border/50">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-muted/50 text-xs font-bold uppercase">
                                                    <th className="p-3">Activity</th>
                                                    <th className="p-3">Points</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/30">
                                                <tr><td className="p-3 font-medium">Check in at partner location</td><td className="p-3 text-primary">+50</td></tr>
                                                <tr><td className="p-3 font-medium">Post a moment/photo</td><td className="p-3 text-primary">+40</td></tr>
                                                <tr><td className="p-3 font-medium">Add a meaningful caption</td><td className="p-3 text-primary">+15</td></tr>
                                                <tr><td className="p-3 font-medium">Follow a new creator</td><td className="p-3 text-primary">+5</td></tr>
                                                <tr><td className="p-3 font-medium">Like a post</td><td className="p-3 text-primary">+1</td></tr>
                                                <tr><td className="p-3 font-medium">Comment on a post</td><td className="p-3 text-primary">+1</td></tr>
                                                <tr><td className="p-3 font-medium">Daily app check-in</td><td className="p-3 text-primary">+10</td></tr>
                                                <tr><td className="p-3 font-medium">Refer a friend</td><td className="p-3 text-primary">+100</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">* Daily caps apply to likes and comments to maintain community quality.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                                        <div className="font-bold text-slate-500">Silver</div>
                                        <div className="text-[10px] text-muted-foreground">Standard Rewards</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                                        <div className="font-bold text-amber-600">Gold</div>
                                        <div className="text-[10px] text-muted-foreground">Premium Perks</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                                        <div className="font-bold text-indigo-600">Platinum</div>
                                        <div className="text-[10px] text-muted-foreground">Exclusive Events</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold mb-2">Redimere Your Rewards</h4>
                                    <p className="text-muted-foreground mb-4">You can use your points for a wide variety of local treasures in our Rewards shop:</p>
                                    <ul className="grid grid-cols-2 gap-2 text-xs font-medium">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Specialty Coffees</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Sunset Drinks</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Dining Discounts</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Data & Airtime</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Cash Redemptions</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> VIP Experiences</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                    <h5 className="font-bold text-primary mb-1">Fair Use Policy</h5>
                                    <p className="text-xs text-muted-foreground">To keep Trendle fair for everyone, we use automated systems to prevent spamming and point abuse. Users attempting to manipulate the system may have their points revoked or accounts suspended.</p>
                                </div>
                            </div>
                        )}

                        {viewContent === 'help' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold mb-2">What is Trendle?</h4>
                                    <p className="text-muted-foreground">Trendle is Cape Town's premier social creator app. We connect locals and travelers with the best hidden gems in the city while rewarding you for being a part of the community.</p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold">Frequently Asked Questions</h4>

                                    <div className="space-y-2">
                                        <div className="font-bold">How do I earn points?</div>
                                        <div className="text-muted-foreground">Engage with the app! Check into places, post photos, follow other creators, and complete daily tasks. Check 'How Points Work' for a full breakdown.</div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="font-bold">Why didn't I get my points?</div>
                                        <div className="text-muted-foreground">Points can take up to 5 minutes to reflect. Ensure your GPS is on for check-ins, and that your post meets our community guidelines.</div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="font-bold">How do I redeem rewards?</div>
                                        <div className="text-muted-foreground">Navigate to the 'Rewards' tab to browse available offers. Select one, follow the redemption steps, and show your code to the partner merchant.</div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="font-bold">Can I change my interests?</div>
                                        <div className="text-muted-foreground">Yes! Go to Profile &gt; Edit Profile and select the tags that reflect your current vibe. Your feed will automatically adjust.</div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-primary text-primary-foreground text-center">
                                    <p className="mb-2 opacity-90">Still need help?</p>
                                    <a href="mailto:support@trendle.app" className="text-xl font-display font-bold underline decoration-2 underline-offset-4">support@trendle.app</a>
                                </div>
                            </div>
                        )}

                        {viewContent === 'privacy' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold mb-2">Our Mission</h4>
                                    <p className="text-muted-foreground">Trendle exists to celebrate creativity and local exploration. We believe in high-trust communities where creators are rewarded for their influence and discovery.</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-bold">Content Ownership</h4>
                                    <p className="text-muted-foreground">You own everything you create. By posting on Trendle, you grant us a license to display your content within the app and on our community channels to showcase your talent.</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-bold">Points & Rewards Disclaimer</h4>
                                    <p className="text-muted-foreground">Trendle points are virtual tokens with no direct cash value until successfully redeemed through authorized partners or our cash-out system. We reserve the right to adjust values as the platform evolves.</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-bold">Privacy Policy</h4>
                                    <p className="text-muted-foreground">We collect only what's necessary (location for check-ins, interests for your feed). Your personal data is never sold to third parties. Your privacy is protected by modern encryption.</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-bold">User Responsibility</h4>
                                    <p className="text-muted-foreground">Users are responsible for maintaining account safety and following our community guidelines. Be respectful, be local, and be you.</p>
                                </div>

                                <p className="text-xs text-muted-foreground pt-4 border-t border-border/50">Last Updated: February 2026. For privacy inquiries, contact <a href="mailto:privacy@trendle.app" className="underline">privacy@trendle.app</a>.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                <DialogContent className="sm:max-w-md bg-background border-none shadow-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Update Email</DialogTitle>
                        <DialogDescription>
                            Enter your new email address. You will need to verify it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateEmail} disabled={updateUser.isPending}>
                            {updateUser.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Update Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="sm:max-w-md bg-background border-none shadow-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current and new password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input
                                id="current"
                                type="password"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new">New Password</Label>
                            <Input
                                id="new"
                                type="password"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <Input
                                id="confirm"
                                type="password"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdatePassword}>Update Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!privacySelect} onOpenChange={() => setPrivacySelect(null)}>
                <DialogContent className="sm:max-w-sm bg-background border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>
                            {privacySelect === 'moments' ? "Who can see my moments" : "Who can see my comments"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-2">
                        {['everyone', 'followers', 'none'].map((option) => {
                            const current = privacySelect === 'moments'
                                ? user?.privacySettings?.canSeeMoments
                                : user?.privacySettings?.canComment;

                            return (
                                <button
                                    key={option}
                                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-2xl transition-colors text-left"
                                    onClick={() => {
                                        const field = privacySelect === 'moments' ? 'canSeeMoments' : 'canComment';
                                        updateUser.mutate({
                                            id: user!.id,
                                            data: {
                                                privacySettings: {
                                                    ...user!.privacySettings,
                                                    [field]: option
                                                }
                                            }
                                        });
                                        setPrivacySelect(null);
                                    }}
                                >
                                    <span className="capitalize font-medium">{option}</span>
                                    {current === option && <Check className="w-5 h-5 text-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>

            <BottomNav />
        </div>
    );
}
