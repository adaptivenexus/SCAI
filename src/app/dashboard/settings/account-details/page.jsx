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
          `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/profile/`, // ✅ Fixed URL
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
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/profile/`, // ✅ Fixed URL
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
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="heading-4">Account Details</h4>
        <p className="text-secondary-foreground subtitle-text">
          Manage your personal info like name, email, and contact preferences.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden space-y-6">
        <div className="bg-primary-gradient h-20"></div>
        <div className="p-6 space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleEditToggle}
              className="ml-auto bg-primary text-white px-8 py-2 rounded hover:opacity-80 transition duration-200"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          <form className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="agencyName" className="block subtitle-text">
                Agency Name
              </label>
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block subtitle-text">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label htmlFor="email" className="block subtitle-text">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label htmlFor="address" className="block subtitle-text">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="block subtitle-text">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div>
            {/* <div className="space-y-2">
              <label htmlFor="country" className="block subtitle-text">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div> */}
            <Link
              href={"/dashboard/settings/security-privacy"}
              className="primary-btn w-max py-3 rounded-xl text-center mt-3 block h-max"
            >
              Change Password
            </Link>
          </form>

          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
