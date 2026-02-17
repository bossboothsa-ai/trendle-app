import { useState, useEffect } from "react";
import { useUserStories } from "@/hooks/use-trendle";
import { X } from "lucide-react";

interface StoryModalProps {
  userId: number;
  onClose: () => void;
}

export function StoryModal({ userId, onClose }: StoryModalProps) {
  const { data: stories, isLoading } = useUserStories(userId);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, currentIndex, stories]); // Improved dependencies

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100]">
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-2">No stories found</h3>
          <p className="text-gray-400">This user has no stories to display</p>
          <button
            onClick={() => {
              onClose();
            }}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];
  // Correctly access media URL
  const mediaUrl = currentStory.media?.[0]?.url || (currentStory as any).image;

  const next = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={() => {
        onClose();
      }} />

      {/* Story container */}
      <div className="relative w-full max-w-md h-[85vh] bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
              <img
                src={currentStory.user.avatar}
                alt={currentStory.user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">
                {currentStory.user.username}
              </div>
              <div className="text-gray-400 text-xs">
                {new Date(currentStory.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors pointer-events-auto"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-16">
          <div className="flex gap-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${index < currentIndex
                  ? "bg-white"
                  : index === currentIndex
                    ? "bg-primary"
                    : "bg-white/30"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Story image */}
        <div className="w-full h-full relative">
          <img
            src={mediaUrl}
            alt={currentStory.caption || "Story"}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors disabled:opacity-0"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={next}
            disabled={currentIndex === stories.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors disabled:opacity-0"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-sm">{currentStory.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}
