"use client";

import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

const GlobalDashboardProvider = ({ children }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const fetchClients = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/client/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
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
  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <GlobalContext.Provider value={{ setIsAddClientOpen, clients }}>
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
