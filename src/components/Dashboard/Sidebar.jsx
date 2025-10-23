"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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
      <div className="sticky top-0 pt-6 px-4 pb-2 min-w-[90px] bg-secondary">
        <Link href={"/"} className="text-background text-center text-2xl block font-bold tracking-wide relative">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{letterSpacing: '2px'}}
              >
                SCANDOQ
              </motion.span>
            ) : (
              <motion.span
                key="short"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-auto block"
              >
                SD
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <hr className="my-4" />
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                href={"/dashboard/overview"}
                className={`p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl transition-colors duration-200 w-full
                  hover:bg-accent-secondary/90 hover:text-primary
                  ${pathname === "/dashboard/overview" ? "bg-accent-secondary text-primary" : ""}`}
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
                  className={`w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl transition-colors duration-200
                    hover:bg-accent-secondary/90 hover:text-primary
                    ${pathname.startsWith("/dashboard/members-mangement") ? "bg-accent-secondary text-primary" : ""}`}
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
                        Members
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )}
            <li>
              <Link
                href={"/dashboard/shared-doc"}
                className={`w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl transition-colors duration-200
                  hover:bg-accent-secondary/90 hover:text-primary
                  ${pathname.startsWith("/dashboard/shared-doc") ? "bg-accent-secondary text-primary" : ""}`}
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
                      Sharing
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            <li className="rounded-xl flex flex-col gap-2">
              <Link
                href={"/dashboard/client-management/client-list"}
                className={`w-full p-2 rounded-xl text-background flex items-center gap-4 font-semibold text-xl transition-colors duration-200
                  hover:bg-accent-secondary/90 hover:text-primary
                  ${pathname.startsWith("/dashboard/client-management") ? "bg-accent-secondary text-primary" : ""}`}
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
                      Clients
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
            <li className="rounded-xl flex flex-col gap-2">
              <Link
                href="/dashboard/document-management/all-documents"
                className={`w-full p-2 rounded-xl text-background flex items-center gap-4 font-semibold text-xl transition-colors duration-200
                  hover:bg-accent-secondary/90 hover:text-primary
                  ${pathname.startsWith("/dashboard/document-management") ? "bg-accent-secondary text-primary" : ""}`}
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
                      Documents
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            <li>
              <Link
                href={"/dashboard/contact"}
                className={`w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl transition-colors duration-200
                  hover:bg-accent-secondary/90 hover:text-primary
                  ${pathname.startsWith("/dashboard/contact") ? "bg-accent-secondary text-primary" : ""}`}
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
                      Support
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
            <li>
              <Link
                href={"/dashboard/settings/account-details"}
                className={`w-full p-2 rounded-lg text-background flex items-center gap-4 font-semibold text-xl transition-colors duration-200
                  hover:bg-accent-secondary/90 hover:text-primary
                  ${pathname.startsWith("/dashboard/settings") ? "bg-accent-secondary text-primary" : ""}`}
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
