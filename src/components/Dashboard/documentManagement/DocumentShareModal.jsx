"use client";

import { useAuth } from "@/context/AuthContext";
import { GlobalContext } from "@/context/GlobalProvider";
import { useContext, useEffect, useState, useTransition } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

const DocumentShareModal = ({ setIsShareDocumentOpen, docs }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    access_password: "",
    expired_at: addHoursToCurrentTime(1),
    shared_by_agency: user.id,
  });
  const [passwordError, setPasswordError] = useState(""); // State for password validation error
  const [loading, startTransition] = useTransition();

  // Utility function to add hours to current time for expiration
  function addHoursToCurrentTime(hours) {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + hours);
    return currentTime.toISOString();
  }

  // Utility function to extract file name from URL with proper undefined handling
  const extractFileName = (url) => {
    // If url is undefined, null, or empty, return a default value
    if (!url || typeof url !== "string") {
      toast.error("Document file is missing. Cannot share this document.");
      throw new Error("Document file is missing");
    }
    try {
      // Split the URL by '/' and get the last part
      const parts = url.split("/");
      let fileName = parts[parts.length - 1];
      // Remove query parameters if any (e.g., ?X-Amz-Algorithm=...)
      fileName = fileName.split("?")[0];
      // Decode URL-encoded characters (e.g., %20 to space)
      fileName = decodeURIComponent(fileName);
      // If fileName is empty after processing, throw an error
      if (!fileName) {
        toast.error("Document file name is invalid. Cannot share this document.");
        throw new Error("Document file name is invalid");
      }
      return fileName;
    } catch (error) {
      console.error("Error extracting file name:", error);
      throw error; // Re-throw to handle in handleSubmit
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  // Handle form submission to save shared documents in localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(() => {
      // Check if docs array is empty
      if (!docs || docs.length === 0) {
        toast.error("No documents selected to share.");
        return;
      }

      // Validate password
      const error = validatePassword(formData.access_password);
      if (error) {
        setPasswordError(error);
        toast.error(error);
        return;
      }

      // Check if we're on the client side
      if (typeof window === "undefined") {
        toast.error("Cannot share document on server side.");
        return;
      }

      // Get existing shared documents from localStorage
      const sharedDocs = JSON.parse(localStorage.getItem("sharedDocuments")) || [];

      try {
        // Map selected documents to the format needed for SharedDocument
        const newDocs = docs.map((doc) => ({
          client: doc.client || "", // Client name
          file: extractFileName(doc.file), // Extract file name with validation
          shared_date: new Date().toISOString().split("T")[0], // Shared date (current date)
          password: formData.access_password, // Password from modal
        }));

        // Save to localStorage
        localStorage.setItem("sharedDocuments", JSON.stringify([...sharedDocs, ...newDocs]));

        // Show success message and close modal
        setIsShareDocumentOpen(false);
        toast.success("Document shared successfully");
      } catch (error) {
        // Error already handled in extractFileName with toast
        return;
      }
    });
  };

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center z-10"
      onClick={() => setIsShareDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[800px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5">Share Document</h5>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="access_password">
              Access Password <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="access_password"
              id="access_password"
              className="border rounded-lg p-3 w-full outline-none"
              value={formData.access_password}
              placeholder="Enter access password"
              required
              onChange={(e) => {
                setFormData({
                  ...formData,
                  access_password: e.target.value,
                });
                setPasswordError(""); // Clear error on change
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className={`primary-btn ${(!docs || docs.length === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!docs || docs.length === 0}
          >
            Submit
          </button>
        </form>
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center rounded-lg z-20">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="4"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4.93 4.93a10 10 0 0114.14 14.14l1.41 1.41a12 12 0 00-16.97-16.97l1.42 1.42z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentShareModal;