"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineShare,
  HiOutlineUser,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const pathname = usePathname();

  const sidebarVariants = {
    open: {
      width: "200px",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    closed: {
      width: "80px",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <motion.div
      suppressHydrationWarning
      className="bg-gradient-to-b from-[var(--secondary)] to-[var(--primary)] h-screen overflow-y-auto overflow-x-hidden w-[80px] lg:w-auto shadow-2xl border-r border-[var(--accent-primary)]/20 "
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
      <div className="flex flex-col h-full">
        <div className="pt-8 px-4 pb-4 flex justify-center">
          <Link
            href={"/"}
            className="text-[var(--background)] text-center block font-bold tracking-wide relative group"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col items-center"
                >
                  <div className="w-max px-5 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ">
                    <span className="text-[var(--primary)] font-black text-xl block">
                      SCANDOQ
                    </span>
                  </div>
                  {/* <span className="heading-5 text-[var(--background)] tracking-[3px] font-black">
                    SCANDOQ
                  </span> */}
                </motion.div>
              ) : (
                <motion.div
                  key="short"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="flex justify-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 aspect-square">
                    <span className="text-[var(--primary)] font-black text-xl">
                      SD
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>
        <div className="mx-4 my-6 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent" />
        <nav
          suppressHydrationWarning
          className="flex-1 px-4 h-full flex flex-col"
        >
          <ul className="space-y-2">
            <li>
              <Link
                href={"/dashboard/overview"}
                className={`group relative rounded-2xl text-[var(--background)] flex items-center font-medium transition-all duration-300 w-full
                  hover:bg-[var(--accent-secondary)]/20 hover:text-[var(--accent-primary)] hover:shadow-lg hover:scale-105
                  ${
                    pathname === "/dashboard/overview" && isOpen
                      ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)] shadow-lg border-l-4 border-[var(--accent-primary)]"
                      : ""
                  } ${isOpen ? "p-3 gap-4" : "p-3 justify-center"}`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    pathname === "/dashboard/overview"
                      ? "bg-[var(--accent-primary)] text-[var(--primary)] shadow-lg"
                      : "bg-[var(--accent-secondary)]/20 text-[var(--background)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--primary)]"
                  } ${!isOpen ? "flex-shrink-0" : ""}`}
                >
                  <MdDashboard size={24} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center flex-1 overflow-hidden"
                    >
                      <span className="label-text font-semibold whitespace-nowrap">
                        Overview
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            {user?.role === "admin" && (
              <li>
                <Link
                  href={"/dashboard/members-mangement"}
                  className={`group relative rounded-2xl text-[var(--background)] flex items-center font-medium transition-all duration-300 w-full
                    hover:bg-[var(--accent-secondary)]/20 hover:text-[var(--accent-primary)] hover:shadow-lg hover:scale-105
                    ${
                      pathname.startsWith("/dashboard/members-mangement") &&
                      isOpen
                        ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)] shadow-lg border-l-4 border-[var(--accent-primary)]"
                        : ""
                    } ${isOpen ? "p-3 gap-4" : "p-3 justify-center"}`}
                >
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      pathname.startsWith("/dashboard/members-mangement")
                        ? "bg-[var(--accent-primary)] text-[var(--primary)] shadow-lg"
                        : "bg-[var(--accent-secondary)]/20 text-[var(--background)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--primary)]"
                    } ${!isOpen ? "flex-shrink-0" : ""}`}
                  >
                    <HiOutlineUsers size={24} />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="flex items-center flex-1 overflow-hidden"
                      >
                        <span className="label-text font-semibold whitespace-nowrap">
                          Members
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )}
            <li>
              <Link
                href={"/dashboard/shared-doc"}
                className={`group relative rounded-2xl text-[var(--background)] flex items-center font-medium transition-all duration-300 w-full
                  hover:bg-[var(--accent-secondary)]/20 hover:text-[var(--accent-primary)] hover:shadow-lg hover:scale-105
                  ${
                    pathname.startsWith("/dashboard/shared-doc") && isOpen
                      ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)] shadow-lg border-l-4 border-[var(--accent-primary)]"
                      : ""
                  } ${isOpen ? "p-3 gap-4" : "p-3 justify-center"}`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    pathname.startsWith("/dashboard/shared-doc")
                      ? "bg-[var(--accent-primary)] text-[var(--primary)] shadow-lg"
                      : "bg-[var(--accent-secondary)]/20 text-[var(--background)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--primary)]"
                  } ${!isOpen ? "flex-shrink-0" : ""}`}
                >
                  <HiOutlineShare size={24} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center flex-1 overflow-hidden"
                    >
                      <span className="label-text font-semibold whitespace-nowrap">
                        Sharing
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            <li>
              <Link
                href={"/dashboard/client-management/client-list"}
                className={`group relative rounded-2xl text-[var(--background)] flex items-center font-medium transition-all duration-300 w-full
                  hover:bg-[var(--accent-secondary)]/20 hover:text-[var(--accent-primary)] hover:shadow-lg hover:scale-105
                  ${
                    pathname.startsWith("/dashboard/client-management") &&
                    isOpen
                      ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)] shadow-lg border-l-4 border-[var(--accent-primary)]"
                      : ""
                  } ${isOpen ? "p-3 gap-4" : "p-3 justify-center"}`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    pathname.startsWith("/dashboard/client-management")
                      ? "bg-[var(--accent-primary)] text-[var(--primary)] shadow-lg"
                      : "bg-[var(--accent-secondary)]/20 text-[var(--background)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--primary)]"
                  } ${!isOpen ? "flex-shrink-0" : ""}`}
                >
                  <HiOutlineUser size={24} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center flex-1 overflow-hidden"
                    >
                      <span className="label-text font-semibold whitespace-nowrap">
                        Clients
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/document-management/all-documents"
                className={`group relative rounded-2xl text-[var(--background)] flex items-center font-medium transition-all duration-300 w-full
                  hover:bg-[var(--accent-secondary)]/20 hover:text-[var(--accent-primary)] hover:shadow-lg hover:scale-105
                  ${
                    pathname.startsWith("/dashboard/document-management") &&
                    isOpen
                      ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)] shadow-lg border-l-4 border-[var(--accent-primary)]"
                      : ""
                  } ${isOpen ? "p-3 gap-4" : "p-3 justify-center"}`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    pathname.startsWith("/dashboard/document-management")
                      ? "bg-[var(--accent-primary)] text-[var(--primary)] shadow-lg"
                      : "bg-[var(--accent-secondary)]/20 text-[var(--background)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--primary)]"
                  } ${!isOpen ? "flex-shrink-0" : ""}`}
                >
                  <HiOutlineDocumentText size={24} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center flex-1 overflow-hidden"
                    >
                      <span className="label-text font-semibold whitespace-nowrap">
                        Documents
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col mt-auto space-y-2 mb-7">
            <li>
              <Link
                href={"/dashboard/contact"}
                className={`group relative rounded-2xl text-[var(--background)] flex items-center font-medium transition-all duration-300 w-full
                  hover:bg-[var(--accent-secondary)]/20 hover:text-[var(--accent-primary)] hover:shadow-lg hover:scale-105
                  ${
                    pathname.startsWith("/dashboard/contact") && isOpen
                      ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)] shadow-lg border-l-4 border-[var(--accent-primary)]"
                      : ""
                  } ${isOpen ? "p-3 gap-4" : "p-3 justify-center"}`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    pathname.startsWith("/dashboard/contact")
                      ? "bg-[var(--accent-primary)] text-[var(--primary)] shadow-lg"
                      : "bg-[var(--accent-secondary)]/20 text-[var(--background)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--primary)]"
                  } ${!isOpen ? "flex-shrink-0" : ""}`}
                >
                  <HiOutlineQuestionMarkCircle size={24} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center flex-1 overflow-hidden"
                    >
                      <span className="label-text font-semibold whitespace-nowrap">
                        Support
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </li>

            <li>
              <Link
                href={"/dashboard/settings/account-details"}
                className={`group relative rounded-2xl text-[var(--background)] flex items-center font-medium transition-all duration-300 w-full
                  hover:bg-[var(--accent-secondary)]/20 hover:text-[var(--accent-primary)] hover:shadow-lg hover:scale-105
                  ${
                    pathname.startsWith(
                      "/dashboard/settings/account-details"
                    ) && isOpen
                      ? "bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent text-[var(--accent-primary)] shadow-lg border-l-4 border-[var(--accent-primary)]"
                      : ""
                  } ${isOpen ? "p-3 gap-4" : "p-3 justify-center"}`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    pathname.startsWith("/dashboard/settings/account-details")
                      ? "bg-[var(--accent-primary)] text-[var(--primary)] shadow-lg"
                      : "bg-[var(--accent-secondary)]/20 text-[var(--background)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--primary)]"
                  } ${!isOpen ? "flex-shrink-0" : ""}`}
                >
                  <HiOutlineCog6Tooth size={24} />
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center flex-1 overflow-hidden"
                    >
                      <span className="label-text font-semibold whitespace-nowrap">
                        Settings
                      </span>
                    </motion.div>
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
