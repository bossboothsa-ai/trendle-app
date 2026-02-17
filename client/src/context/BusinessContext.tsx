import { createContext, useContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { BusinessAccount } from "@shared/schema";

interface BusinessContextType {
    dateRange: DateRange | undefined;
    setDateRange: (date: DateRange | undefined) => void;
    businessId: number | null;
    placeId: number | null;
    business: BusinessAccount | undefined;
    isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    // Fetch business account for the logged-in user
    const { data: businessData, isLoading } = useQuery({
        queryKey: ["/api/business/me"],
        queryFn: async () => {
            const res = await fetch("/api/business/me");
            if (!res.ok) return null;
            return res.json();
        },
        enabled: !!user && user.role === "business",
    });

    const business = businessData?.business as BusinessAccount | undefined;
    const businessId = business?.id || null;
    const placeId = business?.placeId || null;

    return (
        <BusinessContext.Provider value={{ dateRange, setDateRange, businessId, placeId, business, isLoading }}>
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusiness() {
    const context = useContext(BusinessContext);
    if (context === undefined) {
        throw new Error("useBusiness must be used within a BusinessProvider");
    }
    return context;
}
