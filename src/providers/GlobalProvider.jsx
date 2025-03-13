"use client";

import AddNewClient from "@/components/Dashboard/common/AddNewClient";
import AddNewDocument from "@/components/Dashboard/common/AddNewDocument";
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
        <AddNewClient setIsAddClientOpen={setIsAddClientOpen} />
      )}
      {isAddDocumentOpen && (
        <AddNewDocument setIsAddDocumentOpen={setIsAddDocumentOpen} />
      )}
    </GlobalContext.Provider>
  );
};

export default GlobalDashboardProvider;
