"use client";

import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

const GlobalDashboardProvider = ({ children }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  return (
    <GlobalContext.Provider value={{ setIsAddClientOpen }}>
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
