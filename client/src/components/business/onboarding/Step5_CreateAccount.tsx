import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ChevronLeft, Loader2, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Step5Props {
    data: {
        businessName: string;
        category: string;
        city: string;
        contactPerson: string;
        phoneNumber: string;
        email: string;
        username: string;
        password: string;
    };
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step5_CreateAccount({ data, onUpdate, onNext, onBack }: Step5Props) {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.username || data.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!data.password || data.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (data.password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            await apiRequest("POST", "/api/business/register", {
                businessName: data.businessName,
                email: data.email,
                contactPerson: data.contactPerson,
                phoneNumber: data.phoneNumber,
                city: data.city,
                category: data.category,
                username: data.username,
                password: data.password,
            });

            // Success - move to confirmation step
            onNext();
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error.message || "Failed to create account. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Step 5 of 6</span>
                            <span className="text-sm text-slate-600">Secure Account</span>
                        </div>
                        <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500" style={{ width: "83%" }}></div>
                        </div>
                    </div>

                    {/* Form Panel */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                                Almost there!
                            </h2>
                            <p className="text-slate-600 text-lg">Create a password to secure your account</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="username" className="text-base text-slate-700">Username *</Label>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(e) => onUpdate({ username: e.target.value })}
                                    placeholder="Choose a username"
                                    className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-600 mt-1">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-base text-slate-700">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => onUpdate({ password: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                    className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-base text-slate-700">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-8">
                            <Button
                                onClick={onBack}
                                variant="outline"
                                size="lg"
                                className="flex-1 border-slate-300 hover:bg-white/50"
                                disabled={isSubmitting}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                size="lg"
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
