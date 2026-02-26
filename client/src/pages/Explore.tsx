import { usePlaces } from "@/hooks/use-trendle";
import { MapPin, Star, X, Info, Utensils, Coffee, Moon, Scissors, Sparkles, ShoppingBag, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlaceDetails } from "@/components/PlaceDetails";

export default function Explore() {
  const { data: places, isLoading } = usePlaces();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const categories = ["All", "Coffee", "Brunch", "Nightlife", "Food", "Fashion", "Beauty", "Wellness", "Grooming"];

  const filteredPlaces = activeCategory === "All"
    ? places
    : places?.filter(p => p.category === activeCategory);

  const getIcon = (cat: string) => {
    switch (cat) {
      case "Coffee": return <Coffee className="w-4 h-4" />;
      case "Nightlife": return <Moon className="w-4 h-4" />;
      case "Food": return <Utensils className="w-4 h-4" />;
      case "Fashion": return <ShoppingBag className="w-4 h-4" />;
      case "Beauty": return <Sparkles className="w-4 h-4" />;
      case "Wellness": return <HeartPulse className="w-4 h-4" />;
      case "Grooming": return <Scissors className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 py-6">
        <h1 className="text-3xl font-display font-bold mb-2">Explore CPT</h1>
        <p className="text-muted-foreground">Discover trending spots near you.</p>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-6 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2",
                activeCategory === cat
                  ? "bg-foreground text-background shadow-lg"
                  : "bg-white border border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {cat !== "All" && getIcon(cat)}
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 grid grid-cols-1 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-3xl animate-pulse" />
          ))
        ) : (
          filteredPlaces?.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPlace(place)}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-xl"
            >
              {/* Place Image */}
              <img
                src={place.image}
                alt={place.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">4.8</span>
                  </div>
                </div>
                <h3 className="text-2xl text-weight-bold mb-1 font-display">{place.name}</h3>
                <div className="flex items-center gap-4 text-sm text-weight-regular text-gray-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{place.distance}</span>
                  </div>
                  <span>•</span>
                  <span>{place.pointsPerVisit} pts earned</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>

      {/* Place Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetails
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </AnimatePresence>    </div>
  );
}
