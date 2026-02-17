import { useState } from "react";
import { useUser, useStories } from "@/hooks/use-trendle";
import { Plus } from "lucide-react";
import { StoryModal } from "./StoryModal";
import { CreateStoryModal } from "./CreateStoryModal";

export function StoryRail() {
  const { data: user } = useUser();
  const { data: stories = [] } = useStories();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openCreateStory, setOpenCreateStory] = useState(false);

  // Group stories by user
  const userStoriesMap = new Map<number, typeof stories>();
  stories.forEach((story) => {
    if (!userStoriesMap.has(story.userId)) {
      userStoriesMap.set(story.userId, []);
    }
    userStoriesMap.get(story.userId)?.push(story as any);
  });

  // Get unique users with stories
  const uniqueUsers = Array.from(userStoriesMap.keys()).map((userId) => {
    const userStories = userStoriesMap.get(userId)!;
    return {
      id: userId,
      username: userStories[0].user.username,
      avatar: userStories[0].user.avatar,
    };
  });


  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-4 pl-4 space-x-4 flex items-start">
      {/* My Story Add Button */}
      <div
        className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer"
        onClick={() => setOpenCreateStory(true)}
      >
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
      {uniqueUsers.map((storyUser) => (
        <div
          key={storyUser.id}
          className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group"
          onClick={() => {
            setSelectedUserId(storyUser.id);
          }}
        >
          <div className="w-16 h-16 rounded-full p-[3px] bg-[#B8A9FF] shadow-lg shadow-[rgba(184,169,255,0.3)] group-hover:scale-105 transition-transform" style={{ boxShadow: '0 0 15px rgba(184,169,255,0.35)' }}>
            <div className="w-full h-full rounded-full bg-white overflow-hidden">
              <img
                src={storyUser.avatar}
                alt={storyUser.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="text-xs font-medium">{storyUser.username}</span>
        </div>
      ))}

      {/* Story Modal */}
      {selectedUserId && (
        <StoryModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      <CreateStoryModal open={openCreateStory} onOpenChange={setOpenCreateStory} />
    </div>
  );
}
