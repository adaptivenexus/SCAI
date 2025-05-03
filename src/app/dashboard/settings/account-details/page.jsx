"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ add this

const AccountDetails = () => {
  const { user } = useAuth(); // ✅ auth hook

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "+91 9999777788", // Phone number abhi fix hai, jab API se aaye tab replace karna
    password: "***************",
  });

  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = user.agency_name.split(" ");
      setFormData({
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        email: user.email || "",
        phoneNumber: "+91 9999777788", // 
        password: "***************",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Save logic
    setIsEditing(false);
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
          <div className="flex items-center">
        
            <div>
              <h2 className="text-lg font-semibold">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-500">{formData.email}</p>
            </div>
            <button
              onClick={handleEditToggle}
              className="ml-auto bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          <form className="grid grid-cols-2 gap-4 ">
            <div className="space-y-2 ">
              <label htmlFor="firstName" className="block subtitle-text">
                Agency Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={`${formData.firstName} ${formData.lastName}`}
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
            <Link
              href={"/dashboard/settings/security-privacy"}
              className="primary-btn w-max py-3 rounded-xl text-center mt-3"
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
