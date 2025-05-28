"use client";

import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { authFetch } from "@/utils/auth";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const GlobalContext = createContext(null);

const GlobalDashboardProvider = ({ children }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { refreshTokenFn } = useAuth();

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

  const fetchDocuments = async () => {
    try {
      // Ensure localStorage is accessed only on the client side
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      // First fetch all documents
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/`,
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

      // Now fetch parsed data for each document
      const documentsWithParsedData = await Promise.all(
        documentsData.map(async (document) => {
          try {
            const parsedDataResponse = await authFetch(
              `https://www.scandoq.com/api/v1/document/${document.id}/parsed-data/`,
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
            return document; // Return original document if parsing data fetch fails
          } catch (error) {
            console.error(
              `Error fetching parsed data for document ${document.id}:`,
              error
            );
            return document; // Return original document on error
          }
        })
      );

      // Sort documents by upload date and update state
      const sortedData = documentsWithParsedData.sort(
        (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
      );

      setDocuments(sortedData);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

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
        fetchDocuments,
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
