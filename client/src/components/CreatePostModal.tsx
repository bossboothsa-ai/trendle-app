import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost, usePlaces } from "@/hooks/use-trendle";
import { useState } from "react";
import { ImagePlus, MapPin, X, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-trendle";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const { data: user } = useUser();
  const { data: places } = usePlaces();
  const createPost = useCreatePost();
  
  const [step, setStep] = useState<"upload" | "details">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  // Simulated image upload for the demo
  const handleSimulatedUpload = () => {
    // Unsplash: random party/social image
    const randomImg = `https://images.unsplash.com/photo-1514525253440-b39345208668?w=800&auto=format&fit=crop&q=80&random=${Math.random()}`;
    setSelectedImage(randomImg);
    setStep("details");
  };

  const handleSubmit = () => {
    if (!user || !selectedImage) return;

    createPost.mutate({
      userId: user.id,
      placeId: selectedPlaceId,
      image: selectedImage,
      caption: caption,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        // Reset state
        setStep("upload");
        setSelectedImage(null);
        setCaption("");
        setSelectedPlaceId(null);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-none shadow-2xl rounded-3xl">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center font-display text-xl">Create Moment</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {step === "upload" ? (
            <div 
              className="border-2 border-dashed border-muted-foreground/20 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors gap-4"
              onClick={handleSimulatedUpload}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ImagePlus className="w-8 h-8" />
              </div>
              <p className="text-muted-foreground font-medium">Tap to upload photo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                 {/* Preview Image from Unsplash */}
                <img src={selectedImage!} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setStep("upload")}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Caption */}
              <Textarea 
                placeholder="What's happening?" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-muted/30 border-none resize-none text-base focus-visible:ring-1 focus-visible:ring-primary"
              />

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
                disabled={createPost.isPending}
                className="w-full py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {createPost.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Share Moment"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
