import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Settings,
    Shield,
    Activity,
    Database,
    Save,
    Lock,
    Unlock,
    AlertTriangle,
    AlertOctagon,
    Terminal,
    Key,
    FileText
} from "lucide-react";

export default function AdminSettings() {
    const [counterLocked, setCounterLocked] = useState(true);
    const [staffConfirmEnabled, setStaffConfirmEnabled] = useState(true);
    const [emergencyAction, setEmergencyAction] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSaveConfig = () => {
        toast({ title: "Configuration Saved", description: "System settings have been updated successfully." });
    };

    const handleMaintenanceAction = (action: string) => {
        toast({ title: "Maintenance Task", description: `${action} task has been queued.` });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-slate-500">Core platform configuration and integrity controls.</p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={handleSaveConfig}>
                    <Save className="w-4 h-4 mr-2" /> Save Configuration
                </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="text-sm font-bold text-yellow-800">Warning: Global Configurations</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                        Changes made here affect the entire Trendle platform immediately. Please proceed with caution.
                    </p>
                </div>
            </div>

            <div className="space-y-8">

                {/* 1. Activity ID Configuration */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Activity className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Activity ID Configuration</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold text-slate-900">Control the public Activity ID generation format</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Series Letter</Label>
                                            <Input defaultValue="A" className="font-mono text-center font-bold" />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Sub-Series</Label>
                                            <Input defaultValue="X" className="font-mono text-center font-bold" />
                                        </div>
                                        <div>
                                            <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Current Counter</Label>
                                            <div className="relative">
                                                <Input
                                                    defaultValue="001242"
                                                    className="font-mono text-center font-bold bg-slate-50 disabled:opacity-100 disabled:text-slate-500"
                                                    disabled={counterLocked}
                                                />
                                                {counterLocked && <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-3" />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        This counter increments automatically when new users register.
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            {counterLocked ? <Lock className="w-4 h-4 text-slate-500" /> : <Unlock className="w-4 h-4 text-red-500" />}
                                            <Label className="font-medium text-slate-700">Lock Counter Editing</Label>
                                        </div>
                                        <Switch checked={counterLocked} onCheckedChange={setCounterLocked} />
                                    </div>
                                </div>

                                <div className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Format Preview</span>
                                    <span className="text-xl font-mono font-bold text-slate-900 tracking-wider">TRND-AX001242</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 2. Verification Rules */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <Shield className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Verification Rules</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold text-slate-900">Control how platform activity is validated</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-slate-900">Require QR for Check-Ins</div>
                                    <div className="text-sm text-slate-500 mt-0.5">Force scan, disable manual override from business side.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-slate-900">Allow Location Fallback</div>
                                    <div className="text-sm text-slate-500 mt-0.5">Use GPS validation if QR is unavailable or damaged.</div>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-bold text-slate-900">Require Staff Confirmation</div>
                                    <div className="text-sm text-slate-500 mt-0.5">Require PIN verification for reward redemption.</div>

                                    {staffConfirmEnabled && (
                                        <div className="mt-4 flex items-center gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                            <Key className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <Label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Confirmation PIN Length</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input className="w-24 font-mono" defaultValue="4" />
                                                    <span className="text-sm text-slate-500">digits</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Switch checked={staffConfirmEnabled} onCheckedChange={setStaffConfirmEnabled} />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 3. Feature Controls */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                <Settings className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Feature Controls</h2>
                        </div>

                        <Card className="border-slate-200 shadow-sm bg-white rounded-xl h-full">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-base font-bold text-slate-900">Enable or disable platform-wide features</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <p className="text-xs text-slate-500 mb-2">
                                    Disabling a feature hides it from all businesses immediately.
                                </p>
                                {['Surveys', 'Campaigns', 'Rewards', 'Venue Profiles'].map((feature) => (
                                    <div key={feature} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                        <span className="font-bold text-slate-800">{feature}</span>
                                        <Switch defaultChecked />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>

                    {/* 4. Maintenance Tools */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                <Database className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Maintenance Tools</h2>
                        </div>

                        <Card className="border-slate-200 shadow-sm bg-white rounded-xl h-full">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-base font-bold text-slate-900">Platform-level system maintenance</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900">Clear System Cache</div>
                                        <div className="text-xs text-slate-500">Flush Redis and generic page caches.</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-slate-200" onClick={() => handleMaintenanceAction('Clear Cache')}>Clear Cache</Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900">Re-index Search</div>
                                        <div className="text-xs text-slate-500">Rebuild ElasticSearch indices.</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-slate-200" onClick={() => handleMaintenanceAction('Re-index')}>Re-index</Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900">Recalculate Activity Metrics</div>
                                        <div className="text-xs text-slate-500">Useful if analytics drift occurs.</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-slate-200" onClick={() => handleMaintenanceAction('Rebuild Metrics')}>Rebuild Metrics</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* 5. Emergency Controls */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <AlertOctagon className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-bold text-red-900">Emergency Controls</h2>
                    </div>

                    <Card className="border-red-200 shadow-sm bg-red-50/30 rounded-xl overflow-hidden">
                        <CardHeader className="border-b border-red-100 bg-red-50 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold text-red-900">Critical Actions</CardTitle>
                                <Badge variant="destructive" className="bg-red-600">Super Admin Only</Badge>
                            </div>
                            <CardDescription className="text-red-700">
                                These actions cause immediate platform disruption. Use only in emergencies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm">
                                <div>
                                    <h4 className="font-bold text-red-900">Suspend All Check-Ins</h4>
                                    <p className="text-xs text-red-700">Prevents any new check-ins globally.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                            Suspend Check-Ins
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action will immediately block all check-ins across the entire platform.
                                                This will disrupt user experience and business operations.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="py-4">
                                            <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Enter Admin Password to Confirm</Label>
                                            <Input type="password" placeholder="••••••••••••" />
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Confirm Suspension</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm">
                                <div>
                                    <h4 className="font-bold text-red-900">Suspend All Reward Redemptions</h4>
                                    <p className="text-xs text-red-700">Stops point spending immediately.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                            Suspend Rewards
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Suspend Reward Redemptions?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Users will not be able to redeem points for rewards. Wallet balances will be frozen.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="py-4">
                                            <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Enter Admin Password to Confirm</Label>
                                            <Input type="password" placeholder="••••••••••••" />
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Suspend Rewards</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg shadow-sm">
                                <div>
                                    <h4 className="font-bold text-red-900">Enter Maintenance Mode</h4>
                                    <p className="text-xs text-red-700">Takes the entire platform offline for users.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-900">
                                            Enable Maintenance
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Enable Maintenance Mode?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                The platform will be inaccessible to all users and businesses. Only Super Admins will have access.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="py-4">
                                            <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Enter Admin Password to Confirm</Label>
                                            <Input type="password" placeholder="••••••••••••" />
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Enable Maintenance</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 6. Billing Policy - NEW */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Billing Policy</h2>
                    </div>

                    <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold text-slate-900">Invoice & Suspension Rules</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Default Invoice Due Days</Label>
                                    <div className="flex items-center gap-2">
                                        <Input className="w-24 font-mono font-bold" defaultValue="7" />
                                        <span className="text-sm text-slate-500">Days from Issue</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Grace Period</Label>
                                    <div className="flex items-center gap-2">
                                        <Input className="w-24 font-mono font-bold" defaultValue="48" />
                                        <span className="text-sm text-slate-500">Hours</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Late Fee (Optional)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input className="w-24 font-mono font-bold" defaultValue="0" />
                                        <span className="text-sm text-slate-500">Rand (R)</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-slate-900">Auto-Restrict Features</div>
                                    <div className="text-sm text-slate-500 mt-0.5">Automatically disable campaigns/rewards after grace period expires.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-slate-900">Automated Payment Reminders</div>
                                    <div className="text-sm text-slate-500 mt-0.5">Send emails 3 days before due, on due date, and 24h overdue.</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="flex items-center justify-center pt-8 pb-12 text-slate-400 text-xs font-mono">
                    <Terminal className="w-3 h-3 mr-2" />
                    System ID: SYS-ROOT-001 • Encrypted Connection
                </div>
            </div>
        </div>
    );
}
