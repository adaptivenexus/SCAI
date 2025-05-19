"use client";

import UserRow from "@/components/Dashboard/clientManagementComponents/UserRow";
import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { GlobalContext } from "@/context/GlobalProvider";
import { useState, useMemo, useContext, useRef, useEffect } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";

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

  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);

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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Client List</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setIsAddClientOpen(true)}
        >
          Add Client
        </button>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, documents, creation date, or status"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Export Button */}
        <button className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
          <FiDownload />
          Export
        </button>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
        <div className="min-w-[1200px]">
          <table className="w-full">
            <thead className="bg-accent-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                  onClick={() => handleSort("business_name")}
                >
                  Client Name
                  {sortConfig.key === "business_name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortConfig.key === "email" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                  onClick={() => handleSort("phone")}
                >
                  Phone
                  {sortConfig.key === "phone" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                  onClick={() => handleSort("DOCUMENTS")}
                >
                  Documents
                  {sortConfig.key === "DOCUMENTS" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  <div className="relative" ref={creationDateRef}>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  <div className="relative" ref={statusRef}>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
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
      {/* Pagination - moved outside scrollable container */}
      <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
          >
            &lt;&lt;
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>
          {getVisiblePageNumbers().map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <button
                key={index}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ) : (
              <span key={index} className="px-3 py-1">
                ...
              </span>
            )
          )}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
          >
            &gt;
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
          >
            &gt;&gt;
          </button>
        </div>
        <div className="text-sm text-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
          {filteredClients.length} entries
        </div>
      </div>
    </div>
  );
};

export default ClientListPage;
