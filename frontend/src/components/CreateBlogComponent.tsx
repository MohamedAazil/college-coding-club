import { useAppContext } from "@/context/Context";
import {
  convertBlobUrlToFile,
  extractImagesFromContent,
  replaceImageWithSupabaseUrls,
  uploadImageToSupabase,
} from "@/helper";
import type { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlogEditor } from "./BlogEditor";
import { CoverUploader } from "./CoverUploader";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [content, setContent] = useState<JSONContent | null>(null);
  const [contentText, setContentText] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<boolean>(false);
  const { BACKEND_URL, session, user } = useAppContext();

  const navigate = useNavigate();

  const handleOnChange = (content_json: JSONContent, content_text: string) => {
    setContent(content_json);
    setContentText(content_text);
  };

  const handleSubmit = async () => {
    setPublishing(true);

    let coverImgUrl: string | null = null;

    if (cover instanceof File) coverImgUrl = await uploadImageToSupabase(cover);

    const imageUrls = await extractImagesFromContent(content);
    const imageUrlMap = new Map<string, string>();

    for (let imageUrl of imageUrls) {
      const file = await convertBlobUrlToFile(imageUrl);
      const supabaseUrl = await uploadImageToSupabase(file);
      imageUrlMap.set(imageUrl, supabaseUrl);
    }
    if (coverImgUrl) imageUrls.push(coverImgUrl);
    const finalContent = replaceImageWithSupabaseUrls(content, imageUrlMap);

    const payload = {
      title,
      coverImgUrl,
      content_json: finalContent,
      content_text: contentText,
      author_id: user?.id,
      media: imageUrls,
    };

    console.log("POST DATA:", payload);

    try {
      const resp = await fetch(`${BACKEND_URL}/api/community-posts`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        navigate("/blogs");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <input
        type="text"
        placeholder="Post title..."
        className="w-full text-4xl font-bold outline-none bg-transparent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Cover */}
      <CoverUploader onChange={setCover} />

      {/* Content */}
      <BlogEditor onChange={handleOnChange} />

      {/* Publish */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground"
      >
        {publishing ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
}
