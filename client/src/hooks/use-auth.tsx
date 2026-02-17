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
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();

    // IN DEV MODE: ALWAYS RETURN SUCCESSFUL USER
    const user = DEV_USER;
    const isLoading = false;
    const error = null;

    const loginMutation = useMutation({
        mutationFn: async () => { return { user: DEV_USER }; },
        onSuccess: () => { toast({ title: "Dev Mode: Login Simulated" }); },
    });

    const registerMutation = useMutation({
        mutationFn: async () => { return { user: DEV_USER }; },
        onSuccess: () => { toast({ title: "Dev Mode: Register Simulated" }); },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => { },
        onSuccess: () => { toast({ title: "Dev Mode: Logout Ignored" }); },
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
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



