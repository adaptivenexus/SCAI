"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { IoIosRefresh } from 'react-icons/io';

// SharedDocument component - Displays a table of shared documents with search, filter, and pagination
const SharedDocument = () => {
  // Static data for clients - Replace this with API data in the future
  const clients = [
    { name: "Jack Reid", document: "Invoice.pdf", password: "pass123" },
    { name: "Jane Doe", document: "Contract.pdf", password: "pass456" },
    { name: "John Smith", document: "Receipt.pdf", password: "pass789" },
    { name: "Emily Brown", document: "Report.pdf", password: "pass101" },
    { name: "Mike Johnson", document: "Statement.pdf", password: "pass112" },
    { name: "Sarah Wilson", document: "TaxForm.pdf", password: "pass131" },
    { name: "Tom Clark", document: "Bill.pdf", password: "pass141" },
    { name: "Anna Lee", document: "Agreement.pdf", password: "pass151" },
    { name: "David Kim", document: "Summary.pdf", password: "pass161" },
    { name: "Lisa Wong", document: "Policy.pdf", password: "pass171" },
    { name: "Mark Tan", document: "Invoice2.pdf", password: "pass181" },
  ];

  // State for search query, pagination, password visibility, and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePasswords, setVisiblePasswords] = useState(
    clients.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
  );
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const itemsPerPage = 5;

  // Function to toggle password visibility for a specific row
  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to handle filtering by a specific key (name or document)
  const handleFilter = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "desc") {
          return { key: null, direction: "asc" }; // Reset filtering
        }
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Sort the clients based on the filter configuration
  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return clients;

    return [...clients].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [clients, sortConfig]);

  // Filter documents based on search query
  const filteredItems = useMemo(() => {
    return sortedItems.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.document.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedItems, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to generate visible page numbers for pagination
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

  // Reset to page 1 when search query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortConfig]);

  return (
    <div className="p-6">
      {/* Heading for the page */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-5">Shared Documents</h2>
      </div>
      
      {/* Search bar and action buttons */}
      <div className="flex justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by client name or document name"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {/* Refresh Button */}
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
        >
          <IoIosRefresh />
          Refresh
        </button>
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
          >
            <FiFilter />
            Filter
          </button>
          <select
            onChange={(e) => handleFilter(e.target.value)}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="">Filter</option>
            <option value="name">Filter by Name</option>
            <option value="document">Filter by Document</option>
          </select>
        </div>
      </div>

      {/* Table container */}
      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((client, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              return (
                <tr key={globalIndex} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-3 text-foreground">{client.name}</td>
                  <td className="px-6 py-3 text-foreground">{client.document}</td>
                  <td className="px-6 py-3 text-foreground flex items-center gap-2">
                    <span className="inline-block w-[60px]">{visiblePasswords[globalIndex] ? client.password : "••••••"}</span>
                    <button
                      onClick={() => togglePasswordVisibility(globalIndex)}
                      className="text-foreground hover:text-blue-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button className="text-blue-500 hover:text-blue-700">
                      Copy Link
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination section */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              {/* << */}
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
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
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              {/* > */}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
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
    </div>
  );
};

export default SharedDocument;