
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  name: string;
  city: string;
  bio: string;
  avatar: string;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialProfile: ProfileData;
  onSave: (profile: ProfileData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  initialProfile,
  onSave,
}) => {
  const [form, setForm] = useState<ProfileData>(initialProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialProfile.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.city.trim() || !form.bio.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!avatarPreview) {
      setError("You must provide a profile photo.");
      return;
    }

    setIsSaving(true);

    let avatarUrl = form.avatar;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: avatarFile.type || "image/png",
        });
      if (uploadError) {
        setIsSaving(false);
        setError("Failed to upload image.");
        return;
      }
      const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(filePath);
      avatarUrl = urlData.publicUrl;
    }

    onSave({ ...form, avatar: avatarUrl });
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <Input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleInputChange}
            required
          />
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-20 h-20">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt={form.name} />
              ) : (
                <AvatarFallback>?</AvatarFallback>
              )}
            </Avatar>
            <label className="w-full">
              <span className="block text-sm font-medium text-gray-700 mb-1 text-center">
                Upload photo
              </span>
              <Input
                type="file"
                accept="image/*"
                className="mt-0"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                required={!avatarPreview}
              />
            </label>
            {!avatarPreview && (
              <div className="text-xs text-destructive">
                You must upload a profile photo.
              </div>
            )}
          </div>
          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleInputChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
            rows={3}
            required
          />
          {/* Delete button moved below all fields */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleDeleteAvatar}
            disabled={!avatarPreview}
          >
            Delete Photo
          </Button>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <div className="flex space-x-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !avatarPreview}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
