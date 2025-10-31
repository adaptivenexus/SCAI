"use client";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { IoFilterSharp } from "react-icons/io5";
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiEye,
  FiX,
  FiCheck,
} from "react-icons/fi";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { authFetch } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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
    } else {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const dropdownWidth = 192; // w-48 = 192px
      const dropdownHeight = 96; // Approximate height for 2 items

      // Calculate initial position
      let top = buttonRect.bottom + 8;
      let left = buttonRect.right - dropdownWidth;

      // Boundary checking
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust if dropdown goes off right edge
      if (left < 8) {
        left = buttonRect.left; // Align left edges instead
      }

      // Adjust if dropdown goes off bottom edge
      if (top + dropdownHeight > viewportHeight) {
        top = buttonRect.top - dropdownHeight - 8; // Show above button
      }

      setDropdownPosition({ top, left });
      setActionsIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-primary/20 to-accent-secondary/30 p-6">
      {/* Main Container */}
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <div className="flex items-center justify-between gap-6">
            {/* Left Section - Title and Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="heading-3 text-white">Members</h1>
                <div className="flex items-center gap-4 text-white/90 mt-1">
                  <div className="flex items-center gap-1">
                    <FiUsers className="w-3 h-3" />
                    <span className="label-text">
                      {members.length} Total Members
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiShield className="w-3 h-3" />
                    <span className="label-text">Role-based Access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions and Stats */}
            <div className="flex items-center gap-4">
              {/* Add Members Button */}
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-primary hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => openModal()}
              >
                <FiUserPlus className="w-4 h-4" />
                <span className="font-medium">Add Members</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-header with description */}
        <div className="bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 px-6 py-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <p className="text-secondary-foreground text-sm">
              Agency members can be given access to data in the project. Users
              with the "Viewer" role do not consume seats.
            </p>
            <button className="text-primary hover:text-secondary transition-colors duration-200 font-medium text-sm">
              Get More Seats
            </button>
          </div>
        </div>

        {/* Container Content */}
        <div className="px-8 py-2 space-y-6">
          {/* Success/Error Messages */}
          {message.text && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm border ${
                message.type === "success"
                  ? "bg-green-50/80 text-green-800 border-green-200"
                  : "bg-red-50/80 text-red-800 border-red-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {message.type === "success" ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiX className="w-4 h-4" />
                )}
              </div>
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Search Bar and Filter Button */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch color="#000000" className="h-5 w-5" />
              </div>
              <input
                id="search-member"
                type="text"
                placeholder="Search for name or email"
                className="w-full max-w-[700px] pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    <span className="text-sm font-bold text-white">
                      {members.length}/20
                    </span>
                  </div>
                </div>

                {/* Info & Action */}
                <div className="flex-1">
                  <p className="text-base font-semibold text-white">
                    User Seats
                  </p>
                  <p className="text-sm text-white/80">20 included in plan</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors">
                  Get More
                </button>
              </div>
            </div>
            <button className="p-3 bg-gradient-to-r from-accent-primary to-accent-secondary border border-white/40 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <IoFilterSharp className="h-5 w-5 text-primary group-hover:text-secondary transition-colors duration-200" />
            </button>
          </div>

          {/* Members Table */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 overflow-visible">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-8 py-4 border-b border-white/20">
              <div className="grid grid-cols-5 gap-4">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <FiUsers className="w-4 h-4" />
                  <span>Member</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-foreground font-semibold">
                  <FiShield className="w-4 h-4" />
                  <span>Role</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-foreground font-semibold">
                  <FiCalendar className="w-4 h-4" />
                  <span>Added</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-foreground font-semibold">
                  <FiEye className="w-4 h-4" />
                  <span>Status</span>
                </div>
                <div className="text-center text-foreground font-semibold">
                  Actions
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/20">
              {filteredMembers.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-secondary-foreground body-text">
                    No members found.
                  </p>
                  <p className="text-secondary-foreground label-text mt-1">
                    Try adjusting your search criteria
                  </p>
                </div>
              ) : (
                filteredMembers.map((member, idx) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-5 gap-4 px-8 py-6 hover:bg-gradient-to-r hover:from-accent-primary/20 hover:to-accent-secondary/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src="/user.jpg"
                          alt="Profile"
                          width={48}
                          height={48}
                          className="rounded-full aspect-square object-cover ring-2 ring-white/50"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-foreground font-semibold truncate group-hover:text-primary transition-colors duration-200">
                          {member.fullName}
                        </div>
                        <div className="flex items-center gap-1 text-secondary-foreground label-text">
                          <FiMail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full label-text font-medium">
                        <FiShield className="w-3 h-3" />
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-1 text-secondary-foreground label-text">
                        <FiCalendar className="w-3 h-3" />
                        <span>{member.added}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full label-text font-medium ${
                          member.lastActive === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            member.lastActive === "Active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        {member.lastActive}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <button
                          className="p-2 text-secondary-foreground hover:text-primary hover:bg-white/50 rounded-lg transition-all duration-200"
                          onClick={(e) => toggleActionsDropdown(idx, e)}
                        >
                          <HiOutlineEllipsisVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Dropdown Portal */}
      {actionsIndex !== null && (
        <div
          ref={actionsDropdownRef}
          className="fixed w-48 bg-white/95 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl z-[9999] overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 cursor-pointer transition-all duration-200"
            onClick={() => {
              const member = filteredMembers[actionsIndex];
              openModal(true, member);
              setActionsIndex(null);
            }}
          >
            <FiEdit3 className="w-4 h-4" />
            Edit Member
          </div>
          <div
            className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-all duration-200"
            onClick={() => {
              const member = filteredMembers[actionsIndex];
              handleRemove(member.id);
              setActionsIndex(null);
            }}
          >
            <FiTrash2 className="w-4 h-4" />
            Remove Member
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Members */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white/30 relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  {modal.isEditMode ? (
                    <FiEdit3 className="w-5 h-5 text-white" />
                  ) : (
                    <FiUserPlus className="w-5 h-5 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {modal.isEditMode ? "Edit Member" : "Add New Member"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-secondary-foreground hover:text-foreground hover:bg-white/50 rounded-xl transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            {message.text && message.type === "success" && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-600" />
                <span>{message.text}</span>
              </div>
            )}

            {/* Error Message */}
            {message.text && message.type === "error" && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3">
                <FiX className="w-5 h-5 text-red-600" />
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <FiUsers className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-secondary-foreground"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <FiMail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-secondary-foreground"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <FiPhone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-secondary-foreground"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <FiShield className="w-4 h-4" />
                  {modal.isEditMode ? "Set New Password" : "Password"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-secondary-foreground"
                  placeholder={
                    modal.isEditMode ? "Set new password" : "Enter password"
                  }
                />
              </div>
              {!modal.isEditMode && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <FiShield className="w-4 h-4" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-secondary-foreground"
                    placeholder="Confirm password"
                  />
                </div>
              )}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <FiShield className="w-4 h-4" />
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 pt-6 mt-6">
              <button
                className="flex-1 px-6 py-3 text-secondary-foreground bg-white/50 border border-white/30 rounded-xl hover:bg-white/70 transition-all duration-200 font-medium"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                onClick={handleSave}
              >
                {modal.isEditMode ? "Update Member" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagementPage;
