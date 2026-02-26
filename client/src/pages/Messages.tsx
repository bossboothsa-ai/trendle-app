import { MessageSquare, Sparkles } from "lucide-react";

export default function Messages() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">Direct Messages</h1>
            <p className="text-muted-foreground mb-8">
                Connect directly with other explorers and hosts. Coming very soon!
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                Feature in development
            </div>
        </div>
    );
}
