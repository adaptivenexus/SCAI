"use client";

import FileUploader from "@/components/Dashboard/OverviewComponents/DragAndDropFile";
import { GlobalContext } from "@/context/GlobalProvider";
import { extractFilenameFromUrl, formatDate } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
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

const DashboardPage = () => {
  const { clients, documents } = useContext(GlobalContext);

  const [jantojune, setJantojune] = useState([
    { name: "Jan", documents: 0 },
    { name: "Feb", documents: 0 },
    { name: "Mar", documents: 0 },
    { name: "Apr", documents: 0 },
    { name: "May", documents: 0 },
    { name: "Jun", documents: 0 },
  ]);
  const [jultodec, setJultodec] = useState([
    { name: "Jul", documents: 0 },
    { name: "Aug", documents: 0 },
    { name: "Sep", documents: 0 },
    { name: "Oct", documents: 0 },
    { name: "Nov", documents: 0 },
    { name: "Dec", documents: 0 },
  ]);

  const [data, setData] = useState(jantojune);

  function calculateMonthlyData(documents) {
    const monthlyData = Array(12).fill(0); // Array to store document counts for each month (Jan to Dec)

    documents.forEach((doc) => {
      const uploadedDate = new Date(doc.uploaded_at);
      const month = uploadedDate.getMonth(); // Get the month (0 = Jan, 11 = Dec)
      monthlyData[month] += 1; // Increment the count for the respective month
    });

    // Split the data into two halves: Jan-Jun and Jul-Dec
    const jantojune = [
      { name: "Jan", documents: monthlyData[0] },
      { name: "Feb", documents: monthlyData[1] },
      { name: "Mar", documents: monthlyData[2] },
      { name: "Apr", documents: monthlyData[3] },
      { name: "May", documents: monthlyData[4] },
      { name: "Jun", documents: monthlyData[5] },
    ];

    const jultodec = [
      { name: "Jul", documents: monthlyData[6] },
      { name: "Aug", documents: monthlyData[7] },
      { name: "Sep", documents: monthlyData[8] },
      { name: "Oct", documents: monthlyData[9] },
      { name: "Nov", documents: monthlyData[10] },
      { name: "Dec", documents: monthlyData[11] },
    ];

    setJantojune(jantojune);
    setJultodec(jultodec);
    setData(jantojune); // Set the initial data to Jan-Jun
  }

  useEffect(() => {
    calculateMonthlyData(documents);
  }, [documents]);

  const last30DaysDocuments = documents.filter((doc) => {
    const uploadedDate = new Date(doc.uploaded_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return uploadedDate >= thirtyDaysAgo;
  });

  // Retrieve last login date from localStorage
  const lastLogin = localStorage.getItem("lastLogin");

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
              <p className="text-2xl font-semibold text-foreground">
                {last30DaysDocuments.length}
              </p>
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
              Last Login
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {lastLogin ? formatDate(lastLogin) : "No recent login"}
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
                  <td className="border-b py-2">{doc?.category?.name}</td>
                  <td className="border-b py-2">
                    {formatDate(doc.uploaded_at)}
                  </td>
                  <td className="border-b py-2">
                    {doc.status === "Verified" ? (
                      <span
                        className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-800`}
                      >
                        {doc?.status}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="px-2 py-1 text-xs rounded-full  bg-orange-100 text-orange-800"
                        onClick={() => {}}
                      >
                        Verify Now
                      </button>
                    )}
                  </td>
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
