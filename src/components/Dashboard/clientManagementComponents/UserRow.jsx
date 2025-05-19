"use client";

import { extractEmail, formatDate } from "@/utils";
import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "@/context/GlobalProvider";

const UserRow = ({ client, setEditClient, setIsEditClientOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <tr className="hover:bg-black/10 cursor-pointer">
      <td className="px-6 py-4">
        <input type="checkbox" className="rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={client.image_url || "/placeholder.jpg"}
            alt={"Profile"}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="text-sm font-medium text-gray-900">
            {client.business_name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground">{client.email}</td>
      <td className="px-6 py-4 text-sm text-foreground">
        {client.mobile_number}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">{documentCount}</td>
      <td className="px-6 py-4 text-sm text-foreground">
        {formatDate(client.created_at)}
      </td>
      <td className="px-6 py-4">
        {client.status === "Verified" ? (
          <span
            className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-800`}
          >
            Verified
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditClientOpen(true);
              setEditClient(client);
            }}
            className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800"
          >
            Verify Now
          </button>
        )}
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
                setEditClient(client);
                setIsEditClientOpen(true);
                setIsOpen(false);
              }}
            >
              Edit
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
export default UserRow;
