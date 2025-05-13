"use client";

import DocumentRow from "@/components/Dashboard/documentManagement/DocumentRow";
import { GlobalContext } from "@/context/GlobalProvider";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect, useContext } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import DocumentShareModal from "@/components/Dashboard/documentManagement/DocumentShareModal";
import { toast } from "react-toastify";
import { authFetch } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";

// Helper function to check if a date matches the search query or filter
const doesDateMatch = (dateString, query) => {
  if (!dateString || !query) return false;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false; // Invalid date

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

    const dateFormats = [
      year, // e.g., "2025"
      monthLong, // e.g., "may"
      monthShort, // e.g., "may"
      `${day} ${monthLong}`, // e.g., "14 may"
      `${monthLong} ${day}`, // e.g., "may 14"
      `${day} ${monthShort}`, // e.g., "14 may"
      `${monthShort} ${day}`, // e.g., "may 14"
      `${day}-${monthLong}-${year}`, // e.g., "14-may-2025"
      `${day}-${monthShort}-${year}`, // e.g., "14-may-2025"
      dateString.toLowerCase(), // Exact match, e.g., "2025-05-14"
      `${day}/${monthNum}/${year}`, // e.g., "14/05/2025"
      `${day}-${monthNum}-${year}`, // e.g., "14-05-2025"
      `${day}/${monthNum}`, // e.g., "14/05"
      `${monthNum}/${day}`, // e.g., "05/14"
      `${year}/${monthNum}/${day}`, // e.g., "2025/05/14"
      `${day}-${monthNum}-${year}`, // e.g., "14-05-2025"
      `${monthNum}-${day}-${year}`, // e.g., "05-14-2025"
      `${day}.${monthNum}.${year}`, // e.g., "14.05.2025"
    ];

    return dateFormats.some((format) => format.includes(queryLower));
  } catch (error) {
    console.error("Error in doesDateMatch:", dateString, query, error);
    return false;
  }
};

