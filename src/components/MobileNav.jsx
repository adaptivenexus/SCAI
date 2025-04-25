"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaHome,
  FaInfoCircle,
  FaQuestion,
  FaTags,
} from "react-icons/fa";
import { IoCloseOutline, IoMenu } from "react-icons/io5";

const MobileNav = ({ isNavOpen, setIsNavOpen }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav
      className={`mobile-navbar ${
        isNavOpen ? "mobNavIsOpen" : null
      } shadow-lg md:hidden sm:tabNavSize flex flex-col py-10 px-10 gap-5 relative justify-center z-20`}
    >
      <ul className="space-y-3 border-b border-borderColor w-full py-5 transition-all duration-500">
        <li onClick={() => setIsNavOpen(false)}>
          <Link href="/" className="text-xl flex gap-2 items-center">
            <FaHome />
            Home
          </Link>
        </li>

        <li onClick={() => setIsNavOpen(false)}>
          <Link href="/" className="text-xl flex gap-2 items-center">
            <FaInfoCircle />
            About us
          </Link>
        </li>

        <li onClick={() => setIsNavOpen(false)}>
          <Link href="/" className="text-xl flex gap-2 items-center">
            <FaBook />
            Case Studies
          </Link>
        </li>

        <li onClick={() => setIsNavOpen(false)}>
          <Link href="/faq" className="text-xl flex gap-2 items-center">
            <FaQuestion />
            FAQ
          </Link>
        </li>

        <li onClick={() => setIsNavOpen(false)}>
          <Link href="/pricing" className="text-xl flex gap-2 items-center">
            <FaTags />
            Pricing
          </Link>
        </li>
      </ul>
      {isMounted && isAuthenticated ? (
        <div className="flex items-center space-x-5">
          <Link href="/dashboard/overview" className={"primary-btn"}>
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-5">
          <Link href="/auth/signup" className={"primary-outlined-btn"}>
            Get Started
          </Link>
          <Link href="/auth/login" className={"primary-btn"}>
            Login
          </Link>
        </div>
      )}

      <h2 className="heading-4 text-foreground text-center">SCANDOQ.</h2>

      <button onClick={() => setIsNavOpen(false)} className="closeBtn block">
        <IoCloseOutline size={32} />
      </button>
    </nav>
  );
};
export default MobileNav;
