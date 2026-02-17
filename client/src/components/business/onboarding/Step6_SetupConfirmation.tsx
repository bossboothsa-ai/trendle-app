import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Step6_SetupConfirmation() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Step 6 of 6</span>
                            <span className="text-sm text-slate-600">Complete!</span>
                        </div>
                        <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: "100%" }}></div>
                        </div>
                    </div>

                    {/* Confirmation Panel */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
                        <div className="text-center space-y-8">

                            {/* Success Icon */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                                        <CheckCircle2 className="w-14 h-14 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2">
                                        <Sparkles className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Headline */}
                            <div className="space-y-3">
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                                    You're all set!
                                </h2>
                                <p className="text-xl text-slate-600">
                                    We're getting your venue ready for the spotlight
                                </p>
                            </div>

                            {/* Email Notice */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-semibold text-slate-900 mb-2 text-lg">Check your email</h3>
                                        <p className="text-slate-700">
                                            We've sent a verification link. Click it to confirm your account and we'll get you started!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* What's Next */}
                            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-left border border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-4 text-lg">What happens next?</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">1</span>
                                        </div>
                                        <p className="text-slate-700">Verify your email address</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">2</span>
                                        </div>
                                        <p className="text-slate-700">Our team reviews your venue (usually 1-2 business days)</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">3</span>
                                        </div>
                                        <p className="text-slate-700">You'll get an email when your dashboard is ready</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Sparkles className="w-3 h-3 text-white fill-white" />
                                        </div>
                                        <p className="text-slate-700 font-medium">Start bringing in more customers!</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button
                                    onClick={() => setLocation("/business/dashboard")}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg py-6 text-lg"
                                >
                                    Go to Dashboard
                                </Button>
                                <div className="text-sm text-slate-600">
                                    Need help?{" "}
                                    <a href="mailto:support@trendle.com" className="text-purple-600 hover:underline font-medium">
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
