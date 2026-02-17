import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, MessageCircle, TrendingUp, Star } from "lucide-react";

interface Step4Props {
    businessName: string;
    onNext: () => void;
    onBack: () => void;
}

export default function Step4_DashboardPreview({ businessName, onNext, onBack }: Step4Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-40 left-40 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-40 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">

                    {/* Progress */}
                    <div className="mb-8 max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Step 4 of 6</span>
                            <span className="text-sm text-slate-600">Preview</span>
                        </div>
                        <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500" style={{ width: "67%" }}></div>
                        </div>
                    </div>

                    <div className="space-y-8">

                        {/* Header */}
                        <div className="text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                                Watch the buzz grow
                            </h2>
                            <p className="text-xl text-slate-600">
                                Here's what happens when people love your venue
                            </p>
                        </div>

                        {/* Social Activity Preview */}
                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Mock Post 1 */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Emma R.</p>
                                        <p className="text-xs text-slate-500">Just checked in</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-48 rounded-2xl mb-4 flex items-center justify-center text-5xl">
                                    ☕
                                </div>
                                <p className="text-slate-700 mb-4">
                                    Obsessed with this place! The vibe is perfect and the coffee is amazing ✨
                                </p>
                                <div className="flex items-center gap-6 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                        <span className="font-medium">142</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="font-medium">23</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Post 2 */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Jake M.</p>
                                        <p className="text-xs text-slate-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 rounded-2xl mb-4 flex items-center justify-center text-5xl">
                                    🍔
                                </div>
                                <p className="text-slate-700 mb-4">
                                    Best burger in town, hands down! Everyone needs to try this 🔥
                                </p>
                                <div className="flex items-center gap-6 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                        <span className="font-medium">98</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="font-medium">15</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Rating Snippets */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-900">What people are saying</h3>
                                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-900">4.8</span>
                                    <span className="text-slate-600 text-sm">(156 reviews)</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-slate-900">Sarah L.</p>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-700 text-sm">
                                            "Amazing atmosphere! I bring all my friends here now"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-slate-900">David K.</p>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-700 text-sm">
                                            "Best spot in the city. Service is top-notch!"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visit Growth Indicator */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/50 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                <span className="text-3xl font-bold text-slate-900">+247</span>
                            </div>
                            <p className="text-slate-600">New visitors this month from Trendle</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 max-w-2xl mx-auto">
                            <Button
                                onClick={onBack}
                                variant="outline"
                                size="lg"
                                className="flex-1 border-slate-300 hover:bg-white/50"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={onNext}
                                size="lg"
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                            >
                                Continue to Account Setup
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
