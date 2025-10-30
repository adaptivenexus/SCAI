"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import { toast } from "react-toastify";
import { FiShield, FiLock, FiEye, FiEyeOff, FiSave, FiRefreshCw } from "react-icons/fi";

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
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
          <FiShield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="heading-4 text-foreground">Security & Privacy</h2>
          <p className="body-text text-secondary-foreground">
            Control login settings, privacy preferences, and account protection tools
          </p>
        </div>
      </div>
      {/* Password Change Form */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FiLock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="heading-5 text-foreground">Change Password</h3>
            <p className="text-sm text-secondary-foreground">Update your account password for better security</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Password Section */}
            <div className="space-y-4">
              <h4 className="label-text font-semibold text-foreground border-b border-accent-primary/30 pb-2">Current Password</h4>
              <div className="space-y-3">
                <label htmlFor="currentPassword" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FiLock className="w-4 h-4 text-primary" />
                  Enter Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full py-2.5 px-3 rounded-xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none text-sm"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground hover:text-primary transition-colors"
                  >
                    {showCurrentPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* New Password Section */}
            <div className="space-y-4">
              <h4 className="label-text font-semibold text-foreground border-b border-accent-primary/30 pb-2">New Password</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FiLock className="w-4 h-4 text-primary" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full py-2.5 px-3 rounded-xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none text-sm"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground hover:text-primary transition-colors"
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FiLock className="w-4 h-4 text-primary" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full py-2.5 px-3 rounded-xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none text-sm"
                      placeholder="Re-enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-accent-primary/30">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary text-primary hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span className="label-text font-medium">Reset</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span className="label-text font-medium">
                {loading ? "Updating..." : "Update Password"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg flex items-center justify-between">
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
      {/* Login Activity Section */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="heading-5 text-foreground">Login Activity</h3>
            <p className="text-sm text-secondary-foreground">Recent login sessions and device information</p>
          </div>
        </div>

        <div className="rounded-2xl border border-accent-primary/30 overflow-hidden bg-white/50">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-accent-primary to-accent-secondary">
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">Location</th>
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">Device</th>
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">Date/Time</th>
                <th className="py-4 px-6 text-center label-text font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-primary/20">
              <tr className="hover:bg-white/80 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">NY</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">New York, USA</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">C</span>
                    </div>
                    <span className="text-sm text-secondary-foreground">Chrome (Windows)</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-foreground">Apr 6, 2023, 10:30 AM</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    Current
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/80 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">UK</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">London, UK</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 text-xs font-bold">S</span>
                    </div>
                    <span className="text-sm text-secondary-foreground">Safari (Mac)</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-foreground">Apr 5, 2023, 2:15 PM</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                    Ended
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/80 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">JP</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Tokyo, Japan</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 text-xs font-bold">F</span>
                    </div>
                    <span className="text-sm text-secondary-foreground">Firefox (Linux)</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-foreground">Apr 4, 2023, 8:45 AM</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                    Ended
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacyPage;