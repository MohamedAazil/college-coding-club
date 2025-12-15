import { useRef, useState } from "react";

type Props = {
  onChange: (file: File) => void;
};

export function CoverUploader({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="w-full h-56 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition"
    >
      {preview ? (
        <img
          src={preview}
          alt="Cover"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <span className="text-muted-foreground">
          Click to upload cover image
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />
    </div>
  );
}
