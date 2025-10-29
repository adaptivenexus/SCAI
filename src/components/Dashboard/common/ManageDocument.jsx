"use client";

import { GlobalContext } from "@/context/GlobalProvider";
import { useAuth } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { authFetch } from "@/utils/auth";

const ManageDocument = ({
  setIsManageDocumentOpen,
  document,
  parsedData,
  action,
  onDocumentUpdate,
}) => {
  const { clients } = useContext(GlobalContext);
  const { refreshTokenFn } = useAuth();
  const [categories, setCategories] = useState([]);
  const [editDocument, setEditDocument] = useState(document);
  // Auto-set status to Verified if action is verify and not already set
  useEffect(() => {
    if (action === "verify" && editDocument.status !== "Verified") {
      setEditDocument((prev) => ({ ...prev, status: "Verified" }));
    }
  }, [action]);
  const [listClients, setListClients] = useState(clients);
  const [searchInputClients, setSearchInputClients] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation (only for client_id and category_id)
    if (!editDocument.client?.id || editDocument.client.id === 0) {
      setError("Client Name is required");
      setLoading(false);
      return;
    }
    if (!editDocument.category?.id || editDocument.category.id === 0) {
      setError("Category is required");
      setLoading(false);
      return;
    }

    // Prepare payload for API using application/json
    const payload = {
      client_id: editDocument.client.id,
      category_id: editDocument.category.id,
      name: editDocument.name,
      documentDate: editDocument.documentDate,
      status: action === "verify" ? "Verified" : editDocument.status,
    };

    try {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${document.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
        refreshTokenFn
      );

      // Log response details for debugging
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers.get("content-type"));

      // Check the content type of the response
      const contentType = response.headers.get("content-type");
      let data;

      // Handle cases where the response body might be empty (e.g., 204 No Content)
      if (response.status === 204) {
        toast.success(
          action === "verify"
            ? "Document verified successfully!"
            : "Document updated successfully!"
        );
        setIsManageDocumentOpen(false);
        onDocumentUpdate(); // Trigger refresh
        setLoading(false);
        return;
      }

      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Non-JSON Response Body:", text);
        throw new Error(
          `Expected JSON response, but got: ${text.slice(0, 100)}...`
        );
      }

      if (response.ok) {
        toast.success(
          action === "verify"
            ? "Document verified successfully!"
            : "Document updated successfully!"
        );
        setIsManageDocumentOpen(false);
        onDocumentUpdate(); // Trigger refresh
      } else {
        setError(data.message || data.error || "Failed to update document");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInputClients.length > 2) {
      const filteredClients = clients.filter(
        (client) =>
          client.business_name
            .toLowerCase()
            .includes(searchInputClients.toLowerCase()) ||
          client.email.toLowerCase().includes(searchInputClients.toLowerCase())
      );
      setListClients(filteredClients);
    } else {
      setListClients([]);
    }
  }, [searchInputClients, clients]);

  const fetchCategory = async () => {
    try {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/categories/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
        refreshTokenFn
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (document?.client) {
      const emailMatch = document.client.match(/\(([^)]+)\)/);
      const email = emailMatch ? emailMatch[1] : null;

      if (email) {
        const matchedClient = clients.find(
          (client) => client.email.toLowerCase() === email.toLowerCase()
        );
        if (matchedClient) {
          setSearchInputClients("");
          setEditDocument((prev) => ({
            ...prev,
            client: matchedClient,
          }));
        }
      }
    }
  }, [document, clients]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    let date;
    if (dateString.includes(",")) {
      date = new Date(dateString); // Parse "April 14, 2025" format
    } else {
      date = new Date(dateString); // Parse ISO format
    }
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center z-40"
      onClick={() => setIsManageDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[1300px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5 font-bold">
          {action === "verify" ? "Verify Document" : "Edit Document"}
        </h5>
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col justify-between">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex gap-2">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="client_id">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full relative">
                    <div className="border rounded-lg p-3 w-full flex items-center">
                      {!editDocument.client && (
                        <input
                          type="text"
                          name="client_id"
                          id="client_id"
                          className=" placeholder:text-secondary placeholder:font-medium outline-none w-full bg-transparent"
                          placeholder="Search and select client"
                          required
                          onChange={(e) => {
                            setSearchInputClients(e.target.value);
                          }}
                          autoComplete="off"
                          disabled={editDocument.client ? true : false}
                          value={
                            editDocument?.client != (null || undefined)
                              ? editDocument?.client?.business_name
                              : searchInputClients
                          }
                        />
                      )}
                      {editDocument.client && (
                        <>
                          <p className="w-full">
                            {editDocument.client.business_name}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchInputClients("");
                              setEditDocument({
                                ...editDocument,
                                client: undefined,
                              });
                            }}
                            className="text-red-500"
                          >
                            <IoIosCloseCircle size={24} />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="absolute w-full rounded-xl bg-white shadow-lg flex flex-col">
                      {listClients.map((client) => (
                        <button
                          type="button"
                          key={client.id}
                          className="py-2 px-4 border-b w-full cursor-pointer hover:bg-blue-50 text-start"
                          onClick={() => {
                            setEditDocument({
                              ...editDocument,
                              client: client,
                            });
                            setSearchInputClients("");
                          }}
                        >
                          <p className="body-text font-semibold">
                            {client.business_name}
                          </p>
                          <p className="label-text text-primary">
                            {client.email}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-1 gap-1 w-[50%]">
                  <label htmlFor="category_id">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    value={
                      editDocument?.category?.id === undefined
                        ? ""
                        : editDocument.category.id.toString()
                    }
                    onChange={(e) => {
                      setEditDocument({
                        ...editDocument,
                        category: {
                          ...editDocument.category,
                          id: parseInt(e.target.value),
                        },
                      });
                    }}
                    disabled={loading}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentName">Document Name</label>
                <input
                  type="text"
                  name="documentName"
                  id="documentName"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document name"
                  value={editDocument.name || parsedData?.suggested_title || ""}
                  onChange={(e) =>
                    setEditDocument({
                      ...editDocument,
                      name: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </div>
              {/* Status dropdown only for edit, not for verify */}
              {action !== "verify" && (
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="status">Status</label>
                  <select
                    name="status"
                    id="status"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    value={editDocument.status || ""}
                    onChange={(e) =>
                      setEditDocument({
                        ...editDocument,
                        status: e.target.value,
                      })
                    }
                    disabled={loading}
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentDate">Document Date</label>
                <input
                  type="date"
                  name="documentDate"
                  id="documentDate"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document date"
                  value={
                    editDocument.documentDate ||
                    formatDateForInput(parsedData?.document_date) ||
                    ""
                  }
                  onChange={(e) =>
                    setEditDocument({
                      ...editDocument,
                      documentDate: e.target.value,
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex-1 h-[70vh]">
              <h2 className="text-lg text-center font-medium mb-4">Summary</h2>
              <p>{parsedData.summary || "No summary available."}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              type="submit"
              className="primary-btn px-6 text-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? action === "verify"
                  ? "Verifying..."
                  : "Saving..."
                : action === "verify"
                ? "Verify"
                : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsManageDocumentOpen(false);
                setEditDocument(null);
              }}
              className="primary-btn bg-slate-500 px-6 text-lg disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageDocument;
