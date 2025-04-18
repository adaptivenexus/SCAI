"use client";

import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { authFetch } from "@/utils/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const GlobalContext = createContext(null);

const GlobalDashboardProvider = ({ children }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { refreshTokenFn } = useAuth();

  const fetchClients = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/client/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
        refreshTokenFn
      );
      if (!response.ok) {
        setDocuments([]);
        return;
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchClients();
  }, []);

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
