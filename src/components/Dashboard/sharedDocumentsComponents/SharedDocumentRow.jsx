import { GlobalContext } from "@/context/GlobalProvider";
import { useContext, useEffect, useState } from "react";
import { FiExternalLink, FiUser, FiCalendar } from "react-icons/fi";
import Avatar from "../Avatar";

// Helper function to extract the file name from the path
const extractFileName = (path) => {
  if (!path) return "";
  const parts = path.split("/");
  return parts[parts.length - 1];
};

const SharedDocumentRow = ({ doc }) => {
  const [client, setClient] = useState(null);

  const { clients, documents } = useContext(GlobalContext);

  // Find the document by document_id to get its parsed_data.suggested_title
  const documentData = documents.find(
    (document) => document.id === doc.document_id
  );
  console.log(documentData);
  const documentTitle =
    documentData?.parsed_data?.parsed_data?.suggested_title ||
    extractFileName(doc.document_name);

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

  return (
    <tr className="hover:bg-gradient-to-r hover:from-accent-primary/30 hover:to-accent-secondary/30 transition-all duration-300 group">
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Avatar
                name={client?.business_name || "Client"}
                className="w-8 h-8 rounded-full"
                fallbackBg="bg-gradient-to-br from-blue-400 to-green-500"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
              {client?.business_name || "Loading..."}
            </span>
            <span className="text-xs text-gray-500">Client</span>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <a
              target="_blank"
              href={doc.document_link}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors duration-200 group-hover:underline"
              rel="noopener noreferrer"
            >
              <span className="truncate">{documentTitle}</span>
              <FiExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
            <span className="text-xs text-gray-500 truncate">
              Shared Document
            </span>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {new Date(doc.shared_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(doc.shared_date).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
};
export default SharedDocumentRow;
