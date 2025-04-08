import Image from "next/image";
import { FaDownload } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";

const BillingPage = () => {
  return (
    <div className="p-10 flex flex-col gap-6">
      <h4 className="heading-4">Billing & Subscription</h4>
      <div className="flex gap-5 w-full">
        <div className="flex-1 bg-white p-6 shadow-md rounded-xl flex justify-between  ">
          <div className="flex flex-col gap-3">
            <h5 className="heading-5">Plan Details</h5>
            <div className="space-y-2">
              <div className="space-y-0.5">
                <p className="subtitle-text text-secondary-foreground">
                  Basic Plan - $19.99/Month
                </p>
                <p className="subtitle-text text-secondary-foreground">
                  Billed Monthly
                </p>
              </div>
              <p className="subtitle-text text-primary">Single User Plan</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="primary-btn">
                My Subscription
              </button>
              <button type="button" className="secondary-btn">
                Manage Plan
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-between text-center">
            <div className="space-y-2">
              <h5 className="heading-5">Next Billing Date</h5>
              <div className="space-y-0.5">
                <p className="subtitle-text text-secondary-foreground">
                  27th April 2025
                </p>
                <p className="subtitle-text text-primary">
                  (Auto-renewal enabled)
                </p>
              </div>
            </div>
            <p className="label-text text-[#DF5753]">
              Expiring Soon: Renew before 03/01/2026
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white p-6 shadow-md rounded-xl space-y-3">
          <div className="">
            <h5 className="heading-5">Payment Method</h5>
            <p className="subtitle-text text-secondary-foreground">
              Change how You Pay for Your Plan
            </p>
          </div>

          <div className="p-4 rounded-xl border flex gap-5">
            <div>
              <RiVisaLine color="#1634CC" size={60} />
            </div>
            <div className="flex-1 flex justify-between">
              <div className="space-y-2">
                <div>
                  <p className="body-text">Visa ending in 1234</p>
                  <p className="label-text text-secondary-foreground">
                    Expires 03/2026
                  </p>
                </div>
                <p className="label-text text-secondary-foreground">
                  billing1234@gmail.com
                </p>
              </div>
              <button type="button" className="secondary-btn w-max h-max px-10">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl space-y-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <h5 className="heading-5">Usage Summary</h5>
            <button type="button" className="secondary-btn w-max h-max px-10">
              View Usage
            </button>
          </div>
          <button type="button" className="secondary-btn w-max h-max px-10">
            Add Add-on
          </button>
        </div>
        <div className="space-y-3">
          <p className="subtitle-text text-secondary-foreground">
            Overall Usage: 200 pages used out of 500.
          </p>
          <div className="w-full h-6 rounded-lg border overflow-hidden">
            <div className="w-1/2 h-full bg-primary-gradient"></div>
          </div>
          <p className="subtitle-text text-secondary-foreground">
            Remaining: 300 Credits left.
          </p>
        </div>
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl space-y-5">
        <h5 className="heading-5">Billing history</h5>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-3 bg-accent-primary text-foreground">Date</th>
                <th className="py-3 bg-accent-primary text-foreground">Plan</th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Amount
                </th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Payment Method
                </th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Status
                </th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="text-center">
                <td className="py-4">27th April 2025</td>
                <td className="py-4">Basic Plan - $19.99/Month</td>
                <td className="py-4">$19.99</td>
                <td className="py-4">Credit Card</td>
                <td className="py-4 text-primary">Paid</td>
                <td className="py-4">
                  <div className="flex items-center justify-center">
                    <FaDownload />
                  </div>
                </td>
              </tr>
              <tr className="text-center">
                <td className="py-4">27th April 2025</td>
                <td className="py-4">Basic Plan - $19.99/Month</td>
                <td className="py-4">$19.99</td>
                <td className="py-4">Credit Card</td>
                <td className="py-4 text-primary">Paid</td>
                <td className="py-4">
                  <div className="flex items-center justify-center">
                    <FaDownload />
                  </div>
                </td>
              </tr>
              <tr className="text-center">
                <td className="py-4">27th April 2025</td>
                <td className="py-4">Basic Plan - $19.99/Month</td>
                <td className="py-4">$19.99</td>
                <td className="py-4">Credit Card</td>
                <td className="py-4 text-primary">Paid</td>
                <td className="py-4">
                  <div className="flex items-center justify-center">
                    <FaDownload />
                  </div>
                </td>
              </tr>
              <tr className="text-center">
                <td className="py-4">27th April 2025</td>
                <td className="py-4">Basic Plan - $19.99/Month</td>
                <td className="py-4">$19.99</td>
                <td className="py-4">Credit Card</td>
                <td className="py-4 text-primary">Paid</td>
                <td className="py-4">
                  <div className="flex items-center justify-center">
                    <FaDownload />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default BillingPage;
