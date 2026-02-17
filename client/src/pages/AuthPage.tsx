import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

// Minimalist Schemas
const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AuthPage() {
    const { user, loginMutation, registerMutation, isLoading } = useAuth();
    const { toast } = useToast();
    const [isLogin, setIsLogin] = useState(true);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", email: "", phoneNumber: "", password: "" },
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get("verified") === "true") {
            toast({
                title: "Welcome to Trendle! ✨",
                description: "Email verified. You're ready to go.",
                className: "bg-purple-100 border-purple-200 text-purple-900",
            });
        }
    }, [toast]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#E5D9F2] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    if (user) {
        if (user.role === "admin") return <Redirect to="/admin/dashboard" />;
        if (user.role === "business") return <Redirect to="/business/dashboard" />;
        return <Redirect to="/" />;
    }

    return (
        <div className="min-h-screen w-full bg-[#E5D9F2] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-sm z-10 flex flex-col items-center space-y-8">
                {/* Logo Area */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                        Trendle.
                    </h1>
                    <p className="text-slate-600 text-lg">Where moments happen.</p>
                </div>

                {/* Auth Form Container */}
                <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
                    <div className="mb-6 flex justify-center space-x-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`pb-2 text-sm font-semibold transition-colors ${isLogin ? 'text-purple-700 border-b-2 border-purple-700' : 'text-slate-500'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`pb-2 text-sm font-semibold transition-colors ${!isLogin ? 'text-purple-700 border-b-2 border-purple-700' : 'text-slate-500'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {isLogin ? (
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                                <FormField
                                    control={loginForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Username"
                                                    {...field}
                                                    className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Password"
                                                    {...field}
                                                    className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg transition-transform active:scale-95"
                                    disabled={loginMutation.isPending}
                                >
                                    {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                                <FormField
                                    control={registerForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Pick a username"
                                                    {...field}
                                                    className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Email address"
                                                    {...field}
                                                    className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="Phone number"
                                                    {...field}
                                                    className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Create password"
                                                    {...field}
                                                    className="bg-white/60 border-0 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl h-12"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg transition-transform active:scale-95"
                                    disabled={registerMutation.isPending}
                                >
                                    {registerMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-xs text-slate-500">
                    By continuing, you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </div>
    );
}
