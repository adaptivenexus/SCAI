"use client";

import AddNewClient from "@/components/Dashboard/common/AddNewClient";
import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

const GlobalDashboardProvider = ({ children }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  return (
    <GlobalContext.Provider value={{ setIsAddClientOpen }}>
      {children}
      {isAddClientOpen && (
        <AddNewClient setIsAddClientOpen={setIsAddClientOpen} />
      )}
    </GlobalContext.Provider>
  );
};

export default GlobalDashboardProvider;
