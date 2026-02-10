import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/context/Context";
import { format } from "date-fns";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface BlogPost {
  id: number;
  post_id: string;
  title: string;
  content: string;
  coverImg: string | null;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
  like_count: number;
  dislike_count: number;
  is_liked_by_user: boolean;
  is_disliked_by_user: boolean;
}

export default function BlogView() {
  const { post_id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { BACKEND_URL, session } = useAppContext();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/posts/${post_id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("setting post data");
        setBlog(data);
        setLoading(false);
      });
  }, [post_id]);

  const handleReaction = async (type: "like" | "dislike") => {
    if (!blog) return;

    // optimistic UI
    setBlog((prev) =>
      prev
        ? {
            ...prev,
            like_count:
              type === "like"
                ? prev.like_count + (prev.is_liked_by_user ? -1 : 1)
                : prev.like_count,
            dislike_count:
              type === "dislike"
                ? prev.dislike_count + (prev.is_disliked_by_user ? -1 : 1)
                : prev.dislike_count,
            is_liked_by_user: type === "like" ? !prev.is_liked_by_user : false,
            is_disliked_by_user:
              type === "dislike" ? !prev.is_disliked_by_user : false,
          }
        : prev
    );

    await fetch(`/api/posts/${post_id}/react/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction: type }),
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!blog) {
    return <p className="text-center mt-10">Blog not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card className="rounded-2xl overflow-hidden">
        {/* Cover Image */}
        {blog.coverImg && (
          <img
            src={blog.coverImg}
            alt={blog.title}
            className="w-full max-h-[420px] object-contain bg-muted"
          />
        )}

        <CardHeader>
          <CardTitle className="text-3xl">{blog.title}</CardTitle>

          {/* Author */}
          <div className="flex items-center gap-3 mt-4">
            <Avatar>
              <AvatarImage src={blog.author_avatar ?? undefined} />
              <AvatarFallback>{blog.author_name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">{blog.author_name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(blog.created_at), "PPP")}
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Blog Content */}
        <CardContent className="prose max-w-none py-8">
          {blog.content}
        </CardContent>

        <Separator />

        {/* Reactions */}
        <CardFooter className="flex gap-6">
          <button
            onClick={() => handleReaction("like")}
            className={`flex items-center gap-2 text-sm transition ${
              blog.is_liked_by_user ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            <ThumbsUp className="h-5 w-5" />
            {blog.like_count}
          </button>

          <button
            onClick={() => handleReaction("dislike")}
            className={`flex items-center gap-2 text-sm transition ${
              blog.is_disliked_by_user
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            <ThumbsDown className="h-5 w-5" />
            {blog.dislike_count}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
