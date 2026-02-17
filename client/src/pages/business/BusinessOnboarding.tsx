import { useState } from "react";
import { useLocation } from "wouter";
import Step1_ValueIntro from "@/components/business/onboarding/Step1_ValueIntro";
import Step2_BasicInfo from "@/components/business/onboarding/Step2_BasicInfo";
import Step3_ContactDetails from "@/components/business/onboarding/Step3_ContactDetails";
import Step4_DashboardPreview from "@/components/business/onboarding/Step4_DashboardPreview";
import Step5_CreateAccount from "@/components/business/onboarding/Step5_CreateAccount";
import Step6_SetupConfirmation from "@/components/business/onboarding/Step6_SetupConfirmation";

interface OnboardingData {
    businessName: string;
    category: string;
    city: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    username: string;
    password: string;
}

export default function BusinessOnboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [, setLocation] = useLocation();
    const [formData, setFormData] = useState<OnboardingData>({
        businessName: "",
        category: "",
        city: "",
        contactPerson: "",
        phoneNumber: "",
        email: "",
        username: "",
        password: "",
    });

    const updateFormData = (data: Partial<OnboardingData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {currentStep === 1 && <Step1_ValueIntro onNext={nextStep} />}
            {currentStep === 2 && (
                <Step2_BasicInfo
                    data={formData}
                    onUpdate={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {currentStep === 3 && (
                <Step3_ContactDetails
                    data={formData}
                    onUpdate={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {currentStep === 4 && (
                <Step4_DashboardPreview
                    businessName={formData.businessName}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {currentStep === 5 && (
                <Step5_CreateAccount
                    data={formData}
                    onUpdate={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {currentStep === 6 && <Step6_SetupConfirmation />}
        </div>
    );
}
