import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateHostEvent, usePlaces } from "@/hooks/use-trendle";
import { Calendar, MapPin, Users, FileText, Sparkles, Zap, Star } from "lucide-react";
import { hostCategories, eventPromotionTiers } from "@shared/schema";

interface CreateHostEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateHostEventModal({ open, onOpenChange }: CreateHostEventModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venueId, setVenueId] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [pointsReward, setPointsReward] = useState("100");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [promotionTier, setPromotionTier] = useState<string>(eventPromotionTiers[0]); // Default to basic

  const { data: venues } = usePlaces();
  const createEvent = useCreateHostEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !venueId || !category || !startDate || !startTime || !endDate || !endTime) return;

    const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
    const endDateTime = new Date(`${endDate}T${endTime}`).toISOString();

    await createEvent.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
      venueId: parseInt(venueId),
      category: category as any,
      startDateTime,
      endDateTime,
      pointsReward: parseInt(pointsReward) || 100,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      promotionTier: promotionTier as any,
    });

    // Reset form
    setName("");
    setDescription("");
    setVenueId("");
    setCategory("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setPointsReward("100");
    setMaxAttendees("");
    setPromotionTier(eventPromotionTiers[0]);
    onOpenChange(false);
  };

  const isFormValid = name.trim() && venueId && category && startDate && startTime && endDate && endTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl">Create Social Experience</DialogTitle>
          </div>
          <DialogDescription>
            Host a social event at a partner venue. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <Label htmlFor="eventName" className="text-sm font-medium">
              Event Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="eventName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Friday Social Night"
              className="mt-1"
              required
            />
          </div>

          {/* Venue Selection */}
          <div>
            <Label htmlFor="venue" className="text-sm font-medium">
              Select Venue <span className="text-destructive">*</span>
            </Label>
            <Select value={venueId} onValueChange={setVenueId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a partner venue" />
              </SelectTrigger>
              <SelectContent>
                {venues?.map((venue: any) => (
                  <SelectItem key={venue.id} value={venue.id.toString()}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.name}</span>
                      <span className="text-muted-foreground text-xs">• {venue.location}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Event Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {hostCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime" className="text-sm font-medium">
                Start Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-sm font-medium">
                End Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what to expect..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Points & Max Attendees */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="points" className="text-sm font-medium">
                Points Reward
              </Label>
              <Input
                id="points"
                type="number"
                value={pointsReward}
                onChange={(e) => setPointsReward(e.target.value)}
                className="mt-1"
                min={0}
                max={500}
              />
              <p className="text-xs text-muted-foreground mt-1">For checking in</p>
            </div>
            <div>
              <Label htmlFor="maxAttendees" className="text-sm font-medium">
                Max Attendees
              </Label>
              <Input
                id="maxAttendees"
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                className="mt-1"
                min={1}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Promotion Tier */}
          <div>
            <Label htmlFor="promotionTier" className="text-sm font-medium">
              Visibility Options
            </Label>
            <Select value={promotionTier} onValueChange={setPromotionTier}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">
                  <div className="flex items-center justify-between">
                    <span>Basic Listing</span>
                    <span className="text-xs text-muted-foreground">Free</span>
                  </div>
                </SelectItem>
                <SelectItem value="push">
                  <div className="flex items-center justify-between">
                    <span>Boosted Event</span>
                    <span className="text-xs text-yellow-600">Paid</span>
                  </div>
                </SelectItem>
                <SelectItem value="featured">
                  <div className="flex items-center justify-between">
                    <span>Featured Event</span>
                    <span className="text-xs text-orange-600">Paid</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {promotionTier === "basic" && "Event appears in standard feeds"}
              {promotionTier === "push" && "Higher visibility in discovery and notifications"}
              {promotionTier === "featured" && "Top placement in all event feeds"}
            </p>
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
              disabled={!isFormValid || createEvent.isPending}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {createEvent.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your event will appear in discovery. Add promotion for more visibility.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
