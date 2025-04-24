"use client";
import Link from "next/link";
import {
  FaBook,
  FaHome,
  FaInfoCircle,
  FaQuestion,
  FaTags,
} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const MobileNav = ({ isNavOpen, setIsNavOpen }) => {
  return (
    <nav
      className={`mobile-navbar ${
        isNavOpen ? "mobNavIsOpen" : null
      } shadow-lg md:hidden sm:tabNavSize flex flex-col py-10 px-10 gap-5 relative justify-center z-20`}
    >
      <ul className="space-y-3 border-b border-borderColor w-full py-5 transition-all duration-500">
        <li
          onClick={() => setIsNavOpen(false)}
          className="flex gap-2 items-center"
        >
          <FaHome />
          <Link href="/" className="text-xl">
            Home
          </Link>
        </li>

        <li
          onClick={() => setIsNavOpen(false)}
          className="flex gap-2 items-center"
        >
          <FaInfoCircle />
          <Link href="/" className="text-xl">
            About us
          </Link>
        </li>

        <li
          onClick={() => setIsNavOpen(false)}
          className="flex gap-2 items-center"
        >
          <FaBook />
          <Link href="/" className="text-xl">
            Case Studies
          </Link>
        </li>

        <li
          onClick={() => setIsNavOpen(false)}
          className="flex gap-2 items-center"
        >
          <FaQuestion />
          <Link href="/" className="text-xl">
            FAQ
          </Link>
        </li>

        <li
          onClick={() => setIsNavOpen(false)}
          className="flex gap-2 items-center"
        >
          <FaTags />
          <Link href="/" className="text-xl">
            Pricing
          </Link>
        </li>
      </ul>
      

      <h2 className="heading-4 text-foreground text-center">LOGO.</h2>

      <button onClick={() => setIsNavOpen(false)} className="closeBtn block">
        <IoCloseOutline size={32} />
      </button>
    </nav>
  );
};
export default MobileNav;
