"use client";

import { formatDate } from "@/utils";
import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import { useState } from "react";

const UserRow = ({ client, setEditClient, setIsEditClientOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <tr className="hover:bg-black/10 cursor-pointer">
      <td className="px-6 py-4">
        <input type="checkbox" className="rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={client.AVATAR}
            alt={"Profile"}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="text-sm font-medium text-gray-900">
            {client.FIRST_NAME} {client.LAST_NAME}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-foreground">{client.EMAIL}</td>
      <td className="px-6 py-4 text-sm text-foreground">
        {client.MOBILE_NUMBER}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">{client.DOCUMENTS}</td>
      <td className="px-6 py-4 text-sm text-foreground">
        {formatDate(client.CREATED_AT)}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            client.STATUS === "Verified"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {client.STATUS === "Verified" ? "Verified" : "Verify Now"}
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
          <div className="absolute bg-white rounded-lg shadow-lg z-10 overflow-hidden">
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
export default UserRow;
