import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";

export default function VerifyEmail() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [isResending, setIsResending] = useState(false);

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            // TODO: Implement resend verification email endpoint
            toast({
                title: "Email Resent",
                description: "Check your inbox for a new verification link."
            });
        } catch (error: any) {
            toast({
                title: "Failed to resend",
                description: error?.message || "Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <Mail className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl">Check Your Email</CardTitle>
                    <CardDescription className="text-base">
                        We sent a verification link to{" "}
                        <strong className="text-gray-900">{user?.email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                        <p className="font-medium mb-1">📧 What to do next:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Check your inbox (and spam folder)</li>
                            <li>Click the verification link</li>
                            <li>You'll be automatically logged in</li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            variant="outline"
                            className="w-full"
                        >
                            {isResending ? "Sending..." : "Resend Verification Email"}
                        </Button>

                        <Button
                            onClick={() => setLocation("/login")}
                            variant="ghost"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        The verification link will expire in 24 hours.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
