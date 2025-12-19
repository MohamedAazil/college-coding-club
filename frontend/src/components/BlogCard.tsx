import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAppContext } from "@/context/Context";
import type { Blog, ReactionType } from "@/types";
import { format } from "date-fns";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface Props {
  blog: Blog;
}

export default function BlogCard({ blog }: Props) {
  const { BACKEND_URL, session } = useAppContext();

  const [reaction, setReaction] = useState<"like" | "dislike" | null>(
    !(blog?.is_liked_by_user || blog?.is_disliked_by_user)
      ? null
      : blog.is_disliked_by_user
      ? "dislike"
      : "like"
  );

  const handleReaction = async (type: ReactionType) => {
    try {
      const prevReactionState = reaction;
      if (type == "like") {
        blog.like_count += 1;
      } else if (type == "dislike") {
        blog.dislike_count += 1;
      }
      setReaction(type);
      const response = await fetch(`${BACKEND_URL}/api/post-reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ reaction: type, post_id: blog?.post_id }),
      });

      if (!response.ok) {
        if (type == "like") blog.like_count -= 1;
        else if (type == "dislike") blog.dislike_count -= 1;
        setReaction(prevReactionState);
        throw new Error("Failed to react");
      }

      const data = await response.json();
      console.log("Reaction updated:", data);
    } catch (error) {
      console.error(error);
    }
  };
  const activeClass =
    "bg-transparent text-primary dark:bg-primary/20 dark:text-primary";
  const inactiveClass = "text-muted-foreground";

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer rounded-2xl overflow-hidden">
      {/* Cover Image */}
      {blog.coverImg && (
        <div className="h-48 w-full overflow-hidden px-6 pt-6">
          <img
            src={blog.coverImg}
            alt={blog.title}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      )}

      {/* Title */}
      <CardHeader>
        <h2 className="text-lg font-semibold line-clamp-2">{blog.title}</h2>
      </CardHeader>

      {/* Preview */}
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {blog.content.slice(0, 120)}...
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between">
        {/* Author */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={blog.author_avatar} />
            <AvatarFallback>{blog.author_name?.[0]}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium">{blog.author_name}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(blog.created_at), "PPP")}
            </p>
          </div>
        </div>

        {/* Likes / Dislikes */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <button
            className={`flex items-center gap-1 text-sm transition
              ${reaction === "like" ? activeClass : inactiveClass}`}
          >
            <ThumbsUp
              className="h-4 w-4 cursor-pointer"
              onClick={() => handleReaction("like")}
            />
            {blog.like_count}
          </button>

          <button
            className={`flex items-center gap-1 text-sm transition
              ${reaction === "dislike" ? activeClass : inactiveClass}`}
          >
            <ThumbsDown
              className="h-4 w-4 cursor-pointer"
              onClick={() => handleReaction("dislike")}
            />
            {blog.dislike_count}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
