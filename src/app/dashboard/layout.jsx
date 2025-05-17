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

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <GlobalDashboardProvider>
      <div className="flex min-h-screen bg-white">
        <div className="sticky top-0 left-0 h-screen">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 flex flex-col transition-[margin] duration-300 ease-in-out">
          <header className="py-4 px-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
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
                      {user?.agency_name}
                    </p>
                    <p className="text-sm text-start text-primary">
                      Welcome Back
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
              <div className="flex gap-6 items-center flex-1 justify-end">
                <div className="bg-white w-full max-w-[400px] rounded-full py-4 px-6 flex items-center border">
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
          {children}
        </main>
      </div>
    </GlobalDashboardProvider>
  );
};

export default DashboardLayout;
