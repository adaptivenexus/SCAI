"use client";

import Link from "next/link";
import { FaFileAlt, FaRegUser, FaUsers } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { IoIosCall, IoMdSettings } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { TbFileUpload } from "react-icons/tb";
import { IoDocuments } from "react-icons/io5";
import { LuUserRoundPlus } from "react-icons/lu";
import { GlobalContext } from "@/context/GlobalProvider";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  const { setIsAddClientOpen, setIsAddDocumentOpen } =
    useContext(GlobalContext);

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
      className="bg-secondary h-screen sticky top-0 overflow-hidden"
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
      <div className="p-4 min-w-[90px]">
        <Link href={"/"} className="text-background text-center text-2xl block">
          SCAI
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
            <li className="rounded-xl flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!isUsersOpen && isDocumentsOpen) {
                    setIsDocumentsOpen(!isDocumentsOpen);
                    setIsUsersOpen(!isUsersOpen);
                  } else {
                    setIsUsersOpen(!isUsersOpen);
                  }
                }}
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
              </button>
              {isUsersOpen && (
                <div className="text-background ml-12">
                  <ul>
                    <li className="flex items-center justify-center ">
                      <Link
                        href={"/dashboard/client-management/client-list"}
                        className="p-2 flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200 w-full"
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
                              Client List
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </li>
                    <li className="flex items-center justify-center ">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddClientOpen(true);
                        }}
                        className="p-2 flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200 w-full"
                      >
                        <LuUserRoundPlus size={40} className="min-w-[40px]" />
                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                              Add New Client
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li className="rounded-xl flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isUsersOpen && !isDocumentsOpen) {
                    setIsDocumentsOpen(!isDocumentsOpen);
                    setIsUsersOpen(!isUsersOpen);
                  } else {
                    setIsDocumentsOpen(!isDocumentsOpen);
                  }
                }}
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
              </button>
              {isDocumentsOpen && (
                <div className="text-background ml-12">
                  <ul>
                    <li className="flex items-center justify-center ">
                      <Link
                        href="/dashboard/document-management/add-documents"
                        className="p-2 flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200 w-full"
                      >
                        <TbFileUpload size={40} className="min-w-[40px]" />
                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                              Upload Document
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </li>
                    {/* <li className="flex items-center justify-center ">
                      <Link
                        href="/dashboard/document-management/manual-document-upload"
                        className="p-2 flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200 w-full"
                      >
                        <TbFileUpload size={40} className="min-w-[40px]" />
                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                              Add Document
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </li> */}
                    <li className="flex items-center justify-center ">
                      <Link
                        href={"/dashboard/document-management/all-documents"}
                        className="p-2 flex items-center gap-4 font-semibold text-xl hover:bg-accent-secondary/90 transition-colors duration-200 w-full"
                      >
                        <IoDocuments size={40} className="min-w-[40px]" />
                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                              All Documents
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
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
