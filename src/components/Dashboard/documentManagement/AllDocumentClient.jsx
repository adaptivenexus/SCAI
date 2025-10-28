"use client";

import DocumentRow from "@/components/Dashboard/documentManagement/DocumentRow";
import { GlobalContext } from "@/context/GlobalProvider";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiSearch, FiDownload } from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import DocumentShareModal from "@/components/Dashboard/documentManagement/DocumentShareModal";
import { toast } from "react-toastify";

import { useAuth } from "@/context/AuthContext"; 

// Internal: try to parse common numeric date formats when native parsing fails
const parseFlexibleDate = (raw) => {
  if (!raw) return null;
  const s = String(raw).trim();

  // ISO-like first
  const isoMatch = s.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})/);
  if (isoMatch) {
    const y = Number(isoMatch[1]);
    const m = Number(isoMatch[2]);
    const d = Number(isoMatch[3]);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const dt = new Date(y, m - 1, d);
      if (!isNaN(dt.getTime())) return dt;
    }
  }

  // DMY or MDY with separators
  const sepMatch = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
  if (sepMatch) {
    const a = Number(sepMatch[1]);
    const b = Number(sepMatch[2]);
    const y = Number(sepMatch[3].length === 2 ? `20${sepMatch[3]}` : sepMatch[3]);

    // Try DMY (a=d, b=m)
    if (b >= 1 && b <= 12 && a >= 1 && a <= 31) {
      const dtDMY = new Date(y, b - 1, a);
      if (!isNaN(dtDMY.getTime())) return dtDMY;
    }
    // Try MDY (a=m, b=d)
    if (a >= 1 && a <= 12 && b >= 1 && b <= 31) {
      const dtMDY = new Date(y, a - 1, b);
      if (!isNaN(dtMDY.getTime())) return dtMDY;
    }
  }

  // As a last resort, native Date
  const native = new Date(s);
  if (!isNaN(native.getTime())) return native;
  return null;
};

// Helper: robust date matching across many common formats
const doesDateMatch = (dateString, query) => {
  if (!dateString || !query) return false;

  const queryLower = query.toLowerCase().trim();
  const querySanitized = queryLower.replace(/[^a-z0-9]/g, "");

  // Quick raw string checks (works even if parsing fails)
  const rawLower = String(dateString).toLowerCase();
  const rawSanitized = rawLower.replace(/[^a-z0-9]/g, "");
  if (rawLower.includes(queryLower) || rawSanitized.includes(querySanitized)) {
    return true;
  }

  // Try parsing dateString using flexible parser
  const date = parseFlexibleDate(dateString);
  if (!date) {
    // If parsing fails, we've already checked raw string above
    return false;
  }

  const year = date.getFullYear().toString();
  const yy = year.slice(-2);
  const monthIndex = date.getMonth() + 1;
  const monthNum = monthIndex.toString().padStart(2, "0"); // "01".."12"
  const monthNumNoPad = monthIndex.toString();
  const dayNum = date.getDate();
  const day = dayNum.toString().padStart(2, "0");
  const dayNoPad = dayNum.toString();
  const monthLong = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const monthShort = date.toLocaleString("en-US", { month: "short" }).toLowerCase();

  // Extract YYYY-MM-DD from ISO strings if present
  const isoDate = rawLower.match(/\d{4}-\d{2}-\d{2}/)?.[0] || `${year}-${monthNum}-${day}`;
  const compactYMD = `${year}${monthNum}${day}`;
  const compactDMY = `${day}${monthNum}${year}`;

  const candidates = [
    // Year-only / partials
    year, yy,
    `${monthLong} ${year}`, `${monthShort} ${year}`, `${monthNum}/${year}`, `${monthNumNoPad}/${year}`,
    `${year} ${monthLong}`, `${year} ${monthShort}`, `${year}/${monthNum}`, `${year}/${monthNumNoPad}`,
    // Month + Day (names)
    `${day} ${monthLong}`, `${monthLong} ${day}`, `${day} ${monthShort}`, `${monthShort} ${day}`,
    `${monthLong} ${day}, ${year}`, `${day} ${monthLong}, ${year}`,
    `${monthShort} ${day}, ${year}`, `${day} ${monthShort}, ${year}`,
    // Numeric with separators
    `${day}/${monthNum}/${year}`, `${monthNum}/${day}/${year}`, `${dayNoPad}/${monthNumNoPad}/${year}`, `${monthNumNoPad}/${dayNoPad}/${year}`,
    `${year}-${monthNum}-${day}`, `${day}-${monthNum}-${year}`, `${monthNum}-${day}-${year}`,
    `${year}/${monthNum}/${day}`, `${day}-${monthNum}-${year}`, `${monthNum}-${day}-${year}`,
    `${day}.${monthNum}.${year}`, `${monthNum}.${day}.${year}`,
    // No separators
    compactYMD, compactDMY,
    // ISO substring
    isoDate,
    // Raw again (trimmed variants)
    rawLower.replace(/,/g, ""), rawLower.replace(/[ ,]/g, ""),
  ];

  // Compare with sanitized version as well to tolerate punctuation differences
  const candidatesSanitized = candidates.map((c) => String(c).toLowerCase().replace(/[^a-z0-9]/g, ""));

  return (
    candidates.some((c) => String(c).toLowerCase().includes(queryLower)) ||
    candidatesSanitized.some((c) => c.includes(querySanitized))
  );
};

