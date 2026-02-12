import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUser, useUser } from "@/hooks/use-trendle";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { MediaUploader } from "@/components/MediaUploader";
import { cn } from "@/lib/utils";

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface MediaItem {
    type: "image" | "video";
    url: string;
    file?: File;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
    const { data: user } = useUser();
    const updateUser = useUpdateUser();

    const [avatar, setAvatar] = useState<MediaItem[]>([]);
    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [location, setLocation] = useState("");
    const [interests, setInterests] = useState<string[]>([]);

    const availableInterests = ["coffee", "brunch", "nightlife", "work spots", "desserts", "wellness", "hiking", "fitness"];

    useEffect(() => {
        if (user) {
            setBio(user.bio || "");
            setUsername(user.username);
            setDisplayName(user.displayName || "");
            setLocation(user.location || "");
            setInterests(user.interests || []);
            if (user.avatar) {
                setAvatar([{ type: "image", url: user.avatar }]);
            }
        }
    }, [user, open]);

    const handleSubmit = () => {
        if (!user) return;

        updateUser.mutate({
            id: user.id,
            data: {
                bio,
                username,
                displayName,
                location,
                interests: interests as any,
                avatar: avatar.length > 0 ? avatar[0].url : user.avatar,
            },
        }, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-background border-none shadow-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-center font-display text-xl">Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32">
                            <MediaUploader
                                media={avatar}
                                onChange={(newMedia) => setAvatar(newMedia.slice(-1))} // Keep only last selected
                                maxFiles={1}
                                className="mx-auto"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Tap to change avatar</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Username
                            </label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-muted/30 border-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Display Name
                            </label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="bg-muted/30 border-none"
                                placeholder="Public name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Location
                        </label>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-muted/30 border-none"
                            placeholder="e.g. Cape Town"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Bio
                        </label>
                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="bg-muted/30 border-none resize-none min-h-[80px]"
                            maxLength={150}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Interests
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableInterests.map(interest => (
                                <button
                                    key={interest}
                                    onClick={() => {
                                        if (interests.includes(interest)) {
                                            setInterests(interests.filter(i => i !== interest));
                                        } else {
                                            setInterests([...interests, interest]);
                                        }
                                    }}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                                        interests.includes(interest)
                                            ? "bg-primary border-primary text-white"
                                            : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={updateUser.isPending}
                        className="w-full py-6 rounded-xl font-bold text-lg bg-primary hover:opacity-90 transition-opacity"
                    >
                        {updateUser.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
