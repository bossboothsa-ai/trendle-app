import { Heart, MessageCircle, Share2, MapPin, MoreHorizontal, UserPlus, UserMinus, Play, Copy, Edit3, Trash2, Flag, MicOff, UserX } from "lucide-react";
import { type Post, type User, type Place } from "@shared/schema";
import { useLikePost, useComments, useCreateComment, useFollowUser, useUnfollowUser, useCurrentUser } from "@/hooks/use-trendle";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdatePost, useDeletePost } from "@/hooks/use-trendle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface PostCardProps {
  post: Post & { author: User; place: Place | null; hasLiked: boolean; hasFollowed: boolean };
}

export function PostCard({ post }: PostCardProps) {
  const { data: currentUser } = useCurrentUser();
  const likePost = useLikePost();
  const { data: comments } = useComments(post.id);
  const createComment = useCreateComment();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption || "");
  const [isDeleting, setIsDeleting] = useState(false);

  const isMe = currentUser?.id === post.author.id;

  const handleShare = async () => {
    const shareData = {
      title: 'Trendle Moment',
      text: post.caption || 'Check out this moment on Trendle!',
      url: window.location.origin + `/posts/${post.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({ title: "Shared successfully" });
      } catch (err) {
        // Fallback if user cancelled or failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const url = window.location.origin + `/posts/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link copied to clipboard" });
    }).catch(() => {
      toast({ title: "Could not copy link", variant: "destructive" });
    });
  };

  const handleLike = () => {
    likePost.mutate(post.id);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      createComment.mutate({ postId: post.id, text: commentText.trim() });
      setCommentText("");
    }
  };

  const handleUpdate = () => {
    updatePost.mutate({ id: post.id, data: { caption: editCaption } }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const handleDelete = () => {
    deletePost.mutate(post.id, {
      onSuccess: () => setIsDeleting(false)
    });
  };

  const isFollowing = post.hasFollowed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 mb-8 mx-4"
    >
      {/* User Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3 group/author">
          <Avatar className="w-10 h-10 border border-border group-hover/author:border-primary transition-colors">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none group-hover/author:text-primary transition-colors">{post.author.username}</span>
            <span className="text-[10px] text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </Link>

        {post.author.id !== 1 && ( // Don't show follow for yourself
          <Button
            variant={isFollowing ? "ghost" : "outline"}
            size="sm"
            className={cn(
              "h-8 rounded-full text-xs font-bold gap-1",
              isFollowing ? "text-muted-foreground hover:text-destructive" : "border-primary text-primary hover:bg-primary hover:text-white"
            )}
            onClick={() => isFollowing ? unfollowUser.mutate(post.author.id) : followUser.mutate(post.author.id)}
            disabled={followUser.isPending || unfollowUser.isPending}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-3 h-3" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>

      {/* Media Carousel */}
      <div className="w-full bg-black/5 relative aspect-[4/5] sm:aspect-square overflow-hidden bg-muted/30">
        {post.media && post.media.length > 1 ? (
          <Carousel className="w-full h-full group/carousel">
            <CarouselContent className="h-full ml-0">
              {post.media.map((item, index) => (
                <CarouselItem key={index} className="pl-0 h-full">
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    {item && item.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                            Moment
                          </span>
                        </div>
                      </div>
                    ) : item ? (
                      <img
                        src={item.url}
                        alt={`Post ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80";
                        }}
                      />
                    ) : null}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/20 border-none text-white hover:bg-white/40 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
            <CarouselNext className="right-2 bg-white/20 border-none text-white hover:bg-white/40 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
          </Carousel>
        ) : post.media && post.media.length === 1 && post.media[0] ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {post.media[0].type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  src={post.media[0].url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-2xl">
                    <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/10">
                    Moment
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={post.media[0].url}
                alt="Post"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80";
                }}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
              <Play className="w-5 h-5 opacity-20" />
            </div>
            <span className="text-xs font-medium opacity-50 uppercase tracking-widest">Processing Moment...</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Caption/Title */}
        <div>
          <h3 className="text-xl font-bold font-display mb-2">{post.caption}</h3>
        </div>

        {/* Place Name */}
        {post.place && (
          <div className="flex items-center gap-2 text-muted-foreground group/place cursor-pointer">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium text-xs group-hover/place:text-primary transition-colors">{post.place?.name}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="group flex items-center gap-2 focus:outline-none"
            >
              <Heart
                className={cn(
                  "w-7 h-7 transition-colors duration-200",
                  post.hasLiked ? "fill-accent text-accent" : "text-foreground group-hover:text-accent"
                )}
              />
              <span className="font-semibold text-sm">{post.likesCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="group flex items-center gap-2"
            >
              <MessageCircle className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" />
              <span className="font-semibold text-sm">{post.commentsCount}</span>
            </button>
            <button
              onClick={handleShare}
              className="group flex items-center gap-2"
            >
              <Share2 className="w-7 h-7 text-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground focus:outline-none p-1">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-border/50">
              {isMe ? (
                <>
                  <DropdownMenuItem onClick={() => {
                    setEditCaption(post.caption || "");
                    setIsEditing(true);
                  }} className="gap-2 p-3 cursor-pointer">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleting(true)} className="gap-2 p-3 text-destructive focus:text-destructive cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete post</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => toast({ title: "Reported", description: "Thank you for helping keep Trendle safe." })} className="gap-2 p-3 cursor-pointer">
                    <Flag className="w-4 h-4" />
                    <span>Report post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Muted", description: "You will no longer see posts from this user." })} className="gap-2 p-3 cursor-pointer">
                    <MicOff className="w-4 h-4" />
                    <span>Mute user</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Blocked", description: "User has been blocked." })} className="gap-2 p-3 text-destructive focus:text-destructive cursor-pointer">
                    <UserX className="w-4 h-4" />
                    <span>Block user</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={copyToClipboard} className="gap-2 p-3 border-t cursor-pointer">
                <Copy className="w-4 h-4" />
                <span>Copy link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md bg-background border-none shadow-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Update your post caption below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Write a caption..."
                className="bg-muted/30 border-none resize-none text-base focus-visible:ring-1 focus-visible:ring-primary min-h-[100px] rounded-xl"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={updatePost.isPending}>
                {updatePost.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Alert */}
        <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
          <AlertDialogContent className="bg-background border-none shadow-2xl rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This post will be permanently deleted from your profile and the feed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deletePost.isPending}
              >
                {deletePost.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Delete Post
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              {/* Comments List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments?.map(comment => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-bold mr-1">{comment.author.username}</span>
                    {comment.text}
                  </div>
                ))}
                {(!comments || comments.length === 0) && (
                  <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                )}
              </div>

              {/* Comment Input */}
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  className="flex-1"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || createComment.isPending}
                >
                  Post
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div >
  );
}
