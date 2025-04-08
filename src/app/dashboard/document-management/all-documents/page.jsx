"use client";

import ManageDocument from "@/components/Dashboard/common/ManageDocument";
import DocumentPreview from "@/components/Dashboard/documentManagement/DocumentPreview";
import DocumentRow from "@/components/Dashboard/documentManagement/DocumentRow";
import { useState, useMemo, useRef, useEffect } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";

const AllDocumentPage = () => {
  const [documents, setDocuments] = useState([
    // {
    //   id: 1,
    //   client: {
    //     name: "Jack Reid",
    //     avatar: "/path/to/avatar.jpg",
    //   },
    //   name: "Invoice_001.pdf",
    //   category: "Finance",
    //   url: "https://pub-3ee73871842b4afda30068064ade7460.r2.dev/temp.pdf",
    //   processedDate: "2025-09-25",
    //   documentDate: "2025-01-23",
    //   status: "Verified",
    // },
    // {
    //   id: 2,
    //   client: {
    //     name: "Jack Reid",
    //     avatar: "/path/to/avatar.jpg",
    //   },
    //   name: "Contract.docx",
    //   category: "Legal",
    //   url: "https://pub-3ee73871842b4afda30068064ade7460.r2.dev/temp.docx",
    //   processedDate: "2025-09-25",
    //   documentDate: "2025-01-23",
    //   status: "Verified",
    // },
    // // Add more mock documents
    // ...Array.from({ length: 40 }, (_, i) => ({
    //   id: i + 3,
    //   client: {
    //     name: "Jack Reid",
    //     avatar: "/path/to/avatar.jpg",
    //   },
    //   name: `Report_${i + 1}.xlsx`,
    //   category: "Reports",
    //   url: "https://pub-3ee73871842b4afda30068064ade7460.r2.dev/temp.pdf",
    //   processedDate: "2025-09-25",
    //   documentDate: "2025-01-23",
    //   status: i < 3 ? "Verified" : "Verify Now",
    // })),
  ]);
  const [isManageDocumentOpen, setIsManageDocumentOpen] = useState(false);
  const [editDocument, setEditDocument] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [processDateFilter, setProcessDateFilter] = useState("");
  const [documentDateFilter, setDocumentDateFilter] = useState("");
  const [showProcessDatePicker, setShowProcessDatePicker] = useState(false);
  const [showDocumentDatePicker, setShowDocumentDatePicker] = useState(false);
  const processDateRef = useRef(null);
  const documentDateRef = useRef(null);

  useEffect(() => {
    console.log(selectedDocuments);
  }, [selectedDocuments]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  useEffect(() => {
    fetchDocuments();
  }, []);

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
          return { key: null, direction: "asc" }; // Reset sorting
        }
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDocuments(new Set(currentItems.map((doc) => doc.id)));
    } else {
      setSelectedDocuments(new Set());
    }
  };

  const handleSelectDocument = (docId) => {
    setSelectedDocuments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  // Sort the documents
  const sortedDocuments = useMemo(() => {
    if (!sortConfig.key) return documents;

    return [...documents].sort((a, b) => {
      const aValue =
        sortConfig.key === "client"
          ? a[sortConfig.key].name
          : a[sortConfig.key];
      const bValue =
        sortConfig.key === "client"
          ? b[sortConfig.key].name
          : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [documents, sortConfig]);

  // Filter and paginate
  const filteredAndSortedItems = sortedDocuments.filter(
    (doc) =>
      (doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.file.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!processDateFilter || doc.processedDate === processDateFilter) &&
      (!documentDateFilter || doc.documentDate === documentDateFilter)
  );

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const currentItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Documents</h1>
      </div>

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

        {/* Export Button */}
        <button className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50">
          <FiDownload />
          Export
        </button>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-accent-primary">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={
                    currentItems.length > 0 &&
                    currentItems.every((doc) => selectedDocuments.has(doc.id))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("associatedTo")}
              >
                Associated To
                {sortConfig.key === "associatedTo" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("documentName")}
              >
                Document
                {sortConfig.key === "documentName" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Category
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
                Status
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
                setIsManageDocumentOpen={setIsManageDocumentOpen}
                setEditDocument={setEditDocument}
                isSelected={selectedDocuments.has(doc.id)}
                onSelect={handleSelectDocument}
              />
            ))}
          </tbody>
        </table>

        {/* Pagination */}
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
      {isManageDocumentOpen && (
        <ManageDocument
          setIsManageDocumentOpen={setIsManageDocumentOpen}
          editDocument={editDocument}
          setEditDocument={setEditDocument}
        />
      )}
    </div>
  );
};

export default AllDocumentPage;
