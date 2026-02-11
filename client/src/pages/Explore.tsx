import { BottomNav } from "@/components/BottomNav";
import { usePlaces } from "@/hooks/use-trendle";
import { MapPin, Star, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Explore() {
  const { data: places, isLoading } = usePlaces();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Coffee", "Nightlife", "Outdoors", "Food"];

  const filteredPlaces = activeCategory === "All" 
    ? places 
    : places?.filter(p => p.category === activeCategory);

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
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-foreground text-background shadow-lg" 
                  : "bg-white border border-border text-muted-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="h-40 bg-muted rounded-2xl animate-pulse" />
        ) : (
          filteredPlaces?.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Place Image */}
              <img src={place.image} alt={place.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium border border-white/10">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">4.8</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{place.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{place.distance}</span>
                  </div>
                  <span>•</span>
                  <span>{place.pointsPerVisit} pts</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}
