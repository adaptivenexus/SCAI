"use client";

import SharedDocumentRow from "@/components/Dashboard/sharedDocumentsComponents/SharedDocumentRow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import { toast } from "react-toastify";
import { FiChevronUp, FiChevronDown, FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from "react-icons/fi";

const SharedDocumentsPage = () => {
  const router = useRouter();
  const { user, refreshTokenFn } = useAuth();
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "shared_date", direction: "desc" });
  const itemsPerPage = 10;

  const fetchSharedDocuments = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document-share/document-share-audit/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
        refreshTokenFn
      );

      const data = await res.json();
      if (res.ok) {
        const sortedData = data.sort((a, b) => 
          new Date(b.shared_date) - new Date(a.shared_date)
        );
        setSharedDocuments(sortedData);
      } else {
        setSharedDocuments([]);
        console.log("Error fetching shared documents:", data.message);
      }
    } catch (err) {
      console.log("Error fetching shared documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchSharedDocuments();
    }
  }, [user]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "desc") {
          return { key, direction: "asc" };
        }
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedDocuments = [...sharedDocuments].sort((a, b) => {
    let aValue, bValue;
    if (sortConfig.key === "client_name") {
      aValue = a.client_name || "";
      bValue = b.client_name || "";
    } else if (sortConfig.key === "document_name") {
      aValue = a.document_name || "";
      bValue = b.document_name || "";
    } else if (sortConfig.key === "shared_date") {
      aValue = new Date(a.shared_date);
      bValue = new Date(b.shared_date);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gradient-to-br from-background to-accent-primary/20 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="heading-5 text-foreground mb-2">Shared Documents</h2>
          <p className="text-secondary-foreground">Manage and track your shared documents</p>
        </div>
        <button onClick={() => router.back()} className="secondary-btn px-8 shadow-lg hover:shadow-xl transition-all duration-300">
          Back
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-3 text-secondary-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              Loading shared documents...
            </div>
          </div>
        ) : sortedDocuments?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary to-secondary">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors duration-200">
                      <div onClick={() => handleSort("client_name")} className="flex items-center gap-2">
                        Client Name
                        {sortConfig.key === "client_name" && (
                          <span className="text-white">
                            {sortConfig.direction === "asc" ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors duration-200">
                      <div onClick={() => handleSort("document_name")} className="flex items-center gap-2">
                        Document Name
                        {sortConfig.key === "document_name" && (
                          <span className="text-white">
                            {sortConfig.direction === "asc" ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-black/10 transition-colors duration-200">
                      <div onClick={() => handleSort("shared_date")} className="flex items-center gap-2">
                        Shared Date
                        {sortConfig.key === "shared_date" && (
                          <span className="text-white">
                            {sortConfig.direction === "asc" ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedDocuments.map((doc, index) => (
                    <SharedDocumentRow key={index} doc={doc} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg border border-gray-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiChevronsRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Showing <span className="text-primary font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="text-primary font-semibold">{Math.min(currentPage * itemsPerPage, sortedDocuments.length)}</span>{" "}
                of <span className="text-primary font-semibold">{sortedDocuments.length}</span> entries
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No shared documents found</h3>
            <p className="text-secondary-foreground">There are no documents that have been shared yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedDocumentsPage;