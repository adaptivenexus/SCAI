"use client";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { IoFilterSharp } from "react-icons/io5";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import FloatingMenu from "@/components/Dashboard/Overlay/FloatingMenu";
import FullscreenModal from "@/components/Dashboard/Overlay/FullscreenModal";
import { authFetch } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
  FiSave,
  FiMail,
  FiPhone,
  FiUser,
  FiLock,
  FiShield,
} from "react-icons/fi";

// Main component for managing agency members
const MembersManagementPage = () => {
  const { refreshTokenFn } = useAuth();

  // State for members list (will come from API later)

  const [members, setMembers] = useState([]);
  // State for modal (open/close, edit mode, form data)
  const [modal, setModal] = useState({
    isOpen: false,
    isEditMode: false,
    editId: null,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "Administrator",
  });
  // State for actions dropdown and search
  const [actionsIndex, setActionsIndex] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const actionsDropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Static roles for dropdown (can be fetched from API later)
  const roles = ["Administrator", "Contributor", "Developer", "Editor"];

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fetchMembers = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency-member/members/`,
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
      if (Array.isArray(data.agency_members)) {
        setMembers(
          data.agency_members.map((m) => ({
            id: m.id,
            fullName: m.member_name,
            email: m.email,
            phoneNumber: m.phone_number,
            added: new Date(m.created_at).toLocaleDateString(),
            lastActive: m.is_active ? "Active" : "Inactive",
            role: "Member", // Default role, adjust if API provides role
          }))
        );
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch members." });
    }
  };
  // Fetch members on component mount (API integration point)
  useEffect(() => {
    fetchMembers();
  }, []);

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target)
      ) {
        setActionsIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open modal for adding/editing members
  const openModal = (editMode = false, member = null) => {
    setModal({
      isOpen: true,
      isEditMode: editMode,
      editId: member?.id || null,
    });
    setFormData(
      editMode
        ? { ...member, password: "", confirmPassword: "" }
        : {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            role: "Administrator",
          }
    );
    setMessage({ type: "", text: "" });
  };

  // Close modal and reset form
  const closeModal = () => {
    setModal({ isOpen: false, isEditMode: false, editId: null });
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "Administrator",
    });
    setMessage({ type: "", text: "" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  // Validate form inputs before saving
  const validateForm = () => {
    if (!formData.fullName) return "Full Name is required.";
    if (!formData.email || !formData.email.includes("@"))
      return "Please enter a valid email.";
    if (!formData.phoneNumber || formData.phoneNumber.length < 10)
      return "Please enter a valid phone number.";
    if (!modal.isEditMode) {
      if (!formData.password || formData.password.length < 8)
        return "Password must be at least 8 characters.";
      if (formData.password !== formData.confirmPassword)
        return "Passwords do not match.";
    }
    return "";
  };

  // Save member (add or edit)
  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    // Add member via API
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency-member/add/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            password2: formData.confirmPassword,
            member_name: formData.fullName,
            phone_number: formData.phoneNumber,
            agency: 0, // TODO: Replace with actual agency ID if available
          }),
        },
        refreshTokenFn
      );
      if (!res.ok) throw new Error("Failed to add member");
      setMessage({ type: "success", text: "Member added successfully!" });
      fetchMembers(); // Refresh list
      setTimeout(closeModal, 1000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add member." });
    }
  };

  // Remove member
  const handleRemove = (id) => {
    // TODO: Replace this with API call to delete member
    // Example: fetch(`/api/members/${id}`, { method: 'DELETE' });
    setMembers(members.filter((member) => member.id !== id));
    setActionsIndex(null);
    setMessage({ type: "success", text: "Member removed successfully!" });
  };

  // Toggle actions dropdown
  const toggleActionsDropdown = (index, event) => {
    if (actionsIndex === index) {
      setActionsIndex(null);
      setMenuAnchorEl(null);
    } else {
      setActionsIndex(index);
      setMenuAnchorEl(event.currentTarget);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="heading-4 text-foreground">Role Management</h2>
            <p className="body-text text-secondary-foreground">
              Manage roles and permissions for your team members
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => openModal()}
        >
          <FiUserPlus className="w-4 h-4" />
          <span className="label-text font-medium">Add Member</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg space-y-8">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <h3 className="heading-5 text-foreground mb-2">Agency Members</h3>
            <p className="body-text text-secondary-foreground">
              Manage team member access and permissions. Users with "Viewer"
              role do not consume seats.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary border border-primary/20">
              {/* Progress ring */}
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-white/30"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(members.length / 20) * 176} 176`}
                    className="text-white transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text- font-bold text-white">
                    {members.length}/20
                  </span>
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">User Seats</p>
                <p className="text-xs text-white/80">20 included in plan</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors">
                Get More
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  message.type === "success"
                    ? "M5 13l4 4L19 7"
                    : "M6 18L18 6M6 6l12 12"
                }
              />
            </svg>
            {message.text}
          </div>
        )}

        {/* Search Bar and Filter Button */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
            <input
              type="text"
              placeholder="Search for name or email"
              className="w-full py-4 pl-12 pr-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-4 rounded-2xl border-2 border-accent-primary/50 bg-white hover:bg-accent-primary/20 transition-all duration-300">
            <IoFilterSharp className="h-5 w-5 text-primary" />
          </button>
        </div>

        {/* Members Table */}
        <div className="rounded-2xl border border-accent-primary/30 overflow-hidden bg-white/50">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-accent-primary to-accent-secondary">
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">
                  Member
                </th>
                <th className="py-4 px-6 text-center label-text font-semibold text-foreground">
                  Role
                </th>
                <th className="py-4 px-6 text-center label-text font-semibold text-foreground">
                  Added
                </th>
                <th className="py-4 px-6 text-center label-text font-semibold text-foreground">
                  Last Active
                </th>
                <th className="py-4 px-6 text-center label-text font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-primary/20">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-accent-primary/50 flex items-center justify-center">
                        <FiUsers className="w-8 h-8 text-secondary-foreground" />
                      </div>
                      <div>
                        <h4 className="label-text font-medium text-foreground">
                          No Members Found
                        </h4>
                        <p className="text-sm text-secondary-foreground">
                          Add team members to get started
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => (
                  <tr
                    key={member.id}
                    className="hover:bg-white/80 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <Image
                            src="/user.jpg"
                            alt="Profile"
                            width={48}
                            height={48}
                            className="rounded-2xl aspect-square object-cover"
                          />
                        </div>
                        <div>
                          <div className="label-text font-semibold text-foreground">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-secondary-foreground">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-foreground">
                      {member.added}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.lastActive === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {member.lastActive}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative flex items-center justify-center">
                        <button
                          className="p-2 rounded-xl hover:bg-accent-primary/20 transition-colors"
                          onClick={(e) => toggleActionsDropdown(idx, e)}
                        >
                          <HiOutlineEllipsisVertical className="w-5 h-5 text-secondary-foreground" />
                        </button>
                        <FloatingMenu
                          open={actionsIndex === idx}
                          anchorEl={menuAnchorEl}
                          placement="bottom-end"
                          onClose={() => setActionsIndex(null)}
                          className="w-48"
                        >
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                            onClick={() => openModal(true, member)}
                          >
                            <FiEdit3 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">
                              Edit Member
                            </span>
                          </button>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                            onClick={() => handleRemove(member.id)}
                          >
                            <FiTrash2 className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">
                              Remove Member
                            </span>
                          </button>
                        </FloatingMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding/Editing Members */}
      <FullscreenModal open={modal.isOpen} onClose={closeModal} centered>
        <div
          className="bg-white/95 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 w-full max-w-4xl shadow-2xl pointer-events-auto"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              {modal.isEditMode ? (
                <FiEdit3 className="w-6 h-6 text-white" />
              ) : (
                <FiUserPlus className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="heading-4 text-foreground">
                {modal.isEditMode ? "Edit Member" : "Add New Member"}
              </h2>
              <p className="text-sm text-secondary-foreground">
                {modal.isEditMode
                  ? "Update member information"
                  : "Add a new team member to your agency"}
              </p>
            </div>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <FiCheck className="w-5 h-5 text-green-600" />
              ) : (
                <FiX className="w-5 h-5 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.text}
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 label-text font-semibold text-foreground">
                  <FiUser className="w-4 h-4 text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 label-text font-semibold text-foreground">
                  <FiMail className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none"
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 label-text font-semibold text-foreground">
                  <FiPhone className="w-4 h-4 text-primary" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 label-text font-semibold text-foreground">
                  <FiLock className="w-4 h-4 text-primary" />
                  {modal.isEditMode ? "Set New Password" : "Password"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none"
                  placeholder={
                    modal.isEditMode ? "Set new password" : "Enter password"
                  }
                />
              </div>

              {!modal.isEditMode && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 label-text font-semibold text-foreground">
                    <FiLock className="w-4 h-4 text-primary" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none"
                    placeholder="Confirm password"
                  />
                </div>
              )}

              <div className="space-y-3">
                <label className="flex items-center gap-2 label-text font-semibold text-foreground">
                  <FiShield className="w-4 h-4 text-primary" />
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none appearance-none"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-secondary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-accent-primary/30">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
              onClick={closeModal}
            >
              <FiX className="w-4 h-4" />
              <span className="label-text font-medium">Cancel</span>
            </button>
            <button
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={handleSave}
            >
              <FiSave className="w-4 h-4" />
              <span className="label-text font-medium">
                {modal.isEditMode ? "Update Member" : "Add Member"}
              </span>
            </button>
          </div>
        </div>
      </FullscreenModal>
    </div>
  );
};

export default MembersManagementPage;
