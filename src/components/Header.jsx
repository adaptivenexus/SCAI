"use client";

import Link from "next/link";
import PrimaryOutlineButton from "./CTAs/PrimaryOutlineButton";

// icons import
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="px-4 md:px-10 py-4 bg-secondary-gradient flex justify-between sticky top-0 z-20">
      <div className="flex items-center gap-8">
        <div>
          <h4 className="heading-4 text-foreground">SCAI.</h4>
        </div>
        <div className="w-[1px] h-full bg-secondary-foreground hidden md:block"></div>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-5 lg:subtitle-text">
            <li>
              <Link
                href={"/"}
                className={`relative w-max ${
                  pathname === "/"
                    ? "underlineOpen text-primary"
                    : "underlineHover text-foreground"
                }`}
              >
                <span>Home</span>
                <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-[2px] bg-primary"></span>
                <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-[2px] bg-primary"></span>
              </Link>
            </li>
            <li>
              <Link
                href={"/support"}
                className={`relative w-max ${
                  pathname === "/support"
                    ? "underlineOpen text-primary"
                    : "underlineHover text-foreground"
                }`}
              >
                <span>Support</span>
                <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-[2px] bg-primary"></span>
                <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-[2px] bg-primary"></span>
              </Link>
            </li>
            <li className="text-primary">
              <Link
                href={"/case-studies"}
                className={`relative w-max ${
                  pathname === "/case-studies"
                    ? "underlineOpen text-primary"
                    : "underlineHover text-foreground"
                }`}
              >
                <span>Case Studies</span>
                <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-[2px] bg-primary"></span>
                <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-[2px] bg-primary"></span>
              </Link>
            </li>
            <li>
              <Link
                href={"/faq"}
                className={`relative w-max ${
                  pathname === "/faq"
                    ? "underlineOpen text-primary"
                    : "underlineHover text-foreground"
                }`}
              >
                <span>FAQ</span>
                <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-[2px] bg-primary"></span>
                <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-[2px] bg-primary"></span>
              </Link>
            </li>
            <li className="text-primary">
              <Link
                href={"/pricing"}
                className={`relative w-max ${
                  pathname === "/pricing"
                    ? "underlineOpen text-primary"
                    : "underlineHover text-foreground"
                }`}
              >
                <span>Pricing</span>
                <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-[2px] bg-primary"></span>
                <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-[2px] bg-primary"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-5 ">
        <PrimaryOutlineButton className={"hidden md:block"}>
          Get Started
        </PrimaryOutlineButton>
        <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden">
          <IoMenu size={32} />
        </button>
      </div>
      {isNavOpen && (
        <div
          onClick={() => setIsNavOpen(false)}
          className="inset-0 fixed z-0 block lg:hidden"
        ></div>
      )}
      <MobileNav isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
    </header>
  );
};
export default Header;
