"use client";
import { useState, useEffect, useRef } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { extractFilenameFromUrl, formatDate } from "@/utils";
import DocumentPreview from "./DocumentPreview";
import { toast } from "react-toastify";
import { authFetch } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import ManageDocument from "../common/ManageDocument";
import { BiLoaderAlt } from "react-icons/bi";
import Avatar from "@/components/Dashboard/Avatar";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
} from "react-icons/fa";

const DocumentRow = ({
  doc,
  isSelected,
  onSelect,
  fetchDocuments,
  isDisabled,
  parsedData = {},
  onRowClick,
  isManageDocumentOpen,
  setIsManageDocumentOpen,
  setEditDocument,
  setEditAction,
  action,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // const [parsedData, setParsedData] = useState({});
  const { refreshTokenFn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  // Modal state is now managed by parent

  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const ext = filename.split(".").pop().toLowerCase();
    return ext;
  };

  const type = getFileType(extractFilenameFromUrl(doc.file));
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const handleDelete = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${doc.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
        refreshTokenFn
      );
      if (res.ok) {
        toast.success("Document deleted successfully");
        fetchDocuments();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Something went wrong");
    }
  };

  const fetchParsedData = async () => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${doc.id}/parsed-data/`,
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
        // setParsedData(data.parsed_data);
      } else {
        console.log("Error fetching parsed data:", response.statusText);
        // setParsedData({});
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchParsedData();
    }
  }, [isMounted]);

  useEffect(() => {
    if (doc) {
      const interval = setInterval(() => {
        if (
          !parsedData?.parsed_data?.suggested_title ||
          Object.keys(parsedData)?.length === 0
        ) {
          fetchParsedData();
        } else {
          clearInterval(interval);
        }
      }, 25000);

      return () => clearInterval(interval);
    }
  }, [doc, parsedData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <tr
      className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 ${
        isDisabled && !isSelected ? "opacity-50" : ""
      } ${isSelected ? "bg-blue-50 border-blue-200" : ""}`}
      onClick={(e) => {
        // Prevent row click when clicking on checkbox or action buttons
        if (
          e.target.tagName === "INPUT" ||
          e.target.tagName === "BUTTON" ||
          e.target.closest("button") ||
          e.target.closest("a")
        ) {
          return;
        }

        // Prevent row click when ManageDocument modal is open
        if (isManageDocumentOpen) {
          return;
        }

        onRowClick && onRowClick(doc);
      }}
    >
      <td className="px-8 py-4">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
          checked={isSelected}
          onChange={() => onSelect(doc.id, doc.client)}
          disabled={isDisabled}
        />
      </td>
      <td className="px-8 py-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Keep avatar at a fixed size and prevent shrinking */}
          <div className="w-8 h-8 flex-shrink-0 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all rounded-full overflow-hidden">
            <Avatar
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
              name={(doc?.client || "").replace(/\s*\(.*?\)\s*$/, "")}
              size={32}
              className=""
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {(doc?.client || "").replace(/\s*\(.*?\)\s*$/, "")}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {type === "pdf" ? (
              <FaFilePdf className="h-5 w-5 text-red-500" />
            ) : type === "image" ? (
              <FaFileImage className="h-5 w-5 text-green-500" />
            ) : type === "word" ? (
              <FaFileWord className="h-5 w-5 text-blue-500" />
            ) : type === "excel" ? (
              <FaFileExcel className="h-5 w-5 text-green-600" />
            ) : (
              <FaFileAlt className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            {type === "pdf" ? (
              <button
                onClick={() => {
                  setIsPreviewOpen(true);
                }}
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium text-start truncate transition-colors group-hover:text-blue-700"
              >
                {parsedData?.parsed_data?.suggested_title ||
                  extractFilenameFromUrl(doc.file)}
              </button>
            ) : (
              <a
                href={doc.file}
                target="_blank"
                className="text-blue-600 hover:text-blue-800 font-medium text-start truncate transition-colors group-hover:text-blue-700"
                rel="noopener noreferrer"
              >
                {parsedData?.parsed_data?.suggested_title ||
                  extractFilenameFromUrl(doc.file)}
              </a>
            )}
            <span className="text-xs text-gray-500 truncate">
              {type?.toUpperCase() || "FILE"}
            </span>
          </div>
        </div>
        {isPreviewOpen && (
          <DocumentPreview
            document={doc.file}
            setIsDocumentPreviewOpen={setIsPreviewOpen}
            type={type}
          />
        )}
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 group-hover:bg-gray-200 transition-colors">
          {doc.category?.name ||
            parsedData?.parsed_data?.document_type ||
            "Uncategorized"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatDate(doc.uploaded_at)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {formatDate(parsedData?.parsed_data?.document_date)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        {!parsedData?.parsed_data?.suggested_title ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
            <BiLoaderAlt className="animate-spin h-3 w-3" />
            Processing
          </span>
        ) : doc.status === "Verified" ? (
          <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-200">
            ✓ {doc?.status}
          </span>
        ) : (
          // Only show Verify Now if not already Verified
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 border border-orange-200 hover:from-orange-200 hover:to-amber-300 transition-all duration-200 hover:shadow-sm"
            onClick={() => {
              setEditAction("verify");
              setEditDocument(doc);
              setIsManageDocumentOpen(true);
            }}
          >
            Verify Now
          </button>
        )}
      </td>
      <td className="px-8 py-4 relative">
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group-hover:bg-gray-200"
          >
            <FiMoreVertical className="h-4 w-4" />
          </button>
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden"
            >
              <button
                type="button"
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  setEditAction("edit");
                  setEditDocument(doc);
                  setIsManageDocumentOpen(true);
                }}
              >
                <svg
                  className="w-4 h-4 mr-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Document
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-3 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Document
              </button>
            </div>
          )}
          {isManageDocumentOpen && (
            <>
              <ManageDocument
                setIsManageDocumentOpen={setIsManageDocumentOpen}
                document={{ ...doc, status: doc.status || "Pending" }}
                parsedData={parsedData?.parsed_data || {}}
                action={action}
                onDocumentUpdate={fetchDocuments}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default DocumentRow;
