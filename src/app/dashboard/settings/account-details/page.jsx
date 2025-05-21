"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import { toast } from "react-toastify";

const AccountDetails = () => {
  const { user, refreshTokenFn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: "",
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
            agencyName: data.agency_name || "",
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
        agency_name: formData.agencyName,
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
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden space-y-6">
        <div className="bg-primary-gradient h-20 flex items-center justify-between px-6">
          {/* Left Side: Account Details Label */}
          <h4 className="heading-4 text-white font-bold drop-shadow-md">
            Account Details
          </h4>
          {/* Right Side: Short Description and Buttons */}
          <div className="flex items-center space-x-4">
            <p className="text-gray-100 text-sm max-w-xs">
              Manage your personal info like name, email, and contact
              preferences.
            </p>
          </div>
        </div>
        <div className="flex space-x-2 justify-end px-4">
          <Link
            href={"/dashboard/settings/security-privacy"}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition duration-200"
          >
            Change Password
          </Link>
          <button
            onClick={handleEditToggle}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition duration-200"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition duration-200"
            >
              Save
            </button>
          )}
        </div>
        <div className="p-8 space-y-6">
          <form className="grid grid-cols-2 gap-6">
            {/* Agency Name */}
            <div className="space-y-2">
              <label
                htmlFor="agencyName"
                className="block text-sm uppercase font-semibold text-gray-700"
              >
                Agency Name
              </label>
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-4 rounded-xl bg-slate-100 w-full outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm uppercase font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
                className="py-3 px-4 rounded-xl bg-slate-100 w-full outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
            {/* Phone Number */}
            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm uppercase font-semibold text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-4 rounded-xl bg-slate-100 w-full outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
            {/* City */}
            <div className="space-y-2">
              <label
                htmlFor="city"
                className="block text-sm uppercase font-semibold text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-4 rounded-xl bg-slate-100 w-full outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
            {/* Address */}
            <div className="space-y-2 col-span-2">
              <label
                htmlFor="address"
                className="block text-sm uppercase font-semibold text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-4 rounded-xl bg-slate-100 w-full outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
