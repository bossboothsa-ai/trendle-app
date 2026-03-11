import { useQuery, useMutation } from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { createContext, useContext, ReactNode } from "react";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: any;
    logoutMutation: any;
    registerMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// DEV MODE MOCK USER
const DEV_USER: User = {
    id: 1,
    username: "dev_superuser",
    displayName: "Dev Admin",
    password: "",
    role: "admin",
    email: "dev@trendle.com",
    emailVerified: true,
    verificationToken: null,
    verificationTokenExpiry: null,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
    level: "Platinum",
    points: 1000,
    bio: "Superuser Account",
    location: "Cape Town",
    interests: ["development", "testing"],
    isPrivate: false,
    status: "active",
    riskScore: "Low",
    warnings: 0,
    adminNotes: null,
    phoneNumber: "0000000000",
    phoneVerified: true,
    deviceId: "dev-device-id",
    publicActivityId: "TRND-DEV001",
    isFlagged: false,
    flagReason: null,
    notificationSettings: {
        likes: true,
        comments: true,
        follows: true,
        rewards: true,
        places: true,
    },
    privacySettings: {
        showPoints: true,
        canSeeMoments: "everyone",
        canComment: "everyone",
    },
    createdAt: new Date(),
    // Host fields
    isHost: false,
    hostName: null,
    hostBio: null,
    hostAvatar: null,
    hostVerified: false,
    hostCreatedAt: null,
    hostMembershipTier: null,
    hostMembershipStatus: "inactive",
    hostApplicationStatus: null,
    hostApplicationDate: null,
    hostMembershipStartDate: null,
    hostMembershipEndDate: null,
    hostCategories: null,
    paymentReference: null,
    proofOfPayment: null,
    paymentVerified: false,
    paymentDate: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();

    // Fetch current user
    const { data: user, isLoading } = useQuery<User | null>({
        queryKey: ["/api/users/me"],
        queryFn: getQueryFn({ on401: "returnNull" }),
        retry: false,
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/login", data);
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/users/me"], data.user);
            toast({ title: "Logged in successfully" });
        },
        onError: (error: any) => {
            toast({ 
                title: "Login failed", 
                description: error.message || "Check your credentials",
                variant: "destructive"
            });
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/register", data);
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/users/me"], data.user);
            toast({ title: "Registration successful", description: "Welcome to Trendle!" });
        },
        onError: (error: any) => {
            toast({ 
                title: "Registration failed", 
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive"
            });
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/logout", {});
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/users/me"], null);
            toast({ title: "Logged out" });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user: user || null,
                isLoading,
                error: null,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}



