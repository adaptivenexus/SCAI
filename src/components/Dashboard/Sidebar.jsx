"use client";

import Link from "next/link";
import { FaFileAlt, FaRegUser, FaShareAlt, FaUsers } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { IoIosCall, IoMdSettings } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { IoDocuments } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  const sidebarVariants = {
    open: {
      width: "340px",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    closed: {
      width: "90px",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className="bg-secondary h-screen overflow-y-auto overflow-x-hidden w-[90px] lg:w-auto"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      onHoverStart={() => setIsOpen(true)}
      onHoverEnd={() => {
        setIsOpen(false);
        setIsUsersOpen(false);
        setIsDocumentsOpen(false);
      }}
    >
      <div className="sticky top-0 p-4 min-w-[90px] bg-secondary">
        <Link href={"/"} className="text-background text-center text-2xl block">
          SCANDOQ.
        </Link>
        <hr className="my-4" />
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                href={"/dashboard/overview"}
                className="p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200 w-full"
              >
                <RiDashboardFill size={40} className="min-w-[40px]" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      Overview
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            {user?.role === "admin" && (
              <li>
                <Link
                  href={"/dashboard/members-mangement"}
                  className="w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200"
                >
                  <FaUsers size={40} className="min-w-[40px]" />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        Members Mangement
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )}
            <li>
              <Link
                href={"/dashboard/shared-doc"}
                className="w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200"
              >
                <FaShareAlt size={40} className="min-w-[40px]" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      Shared Documents
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            <li className="rounded-xl flex flex-col gap-2">
              <Link
                href={"/dashboard/client-management/client-list"}
                className="w-full p-2 rounded-xl text-background flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200"
              >
                <FaRegUser size={40} className="min-w-[40px]" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      transition={{ duration: 0.2 }}
                    >
                      Client Management
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
            <li className="rounded-xl flex flex-col gap-2">
              <Link
                href="/dashboard/document-management/all-documents"
                className="w-full p-2 rounded-xl text-background flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200"
              >
                <FaFileAlt size={40} className="min-w-[40px]" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      Document Management
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            <li>
              <Link
                href={"/dashboard/contact"}
                className="w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200"
              >
                <IoIosCall size={40} className="min-w-[40px]" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      Contact us
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
            <li>
              <Link
                href={"/dashboard/settings/account-details"}
                className="w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200"
              >
                <IoMdSettings size={40} className="min-w-[40px]" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
