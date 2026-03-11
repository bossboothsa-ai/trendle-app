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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Minimalist Schemas
const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().default(true),
});

const registerSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    interests: z.array(z.string()).default([]),
    rememberMe: z.boolean().default(true),
});

export default function AuthPage() {
    const { user, loginMutation, registerMutation, isLoading } = useAuth();
    const { toast } = useToast();
    const [isLogin, setIsLogin] = useState(true);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "", rememberMe: true },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { displayName: "", username: "", email: "", phoneNumber: "", password: "", interests: [], rememberMe: true },
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
            <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        );
    }

    if (user) {
        if (user.role === "admin") return <Redirect to="/admin/dashboard" />;
        if (user.role === "business") return <Redirect to="/business/dashboard" />;
        return <Redirect to="/" />;
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

            <div className="w-full max-w-sm z-10 flex flex-col items-center space-y-8">
                {/* Logo Area */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white font-display">
                        Trendle.
                    </h1>
                    <p className="text-purple-200 text-lg">Where moments happen.</p>
                </div>

                {/* Auth Form Container */}
                <div className="w-full bg-purple-900/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-purple-700/50 relative overflow-visible">
                    <div className="mb-6 flex justify-center space-x-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`pb-2 text-sm font-semibold transition-colors ${isLogin ? 'text-purple-300 border-b-2 border-purple-400' : 'text-purple-500 hover:text-purple-400'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`pb-2 text-sm font-semibold transition-colors ${!isLogin ? 'text-purple-300 border-b-2 border-purple-400' : 'text-purple-500 hover:text-purple-400'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div key={isLogin ? "login-section" : "register-section"} className="w-full">
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
                                                    id="login-username"
                                                    placeholder="Username"
                                                    {...field}
                                                    autoComplete="username"
                                                    className="bg-purple-700/50 border-2 border-purple-500/50 text-white placeholder:text-purple-300/60 focus-visible:ring-2 focus-visible:ring-purple-300 rounded-xl h-12 font-medium transition-all focus:bg-purple-700 focus:border-purple-400"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-purple-300" />
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
                                                    id="login-password"
                                                    type="password"
                                                    placeholder="Password"
                                                    {...field}
                                                    autoComplete="current-password"
                                                    className="bg-purple-700/50 border-2 border-purple-500/50 text-white placeholder:text-purple-300/60 focus-visible:ring-2 focus-visible:ring-purple-300 rounded-xl h-12 font-medium transition-all focus:bg-purple-700 focus:border-purple-400"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-purple-300" />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={loginForm.control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    id="login-remember"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-purple-400 data-[state=checked]:bg-purple-500"
                                                />
                                            </FormControl>
                                            <Label className="text-sm font-medium text-purple-200 cursor-pointer">
                                                Remember Me
                                            </Label>
                                        </FormItem>
                                    )}
                                />
                                
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold shadow-lg transition-transform active:scale-95"
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
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="register-name"
                                                    placeholder="Name"
                                                    {...field}
                                                    autoComplete="name"
                                                    className="bg-purple-700/50 border-2 border-purple-500/50 text-white placeholder:text-purple-300/60 focus-visible:ring-2 focus-visible:ring-purple-300 rounded-xl h-12 font-medium transition-all focus:bg-purple-700 focus:border-purple-400"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-purple-300" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="register-username"
                                                    placeholder="User Name"
                                                    {...field}
                                                    autoComplete="username"
                                                    className="bg-purple-700/50 border-2 border-purple-500/50 text-white placeholder:text-purple-300/60 focus-visible:ring-2 focus-visible:ring-purple-300 rounded-xl h-12 font-medium transition-all focus:bg-purple-700 focus:border-purple-400"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-purple-300" />
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
                                                    id="register-email"
                                                    type="email"
                                                    placeholder="Email"
                                                    {...field}
                                                    autoComplete="email"
                                                    className="bg-purple-700/50 border-2 border-purple-500/50 text-white placeholder:text-purple-300/60 focus-visible:ring-2 focus-visible:ring-purple-300 rounded-xl h-12 font-medium transition-all focus:bg-purple-700 focus:border-purple-400"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-purple-300" />
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
                                                    id="register-password"
                                                    type="password"
                                                    placeholder="Create password"
                                                    {...field}
                                                    autoComplete="new-password"
                                                    className="bg-purple-700/50 border-2 border-purple-500/50 text-white placeholder:text-purple-300/60 focus-visible:ring-2 focus-visible:ring-purple-300 rounded-xl h-12 font-medium transition-all focus:bg-purple-700 focus:border-purple-400"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-purple-300" />
                                        </FormItem>
                                    )}
                                />
                                
                                {/* Interests removed from registration flow for simplicity as requested */}
                                
                                {/* Interests can be updated in profile later */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold shadow-lg transition-transform active:scale-95"
                                    disabled={registerMutation.isPending}
                                >
                                    {registerMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </form>
                        </Form>
                    )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-xs text-purple-300">
                    By continuing, you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </div>
    );
}