const AllDocumentPage = () => {
  const { documents, fetchDocuments } = useContext(GlobalContext);
  const { refreshTokenFn } = useAuth();
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [processDateFilter, setProcessDateFilter] = useState("");
  const [documentDateFilter, setDocumentDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [showProcessDatePicker, setShowProcessDatePicker] = useState(false);
  const [showDocumentDatePicker, setShowDocumentDatePicker] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false); // For status dropdown visibility
  const [isShareDocumentOpen, setIsShareDocumentOpen] = useState(false);
  const processDateRef = useRef(null);
  const documentDateRef = useRef(null);
  const statusRef = useRef(null); // Ref for status dropdown
  const [isMounted, setIsMounted] = useState(false);
  const [parsedDataMap, setParsedDataMap] = useState({});

  const fetchParsedData = async (docId) => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${docId}/parsed-data/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
        refreshTokenFn
      );
      if (response.ok) {
        const data = await response.json();
        const parsedData = data.parsed_data || {};
        return parsedData;
      } else {
        console.log(
          "Error fetching parsed data for doc",
          docId,
          ":",
          response.statusText
        );
        return {};
      }
    } catch (error) {
      console.error("Error fetching document data for doc", docId, ":", error);
      return {};
    }
  };

  useEffect(() => {
    const fetchAllParsedData = async () => {
      try {
        const parsedDataPromises = documents.map(async (doc) => {
          const parsedData = await fetchParsedData(doc.id);
          return { id: doc.id, parsedData };
        });

        const results = await Promise.all(parsedDataPromises);
        const newParsedDataMap = results.reduce((acc, { id, parsedData }) => {
          acc[id] = parsedData;
          return acc;
        }, {});

        setParsedDataMap(newParsedDataMap);
      } catch (error) {
        console.error("Error in fetchAllParsedData:", error);
        toast.error(
          "Failed to load document data. Please try refreshing the page."
        );
      }
    };

    if (documents && documents.length > 0) {
      fetchAllParsedData();
    }
  }, [documents]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        processDateRef.current &&
        !processDateRef.current.contains(event.target)
      ) {
        setShowProcessDatePicker(false);
      }
      if (
        documentDateRef.current &&
        !documentDateRef.current.contains(event.target)
      ) {
        setShowDocumentDatePicker(false);
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

  const itemsPerPage = 10;

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "desc") {
          return { key: null, direction: "asc" };
        }
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectDocument = (docId, clientName) => {
    setSelectedDocuments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
        if (newSet.size === 0) {
          setSelectedClient(null);
        }
      } else {
        if (newSet.size === 0) {
          setSelectedClient(clientName);
        }
        if (selectedClient === null || selectedClient === clientName) {
          newSet.add(docId);
          setSelectedClient(clientName);
        }
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setSelectedDocuments(new Set());
    setSelectedClient(null);
  };

  const handleDelete = async () => {
    try {
      const deletePromises = Array.from(selectedDocuments).map((docId) =>
        fetch(`${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${docId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Selected documents deleted successfully");
        setSelectedDocuments(new Set());
        setSelectedClient(null);
        fetchDocuments();
      } else {
        toast.error("Failed to delete some documents");
      }
    } catch (error) {
      console.error("Error deleting documents:", error);
      toast.error("Something went wrong while deleting documents");
    }
  };

  const isRowDisabled = (docClient) => {
    return selectedDocuments.size > 0 && selectedClient !== docClient;
  };

  const sortedDocuments = useMemo(() => {
    if (!sortConfig.key) return documents;

    return [...documents].sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === "client") {
        aValue = a.client || "";
        bValue = b.client || "";
      } else if (sortConfig.key === "file") {
        aValue = a.file || "";
        bValue = b.file || "";
      } else if (sortConfig.key === "category") {
        aValue = parsedDataMap[a.id]?.document_type || "";
        bValue = parsedDataMap[b.id]?.document_type || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [documents, sortConfig, parsedDataMap]);

  const filteredAndSortedItems = sortedDocuments.filter(
    (doc) =>
      ((doc.client || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.file || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (parsedDataMap[doc.id]?.suggested_title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (parsedDataMap[doc.id]?.document_type || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doesDateMatch(doc.uploaded_at, searchQuery) ||
        doesDateMatch(parsedDataMap[doc.id]?.document_date, searchQuery) ||
        (doc.status || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!processDateFilter ||
        doesDateMatch(doc.uploaded_at, processDateFilter)) &&
      (!documentDateFilter ||
        doesDateMatch(
          parsedDataMap[doc.id]?.document_date,
          documentDateFilter
        )) &&
      (!statusFilter ||
        (statusFilter === "verified" &&
          (doc.status || "").toLowerCase() === "verified") ||
        (statusFilter === "verify_now" &&
          (doc.status || "").toLowerCase() !== "verified"))
  );

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const currentItems = filteredAndSortedItems.slice(
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

  const selectedDocs = documents.filter((doc) => selectedDocuments.has(doc.id));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BiLoaderAlt className="animate-spin text-4xl" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-5">All Documents</h2>
        <div className="flex gap-2">
          {selectedDocuments.size > 0 && (
            <>
              <button
                className="primary-btn bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="primary-btn"
                onClick={() => setIsShareDocumentOpen(true)}
              >
                Share
              </button>
              <button className="primary-btn" onClick={handleReset}>
                Reset
              </button>
            </>
          )}
          <Link
            className="primary-btn"
            href={"/dashboard/document-management/add-documents"}
          >
            Add Document
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by client, document, category, date, or status"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
        >
          <IoIosRefresh />
          Refresh
        </button>
        <button className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50">
          <FiDownload />
          Export
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-accent-primary">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("client")}
              >
                Associated To
                {sortConfig.key === "client" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("file")}
              >
                Document
                {sortConfig.key === "file" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("category")}
              >
                Category
                {sortConfig.key === "category" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                <div className="relative" ref={processDateRef}>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      setShowProcessDatePicker(!showProcessDatePicker)
                    }
                  >
                    <span>Process Date</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        showProcessDatePicker ? "rotate-180" : ""
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
                  {showProcessDatePicker && (
                    <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-2">
                      <input
                        type="date"
                        className="w-full text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                        value={processDateFilter}
                        onChange={(e) => setProcessDateFilter(e.target.value)}
                      />
                      {processDateFilter && (
                        <button
                          onClick={() => setProcessDateFilter("")}
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
                <div className="relative" ref={documentDateRef}>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      setShowDocumentDatePicker(!showDocumentDatePicker)
                    }
                  >
                    <span>Document Date</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        showDocumentDatePicker ? "rotate-180" : ""
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
                  {showDocumentDatePicker && (
                    <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-gray-200 p-2">
                      <input
                        type="date"
                        className="w-full text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500 p-1"
                        value={documentDateFilter}
                        onChange={(e) => setDocumentDateFilter(e.target.value)}
                      />
                      {documentDateFilter && (
                        <button
                          onClick={() => setDocumentDateFilter("")}
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
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setShowStatusDropdown(false);
                        }}
                      >
                        <option value="">All</option>
                        <option value="verified">Verified</option>
                        <option value="verify_now">Verify Now</option>
                      </select>
                      {statusFilter && (
                        <button
                          onClick={() => {
                            setStatusFilter("");
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
            {currentItems.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                isSelected={selectedDocuments.has(doc.id)}
                onSelect={handleSelectDocument}
                fetchDocuments={fetchDocuments}
                isDisabled={isRowDisabled(doc.client)}
              />
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4 border-t border-gray-200">
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
            {Math.min(
              currentPage * itemsPerPage,
              filteredAndSortedItems.length
            )}{" "}
            of {filteredAndSortedItems.length} entries
          </div>
        </div>
      </div>

      {isShareDocumentOpen && selectedDocs.length > 0 && (
        <DocumentShareModal
          setIsShareDocumentOpen={setIsShareDocumentOpen}
          docs={selectedDocs}
          handleReset={handleReset}
        />
      )}
    </div>
  );
};

export default AllDocumentPage;
