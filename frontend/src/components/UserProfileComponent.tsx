import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/Context";
import { uploadImageToSupabase } from "@/helper";
import type { UserProfile } from "@/types";
import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type ProfileForm = {
  name: string;
  age: number | string;
  college: string;
  year: number | string;
  profileImgFile: File | null;
  goal: string;
  shareProfile: boolean;
  currentSkills: string[];
  learningSkills: string[];
};

const ProfileSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<UserProfile>({
    name: "",
    age: null,
    college: "",
    year: null,
    profileImgFile: "",
    goal: "",
    shareProfile: false,
    currentSkills: [],
    learningSkills: [],
  });

  const { userProfile, user, session } = useAppContext();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [learningSkillInput, setLearningSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Cleanup image preview
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const filename = `${crypto.randomUUID}-${user?.id ? "" : ""}`;
    const newSupabaseImgUrl = uploadImageToSupabase(file, "userProfileImages");

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setForm((prev) => ({
      ...prev,
      profileImgFile: "",
    }));
  };

  const addSkill = (type: "currentSkills" | "learningSkills") => {
    const value =
      type === "currentSkills" ? skillInput.trim() : learningSkillInput.trim();

    if (!value) return;

    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], value],
    }));

    type === "currentSkills" ? setSkillInput("") : setLearningSkillInput("");
  };

  const removeSkill = (
    type: "currentSkills" | "learningSkills",
    index: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (form.profileImgFile) {
        formData.append("profile_image", form.profileImgFile);
      }

      const res = await fetch(`${BACKEND_URL}/api/user-profile`, {
        method: "PUT",
        headers: {
          //   "Content-type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      console.log("Profile updated successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-2xl font-semibold">Profile Details</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src={previewUrl || ""} />
          <AvatarFallback>{form.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Camera className="mr-2 h-4 w-4" />
          Upload photo
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        <Input
          name="college"
          placeholder="College"
          value={form.college}
          onChange={handleChange}
        />
        <Input
          name="year"
          type="number"
          placeholder="College Year"
          value={form.year}
          onChange={handleChange}
        />
      </div>

      {/* Goal */}
      <Textarea
        name="goal"
        placeholder="Your career goal"
        value={form.goal}
        onChange={handleChange}
      />

      {/* Current skills */}
      <div>
        <p className="text-sm font-medium mb-2">Current skills</p>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add skill"
          />
          <Button onClick={() => addSkill("currentSkills")}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {form.currentSkills.map((skill, i) => (
            <Badge key={i} variant="secondary">
              {skill}
              <X
                className="ml-2 h-3 w-3 cursor-pointer"
                onClick={() => removeSkill("currentSkills", i)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Learning skills */}
      <div>
        <p className="text-sm font-medium mb-2">Learning skills</p>
        <div className="flex gap-2">
          <Input
            value={learningSkillInput}
            onChange={(e) => setLearningSkillInput(e.target.value)}
            placeholder="Add skill"
          />
          <Button onClick={() => addSkill("learningSkills")}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {form.learningSkills.map((skill, i) => (
            <Badge key={i} variant="secondary">
              {skill}
              <X
                className="ml-2 h-3 w-3 cursor-pointer"
                onClick={() => removeSkill("learningSkills", i)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Share profile */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={form.shareProfile}
          onCheckedChange={(checked: boolean | "indeterminate") =>
            setForm((prev) => ({
              ...prev,
              shareProfile: checked === true,
            }))
          }
        />
        <span className="text-sm">Allow others to view my profile</span>
      </div>

      {/* Save */}
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save profile"}
      </Button>
    </div>
  );
};

export default ProfileSettings;
