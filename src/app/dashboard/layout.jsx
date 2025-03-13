"use client";
import { FaRegBell, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Sidebar from "@/components/Dashboard/Sidebar";
import GlobalDashboardProvider from "@/providers/GlobalProvider";
import Link from "next/link";
import { IoMdSettings } from "react-icons/io";
import { PiUserCircleFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { useState, useEffect, useRef } from "react";

const DashboardLayout = ({ children }) => {
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
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <header className="py-4 px-6 bg-white shadow-md flex justify-between">
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
                  <p className="text-xl text-start font-medium">John Doe</p>
                  <p className="text-sm text-start text-primary">
                    Welcome Back Admin
                  </p>
                </div>
              </div>
              {isDropdownOpen && (
                <div className="absolute w-[200px] z-20">
                  <div className="bg-white shadow-md rounded-lg px-1 py-2 mt-4">
                    <ul>
                      <li className="subtitle-text border-b border-[#E1E1E1] py-2 px-1 hover:bg-slate-100">
                        <Link
                          href={"/dashboard/settings"}
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
                          href={"/dashboard/settings"}
                          className="flex items-center gap-2"
                        >
                          <div>
                            <IoMdSettings size={24} />
                          </div>
                          Settings
                        </Link>
                      </li>
                      <li className="subtitle-text text-red-500 py-2 px-1 hover:bg-slate-100">
                        <Link
                          href={"/auth/login"}
                          className="flex items-center gap-2"
                        >
                          <div>
                            <MdLogout size={24} />
                          </div>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
              <div className="bg-white max-w-[400px] rounded-full w-full py-4 px-6 flex items-center border">
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
              <div className="text-primary">
                <FaRegBell size={30} />
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
