import { BottomNav } from "@/components/BottomNav";
import { usePlaces } from "@/hooks/use-trendle";
import { MapPin, Star, X, Info, Utensils, Coffee, Moon, Scissors, Sparkles, ShoppingBag, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
                <h3 className="text-2xl font-bold mb-1 font-display">{place.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-300">
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
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlace(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-auto"
            >
              {/* Header Image */}
              <div className="relative h-64 sm:h-72">
                <img src={selectedPlace.image} className="w-full h-full object-cover" alt={selectedPlace.name} />
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-6 right-6 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-card to-transparent">
                  <h2 className="text-3xl font-display font-bold">{selectedPlace.name}</h2>
                </div>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto hide-scrollbar">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-primary">
                    {getIcon(selectedPlace.category)}
                    <span className="font-bold text-sm tracking-wide uppercase">{selectedPlace.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedPlace.location} • {selectedPlace.distance}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {selectedPlace.description || "Discover the magic of this local favorite. Perfect for creators and trendsetters looking for authentic vibes."}
                </p>

                {/* Gallery Section */}
                <div>
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    The Gallery
                  </h4>
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {selectedPlace.gallery && selectedPlace.gallery.length > 0 ? (
                      selectedPlace.gallery.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                          <img src={img} className="w-full h-full object-cover transition-transform hover:scale-105" loading="lazy" />
                        </div>
                      ))
                    ) : (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
                      ))
                    )}
                  </div>
                </div>

                <Button className="w-full py-6 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                  Visit & Earn {selectedPlace.pointsPerVisit} Points
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
