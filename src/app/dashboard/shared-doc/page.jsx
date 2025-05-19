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

  const fetchSharedDocuments = async () => {
    setLoading(true);
    try {
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      // TODO: Replace this API with /api/v1/document-share/document-share-audit/ once it's available
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
        if (user?.id) {
          const filteredData = data.filter(
            (doc) => doc.shared_by_agency === user.id
          );

          if (filteredData.length === 0) {
            setSharedDocuments([]);
          } else {
            setSharedDocuments(filteredData);
          }
        }
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-5">Shared Documents</h2>
        <button
          onClick={() => router.back()}
          className="secondary-btn px-8"
        >
          Back
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <p className="p-6 text-secondary-foreground">Loading...</p>
        ) : sharedDocuments.length > 0 ? (
          <table className="w-full">
            <thead className="bg-accent-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  OTP
                </th>
              </tr>
            </thead>
            <tbody>
              {sharedDocuments.map((doc) => (
                <SharedDocumentRow key={doc.id} doc={doc} />
              ))}
            </tbody>
          </table>
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