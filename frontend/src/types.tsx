import type { JSONContent } from "@tiptap/react";
export type ReactionType = "like" | "dislike";
export interface Blog {
  id: string;
  post_id: string;
  title: string;
  content: string;
  coverImg?: string;
  author_name: string;
  author_avatar?: string;
  created_at: string;
  like_count: number;
  dislike_count: number;
  is_liked_by_user: boolean;
  is_disliked_by_user: boolean;
}

export interface UserProfile {
  id: number;
  user_id: string;
  name: string;
  age: number;
  college: string;
  year: number;
  userImgUrl: string;
}

export interface BlogEditorProps {
  onChange: (value: JSONContent | null) => void;
}

export type BlogDraft = {
  title: string;
  coverImage?: File | null;
  content: JSONContent;
};

export type ImageNode = {
  nodePath: number[];
  src: string;
};
