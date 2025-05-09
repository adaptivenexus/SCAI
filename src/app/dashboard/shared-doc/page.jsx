"use client";

import SharedDocumentRow from "@/components/Dashboard/sharedDocumentsComponents/SharedDocumentRow";
import { useEffect, useState } from "react";

const { useAuth } = require("@/context/AuthContext");
const { authFetch } = require("@/utils/auth");

const SharedDocuments = () => {
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const { user } = useAuth();

  const { refreshTokenFn } = useAuth();

  const fetchSharedDocuments = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/shares/shares/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          refreshTokenFn,
        }
      );
      const data = await res.json();
      if (res.ok) {
        if (user.id) {
          const filteredData = data.filter(
            (doc) => doc.shared_by_agency === user.id
          );

          if (filteredData.length === 0) {
            setSharedDocuments([]);
            return;
          }

          setSharedDocuments(filteredData);
        }
      } else {
        console.error("Error fetching shared documents:", data.message);
      }
    } catch (err) {
      console.error("Error fetching shared documents:", err);
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
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
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
                Password
              </th>
            </tr>
          </thead>
          <tbody>
            {sharedDocuments.map((doc) => (
              <SharedDocumentRow key={doc.id} doc={doc} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SharedDocuments;
