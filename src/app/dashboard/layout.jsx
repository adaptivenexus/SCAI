"use client";
import { FaRegBell, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Sidebar from "@/components/Dashboard/Sidebar";
import GlobalDashboardProvider from "@/context/GlobalProvider";
import Link from "next/link";

import { PiUserCircleFill } from "react-icons/pi";
import { MdDataUsage, MdLogout, MdOutlinePayment } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { IoMenu, IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
          <header className="py-4 px-6 bg-white shadow-md flex items-center justify-between sticky top-0  lg:static">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden mr-4"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <IoMenu size={32} />
            </button>
            <div className="flex items-center justify-between w-full">
              <div
                ref={dropdownRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative group cursor-pointer"
              >
                <div className="flex gap-3 items-center ">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                    }
                    alt={"Profile"}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="space-y-2">
                    <p className="text-xl text-start font-medium">
                      {user?.name}
                    </p>
                    <p className="text-sm text-start text-primary">
                      Welcome Back{" "}
                      <span className="capitalize">{user?.role}</span>
                    </p>
                  </div>
                </div>
                {isDropdownOpen && (
                  <div className="absolute w-[200px] z-20">
                    <div className="bg-white shadow-md rounded-lg px-1 py-2 mt-4">
                      <ul>
                        <li className="subtitle-text border-b border-[#E1E1E1] py-2 px-1 hover:bg-slate-100">
                          <Link
                            href={"/dashboard/settings/account-details"}
                            className="flex items-center gap-2"
                          >
                            <div>
                              <PiUserCircleFill size={24} />
                            </div>
                            Profile
                          </Link>
                        </li>
                        {user.role === "admin" && (
                          <>
                            <li className="subtitle-text border-b border-[#E1E1E1] py-2 px-1 hover:bg-slate-100">
                              <Link
                                href={"/dashboard/settings/billing"}
                                className="flex items-center gap-2"
                              >
                                <div>
                                  <MdOutlinePayment size={24} />
                                </div>
                                Billing
                              </Link>
                            </li>
                            <li className="subtitle-text border-b border-[#E1E1E1] py-2 px-1 hover:bg-slate-100">
                              <Link
                                href={"/dashboard/user/my-usage"}
                                className="flex items-center gap-2"
                              >
                                <div>
                                  <MdDataUsage size={24} />
                                </div>
                                My Usage
                              </Link>
                            </li>
                            <li className="subtitle-text border-b border-[#E1E1E1] py-2 px-1 hover:bg-slate-100">
                              <Link
                                href={"/dashboard/user/team-usage"}
                                className="flex items-center gap-2"
                              >
                                <div>
                                  <MdDataUsage size={24} />
                                </div>
                                Team Usage
                              </Link>
                            </li>
                          </>
                        )}
                        <li className="subtitle-text text-red-500 py-2 px-1 hover:bg-slate-100">
                          <button
                            onClick={() => logout()}
                            className="flex items-center gap-2"
                          >
                            <div>
                              <MdLogout size={24} />
                            </div>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 flex justify-end items-center">
                <div className="bg-white w-full max-w-[400px] rounded-full py-4 px-6 md:flex items-center border hidden">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search Documents and Clients"
                    className="w-full outline-none"
                  />
                  <div className="">
                    <FaSearch size={30} />
                  </div>
                </div>
                <Link href={"/dashboard/notification-page"}>
                  <div className="text-primary">
                    <FaRegBell size={30} />
                  </div>
                </Link>
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
                <span className="text-xl font-bold">SCANDOQ.</span>
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
