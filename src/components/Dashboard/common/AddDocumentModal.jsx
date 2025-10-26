"use client";

import { useContext, useEffect, useState, useRef } from "react";
import DocumentViewer from "../documentManagement/DocumentViewer";
import { GlobalContext } from "@/context/GlobalProvider";
import { IoIosCloseCircle, IoIosArrowDown } from "react-icons/io";

const AddNewDocumentModal = ({
  file,
  setIsAddDocumentOpen,
  handleSubmit,
  formData,
  setFormData,
}) => {
  const { clients } = useContext(GlobalContext);
  const [searchInputClients, setSearchInputClients] = useState("");
  const [listClients, setListClients] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (showDropdown) {
      if (searchInputClients.length > 0) {
        const filteredClients = clients.filter(
          (client) =>
            client.status === "Verified" &&
            (client.business_name
              .toLowerCase()
              .includes(searchInputClients.toLowerCase()) ||
            client.email.toLowerCase().includes(searchInputClients.toLowerCase()))
        );
        setListClients(filteredClients);
      } else {
        // Show all verified clients when dropdown is open but no search input
        const verifiedClients = clients.filter(client => client.status === "Verified");
        setListClients(verifiedClients);
      }
    } else {
      setListClients([]);
    }
  }, [searchInputClients, showDropdown, clients]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center"
      onClick={() => setIsAddDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[1300px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5 font-bold">Add Document</h5>
        <form
          onSubmit={async (e) => {
            setIsSaving(true);
            try {
              await handleSubmit(e);
            } finally {
              setIsSaving(false);
            }
          }}
          className="flex flex-col justify-between"
        >
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex gap-2">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="client_id">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full relative" ref={dropdownRef}>
                    <div className="border rounded-lg p-3 w-full flex items-center">
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
                        onFocus={() => {
                          if (!formData.client) {
                            setShowDropdown(true);
                          }
                        }}
                        onClick={() => {
                          if (!formData.client) {
                            setShowDropdown(true);
                          }
                        }}
                        autoComplete="off"
                        disabled={formData.client ? true : false}
                        value={
                          formData.client
                            ? formData.client.business_name
                            : searchInputClients
                        }
                      />
                      {formData.client ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchInputClients("");
                            setFormData({
                              ...formData,
                              client: undefined,
                            });
                            setShowDropdown(false);
                          }}
                          className="text-red-500"
                        >
                          <IoIosCloseCircle size={24} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="text-gray-500 transition-transform duration-200"
                        >
                          <IoIosArrowDown 
                            size={20} 
                            className={`${showDropdown ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>
                    {showDropdown && listClients.length > 0 && (
                      <div className="absolute w-full rounded-xl bg-white shadow-lg flex flex-col z-10 max-h-60 overflow-y-auto border">
                        {listClients.map((client) => (
                          <button
                            type="button"
                            key={client.id}
                            className="py-2 px-4 border-b w-full cursor-pointer hover:bg-blue-50 text-start"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                client: client,
                              });
                              setSearchInputClients("");
                              setShowDropdown(false);
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
                    )}
                  </div>
                </div>
                {/* <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="category_id">
                    Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="category"
                    id="category"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    value={
                      formData.category_id === undefined
                        ? ""
                        : formData.category_id.toString()
                    }
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        category_id: parseInt(e.target.value),
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
                </div> */}
              </div>
              {/* <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentName">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentName"
                  id="documentName"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document name"
                />
              </div> */}
              {/* <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentDate">
                  Document Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="documentDate"
                  id="documentDate"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document date"
                />
              </div> */}

              {/* <div className="flex flex-col gap-1">
                <label>Status</label>
                <div className="flex gap-4">
                  <label htmlFor="status1" className="flex items-center gap-2">
                    <input type="radio" name="status" id="status1" />
                    <span>Verified</span>
                  </label>
                  <label htmlFor="status2" className="flex items-center gap-2">
                    <input type="radio" name="status" id="status2" />
                    <span>Not Verified</span>
                  </label>
                </div>
              </div>*/}
            </div>
            <div className="flex-1 h-[70vh]">
              <h2 className="text-lg text-center font-medium mb-4">Preview</h2>
              <DocumentViewer document={file.preview} />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              type="submit"
              className="primary-btn px-6 text-lg"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddDocumentOpen(false);
                setFormData({
                  client: undefined,
                  category_id: undefined,
                });
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

export default AddNewDocumentModal;
