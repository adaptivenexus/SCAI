"use client";

import { extractEmail, formatDate } from "@/utils";
import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "@/context/GlobalProvider";
import Avatar from "../Avatar";
import { createPortal } from "react-dom";

const UserRow = ({ client, setEditClient, setIsEditClientOpen, isSelected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const { documents } = useContext(GlobalContext);

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

  const documentCount = documents.filter((doc) => {
    // Extract email from doc.name, e.g., "Jerusalem Market (info@jerusalem.com)"
    const docEmail = extractEmail(doc.client);
    return docEmail === client.email;
  }).length;

  return (
    <>
      {/* Table Row */}
      <tr className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
      <td className="px-8 py-4">
        <input
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={isSelected || false}
          onChange={() => onSelect && onSelect(client.id)}
        />
      </td>
      <td className="px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* Avatar */}
            <Avatar
              name={client?.business_name || "Client"}
              className="w-8 h-8 rounded-full"
              fallbackBg="bg-gradient-to-br from-blue-400 to-green-500"
            />
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {client.business_name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{client.email}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {client.mobile_number}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
        {documentCount}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {formatDate(client.created_at)}
      </td>
      <td className="px-6 py-4">
        {client.status === "Verified" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
            Verified
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditClientOpen(true);
              setEditClient(client);
            }}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200"
          >
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5 animate-pulse"></div>
            Verify Now
          </button>
        )}
      </td>
      <td className="px-8 py-4 relative">
        <button
          type="button"
          onClick={(e) => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              const buttonRect = e.currentTarget.getBoundingClientRect();
              const dropdownWidth = 140; // min-w-[140px]
              const dropdownHeight = 48; // Approximate height for 1 item
              
              // Calculate initial position
              let top = buttonRect.bottom + 8;
              let left = buttonRect.right - dropdownWidth;
              
              // Boundary checking
              const viewportWidth = window.innerWidth;
              const viewportHeight = window.innerHeight;
              
              // Adjust if dropdown goes off right edge
              if (left < 8) {
                left = buttonRect.left; // Align left edges instead
              }
              
              // Adjust if dropdown goes off bottom edge
              if (top + dropdownHeight > viewportHeight) {
                top = buttonRect.top - dropdownHeight - 8; // Show above button
              }
              
              setDropdownPosition({ top, left });
              setIsOpen(true);
            }
          }}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>

      </td>
      </tr>
      
      {/* Portal Dropdown - rendered outside table structure */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[9999] min-w-[140px]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          <button
            onClick={() => {
              setEditClient(client);
              setIsEditClientOpen(true);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Edit Client
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

export default UserRow;
