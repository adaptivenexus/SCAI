"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import { toast } from "react-toastify";
import { FiEdit3, FiSave, FiX, FiLock, FiUser, FiMail, FiPhone, FiMapPin, FiHome } from "react-icons/fi";

const AccountDetails = () => {
  const { user, refreshTokenFn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    country: "",
    password: "***************",
  });

  // Fetch profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.role === "admin") {
          const res = await authFetch(
            `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/profile/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
            refreshTokenFn
          );
          const data = await res.json();
          if (res.ok) {
            setFormData({
              name: data.agency_name || "",
              phoneNumber: data.phone_number || "",
              email: user.email || "",
              address: data.address || "",
              city: data.city || "",
              country: data.country || "",
              password: "***************",
            });
          } else {
            throw new Error("Failed to fetch profile details");
          }
        } else {
          setFormData({
            name: user.name || "",
            phoneNumber: user.phone_number || "",
            email: user.email || "",
            address: user.address || "",
            city: user.city || "",
            country: user.country || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile details");
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const payload = {
        agency_name: formData.name,
        phone_number: formData.phoneNumber,
        address: formData.address || null,
        city: formData.city || null,
        country: 1,
      };

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/profile/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        },
        refreshTokenFn
      );

      if (!res.ok) {
        throw new Error("Failed to update account details");
      }

      toast.success("Account details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating account details:", error);
      toast.error("Failed to update account details");
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="heading-4 text-foreground">Account Details</h2>
            <p className="body-text text-secondary-foreground">
              Manage your personal information and contact preferences
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/settings/security-privacy"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-primary hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <FiLock className="w-4 h-4" />
            <span className="label-text font-medium">Change Password</span>
          </Link>
          
          {user?.role !== "member" && (
            <>
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span className="label-text font-medium">Edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300"
                  >
                    <FiX className="w-4 h-4" />
                    <span className="label-text font-medium">Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <FiSave className="w-4 h-4" />
                    <span className="label-text font-medium">Save</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agency Name */}
          <div className="space-y-3">
            <label htmlFor="name" className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiUser className="w-4 h-4 text-primary" />
              Agency Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full py-4 px-4 rounded-2xl border-2 transition-all duration-300 outline-none ${
                  isEditing
                    ? "border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg"
                    : "border-accent-primary/30 bg-accent-primary/20 text-secondary-foreground"
                }`}
                placeholder="Enter your agency name"
              />
              {isEditing && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label htmlFor="email" className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiMail className="w-4 h-4 text-primary" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled={true}
                className="w-full py-4 px-4 rounded-2xl border-2 border-accent-primary/30 bg-accent-primary/20 text-secondary-foreground outline-none"
                placeholder="Your email address"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <FiLock className="w-4 h-4 text-secondary-foreground" />
              </div>
            </div>
            <p className="text-xs text-secondary-foreground">Email cannot be changed for security reasons</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-3">
            <label htmlFor="phoneNumber" className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiPhone className="w-4 h-4 text-primary" />
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full py-4 px-4 rounded-2xl border-2 transition-all duration-300 outline-none ${
                  isEditing
                    ? "border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg"
                    : "border-accent-primary/30 bg-accent-primary/20 text-secondary-foreground"
                }`}
                placeholder="Enter your phone number"
              />
              {isEditing && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* City */}
          <div className="space-y-3">
            <label htmlFor="city" className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiMapPin className="w-4 h-4 text-primary" />
              City
            </label>
            <div className="relative">
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full py-4 px-4 rounded-2xl border-2 transition-all duration-300 outline-none ${
                  isEditing
                    ? "border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg"
                    : "border-accent-primary/30 bg-accent-primary/20 text-secondary-foreground"
                }`}
                placeholder="Enter your city"
              />
              {isEditing && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3 lg:col-span-2">
            <label htmlFor="address" className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiHome className="w-4 h-4 text-primary" />
              Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full py-4 px-4 rounded-2xl border-2 transition-all duration-300 outline-none ${
                  isEditing
                    ? "border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg"
                    : "border-accent-primary/30 bg-accent-primary/20 text-secondary-foreground"
                }`}
                placeholder="Enter your full address"
              />
              {isEditing && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Info Section */}
        {user?.role === "member" && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <FiLock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="label-text font-semibold text-foreground">Member Account</h4>
                <p className="text-sm text-secondary-foreground">
                  Contact your administrator to update account details
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
