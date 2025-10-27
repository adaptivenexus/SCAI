"use client";

import { GlobalContext } from "@/context/GlobalProvider";
import { extractFilenameFromUrl, formatDate } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useMemo } from "react";
import Avatar from "@/components/Dashboard/Avatar";
import {
  FaFileAlt,
  FaUserFriends,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import { GrDocumentPerformance } from "react-icons/gr";
import { MdHistory, MdTrendingUp } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

const DashboardPage = () => {
  const { clients, documents, setIsAddClientOpen } = useContext(GlobalContext);
  const [lastLogin, setLastLogin] = useState();
  const [chartType, setChartType] = useState("line");
  const router = useRouter();

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
  const [viewMode, setViewMode] = useState("monthly"); // monthly | cumulative

  function calculateMonthlyData(documents) {
    const monthlyData = Array(12).fill(0);

    documents.forEach((doc) => {
      const uploadedDate = new Date(doc.uploaded_at);
      const month = uploadedDate.getMonth();
      monthlyData[month] += 1;
    });

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
    setData(jantojune);
  }

  // Helper functions to calculate trends dynamically
  const calculateDocumentTrend = (documents, periodDays = 30) => {
    if (!documents || documents.length === 0)
      return { trend: "0%", trendUp: false };

    const now = new Date();
    const currentPeriodStart = new Date(
      now.getTime() - periodDays * 24 * 60 * 60 * 1000
    );
    const previousPeriodStart = new Date(
      now.getTime() - 2 * periodDays * 24 * 60 * 60 * 1000
    );

    const currentPeriodDocs = documents.filter((doc) => {
      const uploadDate = new Date(doc.uploaded_at);
      return uploadDate >= currentPeriodStart && uploadDate <= now;
    });

    const previousPeriodDocs = documents.filter((doc) => {
      const uploadDate = new Date(doc.uploaded_at);
      return (
        uploadDate >= previousPeriodStart && uploadDate < currentPeriodStart
      );
    });

    const currentCount = currentPeriodDocs.length;
    const previousCount = previousPeriodDocs.length;

    if (previousCount === 0) {
      return currentCount > 0
        ? { trend: "+100%", trendUp: true }
        : { trend: "0%", trendUp: false };
    }

    const percentChange =
      ((currentCount - previousCount) / previousCount) * 100;
    const trendUp = percentChange >= 0;
    const trendText = `${trendUp ? "+" : ""}${Math.round(percentChange)}%`;

    return { trend: trendText, trendUp };
  };

  const calculateClientTrend = (clients) => {
    if (!clients || clients.length === 0)
      return { trend: "0%", trendUp: false };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Assuming clients have a created_at or similar timestamp field
    const recentClients = clients.filter((client) => {
      const createdDate = new Date(
        client.created_at || client.createdAt || client.joinDate
      );
      return createdDate >= thirtyDaysAgo;
    });

    const previousClients = clients.filter((client) => {
      const createdDate = new Date(
        client.created_at || client.createdAt || client.joinDate
      );
      return createdDate >= sixtyDaysAgo && createdDate < thirtyDaysAgo;
    });

    const currentCount = recentClients.length;
    const previousCount = previousClients.length;

    if (previousCount === 0) {
      return currentCount > 0
        ? { trend: "+100%", trendUp: true }
        : { trend: "0%", trendUp: false };
    }

    const percentChange =
      ((currentCount - previousCount) / previousCount) * 100;
    const trendUp = percentChange >= 0;
    const trendText = `${trendUp ? "+" : ""}${Math.round(percentChange)}%`;

    return { trend: trendText, trendUp };
  };

  useEffect(() => {
    calculateMonthlyData(documents);
  }, [documents]);

  const last30DaysDocuments = documents.filter((doc) => {
    const uploadedDate = new Date(doc.uploaded_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return uploadedDate >= thirtyDaysAgo;
  });

  // Derived interactive data
  const displayedData = useMemo(() => {
    if (viewMode === "monthly") return data;
    let sum = 0;
    return data.map((item) => {
      sum += item.documents;
      return { ...item, documents: sum };
    });
  }, [data, viewMode]);

  // Calculate top clients data from global context
  const topClientsData = useMemo(() => {
    if (
      !Array.isArray(clients) ||
      !Array.isArray(documents) ||
      clients.length === 0
    ) {
      return [];
    }

    // Count documents per client
    const clientDocumentCounts = clients.map((client) => {
      // Match documents by client name and email pattern from the document.client field
      const clientIdentifier = `${client.business_name} (${client.email})`;
      const documentCount = documents.filter(
        (doc) =>
          doc.client === clientIdentifier ||
          doc.client?.includes(client.business_name) ||
          doc.client?.includes(client.email)
      ).length;

      return {
        id: client.id,
        name: client.business_name,
        email: client.email,
        documents: documentCount,
        status: client.status,
      };
    });

    // Sort by document count and take top 5
    return clientDocumentCounts
      .filter((client) => client.documents > 0) // Only show clients with documents
      .sort((a, b) => b.documents - a.documents)
      .slice(0, 5)
      .map((client, index) => ({
        ...client,
        rank: index + 1,
      }));
  }, [clients, documents]);

  // Ensure localStorage is accessed only on the client side
  useEffect(() => {
    typeof window !== "undefined"
      ? setLastLogin(localStorage.getItem("lastLogin"))
      : null;
  }, []);

  const verifiedCount = useMemo(
    () => documents.filter((d) => d.status === "Verified").length,
    [documents]
  );
  const unverifiedCount = useMemo(
    () => documents.filter((d) => d.status !== "Verified").length,
    [documents]
  );

  // Calculate dynamic trends
  const clientTrendData = useMemo(
    () => calculateClientTrend(clients),
    [clients]
  );
  const documentTrendData = useMemo(
    () => calculateDocumentTrend(documents, 30),
    [documents]
  );
  const newDocumentTrendData = useMemo(
    () => calculateDocumentTrend(last30DaysDocuments, 15),
    [last30DaysDocuments]
  );

  // KPI card data with dynamic trends
  const kpiCards = [
    {
      id: "clients",
      title: "Total Clients",
      value: clients.length,
      color: "#F17373",
      icon: FaUserFriends,
      trend: clientTrendData.trend,
      trendUp: clientTrendData.trendUp,
    },
    {
      id: "documents",
      title: "Uploaded Documents",
      value: documents.length,
      color: "#4FBA84",
      icon: FaFileAlt,
      trend: documentTrendData.trend,
      trendUp: documentTrendData.trendUp,
    },
    {
      id: "new",
      title: "New Documents",
      value: last30DaysDocuments.length,
      color: "#796AFF",
      icon: GrDocumentPerformance,
      trend: newDocumentTrendData.trend,
      trendUp: newDocumentTrendData.trendUp,
      subtitle: "last 30 days",
    },
    {
      id: "login",
      title: "Last Login",
      value: lastLogin ? formatDate(lastLogin) : "No recent login",
      color: "#F1B91E",
      icon: MdHistory,
      trendUp: false,
    },
  ];

  const renderChart = () => {
    const commonProps = {
      data: displayedData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005cdc" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#005cdc" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e0e0e0" strokeWidth={1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="documents"
              stroke="#005cdc"
              fillOpacity={1}
              fill="url(#colorDocuments)"
              strokeWidth={3}
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid stroke="#e0e0e0" strokeWidth={1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="documents" fill="#005cdc" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid stroke="#e0e0e0" strokeWidth={1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="documents"
              stroke="#005cdc"
              strokeWidth={4}
              dot={{ fill: "#005cdc", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="p-8 w-full flex flex-col gap-6">
      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className={`group relative overflow-hidden flex items-center p-6 gap-4 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.01]`}
              role="button"
              aria-label={`Select KPI ${card.title}`}
              tabIndex={0}
              title={card.title}
            >
              {/* Decorative hover tint */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-multiply bg-gradient-to-r from-transparent to-blue-50"></div>
              {/* Accent edge */}
              <div
                className={`w-2 h-full rounded-full transition-all duration-300 group-hover:w-3`}
                style={{ backgroundColor: card.color }}
              ></div>
              {/* Content */}
              <div className="space-y-2 flex-1">
                <p className="text-lg font-semibold text-secondary-foreground">
                  {card.title}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  {card.trend && (
                    <span
                      className={`text-xs font-medium flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        card.trendUp
                          ? "text-green-700 bg-green-50"
                          : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {card.trendUp && <MdTrendingUp size={12} />}
                      {card.trend}
                    </span>
                  )}
                </div>
                {card.subtitle && (
                  <p className="text-sm" style={{ color: card.color }}>
                    {card.subtitle}
                  </p>
                )}
                {typeof card.progress === "number" && (
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(card.progress, 100)
                          )}%`,
                          backgroundColor: card.color,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                      {card.progress}%
                    </p>
                  </div>
                )}
              </div>
              {/* Icon */}
              <div className="ml-auto transition-transform duration-300 group-hover:scale-110 relative z-10">
                <div
                  className="p-3 rounded-full bg-gray-50 ring-1"
                  style={{ borderColor: card.color }}
                >
                  <IconComponent size={38} color={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Enhanced Chart + Controls */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GrDocumentPerformance className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Document Statistics
                  </h2>
                  <p className="text-sm text-gray-600">Overview and controls</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col lg:flex-row gap-6">
            <div className="space-y-6 w-full lg:w-[30%]">
              <div className="space-y-4 font-medium">
                <div className="space-y-2">
                  <p className="text-secondary-foreground">Status</p>
                  <p className="text-sm">
                    <span className="text-green-600 font-semibold">
                      Verified:
                    </span>{" "}
                    {verifiedCount} &nbsp;|&nbsp;
                    <span className="text-orange-600 font-semibold">
                      Unverified:
                    </span>{" "}
                    {unverifiedCount}
                  </p>
                </div>
              </div>

              {/* Enhanced Segmented Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Time Period
                  </label>
                  <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full">
                    <button
                      onClick={() => setData(jantojune)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        data === jantojune
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Jan–Jun
                    </button>
                    <button
                      onClick={() => setData(jultodec)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        data === jultodec
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Jul–Dec
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    View Mode
                  </label>
                  <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full">
                    <button
                      onClick={() => setViewMode("monthly")}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === "monthly"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setViewMode("cumulative")}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === "cumulative"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Cumulative
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Chart Type
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1">
                    {[
                      { key: "line", label: "Line" },
                      { key: "area", label: "Area" },
                      { key: "bar", label: "Bar" },
                    ].map((type) => (
                      <button
                        key={type.key}
                        onClick={() => setChartType(type.key)}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                          chartType === type.key
                            ? "bg-white shadow-sm text-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column: Top Clients*/}
        <div className="w-full lg:w-[30%] flex flex-col gap-4 ">
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 min-h-full">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaUserFriends className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Top Clients
                    </h2>
                    <p className="text-sm text-gray-600">
                      Clients with most documents
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-7">Client</div>
                  <div className="col-span-4 text-right">Documents</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                  {topClientsData.length > 0 ? (
                    topClientsData.map((client) => (
                      <div
                        key={client.rank}
                        className="grid grid-cols-12 gap-3 items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        {/* Rank */}
                        <div className="col-span-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              client.rank === 1
                                ? "bg-yellow-500"
                                : client.rank === 2
                                ? "bg-gray-400"
                                : client.rank === 3
                                ? "bg-amber-600"
                                : "bg-blue-500"
                            }`}
                          >
                            {client.rank}
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="col-span-7">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {client.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {client.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {client.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Documents Count */}
                        <div className="col-span-4 text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {client.documents}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaUserFriends className="mx-auto text-gray-300 text-3xl mb-3" />
                      <p className="text-gray-500 text-sm">
                        No client data available
                      </p>
                      <p className="text-gray-400 text-xs">
                        Add clients and documents to see rankings
                      </p>
                    </div>
                  )}
                </div>

                {/* View All Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      router.push("/dashboard/client-management/client-list")
                    }
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    View All Clients →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Recent Documents */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaFileAlt className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Documents
                </h2>
                <p className="text-sm text-gray-600">
                  Latest uploaded documents
                </p>
              </div>
            </div>
            <Link
              href={"/dashboard/document-management/all-documents"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <span>View All</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Document
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Verification
                </th>
                <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.slice(0, 4).map((doc, index) => {
                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={null} // No image available for documents, will show initials
                          alt="client profile"
                          name={doc.client}
                          size={48}
                          className="group-hover:scale-110 transition-transform duration-200"
                          showStatus={true}
                          isActive={true}
                          fallbackBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {doc.client}
                          </p>
                          <p className="text-sm text-gray-500">Client</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaFileAlt className="text-gray-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-48">
                            {extractFilenameFromUrl(doc.file)}
                          </p>
                          <p className="text-sm text-gray-500">Document</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                        {doc?.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MdAccessTime className="text-gray-400 text-sm" />
                        <span className="text-gray-700 font-medium">
                          {formatDate(doc.uploaded_at)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {doc.status === "Verified" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-medium border border-green-200">
                          <FaCheckCircle size={14} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 font-medium border border-orange-200">
                          <FaExclamationTriangle size={14} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/document-management/view-document/${doc.id}`
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 hover:scale-110"
                          title="View Document"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto text-gray-300 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">No documents found</p>
            <p className="text-gray-400 text-sm">
              Upload your first document to get started
            </p>
          </div>
        )}
      </div>

      {/* Recent Clients Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUserFriends className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Clients
                </h2>
                <p className="text-sm text-gray-600">
                  Latest registered clients
                </p>
              </div>
            </div>
            <Link
              href={"/dashboard/client-management/client-list"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <span>View All</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Documents
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-8 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.slice(0, 4).map((client, index) => {
                // Match documents using the same logic as topClientsData
                const clientIdentifier = `${client.business_name} (${client.email})`;
                const clientDocuments = documents.filter(
                  (doc) =>
                    doc.client === clientIdentifier ||
                    doc.client?.includes(client.business_name) ||
                    doc.client?.includes(client.email)
                );
                const isActive = clientDocuments.length > 0;

                return (
                  <tr
                    key={client.id || index}
                    className="hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={client.image_url || client.image}
                          alt="client profile"
                          name={client.business_name || client.name}
                          size={48}
                          className="group-hover:scale-110 transition-transform duration-200"
                          showStatus={true}
                          isActive={isActive}
                          fallbackBg="bg-gradient-to-br from-purple-500 to-pink-600"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {client.business_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {client.business_type || "Client"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-48">
                            {client.email}
                          </p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <MdAccessTime className="text-gray-400 text-sm" />
                        <span className="text-gray-700 font-medium">
                          {formatDate(
                            client.created_at ||
                              client.registration_date ||
                              new Date()
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <FaFileAlt className="text-blue-600 text-xs" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {clientDocuments.length}
                        </span>
                        <span className="text-sm text-gray-500">docs</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {client.status === "Verified" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-medium border border-green-200">
                          <FaCheckCircle className="text-green-600 text-xs" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 font-medium border border-orange-200">
                          <FaExclamationTriangle className="text-orange-600 text-xs" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 hover:scale-110">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 hover:scale-110">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <FaUserFriends className="mx-auto text-gray-300 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">No clients found</p>
            <p className="text-gray-400 text-sm">
              Add your first client to get started
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group">
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-bounce">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>

          {/* Quick Actions Menu */}
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 min-w-48">
            <button
              onClick={() =>
                router.push("/dashboard/document-management/add-documents")
              }
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaFileAlt className="text-blue-600" />
              Upload Document
            </button>
            <button
              onClick={() => setIsAddClientOpen(true)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaUserFriends className="text-green-600" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
export default DashboardPage;

// info@unitedhealth.com
