import type { Blog } from "@/types";
import BlogCard from "./BlogCard";

interface Props {
  blogs: Blog[] | null;
}

export default function BlogList({ blogs }: Props) {
  // const blogs: Blog[] = [
  //   {
  //     id: "1",
  //     title: "The future of AI in 2025",
  //     excerpt: "AI continues to reshape industries...",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  //     author: { name: "Aazil", avatar: "" },
  //     publishedAt: "2025-01-01",
  //   },
  //   {
  //     id: "2",
  //     title: "The future of AI in 2025",
  //     excerpt: "AI continues to reshape industries...",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  //     author: { name: "Aazil", avatar: "" },
  //     publishedAt: "2025-01-01",
  //   },
  //   {
  //     id: "3",
  //     title: "The future of AI in 2025",
  //     excerpt: "AI continues to reshape industries...",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  //     author: { name: "Aazil", avatar: "" },
  //     publishedAt: "2025-01-01",
  //   },
  //   {
  //     id: "4",
  //     title: "The future of AI in 2025",
  //     excerpt: "AI continues to reshape industries...",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  //     author: { name: "Aazil", avatar: "" },
  //     publishedAt: "2025-01-01",
  //   },
  //   {
  //     id: "5",
  //     title: "The future of AI in 2025",
  //     excerpt: "AI continues to reshape industries...",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  //     author: { name: "Aazil", avatar: "" },
  //     publishedAt: "2025-01-01",
  //   },
  //   {
  //     id: "6",
  //     title: "The future of AI in 2025",
  //     excerpt: "AI continues to reshape industries...",
  //     coverImage:
  //       "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  //     author: { name: "Aazil", avatar: "" },
  //     publishedAt: "2025-01-01",
  //   },
  //   // Add more blogs here
  // ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {blogs?.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
