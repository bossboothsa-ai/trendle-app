import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Mail, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PendingApproval() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Pending Admin Approval</CardTitle>
                    <CardDescription className="text-base">
                        Your business account is awaiting verification
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                        <p className="font-medium mb-2">✅ Email Verified</p>
                        <p className="mb-3">Your email has been confirmed. Thank you!</p>

                        <p className="font-medium mb-2">⏳ Awaiting Approval</p>
                        <p>
                            Our team is reviewing your business registration. This typically takes 1-2 business days.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                        <p className="font-medium mb-2">📧 What happens next?</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Admin reviews your application</li>
                            <li>You'll receive an email notification</li>
                            <li>Once approved, you can access your dashboard</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={() => setLocation("/login")}
                            variant="outline"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                            Need help?{" "}
                            <a href="mailto:support@trendle.com" className="text-blue-600 hover:underline">
                                Contact Support
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
