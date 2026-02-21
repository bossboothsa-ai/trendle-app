import { useBusiness } from "@/context/BusinessContext";
import { EventPerformance } from "@/components/business/EventPerformance";
import { Calendar } from "lucide-react";

export default function BusinessEvents() {
    const { placeId } = useBusiness();

    if (!placeId) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No venue linked to your account.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <EventPerformance venueId={placeId} />
        </div>
    );
}
