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
        if (String(item).toLowerCase().includes(q)) return true;
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
          else if (String(val).toLowerCase().includes(q)) return true;
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