const AllDocumentPage = () => {
  // --- LINT FIX: All hooks at top ---
  const { documents, fetchDocuments, clients } = useContext(GlobalContext);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null); // Folder UI
  const [isManageDocumentOpen, setIsManageDocumentOpen] = useState(false);
  const [editDocument, setEditDocument] = useState(null);
  const [editAction, setEditAction] = useState(null); // 'edit' or 'verify'
  const searchParams = useSearchParams();
  const hasOpenedFromQuery = useRef(false);
  // Open verify modal if navigated from notification
  useEffect(() => {
    if (hasOpenedFromQuery.current) return;
    const verify = searchParams.get('verify');
    const id = searchParams.get('id');
    if (verify === '1' && id && documents && documents.length > 0) {
      const docToEdit = documents.find(d => String(d.id) === String(id));
      if (docToEdit) {
        setEditDocument(docToEdit);
        setEditAction('edit');
        setIsManageDocumentOpen(true);
        hasOpenedFromQuery.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, documents]);
  const filteredDocuments = useMemo(() => {
    if (!selectedClientId) return documents;
    return documents.filter(doc => doc.client_id === selectedClientId);
  }, [documents, selectedClientId]);
  // --- END LINT FIX ---
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

  // Get subscription info (adjust according to your context/provider)
  const { subscription, subscriptionDetails } = useAuth();

  // Check if subscription is expired
    const isSubscriptionExpired = !!(
    subscription &&
    subscription.expires_on &&
    !isNaN(Date.parse(subscription.expires_on)) &&
    new Date(subscription.expires_on) < new Date()
  );

  // Restriction logic
  const isScanLimitReached =
    subscription &&
    subscriptionDetails &&
    subscription.used_scans >= subscriptionDetails.allowed_smart_scan;

  const isFreePlan =
    subscriptionDetails &&
    subscriptionDetails.name &&
    subscriptionDetails.name.toLowerCase().includes("free");

  const router = useRouter();
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

  useEffect(() => {
    // Fetch documents for selected client
    fetchDocuments(selectedClientId);
    setCurrentPage(1); // Optionally reset pagination
  }, [selectedClientId]);

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
        aValue =
          a.parsed_data?.document_type ||
          a.parsed_data?.parsed_data?.document_type ||
          "";
        bValue =
          b.parsed_data?.document_type ||
          b.parsed_data?.parsed_data?.document_type ||
          "";
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
        (doc.parsed_data?.suggested_title || doc.parsed_data?.parsed_data?.suggested_title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.category?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.parsed_data?.summary || doc.parsed_data?.parsed_data?.summary || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||s        (doc.parsed_data?.document_type || doc.parsed_data?.parsed_data?.document_type || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.parsed_data?.masked_text || doc.parsed_data?.parsed_data?.masked_text || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.parsed_data?.job_status || doc.parsed_data?.parsed_data?.job_status || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.parsed_data?.analysis_provider || doc.parsed_data?.parsed_data?.analysis_provider || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doesDateMatch(doc.uploaded_at, searchQuery) ||
        doesDateMatch(
          doc.parsed_data?.document_date ||
            doc.parsed_data?.parsed_data?.document_date,
          searchQuery
        ) ||
        (doc.status || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!processDateFilter ||
        doesDateMatch(doc.uploaded_at, processDateFilter)) &&
      (!documentDateFilter ||
        doesDateMatch(
          doc.parsed_data?.document_date ||
            doc.parsed_data?.parsed_data?.document_date,
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

  // --- CLIENT FOLDER LIST ---
  // (UI remains the same as previous edit)
  return (
    <div className="p-6 flex-1 min-w-0">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {clients && clients.length > 0 ? (
              clients.map(client => (
                <button
                  key={client.id}
                  className={`flex flex-col items-center px-4 py-3 rounded-lg border border-gray-200 shadow-sm hover:bg-accent-primary/10 transition-all ${selectedClientId === client.id ? 'bg-accent-primary text-white border-accent-primary' : 'bg-white text-foreground'}`}
                  onClick={() => setSelectedClientId(client.id)}
                >
                  <span className="text-3xl mb-1">📁</span>
                  <span className="font-medium text-sm truncate max-w-[120px]">{client.business_name || client.firstName || client.lastName || client.email}</span>
                </button>
              ))
            ) : (
              <span className="text-gray-400">No clients found</span>
            )}
            {selectedClientId && (
              <button
                className="ml-4 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 text-xs"
                onClick={() => setSelectedClientId(null)}
              >
                Show All Documents
              </button>
            )}
          </div>
        </div>
        {/* --- END CLIENT FOLDER LIST --- */}

        {/* Top buttons and search */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-5">All Documents</h2>
          {/* Show restriction/warning message here, between label and button */}
          {isSubscriptionExpired && (
            <div className="mb-4 px-4 py-3 rounded bg-red-100 text-red-600 font-medium w-fit mx-auto">
              Your subscription is expired, please upgrade it to continue document processing.
            </div>
          )}
          {!isSubscriptionExpired && isScanLimitReached && isFreePlan && (
            <div className="mb-4 px-4 py-3 rounded bg-yellow-100 text-red-600 font-medium w-fit mx-auto">
              You have reached the maximum number of free scans in your plan. Please upgrade to add more documents.
            </div>
          )}
          {!isSubscriptionExpired &&
            isScanLimitReached &&
            !isFreePlan &&
            subscription &&
            subscriptionDetails &&
            subscription.used_scans < subscriptionDetails.allowed_smart_scan + 10 && (
              <div className="mb-4 px-4 py-3 rounded bg-green-100 text-black font-medium w-fit mx-auto">
                You have exhausted free scans in your current plan. Further scans will be charged at <b>$0.20 per page</b>.
              </div>
          )}
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
              className={`primary-btn ${
                isSubscriptionExpired
                  ? "opacity-50 cursor-not-allowed"
                  : isScanLimitReached && isFreePlan
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              href={
                isSubscriptionExpired
                  ? "#"
                  : isScanLimitReached && isFreePlan
                  ? "#"
                  : "/dashboard/document-management/add-documents"
              }
              onClick={e => {
                if (isSubscriptionExpired) {
                  e.preventDefault();
                  toast.error(
                    "Your subscription is expired, please upgrade it to continue document processing."
                  );
                }
                if (!isSubscriptionExpired && isScanLimitReached && isFreePlan) {
                  e.preventDefault();
                  toast.error(
                    "You have reached the maximum number of free scans in your plan. Please upgrade to add more documents."
                  );
                }
                if (!isSubscriptionExpired && isScanLimitReached && !isFreePlan && subscription && subscriptionDetails && subscription.used_scans < subscriptionDetails.allowed_smart_scan + 10) {
                  toast.warn(
                    "You have exhausted free scans in your current plan. Further scans will be charged at $0.20 per page."
                  );
                  // Allow navigation
                }
              }}
              tabIndex={isSubscriptionExpired || (isScanLimitReached && isFreePlan) ? -1 : 0}
              aria-disabled={isSubscriptionExpired || (isScanLimitReached && isFreePlan)}
            >
              Add Document
            </Link>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex justify-between items-center mb-6 gap-4">
          {/* --- Client Filter Dropdown --- */}
          <div className="flex gap-2 flex-1">
            <div className="relative min-w-[200px]">
              <select
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 bg-white"
                value={selectedClientId || ""}
                onChange={e => setSelectedClientId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Clients</option>
                {clients && clients.length > 0 && clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.business_name || client.firstName || client.lastName || client.email}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </span>
            </div>
            {/* --- Search Input --- */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by client, document, category, summary, content, date, or status"
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
        {/* --- END Search and filters --- */}

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
                    onRowClick={() => router.push(`/dashboard/document-management/view-document/${doc.id}`)}
                    isManageDocumentOpen={isManageDocumentOpen && editDocument && editDocument.id === doc.id}
                    setIsManageDocumentOpen={setIsManageDocumentOpen}
                    setEditDocument={setEditDocument}
                    setEditAction={setEditAction}
                    action={editAction}
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
        {/* Only use the ManageDocument modal from DocumentRow now. */}
      </div>
    </div>
  );
};

export default AllDocumentPage;
