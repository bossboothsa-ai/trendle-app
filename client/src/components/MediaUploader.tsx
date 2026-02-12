import { useState, useRef } from "react";
import { X, ImagePlus, Film, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
    type: "image" | "video";
    url: string; // Base64 or Blob URL for preview
    file?: File;
}

interface MediaUploaderProps {
    media: MediaItem[];
    onChange: (media: MediaItem[]) => void;
    maxFiles?: number;
    maxVideoDuration?: number; // seconds
    className?: string;
}

export function MediaUploader({
    media,
    onChange,
    maxFiles = 4,
    maxVideoDuration = 10,
    className
}: MediaUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (media.length + files.length > maxFiles) {
            toast({
                title: "Too many files",
                description: `You can only upload a maximum of ${maxFiles} items.`,
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        const newItems: MediaItem[] = [];

        for (const file of files) {
            try {
                if (file.type.startsWith("video/")) {
                    // Check duration
                    const duration = await getVideoDuration(file);
                    if (duration > maxVideoDuration) {
                        toast({
                            title: "Video too long",
                            description: `Video "${file.name}" exceeds the ${maxVideoDuration}s limit.`,
                            variant: "destructive",
                        });
                        continue;
                    }
                }

                const base64 = await fileToBase64(file);
                newItems.push({
                    type: file.type.startsWith("video/") ? "video" : "image",
                    url: base64,
                    file,
                });
            } catch (err) {
                console.error("Error processing file", err);
                toast({
                    title: "Error",
                    description: "Failed to process file.",
                    variant: "destructive",
                });
            }
        }

        onChange([...media, ...newItems]);
        setIsProcessing(false);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeMedia = (index: number) => {
        const newMedia = [...media];
        newMedia.splice(index, 1);
        onChange(newMedia);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="grid grid-cols-2 gap-4">
                {media.map((item, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-black group">
                        {item.type === "image" ? (
                            <img src={item.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <video src={item.url} className="w-full h-full object-cover" controls={false} />
                        )}

                        <button
                            onClick={() => removeMedia(index)}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {item.type === "video" && (
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-white text-xs flex items-center gap-1">
                                <Film className="w-3 h-3" />
                                Video
                            </div>
                        )}
                    </div>
                ))}

                {media.length < maxFiles && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors gap-2"
                    >
                        {isProcessing ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <ImagePlus className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground text-center px-4">
                                    Add Photos<br />or Video
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*,video/*"
            />
        </div>
    );
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = () => reject("Invalid video file");
        video.src = URL.createObjectURL(file);
    });
}
