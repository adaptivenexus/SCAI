"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import { extractFilenameFromUrl, formatDate } from "@/utils";
import DocumentPreview from "./DocumentPreview";
import { toast } from "react-toastify";
import { authFetch } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import ManageDocument from "../common/ManageDocument";
import { BiLoaderAlt } from "react-icons/bi";

const DocumentRow = ({
  doc,
  isSelected,
  onSelect,
  fetchDocuments,
  isDisabled,
  parsedData = {},
  onRowClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // const [parsedData, setParsedData] = useState({});
  const { refreshTokenFn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isManageDocumentOpen, setIsManageDocumentOpen] = useState(false);
  const [action, setAction] = useState(null);

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
      className={`hover:bg-gray-50 ${
        isDisabled && !isSelected ? "opacity-50" : ""
      }`}
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
        onRowClick && onRowClick(doc);
      }}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="rounded"
            checked={isSelected}
            onChange={() => onSelect(doc.id, doc.client)}
            disabled={isDisabled}
          />
          <Image
            src={
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
            }
            alt={"Profile"}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="text-sm font-medium truncate">{doc.client}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {type === "pdf" ? (
          <button
            onClick={() => {
              setIsPreviewOpen(true);
            }}
            type="button"
            className="text-primary underline text-start truncate"
          >
            {parsedData?.parsed_data?.suggested_title ||
              extractFilenameFromUrl(doc.file)}
          </button>
        ) : (
          <a
            href={doc.file}
            target="_blank"
            className="text-primary underline text-start truncate"
            rel="noopener noreferrer"
          >
            {parsedData?.parsed_data?.suggested_title ||
              extractFilenameFromUrl(doc.file)}
          </a>
        )}
        {isPreviewOpen && (
          <DocumentPreview
            document={doc.file}
            setIsDocumentPreviewOpen={setIsPreviewOpen}
            type={type}
          />
        )}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {doc.category?.name || parsedData?.parsed_data?.document_type}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {formatDate(doc.uploaded_at)}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {formatDate(parsedData?.parsed_data?.document_date)}
      </td>
      <td className="px-6 py-4">
        {!parsedData?.parsed_data?.suggested_title ? (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Processing <BiLoaderAlt className="animate-spin inline-block" />
          </span>
        ) : doc.status === "Verified" ? (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            {doc?.status}
          </span>
        ) : (
          // Only show Verify Now if not already Verified
          <button
            type="button"
            className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800"
            onClick={() => {
              setAction("verify");
              setIsManageDocumentOpen(true);
            }}
          >
            Verify Now
          </button>
        )}
      </td>
      <td className="px-6 py-4 relative">
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiMoreVertical />
          </button>
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute bg-white rounded-lg shadow-lg z-10 overflow-hidden"
            >
              <button
                type="button"
                className="block subtitle-text px-3 py-1 text-foreground hover:opacity-80 hover:bg-black/10 w-full text-start"
                onClick={() => {
                  setIsOpen(false);
                  setAction("edit");
                  setIsManageDocumentOpen(true);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="block subtitle-text px-3 py-1 text-red-500 hover:opacity-80 hover:bg-black/10 w-full text-start"
              >
                Delete
              </button>
            </div>
          )}
          {isManageDocumentOpen && (
            <>
              <ManageDocument
                setIsManageDocumentOpen={setIsManageDocumentOpen}
                document={{ ...doc, status: doc.status || "Pending" }}
                parsedData={parsedData.parsed_data || {}}
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
