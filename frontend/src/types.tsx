import type { JSONContent } from "@tiptap/react";

export interface Blog {
  id: string;
  title: string;
  content: string;
  coverImg?: string;
  author_name: string;
  author_avatar?: string;
  created_at: string;
}

export interface UserProfile {
  id: number;
  user_id: string;
  name: string;
  age: number;
  college: string;
  year: number;
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
