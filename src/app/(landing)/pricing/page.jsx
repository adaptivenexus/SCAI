"use client";
import { IoMdArrowRoundBack, IoIosCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PricingPage = () => {
  const router = useRouter();

  const { subscriptions } = useAuth();

  const mapSubscriptions = [
    {
      ...subscriptions[0],
      features: [
        "Smart Scan 100 pages",
        "FAQ support",
        "No customization",
        "1 GB storage",
      ],
    },
    {
      ...subscriptions[1],
      features: [
        "Smart Scan 200 pages",
        "Email Support",
        "Limited customization",
        "2 GB storage",
        "Smart Dashboard",
      ],
    },
    {
      ...subscriptions[2],
      features: [
        "Smart Scan 500 pages",
        "Priority support",
        "Modrate customization",
        "Document Sharing",
        "5 GB storage",
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
        "10 GB storage",
        "Smart Dashboard",
      ],
    },
  ];

  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-primary text-white p-2 rounded-full"
          >
            <IoMdArrowRoundBack size={24} />
          </button>
          <h4 className="heading-4">Pricing</h4>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mapSubscriptions.map((sub, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-md p-6 flex flex-col justify-between border`}
          >
            <div>
              <h3 className="font-bold text-lg text-forground">{sub.name}</h3>
              <p className="label-text text-secondary-foreground mb-2">
                {sub.description}
              </p>
              <div className="font-bold text-2xl mb-3">
                ${sub.price}
                <span className="text-base font-normal text-secondary-foreground">
                  /Month
                </span>
              </div>
              <ul className="text-sm text-forground mb-6 space-y-4">
                {sub.features.map((feature, index) => (
                  <li key={index} className="text-primary">
                    ✔ {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={`/auth/signup?plan=${sub.id}`} // Plan ID URL mein pass karo
              className="bg-primary text-white rounded-md py-2 mt-auto text-center disabled:opacity-50"
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* Table (No changes needed here) */}
      <section>
        <div>
          <div className="hidden md:grid grid-cols-10 gap-5 p-4 rounded-3xl">
            <div className="col-span-3 px-4">
              <table className="w-full text-Black h-full table-fixed">
                <thead>
                  <tr>
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-start">
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
                      Clients per user
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
                      Document Sharing
                    </td>
                  </tr>
                  <tr className="">
                    <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                      Smart Search
                    </td>
                  </tr>
                  <tr className="">
                    <td className="py-3 border-b border-[#E1E1E1] subtitle-text">
                      Smart AI Document Tagging
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
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Basic
                    </th>
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Standard
                    </th>
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Enterprise
                    </th>
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Executive
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      1GB
                    </td>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      2GB
                    </td>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      5GB
                    </td>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      10GB
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      Up to 5
                    </td>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      Up to 10
                    </td>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      Up to 20
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
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      <div className="text-2xl">
                        <FaCheckCircle className="mx-auto text-primary" />
                      </div>
                    </td>
                  </tr>
                  <tr>
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
                      100 Pages
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
                      25¢ / Page
                    </td>
                    <td className="py-3 text-center subtitle-text w-full">
                      20¢ / Page
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
    </div>
  );
};

export default PricingPage;