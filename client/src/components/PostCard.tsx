import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal } from "lucide-react";
import { type Post, type User, type Place } from "@shared/schema";
import { useLikePost } from "@/hooks/use-trendle";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface PostCardProps {
  post: Post & { author: User; place: Place | null; hasLiked: boolean };
}

export function PostCard({ post }: PostCardProps) {
  const likePost = useLikePost();

  const handleLike = () => {
    likePost.mutate(post.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border/50 mb-6"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            {/* Author Avatar */}
            <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none">{post.author.username}</h3>
            {post.place && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                <span>{post.place.name}</span>
              </div>
            )}
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-[4/5] w-full bg-muted relative">
        {/* Post Image */}
        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className="group flex items-center gap-1.5 focus:outline-none"
            >
              <Heart 
                className={cn(
                  "w-7 h-7 transition-colors duration-200", 
                  post.hasLiked ? "fill-accent text-accent" : "text-foreground group-hover:text-accent"
                )} 
              />
              {post.likesCount > 0 && (
                <span className="font-semibold text-sm">{post.likesCount}</span>
              )}
            </button>
            <button className="group flex items-center gap-1.5">
              <MessageCircle className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" />
              {post.commentsCount > 0 && (
                <span className="font-semibold text-sm">{post.commentsCount}</span>
              )}
            </button>
            <button>
              <Share2 className="w-7 h-7 text-foreground hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-1">
          {post.caption && (
            <p className="text-sm">
              <span className="font-bold mr-2">{post.author.username}</span>
              {post.caption}
            </p>
          )}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-2">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
