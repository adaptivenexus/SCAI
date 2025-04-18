"use client";

import FileUploader from "@/components/Dashboard/OverviewComponents/DragAndDropFile";
import { GlobalContext } from "@/context/GlobalProvider";
import { extractFilenameFromUrl, formatDate } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
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
const DashboardPage = () => {
  const [data, setData] = useState(jantojune);

  const { clients, documents } = useContext(GlobalContext);

  return (
    <div className="p-8 w-full flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex items-center p-6 gap-6 rounded-xl bg-white shadow-md">
          <div className="w-2 h-full rounded-full bg-[#F17373]"></div>
          <div className="space-y-4">
            <p className="text-xl font-semibold text-secondary-foreground">
              Total Clients
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {clients.length}
            </p>
          </div>
          <div className="ml-auto">
            <FaUserFriends size={50} color="#F17373" />
          </div>
        </div>
        <div className="flex items-center p-6 gap-6 rounded-xl bg-white shadow-md">
          <div className="w-2 h-full rounded-full bg-[#4FBA84]"></div>
          <div className="space-y-4">
            <p className="text-xl font-semibold text-secondary-foreground">
              Uploaded Documents
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {documents.length}
            </p>
          </div>
          <div className="ml-auto">
            <FaFileAlt size={50} color="#4FBA84" />
          </div>
        </div>
        <div className="flex items-center p-6 gap-6 rounded-xl bg-white shadow-md">
          <div className="w-2 h-full rounded-full bg-[#796AFF]"></div>
          <div className="space-y-4">
            <p className="text-xl font-semibold text-secondary-foreground">
              New Documents
            </p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-semibold text-foreground">30</p>
              <p className="text-[#796AFF] text-sm">last 30 days</p>
            </div>
          </div>
          <div className="ml-auto">
            <GrDocumentPerformance size={50} color="#796AFF" />
          </div>
        </div>
        <div className="flex items-center p-6 gap-6 rounded-xl bg-white shadow-md">
          <div className="w-2 h-full rounded-full bg-[#F1B91E]"></div>
          <div className="space-y-4">
            <p className="text-xl font-semibold text-secondary-foreground">
              Recent Activity
            </p>
            <p className="text-2xl font-semibold text-foreground">
              Oct 27, 2024
            </p>
          </div>
          <div className="ml-auto">
            <MdHistory size={50} color="#F1B91E" />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="bg-white p-6 shadow-md rounded-xl flex-1 flex gap-6">
          <div className="space-y-6 w-[30%]">
            <h4 className="text-2xl font-medium">Document Statistics</h4>

            <div className="space-y-4 font-medium">
              <div className="space-y-2">
                <p className="text-secondary-foreground">
                  Peak uploaded Documents
                </p>
                <p className="text-xl">
                  {Math.max(...data.map((item) => item.documents))}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-secondary-foreground">
                  Least uploaded Documents
                </p>
                <p className="text-xl">
                  {Math.min(...data.map((item) => item.documents))}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                data === jantojune ? setData(jultodec) : setData(jantojune);
              }}
              type="button"
              className="mt-auto primary-btn w-full"
            >
              {data === jantojune ? "Jul-Dec Chart" : "Jan-Jun Chart"}
            </button>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#636161" strokeWidth={1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="linear"
                  dataKey="documents"
                  stroke="#005cdc"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 shadow-md rounded-xl w-[30%]">
          <FileUploader />
        </div>
      </div>

      <div className="p-6 bg-white shadow-md rounded-xl space-y-4 ">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Documents</h2>
          <Link
            href={"/dashboard/document-management/all-documents"}
            className="primary-btn "
          >
            View All
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-start border-b py-4 text-xl">Client Name</th>
              <th className="text-start border-b py-4 text-xl">
                Document Name
              </th>
              <th className="text-start border-b py-4 text-xl">Category</th>
              <th className="text-start border-b py-4 text-xl">Process Date</th>

              <th className="text-start border-b py-4 text-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            {documents.slice(0, 4).map((doc) => {
              return (
                <tr key={doc.id}>
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
                    <p>{doc.client}</p>
                  </td>
                  <td className="border-b py-2">
                    {extractFilenameFromUrl(doc.file)}
                  </td>
                  <td className="border-b py-2">{doc.category.name}</td>
                  <td className="border-b py-2">
                    {formatDate(doc.uploaded_at)}
                  </td>
                  <td className="border-b py-2 text-green-500">Verified</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DashboardPage;
