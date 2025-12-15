import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "@tiptap/extension-image";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";
import { useRef } from "react";

type Props = {
  onChange: (content: JSONContent, content_text: string) => void;
};

export function BlogEditor({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Start writing your blog...</p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getText());
      console.table(editor.getJSON());
    },
  });

  if (!editor) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: previewUrl }).run();

    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2 border p-2 rounded-lg bg-background">
        <ToggleGroup type="multiple" className="flex gap-1">
          <ToggleGroupItem
            value="bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="heading"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 size={16} />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="bullet"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={16} />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="ordered"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={16} />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="image"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={16} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="border rounded-lg p-4 min-h-[250px] prose dark:prose-invert focus:outline-none"
      />
    </div>
  );
}
