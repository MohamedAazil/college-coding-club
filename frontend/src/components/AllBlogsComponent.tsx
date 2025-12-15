import { useAppContext } from "@/context/Context";
import type { Blog } from "@/types";
import { useEffect, useState } from "react";
import BlogList from "./BlogList";
const AllBlogsComponent = () => {
  const { BACKEND_URL, session } = useAppContext();
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const fetchAllBlogs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/community-posts`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      debugger;
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!(session && BACKEND_URL)) return;
    fetchAllBlogs();
  }, [session, BACKEND_URL]);
  return <BlogList blogs={blogs} />;
};

export default AllBlogsComponent;
