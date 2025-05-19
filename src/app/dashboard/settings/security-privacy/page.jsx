"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import { toast } from "react-toastify";

const SecurityPrivacyPage = () => {
  const { user, refreshTokenFn } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }

      const payload = {
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
      };

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/change-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        },
        refreshTokenFn
      );

      if (!res.ok) {
        throw new Error("Failed to update password");
      }

      toast.success("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="heading-4">Security & Privacy</h4>
        <p className="subtitle-text text-secondary-foreground">
          Control login settings, privacy preferences, and account protection
          tools.
        </p>
      </div>
      <form
        onSubmit={handlePasswordSubmit}
        className="w-full p-6 bg-white shadow-lg space-y-6 rounded-xl border"
      >
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="block subtitle-text">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70" // ✅ Changed back to w-full
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showCurrentPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c-4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <label htmlFor="newPassword" className="block subtitle-text">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70" // ✅ Changed back to w-full
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showNewPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c-4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <label htmlFor="confirmPassword" className="block subtitle-text">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70" // ✅ Changed back to w-full
                placeholder="Re-enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c-4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="secondary-btn px-8"
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="primary-btn px-8"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      <div className="p-6 bg-white shadow-lg rounded-xl border flex items-center justify-between">
        <div className="space-y-2">
          <h5 className="heading-5">Two-Factor Authentication</h5>
          <p className="body-text text-secondary-foreground">
            Add an extra layer of security to your account by enabling
            two-factor authentication.
          </p>
        </div>
        <div className="flex gap-4">
          <button type="button" className="secondary-btn px-8">
            Enable
          </button>
          {false && (
            <button type="button" className="primary-btn px-8">
              Disable
            </button>
          )}
        </div>
      </div>
      <div className="p-6 bg-white shadow-lg rounded-xl border">
        <h5 className="heading-5">Login Activity</h5>
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="heading-5 py-4">Location</th>
              <th className="heading-5 py-4">Device</th>
              <th className="heading-5 py-4">Date/Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="py-4">
              <td className="body-text text-secondary-foreground py-4">
                New York, USA
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Chrome (Windows)
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Apr 6, 2023, 10:30 AM
              </td>
            </tr>
            <tr className="py-4">
              <td className="body-text text-secondary-foreground py-4">
                London, UK
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Safari (Mac)
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Apr 5, 2023, 2:15 PM
              </td>
            </tr>
            <tr className="py-4">
              <td className="body-text text-secondary-foreground py-4">
                Tokyo, Japan
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Firefox (Linux)
              </td>
              <td className="body-text text-secondary-foreground py-4">
                Apr 4, 2023, 8:45 AM
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityPrivacyPage;