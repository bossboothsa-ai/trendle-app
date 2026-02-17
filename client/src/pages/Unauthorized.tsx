import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen grid items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-600">403 - Access Denied</CardTitle>
                    <CardDescription className="text-base">
                        You don't have permission to access this resource.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-900">
                        <p className="font-medium mb-1">Why am I seeing this?</p>
                        <p>
                            This page is restricted to specific user roles. You may be trying to access:
                        </p>
                        <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                            <li>Business portal with a user account</li>
                            <li>User app with a business account</li>
                            <li>Admin panel without admin privileges</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={() => setLocation("/login")}
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="w-full"
                        >
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
