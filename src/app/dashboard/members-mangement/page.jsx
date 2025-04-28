'use client';
import { HiChevronUpDown } from "react-icons/hi2";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";
import { IoFilterSharp } from "react-icons/io5";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// Main component for managing agency members
const MembersManagementPage = () => {
  // State for members list (will come from API later)
  const [members, setMembers] = useState([]);
  // State for modal (open/close, edit mode, form data)
  const [modal, setModal] = useState({ isOpen: false, isEditMode: false, editId: null });
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

  // Fetch members on component mount (API integration point)
  useEffect(() => {
    // TODO: Replace this with API call to fetch members
    // Example: fetch('/api/members').then(res => res.json()).then(data => setMembers(data));
    // For now, keeping members empty initially
  }, []);

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target)) {
        setActionsIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open modal for adding/editing members
  const openModal = (editMode = false, member = null) => {
    setModal({ isOpen: true, isEditMode: editMode, editId: member?.id || null });
    setFormData(
      editMode
        ? { ...member, password: "", confirmPassword: "" }
        : { fullName: "", email: "", phoneNumber: "", password: "", confirmPassword: "", role: "Administrator" }
    );
    setMessage({ type: "", text: "" });
  };

  // Close modal and reset form
  const closeModal = () => {
    setModal({ isOpen: false, isEditMode: false, editId: null });
    setFormData({ fullName: "", email: "", phoneNumber: "", password: "", confirmPassword: "", role: "Administrator" });
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
    if (!formData.email || !formData.email.includes("@")) return "Please enter a valid email.";
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) return "Please enter a valid phone number.";
    if (!modal.isEditMode) {
      if (!formData.password || formData.password.length < 8) return "Password must be at least 8 characters.";
      if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    }
    return "";
  };

  // Save member (add or edit)
  const handleSave = () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    if (modal.isEditMode) {
      // TODO: Replace this with API call to update member
      // Example: fetch(`/api/members/${modal.editId}`, { method: 'PUT', body: JSON.stringify(formData) });
      setMembers(
        members.map((member) =>
          member.id === modal.editId
            ? { ...member, ...formData, lastActive: timestamp }
            : member
        )
      );
      setMessage({ type: "success", text: "Member updated successfully!" });
    } else {
      // TODO: Replace this with API call to add member
      // Example: fetch('/api/members', { method: 'POST', body: JSON.stringify(formData) });
      const newMember = {
        id: Date.now(), // Temporary ID, should come from API
        ...formData,
        added: timestamp,
        lastActive: "Not yet",
      };
      setMembers([...members, newMember]);
      setMessage({ type: "success", text: "Member added successfully!" });
    }
    setTimeout(closeModal, 1000);
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
  const toggleActionsDropdown = (index) => {
    setActionsIndex(actionsIndex === index ? null : index);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Members Management</h1>
      </div>

      {/* Main Container */}
      <div className="w-full p-6 bg-white shadow-lg space-y-6 rounded-xl border">
        <div className="space-y-2 flex justify-between gap-3">
          <div className="space-y-2">
            <h4 className="heading-4">Agency members</h4>
            <p className="subtitle-text text-secondary-foreground">
              Agency members can be given access to data in the project. Users
              with the "Viewer" role do not consume seats.
            </p>
          </div>
          <div>
            <button
              className="primary-btn h-max w-max bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => openModal()}
            >
              + Add Members
            </button>
            <div className="flex flex-col items-end mt-4 gap-2">
              <h2 className="heading-5 text-foreground">{members.length} of 20</h2>
              <p className="body-text text-secondary-foreground">User Seats</p>
              <h2 className="body-text text-secondary-foreground">20 included in plan</h2>
              <h2 className="body-text text-primary">Get More Seats</h2>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={message.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
              />  
            </svg>
            {message.text}
          </div>
        )}

        {/* Search Bar and Filter Button */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search for name or email"
            className="px-3 py-2 border rounded-md w-full focus:outline-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="p-2 border rounded bg-accent-secondary">
            <IoFilterSharp className="h-5 w-5" />
          </button>
        </div>

        {/* Members Table */}
        <table className="w-full text-center border-separate border-spacing-y-2">
          <thead>
            <tr className="text-forground body-text">
              <th className="text-start">Member</th>
              <th className="text-center">Roles</th>
              <th>Added</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-gray-500 text-center">
                  No members found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member, idx) => (
                <tr key={member.id} className="bg-white border-b">
                  <td className="flex items-center gap-3 py-4">
                    <Image
                      src="/user.jpg"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full aspect-square object-cover"
                    />
                    <div>
                      <div className="text-forground label-text text-start">
                        {member.fullName}
                      </div>
                      <div className="text-secondary-foreground label-text">
                        {member.email}
                      </div>
                    </div>
                  </td>
                  <td className="text-forground label-text">{member.role}</td>
                  <td className="text-forground label-text">{member.added}</td>
                  <td className="text-forground label-text">{member.lastActive}</td>
                  <td>
                    <div className="relative flex items-center justify-center gap-1">
                      <button
                        className="text-primary w-5 h-5 cursor-pointer"
                        onClick={() => toggleActionsDropdown(idx)}
                      >
                        <HiOutlineEllipsisVertical />
                      </button>
                      {actionsIndex === idx && (
                        <div
                          ref={actionsDropdownRef}
                          className="absolute top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-10"
                        >
                          <div
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => openModal(true, member)}
                          >
                            Edit
                          </div>
                          <div
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleRemove(member.id)}
                          >
                            Remove from this project
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Members */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {modal.isEditMode ? "Edit Member" : "Add New Member"}
            </h2>
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={message.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                  />
                </svg>
                {message.text}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-primary"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-primary"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-primary"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {modal.isEditMode ? "Set New Password" : "Password"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-primary"
                  placeholder={modal.isEditMode ? "Set new password" : "Enter password"}
                />
              </div>
              {!modal.isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-primary"
                    placeholder="Confirm password"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-primary"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagementPage;