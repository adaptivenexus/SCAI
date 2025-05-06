"use client";
import { IoMdArrowRoundBack, IoIosCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { handleCheckout } from "@/utils/paymentGateway";
import { useAuth } from "@/context/AuthContext";

const UpgradePlanPage = () => {
  const router = useRouter();
  const { subscriptions, subscription } = useAuth();

  const mapSubscriptions = [
    {
      ...subscriptions[0],
      features: [
        "Up to 1,000 documents",
        "Basic AI categorization",
        "Standard OCR",
        "Email support",
      ],
    },
    {
      ...subscriptions[1],
      features: [
        "Up to 10,000 documents",
        "Advanced AI categorization",
        "Premium OCR",
        "Priority support",
        "API access",
      ],
    },
    {
      ...subscriptions[2],
      features: [
        "Unlimited documents",
        "Custom AI training",
        "Enterprise OCR",
        "24/7 dedicated support",
        "Custom integration",
      ],
    },
    {
      ...subscriptions[3],
      features: [
        "Unlimited documents",
        "Custom AI training",
        "Enterprise OCR",
        "24/7 dedicated support",
        "Custom integration",
        "Custom pricing",
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
          <h4 className="heading-4">Upgrade Plan</h4>
        </div>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Free Plan */}
        {mapSubscriptions.map((sub, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-md  p-6 flex flex-col justify-between ${
              subscription.plan === sub.id
                ? "border-4 border-primary scale-105"
                : "border"
            }`}
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
            {subscription.plan === sub.id ? (
              <button
                className="bg-accent-primary text-primary rounded-md py-2 mt-auto cursor-default"
                disabled
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleCheckout(sub.id)}
                type="button"
                disabled={subscription.plan === sub.id && sub.id === 0}
                className="bg-primary text-white rounded-md py-2 mt-auto"
              >
                Get Started
              </button>
            )}
          </div>
        ))}
        {/* 
        <div className="bg-white rounded-xl shadow-md border-4 border-primary p-6 flex flex-col justify-between scale-105">
          <div>
            <h3 className="font-bold text-lg text-forground">Basic</h3>
            <p className="label-text text-secondary-foreground mb-2">
              For growing businesses
            </p>
            <div className="font-bold text-2xl mb-3">
              $19.99{" "}
              <span className="text-base font-normal text-secondary-foreground">
                /Month
              </span>
            </div>
            <ul className="text-sm text-forground mb-6 space-y-4">
              <li className="text-primary">✔ Up to 10,000 documents</li>
              <li className="text-primary">✔ Advanced AI categorization</li>
              <li className="text-primary">✔ Premium OCR</li>
              <li className="text-primary">✔ Priority support</li>
              <li className="text-primary">✔ API access</li>
            </ul>
          </div>
          <button
            className="bg-accent-primary text-primary rounded-md py-2 mt-auto cursor-default"
            disabled
          >
            Current Plan
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-forground">Standard</h3>
            <p className="label-text text-secondary-foreground mb-2">
              For large organizations
            </p>
            <div className="font-bold text-2xl mb-3">
              $149.99{" "}
              <span className="text-base font-normal text-secondary-foreground">
                /Month
              </span>
            </div>
            <ul className="text-sm text-forground mb-6 space-y-4">
              <li className="text-primary">✔ Unlimited documents</li>
              <li className="text-primary">✔ Custom AI training</li>
              <li className="text-primary">✔ Enterprise OCR</li>
              <li className="text-primary">✔ 24/7 dedicated support</li>
              <li className="text-primary">✔ Custom integration</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={async () => {
              await handleCheckout(3);
            }}
            className="bg-primary text-white rounded-md py-2 mt-auto"
          >
            Upgrade Plan
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-forground">Enterprise</h3>
            <p className="label-text text-secondary-foreground mb-2">
              For large organizations
            </p>
            <div className="font-bold text-2xl mb-3">Custom Pricing</div>
            <ul className="text-sm text-forground mb-6 space-y-4">
              <li className="text-primary">✔ Unlimited documents</li>
              <li className="text-primary">✔ Custom AI training</li>
              <li className="text-primary">✔ Enterprise OCR</li>
              <li className="text-primary">✔ 24/7 dedicated support</li>
              <li className="text-primary">✔ Custom integration</li>
            </ul>
          </div>
          <button className="bg-primary text-white rounded-md py-2 mt-auto">
            Upgrade Plan
          </button>
          </div> */}
      </div>

      {/* Table */}
      <section>
        <div>
          <div className="hidden md:grid grid-cols-10 gap-5 p-4 rounded-3xl ">
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
                      API Access
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
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Free
                    </th>
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Basic
                    </th>
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Standard
                    </th>
                    <th className="heading-5 border-b border-[#E1E1E1] py-3 text-center w-full">
                      Enterprise
                    </th>
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
                      Unlimited
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
                      100 Pages
                    </td>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      1000 Pages
                    </td>
                    <td className="border-b border-[#E1E1E1] py-3 text-center subtitle-text w-full">
                      Unlimited
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
    </div>
  );
};

export default UpgradePlanPage;
