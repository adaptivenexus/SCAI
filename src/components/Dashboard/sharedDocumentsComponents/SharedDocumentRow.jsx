"use client";
import { useAuth } from "@/context/AuthContext";
import { GlobalContext } from "@/context/GlobalProvider";
import { authFetch } from "@/utils/auth";
import { useContext, useEffect, useState } from "react";

const SharedDocumentRow = ({ doc }) => {
  const [client, setClient] = useState(null);
  const [document, setDocument] = useState(null);
  const { clients, documents } = useContext(GlobalContext);
  const [parsedData, setParsedData] = useState({});
  const { refreshTokenFn } = useAuth();

  const fetchClient = async (clientId) => {
    try {
      const data = clients.find((client) => client.id === clientId);
      if (!data) {
        throw new Error("Client not found");
      }

      setClient(data);
    } catch (err) {
      console.error("Error fetching shared documents:", err);
    }
  };

  const fetchDocument = async (documentId) => {
    try {
      const data = documents.find((document) => document.id === documentId);
      if (!data) {
        throw new Error("Document not found");
      }

      setDocument(data);
    } catch (err) {
      console.error("Error fetching document:", err);
    }
  };
  const fetchParsedData = async (documentId) => {
    try {
      // Ensure localStorage is accessed only on the client side
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${documentId}/parsed-data/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
        refreshTokenFn
      );
      if (response.ok) {
        const data = await response.json();
        setParsedData(data.parsed_data);
      } else {
        console.log("Error fetching parsed data:", response.statusText);
        setParsedData({});
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  useEffect(() => {
    fetchClient(doc.client);
    fetchDocument(doc.document);
    fetchParsedData(doc.document);
  }, [doc]);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {client?.business_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {parsedData.suggested_title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(doc.expires_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {doc.access_password}
      </td>
    </tr>
  );
};
export default SharedDocumentRow;
