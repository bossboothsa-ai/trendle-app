import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpgradeToHost } from "@/hooks/use-trendle";
import { Sparkles, Users, Calendar, Zap } from "lucide-react";

interface HostUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HostUpgradeModal({ open, onOpenChange }: HostUpgradeModalProps) {
  const [hostName, setHostName] = useState("");
  const [hostBio, setHostBio] = useState("");
  const upgradeToHost = useUpgradeToHost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim() || hostName.length < 2) return;
    
    await upgradeToHost.mutateAsync({
      hostName: hostName.trim(),
      hostBio: hostBio.trim() || undefined,
    });
    
    onOpenChange(false);
  };

  const benefits = [
    { icon: Calendar, title: "Create Events", desc: "Host social experiences at partner venues" },
    { icon: Users, title: "Build Community", desc: "Bring people together for unique moments" },
    { icon: Zap, title: "Earn Recognition", desc: "Get verified and grow your following" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl">Become a Social Host</DialogTitle>
          </div>
          <DialogDescription>
            Transform your account to host social experiences and events at partner venues.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Benefits */}
          <div className="grid gap-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                <benefit.icon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Fields */}
          <div className="space-y-3 pt-2">
            <div>
              <Label htmlFor="hostName" className="text-sm font-medium">
                Host Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hostName"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g., Jenna's Socials"
                className="mt-1"
                minLength={2}
                maxLength={50}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is how you'll appear as a host
              </p>
            </div>

            <div>
              <Label htmlFor="hostBio" className="text-sm font-medium">
                Host Bio
              </Label>
              <Textarea
                id="hostBio"
                value={hostBio}
                onChange={(e) => setHostBio(e.target.value)}
                placeholder="Tell people what kind of events you host..."
                className="mt-1"
                rows={3}
                maxLength={200}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!hostName.trim() || hostName.length < 2 || upgradeToHost.isPending}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {upgradeToHost.isPending ? "Upgrading..." : "Become a Host"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            No subscription required. Pay-per-event promotion available.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
