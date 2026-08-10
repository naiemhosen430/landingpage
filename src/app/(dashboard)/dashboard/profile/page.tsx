"use client";

import { useState } from "react";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/store/authApi";

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery(undefined);
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();

  const [profileForm, setProfileForm] = useState({
    name: user?.data?.name || "",
    email: user?.data?.email || "",
    phone: user?.data?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [passError, setPassError] = useState("");

  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handlePasswordSave = async () => {
    setPassError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPassSaved(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPassSaved(false), 3000);
    } catch (err: any) {
      setPassError(err?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account settings</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Personal Information</h3>
            {saved && (
              <span
                style={{
                  color: "var(--success)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Saved!
              </span>
            )}
          </div>
          <div className="card-body">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "var(--radius-full)",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {user?.data?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {user?.data?.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                  {user?.data?.email}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    textTransform: "capitalize",
                  }}
                >
                  {user?.data?.role}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                placeholder="+880..."
              />
            </div>
            <button
              onClick={handleProfileSave}
              className="btn btn-primary"
              disabled={updating}
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Change Password</h3>
            {passSaved && (
              <span
                style={{
                  color: "var(--success)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Password updated!
              </span>
            )}
          </div>
          <div className="card-body">
            {passError && (
              <div className="auth-error" style={{ marginBottom: 16 }}>
                {passError}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
            <button
              onClick={handlePasswordSave}
              className="btn btn-primary"
              disabled={changingPassword}
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
