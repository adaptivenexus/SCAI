"use client";

import { FaCheckCircle } from "react-icons/fa";
import Heading from "../AccentComponents/Heading";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";

const Pricing = () => {
  const { subscriptions } = useAuth();

  // Map subscriptions with features (same as previous PricingPage.jsx)
  const mapSubscriptions = [
    {
      ...subscriptions[0],
      features: [
        "Smart Scan 25 pages",
        "FAQ support",
        "No customization",
        "1 GB storage",
      ],
    },
    {
      ...subscriptions[1],
      features: [
        "Smart Scan 100 pages",
        "Email Support",
        "Limited customization",
        "5 GB storage",
        "Smart Dashboard",
      ],
    },
    {
      ...subscriptions[2],
      features: [
        "Smart Scan 1000 pages",
        "Priority support",
        "Moderate customization",
        "Document Sharing",
        "10 GB storage",
        "Smart Dashboard",
      ],
    },
    {
      ...subscriptions[3],
      features: [
        "Smart Scan Customized pages",
        "24/7 dedicated support",
        "Extensive customization",
        "Document Sharing",
        "50 GB storage",
        "Smart Dashboard",
      ],
    },
  ];

  return (
    <section>
      <div className="xl:max-w-[1280px] px-4 mx-auto space-y-10">
        <div className="flex flex-col items-center gap-5">
          <Heading>Pricing</Heading>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="heading-4 sm:heading-3 md:heading-2 text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="subtitle-text text-secondary-foreground">
              Choose the plan that's right for your business
            </p>
          </div>
        </div>
        <div className="grid-cols-1 md:grid-cols-10 gap-5 grid">
          <div className="py-8 bg-secondary-gradient rounded-xl flex flex-col items-center justify-center space-y-2 md:col-span-3">
            <h4 className="heading-4">Contact us!</h4>
            <Link href={"/contact"} className="flex items-center gap-2">
              Get started <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-2 flex-1 md:col-span-7">
            {mapSubscriptions.map((sub, index) => (
              <div
                key={index}
                className="border border-accent-secondary rounded-xl flex flex-col items-center gap-5 p-4"
              >
                <p className="heading-5">{sub.name}</p>
                <p className="heading-5">
                  {sub.name === "Enterprise" ? "Custom Pricing" : `$${sub.price}/`}
                  <span className="text-secondary-foreground body-text">
                    {sub.name !== "Enterprise" && "Month"}
                  </span>
                </p>
                <Link
                  href={`/auth/signup?plan=${sub.id}`}
                  className="bg-accent-primary text-primary px-4 py-2 rounded-lg"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid grid-cols-10 gap-5 p-4 rounded-3xl bg-primary-gradient">
          <div className="col-span-3 px-4">
            <table className="w-full text-white h-full table-fixed">
              <thead>
                <tr>
                  <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center">
                    Features
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Storage
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Users per Client
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Support
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Smart Dashboards
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Document Classification
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Customization
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Smart AI Document Tagging
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Document Sharing
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Webhooks Access
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Integration
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Automation Expert Support
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Custom Data Validation
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Smart Search
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    SMART SCAN
                  </td>
                </tr>
                <tr className="">
                  <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                    Exceeds Page Limit Cost
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-span-7 bg-white rounded-3xl">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  {mapSubscriptions.map((sub, index) => (
                    <th
                      key={index}
                      className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full"
                    >
                      {sub.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    1GB
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    5GB
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    10GB
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    50GB
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    1 user
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Up to 5
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Up to 10
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Customized
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    FAQ
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Email Support
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Priority Support
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    24/7 Support
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Preview
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Basic
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Limited
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Moderate
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Extensive
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    2 Hours
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    5 Hours
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-3xl">
                      <IoIosCloseCircle className="mx-auto text-gray-500" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    <div className="text-2xl">
                      <FaCheckCircle className="mx-auto text-primary" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    25 Pages
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    200 Pages
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    500 Pages
                  </td>
                  <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                    Customized
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-center subtitle-text w-full">
                    ......
                  </td>
                  <td className="py-3 text-center subtitle-text w-full">
                    25¢ / Page
                  </td>
                  <td className="py-3 text-center subtitle-text w-full">
                    20¢ / Page
                  </td>
                  <td className="py-3 text-center subtitle-text w-full">
                    Custom Pricing
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;