"use client";
import { FaRegBell, FaSearch, FaFileAlt, FaUserFriends } from "react-icons/fa";
import Image from "next/image";
import Sidebar from "@/components/Dashboard/Sidebar";
import GlobalDashboardProvider from "@/context/GlobalProvider";
import Link from "next/link";

import { PiUserCircleFill } from "react-icons/pi";
import { MdDataUsage, MdLogout, MdOutlinePayment } from "react-icons/md";
import { useState, useEffect, useRef, useContext } from "react";
import { useAuth } from "@/context/AuthContext";
import { IoMenu, IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/GlobalProvider";
import { extractFilenameFromUrl } from "@/utils";
import Avatar from "@/components/Dashboard/Avatar";

const NotificationBell = () => {
  const ctx = useContext(GlobalContext);
  const clients = Array.isArray(ctx?.clients) ? ctx.clients : [];
  const documents = Array.isArray(ctx?.documents) ? ctx.documents : [];
  const unverifiedClientsCount = clients.filter((c) => c.status !== "Verified").length;
  const unverifiedDocumentsCount = documents.filter((d) => !d.is_verified).length;
  const notificationCount = unverifiedClientsCount + unverifiedDocumentsCount;

  return (
    <Link href={"/dashboard/notification-page"}>
      <div className="relative text-primary">
        <FaRegBell size={30} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {notificationCount}
          </span>
        )}
      </div>
    </Link>
  );
};

const DashboardLayout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  // call use effect to check authentication and use useRouter hook to redirect to login if not authenticated
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  const [isSearchContainerOpen, setIsSearchContainerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchContainerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileNavOpen) {
      setIsMobileNavVisible(true);
    } else if (isMobileNavVisible) {
      // Wait for animation to finish before hiding
      const timeout = setTimeout(() => setIsMobileNavVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isMobileNavOpen, isMobileNavVisible]);

  return (
    <GlobalDashboardProvider>
      <div className="flex min-h-screen bg-white">
        {/* Sidebar: hidden on mobile when mobile nav is open */}
        <div className="sticky top-0 left-0 h-screen hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 flex flex-col transition-[margin] duration-300 ease-in-out">
          <header className="py-4 px-6 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-100/50 flex items-center justify-between sticky top-0 z-20 lg:static transition-all duration-300">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden mr-4 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 active:scale-95"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <IoMenu size={24} className="text-gray-700" />
            </button>
            <div className="flex items-center justify-between w-full">
              <div
                ref={dropdownRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative group cursor-pointer"
              >
                <div className="flex gap-4 items-center p-2 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 group-hover:shadow-md">
                  <div className="relative">
                    <Avatar
                      name={user?.name}
                      src={user?.image_url}
                      size={48}
                      className="rounded-full ring-2 ring-white shadow-lg transition-all duration-300 group-hover:ring-4 group-hover:ring-blue-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-800 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-600 leading-tight">
                      Welcome back{" "}
                      <span className="capitalize font-medium text-blue-600">
                        {user?.role}
                      </span>
                    </p>
                  </div>
                  <div className="ml-2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {isDropdownOpen && (
                  <div className="absolute w-[240px] z-20 top-full left-0 mt-2">
                    <div className="bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-200/50 py-2 animate-in slide-in-from-top-2 duration-200">
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href={"/dashboard/settings/account-details"}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 rounded-xl mx-2 group"
                          >
                            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                              <PiUserCircleFill
                                size={18}
                                className="text-blue-600"
                              />
                            </div>
                            <span className="font-medium">Profile</span>
                          </Link>
                        </li>
                        {user.role === "admin" && (
                          <>
                            <li>
                              <Link
                                href={"/dashboard/settings/billing"}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-all duration-200 rounded-xl mx-2 group"
                              >
                                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                                  <MdOutlinePayment
                                    size={18}
                                    className="text-green-600"
                                  />
                                </div>
                                <span className="font-medium">Billing</span>
                              </Link>
                            </li>
                          </>
                        )}
                        <li className="border-t border-gray-200/50 mt-2 pt-2">
                          <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200 rounded-xl mx-2 w-full group"
                          >
                            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-200">
                              <MdLogout size={18} className="text-red-600" />
                            </div>
                            <span className="font-medium">Logout</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 flex justify-end items-center gap-4 relative">
                <div
                  className="bg-white/60 backdrop-blur-sm w-full max-w-[400px] rounded-2xl py-3 px-5 md:flex items-center border border-gray-200/50 hidden relative shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 group"
                  ref={searchContainerRef}
                >
                  <SearchBoxInput
                    isSearchContainerOpen={isSearchContainerOpen}
                    setIsSearchContainerOpen={setIsSearchContainerOpen}
                  />
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                    <FaSearch size={20} />
                  </div>

                  {/* Search Container */}
                  {isClient && isSearchContainerOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                      <SearchContainer />
                    </div>
                  )}
                </div>
                <NotificationBell />
              </div>
            </div>
          </header>
          {/* Mobile Nav Overlay */}
          <div
            className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${
              isMobileNavOpen || isMobileNavVisible
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Overlay */}
            <div
              className={`absolute inset-0  bg-black/30 transition-opacity duration-300 ${
                isMobileNavOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setIsMobileNavOpen(false)}
            />
            {/* Sidebar */}
            <div
              className={`relative bg-secondary text-background h-full w-4/5 max-w-xs shadow-xl transform transition-transform duration-300 ease-in-out ${
                isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-xl font-bold px-2 py-1">SCANDOQ</span>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <IoClose size={32} />
                </button>
              </div>
              <nav className="flex flex-col gap-4 p-6">
                <Link
                  href="/dashboard/overview"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="text-lg font-medium"
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/client-management/client-list"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="text-lg font-medium"
                >
                  Clients
                </Link>
                <Link
                  href="/dashboard/document-management/all-documents"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="text-lg font-medium"
                >
                  Documents
                </Link>
                <Link
                  href="/dashboard/members-mangement"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="text-lg font-medium"
                >
                  Members
                </Link>
                <Link
                  href="/dashboard/settings/account-details"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="text-lg font-medium"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileNavOpen(false);
                  }}
                  className="text-lg font-medium text-red-500 text-left"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
          {children}
        </main>
      </div>
    </GlobalDashboardProvider>
  );
};

