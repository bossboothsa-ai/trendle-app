import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost, usePlaces } from "@/hooks/use-trendle";
import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-trendle";
import { cn } from "@/lib/utils";
import { MediaUploader } from "@/components/MediaUploader";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MediaItem {
  type: "image" | "video";
  url: string;
  file?: File;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const { data: user } = useUser();
  const { data: places } = usePlaces();
  const createPost = useCreatePost();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [caption, setCaption] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!user || media.length === 0) return;

    createPost.mutate({
      userId: user.id,
      placeId: selectedPlaceId,
      media: media.map(m => ({ type: m.type, url: m.url })),
      caption: caption,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        // Reset state
        setMedia([]);
        setCaption("");
        setSelectedPlaceId(null);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMedia([]);
      setCaption("");
      setSelectedPlaceId(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-none shadow-2xl rounded-3xl">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center font-display text-xl">Create Moment</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Media Uploader */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Media
            </label>
            <MediaUploader
              media={media}
              onChange={setMedia}
              maxFiles={5}
              maxVideoDuration={10}
            />
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Caption
            </label>
            <Textarea
              placeholder="What's happening?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-muted/30 border-none resize-none text-base focus-visible:ring-1 focus-visible:ring-primary min-h-[100px]"
            />
          </div>

          {/* Location Tagging */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Tag Location
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {places?.map(place => (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlaceId(selectedPlaceId === place.id ? null : place.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedPlaceId === place.id
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {place.name}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={createPost.isPending || media.length === 0}
            className="w-full py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            {createPost.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Share Moment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
