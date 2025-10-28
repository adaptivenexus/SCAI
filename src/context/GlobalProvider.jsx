"use client";

import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { authFetch } from "@/utils/auth";
import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export const GlobalContext = createContext(null);

const GlobalDashboardProvider = ({ children }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { refreshTokenFn } = useAuth();

  // Global search state
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // --- Date matching helpers for global search ---
  // Parse common numeric date formats when native parsing fails
  const parseFlexibleDate = (raw) => {
    if (!raw) return null;
    const s = String(raw).trim();

    // ISO-like first (YYYY-MM-DD with different separators)
    const isoMatch = s.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})/);
    if (isoMatch) {
      const y = Number(isoMatch[1]);
      const m = Number(isoMatch[2]);
      const d = Number(isoMatch[3]);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const dt = new Date(y, m - 1, d);
        if (!isNaN(dt.getTime())) return dt;
      }
    }

    // DMY or MDY with separators
    const sepMatch = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
    if (sepMatch) {
      const a = Number(sepMatch[1]);
      const b = Number(sepMatch[2]);
      const y = Number(sepMatch[3].length === 2 ? `20${sepMatch[3]}` : sepMatch[3]);

      // Try DMY (a=d, b=m)
      if (b >= 1 && b <= 12 && a >= 1 && a <= 31) {
        const dtDMY = new Date(y, b - 1, a);
        if (!isNaN(dtDMY.getTime())) return dtDMY;
      }
      // Try MDY (a=m, b=d)
      if (a >= 1 && a <= 12 && b >= 1 && b <= 31) {
        const dtMDY = new Date(y, a - 1, b);
        if (!isNaN(dtMDY.getTime())) return dtMDY;
      }
    }

    // As a last resort, native Date
    const native = new Date(s);
    if (!isNaN(native.getTime())) return native;
    return null;
  };

  // Robust date matching across many common formats
  const doesDateMatch = (dateString, query) => {
    if (!dateString || !query) return false;

    const queryLower = String(query).toLowerCase().trim();
    const querySanitized = queryLower.replace(/[^a-z0-9]/g, "");

    // Quick raw string checks (works even if parsing fails)
    const rawLower = String(dateString).toLowerCase();
    const rawSanitized = rawLower.replace(/[^a-z0-9]/g, "");
    if (rawLower.includes(queryLower) || rawSanitized.includes(querySanitized)) {
      return true;
    }

    // Try parsing dateString using flexible parser
    const date = parseFlexibleDate(dateString);
    if (!date) {
      // If parsing fails, we've already checked raw string above
      return false;
    }

    const year = date.getFullYear().toString();
    const yy = year.slice(-2);
    const monthIndex = date.getMonth() + 1;
    const monthNum = monthIndex.toString().padStart(2, "0");
    const monthNumNoPad = monthIndex.toString();
    const dayNum = date.getDate();
    const day = dayNum.toString().padStart(2, "0");
    const dayNoPad = dayNum.toString();
    const monthLong = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
    const monthShort = date.toLocaleString("en-US", { month: "short" }).toLowerCase();

    // Extract YYYY-MM-DD from ISO strings if present
    const isoDate = rawLower.match(/\d{4}-\d{2}-\d{2}/)?.[0] || `${year}-${monthNum}-${day}`;
    const compactYMD = `${year}${monthNum}${day}`;
    const compactDMY = `${day}${monthNum}${year}`;

    const candidates = [
      year, yy,
      `${monthLong} ${year}`, `${monthShort} ${year}`, `${monthNum}/${year}`, `${monthNumNoPad}/${year}`,
      `${year} ${monthLong}`, `${year} ${monthShort}`, `${year}/${monthNum}`, `${year}/${monthNumNoPad}`,
      `${day} ${monthLong}`, `${monthLong} ${day}`, `${day} ${monthShort}`, `${monthShort} ${day}`,
      `${monthLong} ${day}, ${year}`, `${day} ${monthLong}, ${year}`,
      `${monthShort} ${day}, ${year}`, `${day} ${monthShort}, ${year}`,
      `${day}/${monthNum}/${year}`, `${monthNum}/${day}/${year}`, `${dayNoPad}/${monthNumNoPad}/${year}`, `${monthNumNoPad}/${dayNoPad}/${year}`,
      `${year}-${monthNum}-${day}`, `${day}-${monthNum}-${year}`, `${monthNum}-${day}-${year}`,
      `${year}/${monthNum}/${day}`, `${day}-${monthNum}-${year}`, `${monthNum}-${day}-${year}`,
      `${day}.${monthNum}.${year}`, `${monthNum}.${day}.${year}`,
      compactYMD, compactDMY,
      isoDate,
      rawLower.replace(/,/g, ""), rawLower.replace(/[ ,]/g, ""),
    ];

    const candidatesSanitized = candidates.map((c) => String(c).toLowerCase().replace(/[^a-z0-9]/g, ""));

    return (
      candidates.some((c) => String(c).toLowerCase().includes(queryLower)) ||
      candidatesSanitized.some((c) => c.includes(querySanitized))
    );
  };

  const fetchClients = async () => {
    try {
      // Ensure localStorage is accessed only on the client side
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/client/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
        refreshTokenFn
      );
      if (!res.ok) {
        console.log(res);
        return;
      }
      const data = await res.json();

      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchDocuments = async (clientId = null) => {
    try {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      // Build URL with client filter if provided
      let url = `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/`;
      if (clientId) {
        url += `?client_id=${clientId}`;
      }

      const response = await authFetch(
        url,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        refreshTokenFn
      );

      if (!response.ok) {
        setDocuments([]);
        return;
      }

      const documentsData = await response.json();

      // Fetch parsed data for each document (unchanged)
      const documentsWithParsedData = await Promise.all(
        documentsData.map(async (document) => {
          try {
            const parsedDataResponse = await authFetch(
              `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${document.id}/parsed-data/`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
              refreshTokenFn
            );

            if (parsedDataResponse.ok) {
              const parsedData = await parsedDataResponse.json();
              return {
                ...document,
                parsed_data: parsedData,
              };
            }
            return document;
          } catch (error) {
            console.error(
              `Error fetching parsed data for document ${document.id}:`,
              error
            );
            return document;
          }
        })
      );

      const sortedData = documentsWithParsedData.sort(
        (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
      );

      setDocuments(sortedData);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Helper: recursively check if any value in object includes the query
  const objectIncludesQuery = (obj, query) => {
    if (!query) return true;
    const q = String(query).toLowerCase();

    const seen = new Set();
    const stack = [obj];
    let steps = 0;

    while (stack.length && steps < 5000) {
      const item = stack.pop();
      steps++;
      if (!item) continue;

      if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
        const s = String(item);
        if (s.toLowerCase().includes(q) || doesDateMatch(s, query)) return true;
        continue;
      }

      if (Array.isArray(item)) {
        for (const el of item) stack.push(el);
        continue;
      }

      if (typeof item === "object") {
        if (seen.has(item)) continue;
        seen.add(item);
        for (const key of Object.keys(item)) {
          const val = item[key];
          if (val == null) continue;
          if (typeof val === "object") stack.push(val);
          else {
            const vs = String(val);
            if (vs.toLowerCase().includes(q) || doesDateMatch(vs, query)) return true;
          }
        }
      }
    }

    return false;
  };

  // Derived: filtered clients/documents based on globalSearchQuery
  const filteredClients = useMemo(() => {
    if (!globalSearchQuery) return clients;
    return clients.filter((c) => objectIncludesQuery(c, globalSearchQuery));
  }, [clients, globalSearchQuery]);

  const filteredDocuments = useMemo(() => {
    if (!globalSearchQuery) return documents;
    return documents.filter((d) => objectIncludesQuery(d, globalSearchQuery));
  }, [documents, globalSearchQuery]);

  useEffect(() => {
    fetchDocuments();
    fetchClients();
  }, []);
  useEffect(() => {
    console.log(documents);
  }, [documents]);

  return (
    <GlobalContext.Provider
      value={{
        setIsAddClientOpen,
        clients,
        documents,
        filteredClients,
        filteredDocuments,
        globalSearchQuery,
        setGlobalSearchQuery,
        fetchDocuments, // now accepts clientId
        fetchClients,
      }}
    >
      {children}
      {isAddClientOpen && (
        <AddOrManageClient
          setIsAddClientOpen={setIsAddClientOpen}
          isNew={true}
        />
      )}
    </GlobalContext.Provider>
  );
};

export default GlobalDashboardProvider;
