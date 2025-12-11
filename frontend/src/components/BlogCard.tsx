import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Blog } from "@/types";
import { format } from "date-fns";
interface Props {
  blog: Blog;
}

export default function BlogCard({ blog }: Props) {
  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer rounded-2xl overflow-hidden">
      {blog.coverImage && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader>
        <h2 className="text-lg font-semibold line-clamp-2">{blog.title}</h2>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={blog.author.avatar} />
          <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{blog.author.name}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(blog.publishedAt), "PPP")}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
