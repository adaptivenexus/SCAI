"use client";

import AddNewDocument from "@/components/Dashboard/common/AddNewDocument";
import AddOrManageClient from "@/components/Dashboard/common/AddOrManageClient";
import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

const GlobalDashboardProvider = ({ children }) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  return (
    <GlobalContext.Provider
      value={{ setIsAddClientOpen, setIsAddDocumentOpen }}
    >
      {children}
      {isAddClientOpen && (
        <AddOrManageClient
          setIsAddClientOpen={setIsAddClientOpen}
          isNew={true}
        />
      )}
      {isAddDocumentOpen && (
        <AddNewDocument setIsAddDocumentOpen={setIsAddDocumentOpen} />
      )}
    </GlobalContext.Provider>
  );
};

export default GlobalDashboardProvider;
