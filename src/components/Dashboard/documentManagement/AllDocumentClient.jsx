"use client";

import DocumentRow from "@/components/Dashboard/documentManagement/DocumentRow";
import { GlobalContext } from "@/context/GlobalProvider";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiSearch,
  FiDownload,
  FiFolder,
  FiUsers,
  FiX,
  FiChevronDown,
  FiShoppingCart,
  FiPackage,
  FiSettings,
  FiTool,
  FiMoreHorizontal,
} from "react-icons/fi";
import { IoIosRefresh } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsCheck2Circle } from "react-icons/bs";
import DocumentShareModal from "@/components/Dashboard/documentManagement/DocumentShareModal";
import { toast } from "react-toastify";

import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils";

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
    const y = Number(
      sepMatch[3].length === 2 ? `20${sepMatch[3]}` : sepMatch[3]
    );

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
  const monthLong = date
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();
  const monthShort = date
    .toLocaleString("en-US", { month: "short" })
    .toLowerCase();

  // Extract YYYY-MM-DD from ISO strings if present
  const isoDate =
    rawLower.match(/\d{4}-\d{2}-\d{2}/)?.[0] || `${year}-${monthNum}-${day}`;
  const compactYMD = `${year}${monthNum}${day}`;
  const compactDMY = `${day}${monthNum}${year}`;

  const candidates = [
    // Year-only / partials
    year,
    yy,
    `${monthLong} ${year}`,
    `${monthShort} ${year}`,
    `${monthNum}/${year}`,
    `${monthNumNoPad}/${year}`,
    `${year} ${monthLong}`,
    `${year} ${monthShort}`,
    `${year}/${monthNum}`,
    `${year}/${monthNumNoPad}`,
    // Month + Day (names)
    `${day} ${monthLong}`,
    `${monthLong} ${day}`,
    `${day} ${monthShort}`,
    `${monthShort} ${day}`,
    `${monthLong} ${day}, ${year}`,
    `${day} ${monthLong}, ${year}`,
    `${monthShort} ${day}, ${year}`,
    `${day} ${monthShort}, ${year}`,
    // Numeric with separators
    `${day}/${monthNum}/${year}`,
    `${monthNum}/${day}/${year}`,
    `${dayNoPad}/${monthNumNoPad}/${year}`,
    `${monthNumNoPad}/${dayNoPad}/${year}`,
    `${year}-${monthNum}-${day}`,
    `${day}-${monthNum}-${year}`,
    `${monthNum}-${day}-${year}`,
    `${year}/${monthNum}/${day}`,
    `${day}-${monthNum}-${year}`,
    `${monthNum}-${day}-${year}`,
    `${day}.${monthNum}.${year}`,
    `${monthNum}.${day}.${year}`,
    // No separators
    compactYMD,
    compactDMY,
    // ISO substring
    isoDate,
    // Raw again (trimmed variants)
    rawLower.replace(/,/g, ""),
    rawLower.replace(/[ ,]/g, ""),
  ];

  // Compare with sanitized version as well to tolerate punctuation differences
  const candidatesSanitized = candidates.map((c) =>
    String(c)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
  );

  return (
    candidates.some((c) => String(c).toLowerCase().includes(queryLower)) ||
    candidatesSanitized.some((c) => c.includes(querySanitized))
  );
};

