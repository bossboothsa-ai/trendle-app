import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Star } from "lucide-react";

interface Step1Props {
    onNext: () => void;
}

export default function Step1_ValueIntro({ onNext }: Step1Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">

                {/* Hero Section */}
                <div className="text-center mb-16 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
                        Get People Talking<br />About Your Venue
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto">
                        Turn every visit into social buzz. Real customers, real posts, real growth.
                    </p>
                    <Button
                        onClick={onNext}
                        size="lg"
                        className="px-10 py-7 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        Start Growing Today
                    </Button>
                    <div className="text-sm text-slate-600 mt-4">
                        Already have an account?{" "}
                        <a href="/business/login" className="text-purple-600 hover:underline font-medium">
                            Sign in
                        </a>
                    </div>
                </div>

                {/* Social Feed Preview */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
                        Watch Your Venue Come Alive
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

                        {/* Post 1 */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Sarah M.</p>
                                        <p className="text-xs text-slate-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-200 to-pink-200 h-64 rounded-xl mb-3 flex items-center justify-center">
                                    <span className="text-6xl">☕</span>
                                </div>
                                <p className="text-slate-700 mb-3">
                                    Best coffee spot in town! The vibe here is unmatched ✨
                                </p>
                                <div className="flex items-center gap-6 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                        <span className="text-sm font-medium">247</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">32</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Share2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">18</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post 2 */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Mike T.</p>
                                        <p className="text-xs text-slate-500">5 hours ago</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-200 to-purple-200 h-64 rounded-xl mb-3 flex items-center justify-center">
                                    <span className="text-6xl">🍔</span>
                                </div>
                                <p className="text-slate-700 mb-3">
                                    Finally found my new favorite burger spot! You guys need to try this 🔥
                                </p>
                                <div className="flex items-center gap-6 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                        <span className="text-sm font-medium">189</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">24</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Share2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">12</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Feedback Snapshot */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
                        Real Feedback, Real Growth
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-4">

                        {/* Review 1 */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-semibold text-slate-900">Jessica L.</p>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-700">
                                        "Amazing atmosphere and the staff are so friendly! I come here every weekend now. Highly recommend!"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-semibold text-slate-900">David K.</p>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-700">
                                        "Best place to hang out with friends. The vibe is perfect and the service is top-notch!"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="font-semibold text-slate-900">Emma R.</p>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4].map((i) => (
                                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            ))}
                                            <Star className="w-4 h-4 text-slate-300" />
                                        </div>
                                    </div>
                                    <p className="text-slate-700">
                                        "Great food and drinks. The only thing missing is more outdoor seating, but still love it!"
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        Ready to grow your venue?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Join hundreds of venues already using Trendle to connect with customers
                    </p>
                    <Button
                        onClick={onNext}
                        size="lg"
                        className="px-12 py-7 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        Get Started Now
                    </Button>
                </div>

            </div>
        </div>
    );
}
