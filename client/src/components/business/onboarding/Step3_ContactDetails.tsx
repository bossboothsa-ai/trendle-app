import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ChevronLeft, Mail, Phone, User, Shield } from "lucide-react";

interface Step3Props {
    data: {
        contactPerson: string;
        phoneNumber: string;
        email: string;
    };
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step3_ContactDetails({ data, onUpdate, onNext, onBack }: Step3Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.contactPerson || data.contactPerson.length < 2) {
            newErrors.contactPerson = "Contact person name must be at least 2 characters";
        }

        const cleanPhone = data.phoneNumber.replace(/[\s\-()]/g, '');
        if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 15) {
            newErrors.phoneNumber = "Phone number must be 10-15 digits";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            newErrors.email = "Please enter a valid email address";
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
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Step 3 of 6</span>
                            <span className="text-sm text-slate-600">Contact Details</span>
                        </div>
                        <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500" style={{ width: "50%" }}></div>
                        </div>
                    </div>

                    {/* Form Panel */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                                Who should we celebrate your venue with?
                            </h2>
                            <p className="text-slate-600 text-lg">We'll keep you in the loop on everything exciting</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="contactPerson" className="text-base text-slate-700 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Your Name *
                                </Label>
                                <Input
                                    id="contactPerson"
                                    value={data.contactPerson}
                                    onChange={(e) => onUpdate({ contactPerson: e.target.value })}
                                    placeholder="e.g., John Smith"
                                    className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                />
                                {errors.contactPerson && (
                                    <p className="text-sm text-red-600 mt-1">{errors.contactPerson}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phoneNumber" className="text-base text-slate-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Phone Number *
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    value={data.phoneNumber}
                                    onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
                                    placeholder="+27 12 345 6789"
                                    className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                />
                                {errors.phoneNumber && (
                                    <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-base text-slate-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Business Email *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => onUpdate({ email: e.target.value })}
                                    placeholder="contact@yourbusiness.com"
                                    className="mt-2 h-12 text-lg bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                )}
                                <div className="mt-3 flex items-start gap-2 bg-purple-50/50 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
                                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-700">
                                        We'll send updates and celebration moments to this email. Your info is safe with us.
                                    </p>
                                </div>
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
                </div>
            </div>
        </div>
    );
}