// Helper function to get business type icon
const getBusinessTypeIcon = (businessType) => {
  const iconMap = {
    Retail: FiShoppingCart,
    Wholesale: FiPackage,
    Manufacturing: FiSettings,
    Service: FiTool,
    Other: FiMoreHorizontal,
  };

  return iconMap[businessType] || FiFolder;
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
    const verify = searchParams.get("verify");
    const id = searchParams.get("id");
    if (verify === "1" && id && documents && documents.length > 0) {
      const docToEdit = documents.find((d) => String(d.id) === String(id));
      if (docToEdit) {
        setEditDocument(docToEdit);
        setEditAction("edit");
        setIsManageDocumentOpen(true);
        hasOpenedFromQuery.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, documents]);
  const filteredDocuments = useMemo(() => {
    if (!selectedClientId) return documents;
    return documents.filter((doc) => doc.client_id === selectedClientId);
  }, [documents, selectedClientId]);

  // State for client search functionality
  const [clientSearchQuery, setClientSearchQuery] = useState(""); // For client search

  // Filtered clients for search functionality
  const filteredClients = useMemo(() => {
    if (!clients || !Array.isArray(clients)) return [];
    if (!clientSearchQuery.trim()) return clients;

    return clients.filter((client) => {
      const searchTerm = clientSearchQuery.toLowerCase();
      const businessName = (client.business_name || "").toLowerCase();
      const firstName = (client.firstName || "").toLowerCase();
      const lastName = (client.lastName || "").toLowerCase();
      const email = (client.email || "").toLowerCase();

      return (
        businessName.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        email.includes(searchTerm)
      );
    });
  }, [clients, clientSearchQuery]);
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
  const [showClientDropdown, setShowClientDropdown] = useState(false); // For custom client dropdown
  const processDateRef = useRef(null);
  const documentDateRef = useRef(null);
  const statusRef = useRef(null); // Ref for status dropdown
  const clientDropdownRef = useRef(null); // Ref for client dropdown
  const [isMounted, setIsMounted] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

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
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target)
      ) {
        setShowClientDropdown(false);
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

  const handleSelectAll = () => {
    if (
      selectedDocuments.size === filteredDocuments.length &&
      filteredDocuments.length > 0
    ) {
      // If all are selected, deselect all
      setSelectedDocuments(new Set());
      setSelectedClient(null);
    } else {
      // Select all filtered documents
      const allDocIds = new Set(filteredDocuments.map((doc) => doc.id));
      setSelectedDocuments(allDocIds);
      // Set the client to the first document's client (since all filtered docs should have same client)
      if (filteredDocuments.length > 0) {
        setSelectedClient(filteredDocuments[0].client);
      }
    }
  };

  // Helper functions for custom dropdown
  const handleClientSelect = (client) => {
    setSelectedClientId(client ? client.id : null);
    setShowClientDropdown(false);
    setClientSearchQuery("");
  };

  const getSelectedClientDisplay = () => {
    if (!selectedClientId || !clients) return "All Clients";
    const selectedClient = clients.find(
      (client) => client.id === selectedClientId
    );
    if (!selectedClient) return "All Clients";
    return (
      selectedClient.business_name ||
      selectedClient.firstName ||
      selectedClient.lastName ||
      selectedClient.email ||
      "Unknown Client"
    );
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

  const handleExportCSV = () => {
    // Get selected documents data or all filtered documents if none selected
    const documentsToExport =
      selectedDocuments.size > 0
        ? documents.filter((doc) => selectedDocuments.has(doc.id))
        : filteredAndSortedItems;

    if (documentsToExport.length === 0) {
      toast.warning("No documents to export");
      return;
    }

    setShowExportModal(true);
  };

  const confirmExportCSV = () => {
    try {
      // Get selected documents data or all filtered documents if none selected
      const documentsToExport =
        selectedDocuments.size > 0
          ? documents.filter((doc) => selectedDocuments.has(doc.id))
          : filteredAndSortedItems;

      // Format data for CSV - correctly access the document structure
      const csvData = documentsToExport.map((doc) => {
        // Extract client name and email from the client string
        // Format is usually "Business Name (email@example.com)" or just "Business Name"
        let clientName = "Unknown Client";
        let clientEmail = "";

        if (doc.client) {
          const emailMatch = doc.client.match(/\(([^)]+)\)$/);
          if (emailMatch) {
            clientEmail = emailMatch[1];
            clientName = doc.client.replace(/\s*\([^)]+\)$/, "").trim();
          } else {
            clientName = doc.client;
          }
        }

        // Access parsed data correctly (note the double parsed_data)
        const parsedData = doc.parsed_data?.parsed_data || {};

        // Only include fields that have meaningful data
        const rowData = {
          id: doc.id,
          client_name: clientName,
          client_email: clientEmail,
          title: parsedData.suggested_title || "Untitled",
          category_name:
            doc.category?.name || parsedData.document_type || "Uncategorized",
          uploaded_at: doc.uploaded_at || "",
          status: doc.status || "Pending",
        };

        // Only add optional fields if they have values
        if (parsedData.summary) {
          rowData.summary = parsedData.summary;
        }

        if (parsedData.document_date) {
          rowData.document_date = parsedData.document_date;
        }

        if (parsedData.number_of_pages) {
          rowData.number_of_pages = parsedData.number_of_pages;
        }

        if (doc.file) {
          rowData.file_url = doc.file;
        }

        return rowData;
      });

      // Create headers based on what fields are actually present
      const allKeys = new Set();
      csvData.forEach((row) => {
        Object.keys(row).forEach((key) => allKeys.add(key));
      });

      // Define the order of headers
      const headerOrder = [
        "id",
        "client_name",
        "client_email",
        "title",
        "category_name",
        "status",
        "uploaded_at",
        "document_date",
        "summary",
        "number_of_pages",
        "file_url",
      ];

      const headers = headerOrder.filter((header) => allKeys.has(header));
      const headerLabels = headers.map((header) => {
        const labelMap = {
          id: "ID",
          client_name: "Client Name",
          client_email: "Client Email",
          title: "Title",
          category_name: "Category",
          status: "Status",
          uploaded_at: "Uploaded At",
          document_date: "Document Date",
          summary: "Summary",
          number_of_pages: "Pages",
          file_url: "File URL",
        };
        return labelMap[header] || header;
      });

      const csvContent = [
        headerLabels.join(","),
        ...csvData.map((row) =>
          headers
            .map((header) => {
              const value = row[header] || "";
              // Escape quotes and wrap in quotes if contains comma, quote, or newline
              const escapedValue = String(value).replace(/"/g, '""');
              return /[",\n\r]/.test(escapedValue)
                ? `"${escapedValue}"`
                : escapedValue;
            })
            .join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `documents_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        `Successfully exported ${documentsToExport.length} documents to CSV`
      );
      setShowExportModal(false);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV file");
      setShowExportModal(false);
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
        (
          doc.parsed_data?.suggested_title ||
          doc.parsed_data?.parsed_data?.suggested_title ||
          ""
        )
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (doc.category?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (
          doc.parsed_data?.document_type ||
          doc.parsed_data?.parsed_data?.document_type ||
          ""
        )
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (
          doc.parsed_data?.job_status ||
          doc.parsed_data?.parsed_data?.job_status ||
          ""
        )
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doesDateMatch(formatDate(doc.uploaded_at), searchQuery) ||
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
          {/* Client Filter Cards */}
          <div className="bg-background rounded-2xl border border-accent-primary shadow-sm p-6">
            <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent-primary scrollbar-track-accent-secondary p-5">
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <button
                    key={client.id}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-md flex-shrink-0 ${
                      selectedClientId === client.id
                        ? "text-background border-transparent shadow-lg"
                        : "bg-accent-primary hover:bg-accent-secondary text-foreground border-accent-primary hover:border-secondary"
                    }`}
                    style={
                      selectedClientId === client.id
                        ? { background: "var(--primary-gradient)" }
                        : {}
                    }
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    {/* Client Icon */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        selectedClientId === client.id
                          ? "bg-white/20"
                          : "bg-accent-secondary"
                      }`}
                    >
                      {(() => {
                        const IconComponent = getBusinessTypeIcon(
                          client.business_type
                        );
                        return (
                          <IconComponent
                            className={`w-4 h-4 ${
                              selectedClientId === client.id
                                ? "text-background"
                                : "text-primary"
                            }`}
                          />
                        );
                      })()}
                    </div>

                    {/* Client Name */}
                    <span className="font-medium text-sm truncate max-w-[140px]">
                      {client.business_name ||
                        client.firstName ||
                        client.lastName ||
                        client.email}
                    </span>

                    {/* Selected Indicator */}
                    {selectedClientId === client.id && (
                      <BsCheck2Circle className="w-4 h-4 text-background ml-auto" />
                    )}
                  </button>
                ))
              ) : (
                <div className="flex items-center gap-3 text-secondary-foreground py-8">
                  <HiOutlineUserGroup className="w-6 h-6" />
                  <span className="text-sm">No clients found</span>
                </div>
              )}
            </div>

            {/* Clear Filter Button */}
            {selectedClientId && (
              <div className="mt-4 pt-4 border-t border-accent-primary">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-secondary text-secondary-foreground border border-accent-primary hover:border-secondary transition-all duration-200 text-sm font-medium"
                  onClick={() => setSelectedClientId(null)}
                >
                  <FiX className="w-4 h-4" />
                  Clear Filter - Show All Documents
                </button>
              </div>
            )}
          </div>
        </div>
        {/* --- END CLIENT FOLDER LIST --- */}

        {/* Commented Search Client filter */}
        {/* <div className="relative min-w-[220px]" ref={clientDropdownRef}>
                <button
                  type="button"
                  className="w-full pl-4 pr-4 py-3 rounded-xl border border-accent-primary bg-background text-foreground focus:outline-none focus:border-primary hover:border-secondary transition-all duration-200 text-sm font-medium text-left flex items-center justify-between"
                  onClick={() => setShowClientDropdown(!showClientDropdown)}
                >
                  <span className="truncate">{getSelectedClientDisplay()}</span>
                  <FiChevronDown
                    className={`w-4 h-4 text-secondary-foreground transition-transform duration-200 ${
                      showClientDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                  
                {showClientDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-accent-primary rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
                    <div className="p-3 border-b border-accent-primary">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search clients..."
                          className="w-full pl-8 pr-3 py-2 rounded-lg border border-accent-primary bg-background text-foreground focus:outline-none focus:border-primary text-sm"
                          value={clientSearchQuery}
                          onChange={(e) => setClientSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-secondary-foreground w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      <button
                        type="button"
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-accent-secondary transition-colors duration-150 flex items-center gap-3 ${
                          !selectedClientId
                            ? "bg-accent-secondary text-primary font-medium"
                            : "text-foreground"
                        }`}
                        onClick={() => handleClientSelect(null)}
                      >
                        <FiUsers className="w-4 h-4 text-secondary-foreground" />
                        <span>All Clients</span>
                        {!selectedClientId && (
                          <BsCheck2Circle className="w-4 h-4 text-primary ml-auto" />
                        )}
                      </button>

                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-accent-secondary transition-colors duration-150 flex items-center gap-3 ${
                              selectedClientId === client.id
                                ? "bg-accent-secondary text-primary font-medium"
                                : "text-foreground"
                            }`}
                            onClick={() => handleClientSelect(client)}
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {(
                                  client.business_name ||
                                  client.firstName ||
                                  client.email ||
                                  "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium">
                                {client.business_name ||
                                  `${client.firstName || ""} ${
                                    client.lastName || ""
                                  }`.trim() ||
                                  client.email}
                              </div>
                              {client.business_name &&
                                (client.firstName || client.lastName) && (
                                  <div className="text-xs text-secondary-foreground truncate">
                                    {`${client.firstName || ""} ${
                                      client.lastName || ""
                                    }`.trim()}
                                  </div>
                                )}
                            </div>
                            {selectedClientId === client.id && (
                              <BsCheck2Circle className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        ))
                      ) : clientSearchQuery.trim() ? (
                        <div className="px-4 py-6 text-center text-secondary-foreground text-sm">
                          <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No clients found</p>
                          <p className="text-xs mt-1">
                            Try adjusting your search
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center text-secondary-foreground text-sm">
                          <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No clients available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div> */}

        {/* Enhanced Table with modern styling */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiFolder className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  All Documents
                </h2>
                <p className="text-sm text-gray-600">
                  Manage and organize your documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* --- Search Input --- */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search documents by any attribute..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent-primary bg-background text-foreground focus:outline-none focus:border-primary hover:border-secondary transition-all duration-200 text-sm min-w-[350px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground w-4 h-4" />
              </div>
              {/* --- Action Buttons --- */}
              <div className="flex gap-3 ml-auto">
                {/* Top buttons and search */}
                <div className="flex justify-between items-center">
                  {/* Show restriction/warning message here, between label and button */}
                  {isSubscriptionExpired && (
                    <div className="mb-4 px-4 py-3 rounded bg-red-100 text-red-600 font-medium w-fit mx-auto">
                      Your subscription is expired, please upgrade it to
                      continue document processing.
                    </div>
                  )}
                  {!isSubscriptionExpired &&
                    isScanLimitReached &&
                    isFreePlan && (
                      <div className="mb-4 px-4 py-3 rounded bg-yellow-100 text-red-600 font-medium w-fit mx-auto">
                        You have reached the maximum number of free scans in
                        your plan. Please upgrade to add more documents.
                      </div>
                    )}
                  {!isSubscriptionExpired &&
                    isScanLimitReached &&
                    !isFreePlan &&
                    subscription &&
                    subscriptionDetails &&
                    subscription.used_scans <
                      subscriptionDetails.allowed_smart_scan + 10 && (
                      <div className="mb-4 px-4 py-3 rounded bg-green-100 text-black font-medium w-fit mx-auto">
                        You have exhausted free scans in your current plan.
                        Further scans will be charged at <b>$0.20 per page</b>.
                      </div>
                    )}
                  <div className="flex gap-3">
                    {selectedDocuments.size > 0 && (
                      <>
                        <button
                          className="btn-danger flex items-center gap-2 font-medium"
                          onClick={handleDelete}
                        >
                          <FiX className="w-4 h-4" />
                          Delete
                        </button>
                        <button
                          className="primary-btn flex items-center gap-2 font-medium"
                          onClick={() => setIsShareDocumentOpen(true)}
                        >
                          <FiUsers className="w-4 h-4" />
                          Share
                        </button>

                        <button
                          className="primary-outlined-btn flex items-center gap-2 font-medium"
                          onClick={handleReset}
                        >
                          <IoIosRefresh className="w-4 h-4" />
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
                      onClick={(e) => {
                        if (isSubscriptionExpired) {
                          e.preventDefault();
                          toast.error(
                            "Your subscription is expired, please upgrade it to continue document processing."
                          );
                        }
                        if (
                          !isSubscriptionExpired &&
                          isScanLimitReached &&
                          isFreePlan
                        ) {
                          e.preventDefault();
                          toast.error(
                            "You have reached the maximum number of free scans in your plan. Please upgrade to add more documents."
                          );
                        }
                        if (
                          !isSubscriptionExpired &&
                          isScanLimitReached &&
                          !isFreePlan &&
                          subscription &&
                          subscriptionDetails &&
                          subscription.used_scans <
                            subscriptionDetails.allowed_smart_scan + 10
                        ) {
                          toast.warn(
                            "You have exhausted free scans in your current plan. Further scans will be charged at $0.20 per page."
                          );
                          // Allow navigation
                        }
                      }}
                      tabIndex={
                        isSubscriptionExpired ||
                        (isScanLimitReached && isFreePlan)
                          ? -1
                          : 0
                      }
                      aria-disabled={
                        isSubscriptionExpired ||
                        (isScanLimitReached && isFreePlan)
                      }
                    >
                      Add Document
                    </Link>
                  </div>
                </div>
                <button
                  className="secondary-btn flex items-center gap-2 font-medium"
                  onClick={handleExportCSV}
                >
                  <FiDownload className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="group flex items-center gap-2 px-4 py-3 rounded-xl border border-accent-primary bg-accent-primary hover:bg-accent-secondary text-foreground transition-all duration-200 hover:scale-105 hover:shadow-md text-sm font-medium"
                >
                  <IoIosRefresh className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        filteredDocuments.length > 0 &&
                        selectedDocuments.size === filteredDocuments.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                  <th
                    className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
                    className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
                    className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("category")}
                  >
                    Category
                    {sortConfig.key === "category" && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="relative" ref={processDateRef}>
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors rounded px-2 py-1"
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="relative" ref={documentDateRef}>
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors rounded px-2 py-1"
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
                  <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentItems.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedDocuments.has(doc.id)}
                    onSelect={handleSelectDocument}
                    fetchDocuments={fetchDocuments}
                    isDisabled={isRowDisabled(doc.client)}
                    parsedData={doc.parsed_data}
                    onRowClick={() =>
                      router.push(
                        `/dashboard/document-management/view-document/${doc.id}`
                      )
                    }
                    isManageDocumentOpen={
                      isManageDocumentOpen &&
                      editDocument &&
                      editDocument.id === doc.id
                    }
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

        {/* CSV Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-md w-full mx-4">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FiDownload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Export to CSV
                    </h3>
                    <p className="text-white/90 text-sm">
                      Download document data
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <FiFolder className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {selectedDocuments.size > 0
                            ? `${selectedDocuments.size} selected documents`
                            : `${filteredAndSortedItems.length} documents`}
                        </p>
                        <p className="text-sm text-secondary-foreground">
                          {selectedDocuments.size > 0
                            ? "Export selected documents only"
                            : "Export all filtered documents"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      Included Fields:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-secondary-foreground">
                      <span>• Document Title</span>
                      <span>• Client Name</span>
                      <span>• Client Email</span>
                      <span>• Category</span>
                      <span>• Status</span>
                      <span>• Upload Date</span>
                      <span>• Document Date</span>
                      <span>• Summary</span>
                      <span>• Page Count</span>
                      <span>• File URL</span>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmExportCSV}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Only use the ManageDocument modal from DocumentRow now. */}
      </div>
    </div>
  );
};

export default AllDocumentPage;
