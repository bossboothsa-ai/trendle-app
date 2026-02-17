import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ChevronLeft, MapPin, Tag } from "lucide-react";

interface Step2Props {
    data: {
        businessName: string;
        category: string;
        city: string;
    };
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2_BasicInfo({ data, onUpdate, onNext, onBack }: Step2Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.businessName || data.businessName.length < 2) {
            newErrors.businessName = "Business name must be at least 2 characters";
        }
        if (!data.category) {
            newErrors.category = "Please select a category";
        }
        if (!data.city || data.city.length < 2) {
            newErrors.city = "City must be at least 2 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
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
                <div className="w-full max-w-5xl">

                    {/* Progress */}
                    <div className="mb-8 max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Step 2 of 6</span>
                            <span className="text-sm text-slate-600">Basic Info</span>
                        </div>
                        <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500" style={{ width: "33%" }}></div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">

                        {/* Form Panel */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                    Let's introduce your venue to Trendle
                                </h2>
                                <p className="text-slate-600">Tell us a bit about your place</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="businessName" className="text-base text-slate-700">Venue Name *</Label>
                                    <Input
                                        id="businessName"
                                        value={data.businessName}
                                        onChange={(e) => onUpdate({ businessName: e.target.value })}
                                        placeholder="e.g., The Coffee House"
                                        className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    {errors.businessName && (
                                        <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="category" className="text-base text-slate-700">What type of venue? *</Label>
                                    <Select value={data.category} onValueChange={(value) => onUpdate({ category: value })}>
                                        <SelectTrigger className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bar">Bar</SelectItem>
                                            <SelectItem value="Café">Café</SelectItem>
                                            <SelectItem value="Restaurant">Restaurant</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="city" className="text-base text-slate-700">City *</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => onUpdate({ city: e.target.value })}
                                        placeholder="e.g., Cape Town"
                                        className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-600 mt-1">{errors.city}</p>
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
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    size="lg"
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>

                        {/* Live Preview Panel */}
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                            <h3 className="text-lg font-semibold text-slate-900 mb-6">Live Preview</h3>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-3xl">
                                        {data.businessName ? data.businessName[0].toUpperCase() : "?"}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-slate-900">
                                            {data.businessName || "Your Venue Name"}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                                            {data.category && (
                                                <div className="flex items-center gap-1">
                                                    <Tag className="w-4 h-4" />
                                                    <span>{data.category}</span>
                                                </div>
                                            )}
                                            {data.city && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{data.city}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/60 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Status</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                            Setting up
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Visibility</span>
                                        <span className="text-slate-900 font-medium">Public</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 mt-4 text-center">
                                    This is how your venue will appear on Trendle
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
