"use client";

import ManageDocument from "@/components/Dashboard/common/ManageDocument";
import DocumentRow from "@/components/Dashboard/documentManagement/DocumentRow";
import { useState, useMemo } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";

const AllDocumentPage = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      associatedTo: {
        name: "Jack Reid",
        avatar: "/path/to/avatar.jpg",
      },
      documentName: "Invoice_001.pdf",
      category: "Finance",
      url: "https://pub-3ee73871842b4afda30068064ade7460.r2.dev/temp.pdf",
      processDate: "2025-09-25",
      documentDate: "2025-01-23",
      status: "Verified",
    },
    {
      id: 2,
      associatedTo: {
        name: "Jack Reid",
        avatar: "/path/to/avatar.jpg",
      },
      documentName: "Contract.docx",
      category: "Legal",
      url: "https://pub-3ee73871842b4afda30068064ade7460.r2.dev/temp.docx",
      processDate: "2025-09-25",
      documentDate: "2025-01-23",
      status: "Verified",
    },
    // Add more mock documents
    ...Array.from({ length: 40 }, (_, i) => ({
      id: i + 3,
      associatedTo: {
        name: "Jack Reid",
        avatar: "/path/to/avatar.jpg",
      },
      documentName: `Report_${i + 1}.xlsx`,
      category: "Reports",
      url: "https://pub-3ee73871842b4afda30068064ade7460.r2.dev/temp.pdf",
      processDate: "2025-09-25",
      documentDate: "2025-01-23",
      status: i < 3 ? "Verified" : "Verify Now",
    })),
  ]);
  const [isManageDocumentOpen, setIsManageDocumentOpen] = useState(false);
  const [editDocument, setEditDocument] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
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

  // Sort the documents
  const sortedDocuments = useMemo(() => {
    if (!sortConfig.key) return documents;

    return [...documents].sort((a, b) => {
      const aValue =
        sortConfig.key === "associatedTo"
          ? a[sortConfig.key].name
          : a[sortConfig.key];
      const bValue =
        sortConfig.key === "associatedTo"
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
      doc.associatedTo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search Client"
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
                <input type="checkbox" className="rounded" />
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
                Document Name
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
                Process Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Document Date
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
