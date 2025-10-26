"use client";
import { useAuth } from "@/context/AuthContext";
import { GlobalContext } from "@/context/GlobalProvider";
import { authFetch } from "@/utils/auth";
import { useContext, useEffect, useState } from "react";

const SharedDocumentRow = ({ doc }) => {
  const [client, setClient] = useState(null);

  const { clients, documents } = useContext(GlobalContext);

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

  useEffect(() => {
    fetchClient(doc.client_id);
  }, [doc]);

  // Helper function to extract the file name from the path
  const extractFileName = (path) => {
    if (!path) return "";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {client?.business_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 underline">
        <a target="_blank" href={doc.document_link}>
          {extractFileName(doc.document_name)}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(doc.shared_date).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '/')}
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {doc.otp}
      </td> */}
    </tr>
  );
};
export default SharedDocumentRow;
