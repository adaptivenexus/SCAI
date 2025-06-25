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
  const statusRef = useRef(null); // Ref for status dropdown  const [isMounted, setIsMounted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
        fetch(`${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${docId}/`, {
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
        aValue = a.parsed_data?.document_type || "";
        bValue = b.parsed_data?.document_type || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [documents, sortConfig]);

  const filteredAndSortedItems = sortedDocuments.filter(
    (doc) =>
      ((doc.client || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.file || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.parsed_data?.suggested_title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.category?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doesDateMatch(doc.uploaded_at, searchQuery) ||
        doesDateMatch(doc.parsed_data?.document_date, searchQuery) ||
        (doc.status || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!processDateFilter ||
        doesDateMatch(doc.uploaded_at, processDateFilter)) &&
      (!documentDateFilter ||
        doesDateMatch(doc.parsed_data?.document_date, documentDateFilter)) &&
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
    <div className="p-6 flex-1 min-w-0">
      <div className="flex flex-col h-full">
        {/* Top buttons and search */}
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

        {/* Search and filters */}
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

        {/* Table with horizontal scroll */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
          <div className="min-w-[1200px]">
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
                            onChange={(e) =>
                              setProcessDateFilter(e.target.value)
                            }
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
                            onChange={(e) =>
                              setDocumentDateFilter(e.target.value)
                            }
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
                    parsedData={doc.parsed_data}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-start items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {getVisiblePageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={"dots-" + idx} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === page
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(page)}
                  disabled={currentPage === page}
                >
                  {page}
                </button>
              )
            )}
            <button
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {isShareDocumentOpen && selectedDocs.length > 0 && (
          <DocumentShareModal
            setIsShareDocumentOpen={setIsShareDocumentOpen}
            docs={selectedDocs}
            handleReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default AllDocumentPage;
