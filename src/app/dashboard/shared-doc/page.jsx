"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";

// SharedDocument component - Displays a table of shared documents with specific columns
const SharedDocument = () => {
  // State for shared documents, loaded from localStorage
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePasswords, setVisiblePasswords] = useState({}); // State for password visibility
  const [showFullPassword, setShowFullPassword] = useState(null); // State for showing full password in modal

  const itemsPerPage = 10; // Number of items per page

  // Load and clean documents from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedDocs = JSON.parse(localStorage.getItem("sharedDocuments")) || [];
      
      // Filter out invalid entries (where file is "Unnamed Document" or undefined)
      storedDocs = storedDocs.filter((doc) => 
        doc.file && typeof doc.file === "string" && doc.file !== "Unnamed Document"
      );

      // Update localStorage with cleaned data
      localStorage.setItem("sharedDocuments", JSON.stringify(storedDocs));

      // Set the cleaned documents to state
      setDocuments(storedDocs);

      // Initialize password visibility for each document
      setVisiblePasswords(
        storedDocs.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
      );
    }
  }, []);

  // Function to refresh documents from localStorage
  const refreshDocuments = () => {
    if (typeof window !== "undefined") {
      let updatedDocs = JSON.parse(localStorage.getItem("sharedDocuments")) || [];

      // Filter out invalid entries again on refresh
      updatedDocs = updatedDocs.filter((doc) => 
        doc.file && typeof doc.file === "string" && doc.file !== "Unnamed Document"
      );

      // Update localStorage with cleaned data
      localStorage.setItem("sharedDocuments", JSON.stringify(updatedDocs));

      setDocuments(updatedDocs);

      // Reset password visibility
      setVisiblePasswords(
        updatedDocs.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
      );
    }
  };

  // Function to toggle password visibility for a specific row
  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to truncate password for display
  const truncatePassword = (password, maxLength = 10) => {
    if (!password) return "••••••"; // Handle undefined or empty password
    if (password.length <= maxLength) return password;
    return password.substring(0, maxLength) + "...";
  };

  // Function to extract file name from URL with proper undefined handling
  const extractFileName = (url) => {
    // If url is undefined, null, or empty, return a default value
    if (!url || typeof url !== "string") {
      return "N/A"; // This should not happen now due to filtering
    }
    try {
      // Split the URL by '/' and get the last part
      const parts = url.split("/");
      let fileName = parts[parts.length - 1];
      // Remove query parameters if any (e.g., ?X-Amz-Algorithm=...)
      fileName = fileName.split("?")[0];
      // Decode URL-encoded characters (e.g., %20 to space)
      fileName = decodeURIComponent(fileName);
      // If fileName is empty after processing, return default
      return fileName || "N/A";
    } catch (error) {
      console.error("Error extracting file name:", error);
      return "N/A";
    }
  };

  // Filter documents based on search query
  const filteredItems = useMemo(() => {
    return documents.filter(
      (doc) =>
        (doc.client || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.file || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate visible page numbers for pagination
  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-5">Shared Documents</h2>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by client or document name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <button
          onClick={refreshDocuments}
          className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-all duration-300"
        >
          <IoIosRefresh />
          Refresh
        </button>
        <button className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-all duration-300">
          <FiDownload />
          Export
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-accent-primary">
            <tr>
              {/* Column: Client Name */}
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Client Name
              </th>
              {/* Column: Document Name */}
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Document Name
              </th>
              {/* Column: Shared Date */}
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Shared Date
              </th>
              {/* Column: Password */}
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Password
              </th>
              {/* Column: Action */}
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((doc, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              return (
                <tr key={globalIndex} className="hover:bg-gray-50 transition-all duration-200">
                  {/* Client Name */}
                  <td className="px-6 py-4 text-foreground">{doc.client || "N/A"}</td>
                  {/* Document Name - Ensure only file name is displayed */}
                  <td className="px-6 py-4 text-foreground">
                    {extractFileName(doc.file)}
                  </td>
                  {/* Shared Date */}
                  <td className="px-6 py-4 text-foreground">{doc.shared_date || "N/A"}</td>
                  {/* Password with Eye Icon */}
                  <td className="px-6 py-4 text-foreground">
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-[120px]">
                        {visiblePasswords[globalIndex]
                          ? truncatePassword(doc.password)
                          : "••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(globalIndex)}
                        className="text-foreground hover:text-blue-500 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      {visiblePasswords[globalIndex] && doc.password && doc.password.length > 10 && (
                        <button
                          onClick={() => setShowFullPassword(doc.password)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Show Full
                        </button>
                      )}
                    </div>
                  </td>
                  {/* Action */}
                  <td className="px-6 py-4 text-foreground">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all duration-200">
                      Copy Link
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Section */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200"
            >
              &lt;&lt;
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200"
            >
              &lt;
            </button>
            {getVisiblePageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNum === "number" && setCurrentPage(pageNum)
                }
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white"
                    : pageNum === "..."
                    ? "border-transparent cursor-default"
                    : "border-gray-200 hover:bg-gray-50"
                } transition-all duration-200`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200"
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200"
            >
              &gt;&gt;
            </button>
          </div>
          <div className="text-sm text-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
            {filteredItems.length} entries
          </div>
        </div>
      </div>

      {/* Modal for Showing Full Password */}
      {showFullPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Full Password</h3>
            <p className="break-all">{showFullPassword}</p>
            <button
              onClick={() => setShowFullPassword(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedDocument;