import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStory, useUser } from "@/hooks/use-trendle";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MediaUploader } from "@/components/MediaUploader";

interface CreateStoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface MediaItem {
    type: "image" | "video";
    url: string;
    file?: File;
}

export function CreateStoryModal({ open, onOpenChange }: CreateStoryModalProps) {
    const { data: user } = useUser();
    const createStory = useCreateStory();

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [caption, setCaption] = useState("");

    const handleSubmit = () => {
        if (!user || media.length === 0) return;

        createStory.mutate({
            userId: user.id,
            media: media.map(m => ({ type: m.type, url: m.url })),
            caption: caption,
        }, {
            onSuccess: () => {
                onOpenChange(false);
                // Reset state
                setMedia([]);
                setCaption("");
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setMedia([]);
            setCaption("");
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-none shadow-2xl rounded-3xl">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="text-center font-display text-xl">Add to Story</DialogTitle>
                </DialogHeader>

                <div className="p-4 space-y-6">
                    {/* Media Uploader */}
                    <div>
                        <MediaUploader
                            media={media}
                            onChange={(newMedia) => setMedia(newMedia.slice(-1))} // Stories usually one item at a time? Or multiple? Let's allow 1 for now per story "slide", or stick to 1.
                            maxFiles={1}
                            maxVideoDuration={15}
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Share a moment (Photo or Video up to 15s)
                        </p>
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                            Caption (Optional)
                        </label>
                        <Textarea
                            placeholder="Add a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="bg-muted/30 border-none resize-none text-base focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={createStory.isPending || media.length === 0}
                        className="w-full py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    >
                        {createStory.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Share to Story"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
