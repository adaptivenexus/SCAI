import Link from "next/link";

// Icons Import
import { IoIosMail } from "react-icons/io";
import { HiArrowRight } from "react-icons/hi2";
import { FaFacebookSquare, FaInstagramSquare, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-secondary-gradient">
      <div className="px-4 md:px-10  xl:px-44 mx-auto flex gap-20 lg:gap-60 py-20 flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-between gap-10">
          <div className="space-y-3">
            <p className="subtitle-text text-primary">Stay Connected</p>
            <h2 className="heading-4 sm:heading-3 md:heading-2">
              Subscribe for our
              <br />
              newslatters
            </h2>
            <div className="py-4 px-5 rounded-xl border border-foreground w-full flex items-center">
              <input
                className="w-full bg-transparent outline-none"
                id="newsletter"
                name="newsletter"
                placeholder="Enter your email"
                type="email"
              />
              <button type="button">
                <HiArrowRight />
              </button>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <IoIosMail size={40} />
            <FaInstagramSquare size={32} />
            <FaYoutube size={36} />
            <FaFacebookSquare size={32} />
          </div>
        </div>
        <div className="flex-1 space-y-20">
          <div className="flex justify-between">
            <div className="space-y-5">
              <h5 className="heading-5 text-foreground">Links</h5>
              <ul className="space-y-2 body-text text-secondary-foreground">
                <li>
                  <Link href={"/"}>Home</Link>
                </li>
                <li>
                  <Link href={"/"}>Pricing</Link>
                </li>
                <li>
                  <Link href={"/"}>Case Studies</Link>
                </li>
                <li>
                  <Link href={"/"}>About Us</Link>
                </li>
                <li>
                  <Link href={"/"}>Testimonials</Link>
                </li>
                <li>
                  <Link href={"/"}>FAQ</Link>
                </li>
                <li>
                  <Link href={"/"}>Contact us</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-5">
              <h5 className="heading-5 text-foreground">Support</h5>
              <ul className="body-text text-secondary-foreground space-y-2">
                <li>+1 (904) 800-9254</li>
                <li>business@adaptivenexus.com</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between text-secondary-foreground body-text">
            <Link href={"/"}>Privacy Policy</Link>
            <p>© 2025 — Copyright</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
