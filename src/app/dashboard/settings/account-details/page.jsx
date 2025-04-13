"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const AccountDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "JohnDoe1234@gmail.com",
    phoneNumber: "+91 9999777788",
    password: "***************",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Add save logic here

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
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
              height={100}
              width={100}
            />
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

          <form className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block subtitle-text">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block subtitle-text">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="py-3 px-2 rounded-xl bg-slate-100 w-full outline-none border disabled:opacity-70"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block subtitle-text">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
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
