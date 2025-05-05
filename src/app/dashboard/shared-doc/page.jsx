"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";
import { toast } from "react-toastify";

const SharedDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showFullPassword, setShowFullPassword] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set()); // State for selected documents

  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedDocs = JSON.parse(localStorage.getItem("sharedDocuments")) || [];
      
      storedDocs = storedDocs.filter((doc) => 
        doc.file && typeof doc.file === "string" && doc.file !== "Unnamed Document"
      );

      localStorage.setItem("sharedDocuments", JSON.stringify(storedDocs));

      setDocuments(storedDocs);

      setVisiblePasswords(
        storedDocs.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
      );
    }
  }, []);

  const refreshDocuments = () => {
    if (typeof window !== "undefined") {
      let updatedDocs = JSON.parse(localStorage.getItem("sharedDocuments")) || [];

      updatedDocs = updatedDocs.filter((doc) => 
        doc.file && typeof doc.file === "string" && doc.file !== "Unnamed Document"
      );

      localStorage.setItem("sharedDocuments", JSON.stringify(updatedDocs));

      setDocuments(updatedDocs);

      setVisiblePasswords(
        updatedDocs.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
      );
    }
  };

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncatePassword = (password, maxLength = 10) => {
    if (!password) return "••••••";
    if (password.length <= maxLength) return password;
    return password.substring(0, maxLength) + "...";
  };

  const extractFileName = (url) => {
    if (!url || typeof url !== "string") {
      return "N/A";
    }
    try {
      const parts = url.split("/");
      let fileName = parts[parts.length - 1];
      fileName = fileName.split("?")[0];
      fileName = decodeURIComponent(fileName);
      return fileName || "N/A";
    } catch (error) {
      console.error("Error extracting file name:", error);
      return "N/A";
    }
  };

  const handleSelectDocument = (index) => {
    setSelectedDocuments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === filteredItems.length) {
      setSelectedDocuments(new Set());
    } else {
      const allIndices = filteredItems.map((_, index) => (currentPage - 1) * itemsPerPage + index);
      setSelectedDocuments(new Set(allIndices));
    }
  };

  const handleDelete = () => {
    if (selectedDocuments.size === 0) {
      toast.error("No documents selected to delete.");
      return;
    }

    const updatedDocs = documents.filter((_, index) => !selectedDocuments.has(index));
    localStorage.setItem("sharedDocuments", JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
    setSelectedDocuments(new Set());
    toast.success("Selected documents deleted successfully");
  };

  const handleReset = () => {
    setSelectedDocuments(new Set());
  };

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-5">Shared Documents</h2>
        <div className="flex gap-2">
          {selectedDocuments.size > 0 && (
            <>
              <button
                className="primary-btn"
                onClick={handleSelectAll}
              >
                {selectedDocuments.size === filteredItems.length ? "Deselect All" : "Select All"}
              </button>
              <button
                className="primary-btn bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="primary-btn"
                onClick={handleReset}
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-accent-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectedDocuments.size === filteredItems.length && filteredItems.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Document Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Shared Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Password
              </th>
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
                  <td className="px-6 py-4 text-foreground">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedDocuments.has(globalIndex)}
                      onChange={() => handleSelectDocument(globalIndex)}
                    />
                  </td>
                  <td className="px-6 py-4 text-foreground">{doc.client || "N/A"}</td>
                  <td className="px-6 py-4 text-foreground">
                    {extractFileName(doc.file)}
                  </td>
                  <td className="px-6 py-4 text-foreground">{doc.shared_date || "N/A"}</td>
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

        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200"
            >
              {/* << */}
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200"
            >
              {/* < */}
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
              {/* > */}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all duration-200"
            >
              {/* >> */}
            </button>
          </div>
          <div className="text-sm text-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
            {filteredItems.length} entries
          </div>
        </div>
      </div>

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