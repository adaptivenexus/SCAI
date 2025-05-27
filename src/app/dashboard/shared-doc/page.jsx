"use client";

import SharedDocumentRow from "@/components/Dashboard/sharedDocumentsComponents/SharedDocumentRow";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import { toast } from "react-toastify";

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-5">Shared Documents</h2>
        <button onClick={() => router.back()} className="secondary-btn px-8">
          Back
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <p className="p-6 text-secondary-foreground">Loading...</p>
        ) : sortedDocuments?.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-accent-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10">
                    <div onClick={() => handleSort("client_name")}>
                      Client Name
                      {sortConfig.key === "client_name" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10">
                    <div onClick={() => handleSort("document_name")}>
                      Document Name
                      {sortConfig.key === "document_name" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10">
                    <div onClick={() => handleSort("shared_date")}>
                      Shared Date
                      {sortConfig.key === "shared_date" && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedDocuments.map((doc, index) => (
                  <SharedDocumentRow key={index} doc={doc} />
                ))}
              </tbody>
            </table>
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
                <span className="px-3 py-1">
                  Page {currentPage} of {totalPages}
                </span>
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
                {Math.min(currentPage * itemsPerPage, sortedDocuments.length)}{" "}
                of {sortedDocuments.length} entries
              </div>
            </div>
          </>
        ) : (
          <p className="p-6 text-secondary-foreground">
            No shared documents found
          </p>
        )}
      </div>
    </div>
  );
};

export default SharedDocumentsPage;