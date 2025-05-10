"use client";

import Link from "next/link";
import React from "react";
import { FaFacebookSquare, FaInstagramSquare, FaYoutube } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="px-4 md:px-10 py-4 bg-secondary-gradient flex justify-center
       sticky top-0 z-20"
      >
        <div>
          <Link href={"/"} className="heading-4 text-foreground">
            SCANDOQ.
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-secondary-gradient flex justify-between items-center py-4">
        <div className="px-4 md:px-10 py-4 flex justify-between items-center w-full">
          <div className="flex gap-6 items-center">
            <IoIosMail size={40} />
            <FaInstagramSquare size={32} />
            <FaYoutube size={36} />
            <FaFacebookSquare size={32} />
          </div>
          <div className="flex justify-between text-secondary-foreground body-text gap-5">
            <Link href={"/"}>Privacy Policy</Link>
            <p>© 2024 — Copyright</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
