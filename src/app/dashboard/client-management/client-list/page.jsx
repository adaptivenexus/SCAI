"use client";

import UserRow from "@/components/Dashboard/clientManagementComponents/UserRow";
import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { GlobalContext } from "@/context/GlobalProvider";
import { useState, useMemo, useContext } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";

const ClientListPage = () => {
  const { clients } = useContext(GlobalContext);

  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const itemsPerPage = 10;

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      // If clicking the same column
      if (prevConfig.key === key) {
        // If it's already in desc order (meaning this is the third click)
        if (prevConfig.direction === "desc") {
          // Reset sorting
          return { key: "id", direction: "asc" };
        }
        // Otherwise change to desc order
        return { key, direction: "desc" };
      }
      // First click on a new column - start with asc
      return { key, direction: "asc" };
    });
  };

  const sortedClients = useMemo(() => {
    const sorted = [...clients];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [clients, sortConfig]);

  const filteredClients = sortedClients.filter((client) => {
    const matchesSearch =
      `${client.business_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === "All") return matchesSearch;
    return client.status === filterStatus && matchesSearch;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage]);

  // Get visible page numbers
  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Client List</h1>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Client"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 appearance-none bg-white"
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Not Verified">Not Verified</option>
          </select>
        </div>

        {/* Export Button */}
        <button className="px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
          <FiDownload />
          Export
        </button>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-accent-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                <input type="checkbox" className="rounded" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("FIRST_NAME")}
              >
                Client Name
                {sortConfig.key === "FIRST_NAME" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Phone
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("DOCUMENTS")}
              >
                Documents
                {sortConfig.key === "DOCUMENTS" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer hover:bg-black/10"
                onClick={() => handleSort("CREATED_AT")}
              >
                Creation date
                {sortConfig.key === "CREATED_AT" && (
                  <span className="ml-1">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((client) => (
              <UserRow
                key={client.id}
                client={client}
                setEditClient={setEditClient}
                setIsEditClientOpen={setIsEditClientOpen}
              />
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              &lt;&lt;
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              &lt;
            </button>
            {getVisiblePageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNum === "number" && setCurrentPage(pageNum)
                }
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white"
                    : pageNum === "..."
                    ? "border-transparent cursor-default"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
            >
              &gt;&gt;
            </button>
          </div>
          <div className="text-sm text-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
            {filteredClients.length} entries
          </div>
        </div>
      </div>
      {isEditClientOpen && (
        <AddOrManageClient
          oldClient={editClient}
          isNew={false}
          setIsAddClientOpen={setIsEditClientOpen}
          setEditClient={setEditClient}
        />
      )}
    </div>
  );
};

export default ClientListPage;
