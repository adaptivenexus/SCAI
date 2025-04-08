"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import { extractFilenameFromUrl, formatDate } from "@/utils";
import DocumentPreview from "./DocumentPreview";

const DocumentRow = ({
  doc,
  setIsManageDocumentOpen,
  setEditDocument,
  isSelected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded"
          checked={isSelected}
          onChange={() => onSelect(doc.id)}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
            }
            alt={"Profile"}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{doc.client}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        <div>
          <button
            onClick={() => {
              setIsPreviewOpen(true);
            }}
            type="button"
            className="text-primary underline"
          >
            {extractFilenameFromUrl(doc.file)}
          </button>
          {isPreviewOpen && (
            <DocumentPreview
              document={doc.file}
              setIsDocumentPreviewOpen={setIsPreviewOpen}
              fileName={extractFilenameFromUrl(doc.file)}
            />
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground">{doc.category.name}</td>
      <td className="px-6 py-4 text-sm text-foreground">
        {formatDate(doc.uploaded_at)}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">
        {formatDate(doc.documentDate)}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            doc.status === "Verified"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {doc.status}
        </span>
      </td>
      <td className="px-6 py-4 relative">
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
                setEditDocument(doc);
                setIsManageDocumentOpen(true);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="block subtitle-text px-3 py-1 text-foreground hover:opacity-80 hover:bg-black/10 w-full text-start"
            >
              Share
            </button>
            <button
              type="button"
              className="block subtitle-text px-3 py-1 text-red-500 hover:opacity-80 hover:bg-black/10 w-full text-start"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
export default DocumentRow;
