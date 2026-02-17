import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HardHat } from "lucide-react";

interface PlaceholderPageProps {
    title?: string;
    description?: string;
    backUrl?: string;
    backLabel?: string;
}

export default function PlaceholderPage({
    title = "Feature In Preparation",
    description = "This feature is currently being built and will be available in the next update.",
    backUrl = "/",
    backLabel = "Go Back"
}: PlaceholderPageProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                    <HardHat className="w-10 h-10 text-slate-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    <p className="text-slate-500">{description}</p>
                </div>

                <Link href={backUrl}>
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        {backLabel}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
