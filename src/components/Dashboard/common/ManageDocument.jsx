"use client";

import { GlobalContext } from "@/context/GlobalProvider";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

const ManageDocument = ({ setIsManageDocumentOpen, document, parsedData }) => {
  const { clients } = useContext(GlobalContext);
  const [categories, setCategories] = useState([]);
  const [editDocument, setEditDocument] = useState(document);
  const [listClients, setListClients] = useState(clients);
  const [searchInputClients, setSearchInputClients] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
  }, [searchInputClients]);

  const fetchCategory = async () => {
    try {
      // Ensure localStorage is accessed only on the client side
      const accessToken =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;


      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/categories/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
      // Extract email from the client name string
      const emailMatch = document.client.match(/\(([^)]+)\)/);
      const email = emailMatch ? emailMatch[1] : null;

      if (email) {
        // Find the client in the global state using the extracted email
        const matchedClient = clients.find(
          (client) => client.email.toLowerCase() === email.toLowerCase()
        );
        if (matchedClient) {
          // Update the editDocument state with the matched client
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
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center z-10"
      onClick={() => setIsManageDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[1300px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5 font-bold">Edit Document</h5>
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
                <label htmlFor="documentName">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentName"
                  id="documentName"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document name"
                  value={editDocument.name || parsedData?.suggested_title}
                  onChange={(e) =>
                    setEditDocument({
                      ...editDocument,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentDate">
                  Document Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="documentDate"
                  id="documentDate"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document date"
                  value={
                    editDocument.documentDate ||
                    formatDateForInput(parsedData?.document_date)
                  }
                  onChange={(e) =>
                    setEditDocument({
                      ...editDocument,
                      documentDate: e.target.value,
                    })
                  }
                />
              </div>

              {/* <div className="flex flex-col gap-1">
                <label>Status</label>
                <div className="flex gap-4">
                  <label htmlFor="status1" className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      id="status1"
                      checked={editDocument.status === "Verified"}
                      onChange={() =>
                        setEditDocument({
                          ...editDocument,
                          status: "Verified",
                        })
                      }
                    />
                    <span>Verified</span>
                  </label>
                  <label htmlFor="status2" className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      id="status2"
                      checked={editDocument.status === "Not Verified"}
                      onChange={() =>
                        setEditDocument({
                          ...editDocument,
                          status: "Not Verified",
                        })
                      }
                    />
                    <span>Not Verified</span>
                  </label>
                </div>
              </div> */}
            </div>
            <div className="flex-1 h-[70vh]">
              <h2 className="text-lg text-center font-medium mb-4">Summary</h2>
              <p>{parsedData.summary}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              type="submit"
              onClick={() => toast.warn("Api Work in Progress")}
              className="primary-btn px-6 text-lg"
            >
              Verify
            </button>
            <button
              type="button"
              onClick={() => {
                setIsManageDocumentOpen(false);
                setEditDocument && setEditDocument(null);
              }}
              className="primary-btn bg-slate-500 px-6 text-lg"
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
