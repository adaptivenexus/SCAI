"use client";

import UserRow from "@/components/Dashboard/clientManagementComponents/UserRow";
import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { GlobalContext } from "@/context/GlobalProvider";
import { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiDownload,
  FiChevronUp,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";

// Helper function to check if a date matches the search query or filter in various formats
const doesDateMatch = (dateString, query) => {
  if (!dateString || !query) return false;

  const date = new Date(dateString);
  if (isNaN(date)) return false; // Invalid date

  const queryLower = query.toLowerCase().trim();
  const year = date.getFullYear().toString();
  const monthLong = date
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();
  const monthShort = date
    .toLocaleString("en-US", { month: "short" })
    .toLowerCase();
  const monthNum = (date.getMonth() + 1).toString().padStart(2, "0"); // e.g., "05"
  const day = date.getDate().toString().padStart(2, "0"); // e.g., "14"

  // Lightweight array of date formats to match
  const dateFormats = [
    year, // e.g., "2025"
    monthLong, // e.g., "may"
    monthShort, // e.g., "may"
    monthNum, // e.g., "05"
    day, // e.g., "14"
    `${day} ${monthLong}`, // e.g., "14 may"
    `${monthLong} ${day}`, // e.g., "may 14"
    `${day} ${monthShort}`, // e.g., "14 may"
    `${monthShort} ${day}`, // e.g., "may 14"
    `${day}-${monthLong}-${year}`, // e.g., "14-may-2025"
    `${day}-${monthLong}`, // e.g., "14-may"
    `${day}-${monthShort}-${year}`, // e.g., "14-may-2025"
    `${day}-${monthShort}`, // e.g., "14-may"
    dateString.toLowerCase(), // Exact match, e.g., "2025-05-14"
    date.toISOString().split("T")[0].toLowerCase(), // e.g., "2025-05-14"
    `${day}/${monthNum}/${year}`, // e.g., "14/05/2025"
    `${day}-${monthNum}-${year}`, // e.g., "14-05-2025"
    `${day}.${monthNum}.${year}`, // e.g., "14.05.2025"
    `${monthNum}/${day}/${year}`, // e.g., "05/14/2025"
    `${monthNum}-${day}-${year}`, // e.g., "05-14-2025"
    `${monthNum}.${day}.${year}`, // e.g., "05.14.2025"
    `${day}/${monthNum}`, // e.g., "14/05"
    `${day}-${monthNum}`, // e.g., "14-05"
    `${day}.${monthNum}`, // e.g., "14.05"
    `${monthNum}/${day}`, // e.g., "05/14"
    `${monthNum}-${day}`, // e.g., "05-14"
    `${monthNum}.${day}`, // e.g., "05.14"
  ];

  return dateFormats.some((format) => format.includes(queryLower));
};

const ClientListPage = () => {
  const { clients } = useContext(GlobalContext);
  const searchParams = useSearchParams();

  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);

  // Open verify modal if navigated from notification
  useEffect(() => {
    const verify = searchParams.get("verify");
    const id = searchParams.get("id");
    if (verify === "1" && id && clients && clients.length > 0) {
      const clientToEdit = clients.find((c) => String(c.id) === String(id));
      if (clientToEdit) {
        setEditClient(clientToEdit);
        setIsEditClientOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, clients]);

  // Open edit modal if navigated with edit intent from global search
  useEffect(() => {
    const edit = searchParams.get("edit");
    const id = searchParams.get("id");
    if (edit === "1" && id && clients && clients.length > 0) {
      const clientToEdit = clients.find((c) => String(c.id) === String(id));
      if (clientToEdit) {
        setEditClient(clientToEdit);
        setIsEditClientOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, clients]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(""); // Changed to empty string for consistency with AllDocumentPage
  const [creationDateFilter, setCreationDateFilter] = useState("");
  const [showCreationDatePicker, setShowCreationDatePicker] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false); // For status dropdown visibility
  const creationDateRef = useRef(null);
  const statusRef = useRef(null); // Ref for status dropdown
  const itemsPerPage = 10;

  const { setIsAddClientOpen } = useContext(GlobalContext);

  // Handle click outside to close the date picker and status dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        creationDateRef.current &&
        !creationDateRef.current.contains(event.target)
      ) {
        setShowCreationDatePicker(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "desc") {
          return { key: "id", direction: "asc" };
        }
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedClients = useMemo(() => {
    const sorted = [...clients];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";

        // Handle numeric sorting for DOCUMENTS
        if (sortConfig.key === "DOCUMENTS") {
          aValue = parseInt(aValue, 10) || 0;
          bValue = parseInt(bValue, 10) || 0;
        }

        // Handle phone number sorting by normalized digits
        if (sortConfig.key === "phone") {
          aValue = (a.mobile_number || "").replace(/[^0-9]/g, "");
          bValue = (b.mobile_number || "").replace(/[^0-9]/g, "");
        }

        // Handle string sorting for other fields (business_name, email, etc)
        if (typeof aValue === "string" && sortConfig.key !== "phone") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [clients, sortConfig]);

  const filteredClients = sortedClients.filter((client) => {
    const phone = (client.mobile_number || "").toLowerCase();
    const normalizedPhone = phone.replace(/[^0-9]/g, "");
    const query = searchQuery.toLowerCase();
    const queryNormalized = query.replace(/[^0-9]/g, "");

    // If the search query is all digits, match against normalized phone
    let phoneMatch = false;
    if (queryNormalized && /^\d+$/.test(queryNormalized)) {
      phoneMatch = normalizedPhone.includes(queryNormalized);
    } else if (query) {
      phoneMatch = phone.includes(query);
    }

    const matchesSearch =
      (client.business_name || "").toLowerCase().includes(query) ||
      (client.email || "").toLowerCase().includes(query) ||
      phoneMatch ||
      (client.DOCUMENTS || "").toString().includes(query) ||
      doesDateMatch(client.created_at, searchQuery) ||
      (client.status || "").toLowerCase().includes(query);

    const matchesStatus =
      !filterStatus ||
      (filterStatus === "verified" &&
        (client.status || "").toLowerCase() === "verified") ||
      (filterStatus === "verify_now" &&
        (client.status || "").toLowerCase() !== "verified");

    const matchesCreationDate =
      !creationDateFilter ||
      doesDateMatch(client.created_at, creationDateFilter);

    return matchesSearch && matchesStatus && matchesCreationDate;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage]);

  // Get visible page numbers
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
    <div className="p-6 flex-1 min-w-0">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="heading-4 text-foreground">Client Management</h1>
            <button
              className="primary-btn flex items-center gap-2"
              onClick={() => setIsAddClientOpen(true)}
            >
              Add Client
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-background rounded-2xl border border-accent-primary shadow-sm p-6">
            <div className="flex justify-between items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground" />
                <input
                  type="text"
                  placeholder="Search by client name, email, phone, documents, creation date, or status"
                  className="w-full max-w-[650px] pl-10 pr-4 py-3 rounded-xl border border-accent-primary bg-background text-foreground placeholder-secondary-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Export Button */}
              <button className="secondary-btn flex items-center gap-2">
                <FiDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Client Table */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiSearch className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Client Management
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and organize your clients
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-visible">
            <div className="min-w-[1200px] relative">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </th>
                    <th
                      className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("business_name")}
                    >
                      Client Name
                      {sortConfig.key === "business_name" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? (
                            <FiChevronUp className="w-4 h-4 inline" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortConfig.key === "email" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? (
                            <FiChevronUp className="w-4 h-4 inline" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("phone")}
                    >
                      Phone
                      {sortConfig.key === "phone" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? (
                            <FiChevronUp className="w-4 h-4 inline" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("DOCUMENTS")}
                    >
                      Documents
                      {sortConfig.key === "DOCUMENTS" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? (
                            <FiChevronUp className="w-4 h-4 inline" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="relative" ref={creationDateRef}>
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors rounded px-2 py-1"
                          onClick={() =>
                            setShowCreationDatePicker(!showCreationDatePicker)
                          }
                        >
                          <span>Creation Date</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              showCreationDatePicker ? "rotate-180" : ""
                            }`}
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
                        {showCreationDatePicker && (
                          <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-2">
                            <input
                              type="date"
                              className="w-full text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                              value={creationDateFilter}
                              onChange={(e) =>
                                setCreationDateFilter(e.target.value)
                              }
                            />
                            {creationDateFilter && (
                              <button
                                onClick={() => setCreationDateFilter("")}
                                className="w-full mt-1 text-xs text-gray-600 hover:text-gray-800"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="relative" ref={statusRef}>
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors rounded px-2 py-1"
                          onClick={() =>
                            setShowStatusDropdown(!showStatusDropdown)
                          }
                        >
                          <span>Status</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              showStatusDropdown ? "rotate-180" : ""
                            }`}
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
                        {showStatusDropdown && (
                          <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-2">
                            <select
                              className="w-full text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                              value={filterStatus}
                              onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setShowStatusDropdown(false);
                              }}
                            >
                              <option value="">All</option>
                              <option value="verified">Verified</option>
                              <option value="verify_now">Verify Now</option>
                            </select>
                            {filterStatus && (
                              <button
                                onClick={() => {
                                  setFilterStatus("");
                                  setShowStatusDropdown(false);
                                }}
                                className="w-full mt-1 text-xs text-gray-600 hover:text-gray-800"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentItems.map((client) => (
                    <UserRow
                      key={client.id}
                      client={client}
                      setEditClient={setEditClient}
                      setIsEditClientOpen={setIsEditClientOpen}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pagination - moved outside scrollable container */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            {getVisiblePageNumbers().map((pageNum, index) =>
              typeof pageNum === "number" ? (
                <button
                  key={index}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ) : (
                <span key={index} className="px-3 py-2 text-sm text-gray-500">
                  ...
                </span>
              )
            )}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronsRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
            {filteredClients.length} entries
          </div>
        </div>
        {isEditClientOpen && (
          <AddOrManageClient
            oldClient={editClient}
            isNew={false}
            setIsAddClientOpen={setIsEditClientOpen}
            setEditClient={setEditClient}
          />
        )}
      </div>
    </div>
  );
};

export default ClientListPage;