export default DashboardLayout;

const SearchBoxInput = ({
  isSearchContainerOpen,
  setIsSearchContainerOpen,
}) => {
  const { setGlobalSearchQuery, globalSearchQuery } = useContext(GlobalContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value || "";
    setGlobalSearchQuery(value);

    // Show search container when user starts typing
    if (value.length > 0 && !isSearchContainerOpen) {
      setIsSearchContainerOpen(true);
    } else if (value.length === 0) {
      setIsSearchContainerOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (globalSearchQuery.length > 0) {
      setIsSearchContainerOpen(true);
    }
  };

  return (
    <input
      type="text"
      name="search"
      id="search"
      placeholder="Search documents, clients..."
      className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
      value={isClient ? globalSearchQuery : ""}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      autoComplete="off"
    />
  );
};

const SearchContainer = () => {
  const { filteredDocuments, filteredClients, globalSearchQuery } =
    useContext(GlobalContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering dynamic content on server
  if (!isClient) {
    return <div className="p-4 text-gray-500 text-center">Loading...</div>;
  }

  if (!globalSearchQuery) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Start typing to search documents and clients...
      </div>
    );
  }

  const hasResults = filteredDocuments.length > 0 || filteredClients.length > 0;

  if (!hasResults) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No results found for "{globalSearchQuery}"
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Documents Section */}
      {filteredDocuments.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <FaFileAlt className="mr-2" />
            Documents ({filteredDocuments.slice(0, 5).length})
          </h3>
          <div className="space-y-2">
            {filteredDocuments.slice(0, 5).map((doc) => (
              <Link
                key={doc.id}
                href={`/dashboard/document-management/view-document/${doc.id}`}
                className="block p-2 hover:bg-gray-50 rounded border-l-2 border-blue-500"
              >
                <div className="text-sm font-medium text-gray-900 truncate">
                  {doc.parsed_data?.parsed_data?.suggested_title ||
                    doc.name ||
                    (doc.file
                      ? extractFilenameFromUrl(doc.file)
                      : "Untitled Document")}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  Client: {doc.client?.business_name || doc.client || "Unknown"}
                </div>
              </Link>
            ))}
          </div>
          {filteredDocuments.length > 5 && (
            <Link
              href="/dashboard/document-management/all-documents"
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 block"
            >
              View all {filteredDocuments.length} documents →
            </Link>
          )}
        </div>
      )}

      {/* Clients Section */}
      {filteredClients.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <FaUserFriends className="mr-2" />
            Clients ({filteredClients.slice(0, 5).length})
          </h3>
          <div className="space-y-2">
            {filteredClients.slice(0, 5).map((client) => (
              <Link
                key={client.id}
                href="/dashboard/client-management/client-list"
                className="block p-2 hover:bg-gray-50 rounded border-l-2 border-green-500"
              >
                <div className="text-sm font-medium text-gray-900 truncate">
                  {client.business_name || "Unnamed Business"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {client.email} • {client.mobile_number || "No phone"}
                </div>
              </Link>
            ))}
          </div>
          {filteredClients.length > 5 && (
            <Link
              href="/dashboard/client-management/client-list"
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 block"
            >
              View all {filteredClients.length} clients →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
