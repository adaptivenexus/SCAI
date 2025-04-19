"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

const MyUsagePage = () => {


  const router = useRouter();
  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-blue-500 text-white p-2 rounded-full"
          >
            <IoMdArrowRoundBack size={24} />
          </button>
          <h4 className="heading-4">My Details & Usage</h4>
        </div>
        <Link href={"/dashboard/billing/upgrade-plan"}>
          <button type="button" className="primary-btn">
            Upgrade Plan
          </button>
        </Link>
      </div>
    
      {/* Add your usage statistics and management options here */}
      <div className="flex gap-5 w-full">
        <div className="flex-1 bg-white shadow-xl rounded-xl border">
          <div className="py-4 border-b px-3">
            <h5 className="heading-5">Details</h5>
          </div>
          <div className="py-4 border-b px-3 grid grid-cols-2">
            <p className="font-semibold">Subscription Renewal Data</p>
            <p className="text-secondary-foreground">03/01/2026</p>
          </div>
          <div className="py-4 border-b px-3 grid grid-cols-2">
            <p className="font-semibold">Payment Method</p>
            <p className="text-secondary-foreground">Visa - **** 1234</p>
          </div>
          <div className="py-4 border-b px-3 grid grid-cols-2">
            <p className="font-semibold">Plan Type</p>
            <p className="text-secondary-foreground">
              Basic ($19.99/month) / Single User Plan
            </p>
          </div>
          <div className="py-4 border-b px-3 grid grid-cols-2">
            <p className="font-semibold">Last Active</p>
            <p className="text-secondary-foreground">2 hours ago</p>
          </div>
          <div className="py-4 px-3 grid grid-cols-2">
            <p className="font-semibold">Billing History</p>
            <Link href={""} className="text-primary">
              View Invoices
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-white shadow-xl rounded-xl border p-5 space-y-2">
            <div className="flex justify-between items-center">
              <h5 className="heading-5">Usage Summary</h5>
              <button className="primary-btn">Add-ons</button>
            </div>
            <div className="flex flex-col gap-3">
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
          <div className="bg-white shadow-xl rounded-xl border p-5 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="subtitle-text">Scans Used</p>
                <p className="subtitle-text text-secondary-foreground">
                  50/100
                </p>
              </div>
              <div className="w-full h-6 rounded-lg border overflow-hidden">
                <div className="w-1/2 h-full bg-primary-gradient"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="subtitle-text">Storage Used</p>
                <p className="subtitle-text text-secondary-foreground">
                  2.5GB/5GB
                </p>
              </div>
              <div className="w-full h-6 rounded-lg border overflow-hidden">
                <div className="w-1/2 h-full bg-primary-gradient"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-xl border p-5 space-y-6">
        <div className="flex justify-between items-center">
          <h5 className="heading-5">Add-ons Details</h5>
          <div className="flex gap-3 items-center">
            <p>Sort-by: </p>
            <select
              name="sorting"
              id="sorting"
              className="p-2 border rounded-lg w-max"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="lowest-rated">Lowest Rated</option>
            </select>
          </div>
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-start py-3">Add-on</th>
              <th className="text-start py-3">Activation Date</th>
              <th className="text-start py-3">Usage</th>
              <th className="text-start py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-[1px] divide-gray-200">
            <tr>
              <td className="py-3">Extra 100 Scans</td>
              <td className="py-3">12 Mar 2025</td>
              <td className="py-3">100 Scans</td>
              <td className="py-3">🟢 Active</td>
            </tr>
            <tr>
              <td className="py-3">10GB Extra Storage</td>
              <td className="py-3">15 Feb 2025</td>
              <td className="py-3">10GB</td>
              <td className="py-3">🔴 Expired</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MyUsagePage;
