"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const TeamUsagePage = () => {
  const router = useRouter();
  const [selectedTimeframe, setSelectedTimeframe] = useState("Hourly");

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
          <h4 className="heading-4">Team Details & Usage</h4>
        </div>
        <Link href={"/dashboard/billing/upgrade-plan"}>
          <button type="button" className="primary-btn">
            Upgrade Plan
          </button>
        </Link>
      </div>

      {/* Add your usage statistics and management options here */}
      <div className="flex gap-5 w-full">
        <div className="flex-1 bg-white shadow-xl rounded-xl border flex flex-col">
          <div className="py-4 border-b px-6 flex-1 flex items-center">
            <h5 className="heading-5">Details</h5>
          </div>
          <div className="py-4 border-b px-6 grid grid-cols-2 flex-1 items-center">
            <p className="font-semibold">Subscription Renewal Data</p>
            <p className="text-secondary-foreground">03/01/2026</p>
          </div>
          <div className="py-4 border-b px-6 grid grid-cols-2 flex-1 items-center">
            <p className="font-semibold">Payment Method</p>
            <p className="text-secondary-foreground">Visa - **** 1234</p>
          </div>
          <div className="py-4 border-b px-6 grid grid-cols-2 flex-1 items-center">
            <p className="font-semibold">Plan Type</p>
            <p className="text-secondary-foreground">
              Basic ($19.99/month) / Team Plan
            </p>
          </div>

          <div className="py-4 px-6 grid grid-cols-2 flex-1 items-center">
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
      </div>
      <div className="bg-accent-primary max-w-[1260px] w-full p-6 flex gap-6 rounded-full mx-auto">
        <button
          type="button"
          onClick={() => setSelectedTimeframe("Hourly")}
          className={`${
            selectedTimeframe == "Hourly" ? "bg-white shadow-lg" : ""
          } py-4 w-full rounded-full subtitle-text`}
        >
          Hourly
        </button>
        <button
          type="button"
          onClick={() => setSelectedTimeframe("Daily")}
          className={`${
            selectedTimeframe == "Daily" ? "bg-white shadow-lg" : ""
          } py-4 w-full rounded-full subtitle-text`}
        >
          Daily
        </button>
        <button
          type="button"
          onClick={() => setSelectedTimeframe("Weekly")}
          className={`${
            selectedTimeframe == "Weekly" ? "bg-white shadow-lg" : ""
          } py-4 w-full rounded-full subtitle-text`}
        >
          Weekly
        </button>
        <button
          type="button"
          onClick={() => setSelectedTimeframe("Monthly")}
          className={`${
            selectedTimeframe == "Monthly" ? "bg-white shadow-lg" : ""
          } py-4 w-full rounded-full subtitle-text`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setSelectedTimeframe("Per Scan")}
          className={`${
            selectedTimeframe == "Per Scan" ? "bg-white shadow-lg" : ""
          } py-4 w-full rounded-full subtitle-text`}
        >
          Per Scan
        </button>
      </div>
      <div className="bg-white shadow-xl rounded-xl border p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="heading-5">Team Usage</h5>
          <div className="flex gap-3 items-center">
            <Link href={"/dashboard/settings/role-mangement"}>
              <button type="button" className="primary-btn">
                Manage
              </button>
            </Link>
            <label
              htmlFor="search"
              className="flex items-center gap-2 border p-2 rounded-lg bg-slate-50 min-w-[400px]"
            >
              <input
                type="text"
                id="search"
                name="search"
                className="border-none outline-none bg-transparent w-full"
                placeholder="Search"
              />
              <IoSearch size={28} />
            </label>
          </div>
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-start py-3">User Name</th>
              <th className="text-start py-3">Email</th>
              <th className="text-start py-3">Role</th>
              <th className="text-start py-3">Scans Used</th>
              <th className="text-start py-3">Storage Used</th>
              <th className="text-start py-3">Last Active</th>
              <th className="text-start py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-[1px] divide-gray-200">
            <tr>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <Image
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>Jack Reid</span>
                </div>
              </td>
              <td className="py-3">jack@email.com</td>
              <td className="py-3">Admin</td>
              <td className="py-3">30</td>
              <td className="py-3">2GB</td>
              <td className="py-3">2 hours ago</td>
              <td className="py-3">
                <button type="button" className="text-blue-500">
                  Edit
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <Image
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>John Doe</span>
                </div>
              </td>
              <td className="py-3">john@email.com</td>
              <td className="py-3">Team Member</td>
              <td className="py-3">10</td>
              <td className="py-3">1GB</td>
              <td className="py-3">3 hours ago</td>
              <td className="py-3">
                <button type="button" className="text-blue-500">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TeamUsagePage;
