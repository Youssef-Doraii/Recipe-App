import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { useAuthStore } from "../store/authStore";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { user, fetchUser } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(
        user.user_metadata?.display_name ||
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          ""
      );
      setEmail(user.email || "");

      const userAvatar =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.avatar ||
        user.user_metadata?.picture ||
        null;

      setAvatarUrl(userAvatar);
      console.log("Avatar URL:", userAvatar);
    }
  }, [user]);

  useEffect(() => {
    if (editing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editing]);

  if (!user) {
    navigate("/");
    return null;
  }

  const handlePasswordChange = async () => {
    setPasswordFeedback(null);
    if (!currentPassword || !newPassword) {
      setPasswordFeedback("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback("New password must be at least 6 characters.");
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    if (signInError) {
      setPasswordFeedback("Current password is incorrect.");
      return;
    }
    const { error: pwError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (pwError) {
      setPasswordFeedback(pwError.message);
    } else {
      setPasswordFeedback("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setShowPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error: metaError } = await supabase.auth.updateUser({
        data: { display_name: name, avatar_url: avatarUrl },
      });
      if (metaError) {
        setFeedback(
          metaError.message || "Error updating profile. Please try again."
        );
      } else {
        setFeedback("Profile updated!");
        fetchUser();
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setFeedback("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNameClick = () => {
    setEditing(true);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !user) return;

    setAvatarUploading(true);
    setFeedback(null);

    try {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB");
      }

      const fileExt = file.name.split(".").pop();
      const validExtensions = ["jpg", "jpeg", "png", "gif"];

      if (!fileExt || !validExtensions.includes(fileExt.toLowerCase())) {
        throw new Error("Invalid file type. Please upload a JPG, PNG or GIF");
      }

      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Failed to upload image");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      console.log("Uploaded to:", publicUrl);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) {
        console.error("User metadata update error:", updateError);
        throw new Error("Failed to update profile");
      }

      setAvatarUrl(publicUrl);
      setTimeout(async () => {
        await fetchUser();
        setFeedback("Avatar updated successfully!");
      }, 500);
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      setFeedback(error.message || "Error uploading avatar. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="profile-main-bg">
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-avatar-large">
            <div
              className="avatar-edit-wrapper-large"
              onClick={handleAvatarClick}
              title="Click to change avatar"
              style={{ cursor: "pointer" }}
            >
              <img
                src={avatarUrl || "/avatar-placeholder.png"}
                alt="Profile"
                className="profile-avatar circular-avatar-fix"
                onError={(e) => {
                  console.log("Image load error, falling back to placeholder");
                  e.currentTarget.src = "/avatar-placeholder.png";
                }}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div className="avatar-upload-overlay">
                <span>Change</span>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: "none" }}
            aria-label="Upload avatar image"
          />

          <div className="profile-card-userinfo">
            <h2 className="profile-card-name">
              {name || user?.user_metadata?.display_name || "User"}
            </h2>
            <p className="profile-card-email">{email}</p>
          </div>
        </div>
        <form className="profile-card-fields" onSubmit={handleSubmit}>
          <label>
            Name:
            {editing ? (
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <input
                type="text"
                value={name}
                onClick={handleNameClick}
                readOnly
                className="clickable-input"
                style={{ cursor: "pointer" }}
                title="Click to edit"
              />
            )}
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              disabled
              title="Email cannot be changed"
            />
          </label>
          {feedback && <div className="profile-feedback">{feedback}</div>}
          <div className="profile-card-actions">
            {editing && (
              <>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Change"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
        <div className="profile-card-actions">
          <button
            className="profile-toggle-pw"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide Password Change" : "Change Password"}
          </button>
        </div>
        {showPassword && (
          <div className="profile-password-form">
            <label>
              Current Password:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <button onClick={handlePasswordChange}>Update Password</button>
            {passwordFeedback && (
              <div className="profile-feedback">{passwordFeedback}</div>
            )}
          </div>
        )}
        {avatarUploading && (
          <div className="avatar-uploading-indicator">Uploading avatar...</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
