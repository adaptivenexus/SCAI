"use client";

import FileUploader from "@/components/Dashboard/OverviewComponents/DragAndDropFile";
import Image from "next/image";
import { useState } from "react";
import { FaFileAlt, FaUserFriends } from "react-icons/fa";
import { GrDocumentPerformance } from "react-icons/gr";
import { MdHistory } from "react-icons/md";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const jantojune = [
  { name: "Jan", documents: 2400 },
  { name: "Feb", documents: 1398 },
  { name: "Mar", documents: 9000 },
  { name: "Apr", documents: 3908 },
  { name: "May", documents: 4800 },
  { name: "Jun", documents: 3800 },
];
const jultodec = [
  { name: "Jul", documents: 8234 },
  { name: "Aug", documents: 6523 },
  { name: "Sep", documents: 7345 },
  { name: "Oct", documents: 11821 },
  { name: "Nov", documents: 4512 },
  { name: "Dec", documents: 1789 },
];
const StartTour = () => {
  const [data, setData] = useState(jantojune);

  return (
    <div className="p-8 w-full flex flex-col gap-6">
      <div className="flex gap-4">
        <div className="bg-white p-6 shadow-md rounded-xl w-full h-[300px]">
          <FileUploader />
        </div>
      </div>

      <div className="p-6 bg-white shadow-md rounded-xl space-y-4 ">
        <h2 className="text-2xl font-semibold">Recent Documents</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-start border-b py-4 text-xl">Client Name</th>
              <th className="text-start border-b py-4 text-xl">
                Document Name
              </th>
              <th className="text-start border-b py-4 text-xl">Category</th>
              <th className="text-start border-b py-4 text-xl">Process Date</th>
              <th className="text-start border-b py-4 text-xl">
                Document Date
              </th>
              <th className="text-start border-b py-4 text-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="flex gap-3 items-center border-b py-2">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                  }
                  alt="profile"
                  width={40}
                  height={40}
                  className="aspect-square object-cover object-top rounded-full"
                />
                <p>John Doe</p>
              </td>
              <td className="border-b py-2">Invoice of Electronic Items</td>
              <td className="border-b py-2">Invoice</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2 text-green-500">Verified</td>
            </tr>
            <tr>
              <td className="flex gap-3 items-center border-b py-2">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                  }
                  alt="profile"
                  width={40}
                  height={40}
                  className="aspect-square object-cover object-top rounded-full"
                />
                <p>John Doe</p>
              </td>
              <td className="border-b py-2">Invoice of Electronic Items</td>
              <td className="border-b py-2">Invoice</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2 text-green-500">Verified</td>
            </tr>
            <tr>
              <td className="flex gap-3 items-center border-b py-2">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                  }
                  alt="profile"
                  width={40}
                  height={40}
                  className="aspect-square object-cover object-top rounded-full"
                />
                <p>John Doe</p>
              </td>
              <td className="border-b py-2">Invoice of Electronic Items</td>
              <td className="border-b py-2">Invoice</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2 text-red-500">Verify Now</td>
            </tr>
            <tr>
              <td className="flex gap-3 items-center border-b py-2">
                <Image
                  src={
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                  }
                  alt="profile"
                  width={40}
                  height={40}
                  className="aspect-square object-cover object-top rounded-full"
                />
                <p>John Doe</p>
              </td>
              <td className="border-b py-2">Invoice of Electronic Items</td>
              <td className="border-b py-2">Invoice</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2">23 Jan 2025</td>
              <td className="border-b py-2 text-green-500">Verified</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StartTour;
