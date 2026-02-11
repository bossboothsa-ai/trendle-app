import { useUser } from "@/hooks/use-trendle";
import { Plus } from "lucide-react";

export function StoryRail() {
  const { data: user } = useUser();

  // Mock stories data for visual flair
  const stories = [
    { id: 1, name: "Jason", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop" },
    { id: 2, name: "Sarah", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { id: 3, name: "Mike", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { id: 4, name: "Emma", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop" },
    { id: 5, name: "Alex", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
  ];

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-4 pl-4 space-x-4 flex items-start">
      {/* My Story Add Button */}
      <div className="flex flex-col items-center gap-1 min-w-[64px]">
        <div className="relative w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-muted-foreground/30">
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {user?.avatar && <img src={user.avatar} className="w-full h-full object-cover opacity-50" />}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary rounded-full p-1 text-white shadow-lg">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium text-muted-foreground">My Story</span>
      </div>

      {/* Friends Stories */}
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group">
          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
               {/* User Avatar from Unsplash */}
              <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <span className="text-xs font-medium">{story.name}</span>
        </div>
      ))}
    </div>
  );
}
