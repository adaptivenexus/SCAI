"use client";

import { useAuth } from "@/context/AuthContext";
import { GlobalContext } from "@/context/GlobalProvider";
import { useContext, useEffect, useState, useTransition } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

const DocumentShareModal = ({ setIsShareDocumentOpen, doc }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    client: undefined,
    document: undefined,
    access_password: "",
    expired_at: addHoursToCurrentTime(1),
    shared_by_agency: user.id,
  });

  const [searchInputClients, setSearchInputClients] = useState("");
  const { clients } = useContext(GlobalContext);
  const [listClients, setListClients] = useState(clients);
  const [loading, startTransition] = useTransition();

  function addHoursToCurrentTime(hours) {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + hours);
    return currentTime.toISOString(); // Returns in the format: 2025-04-30T07:12:30.271Z
  }

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

  useEffect(() => {
    if (doc) {
      setFormData({
        ...formData,
        document: doc.id,
      });
    }
  }, [doc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SWAGGER_URL}/shares/shares/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              client: formData.client.id,
              document: formData.document,
              access_password: formData.access_password,
              expired_at: formData.expired_at,
              shared_by_agency: formData.shared_by_agency,
            }),
          }
        );
        if (response.ok) {
          setIsShareDocumentOpen(false);
          toast.success("Document shared successfully");
        } else {
          console.error("Error sharing document:", response.statusText);
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error sharing document:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center z-10"
      onClick={() => setIsShareDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[800px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5">Share Document</h5>
        {/* Add your document sharing content here */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Add form fields here */}
          <div className="flex flex-col flex-1 gap-1">
            <label htmlFor="client_id">
              Client Name <span className="text-red-500">*</span>
            </label>
            <div className="w-full relative">
              <div className="border rounded-lg p-3 w-full flex items-center">
                {!formData.client && (
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
                    disabled={formData.client ? true : false}
                    value={
                      formData?.client != (null || undefined)
                        ? formData?.client?.business_name
                        : searchInputClients
                    }
                  />
                )}
                {formData.client && (
                  <>
                    <p className="w-full">{formData.client.business_name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInputClients("");
                        setFormData({
                          ...formData,
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

              <div className="absolute w-full rounded-xl overflow-hidden bg-white shadow-lg flex flex-col">
                {searchInputClients &&
                  listClients.map((client, index) => (
                    <button
                      type="button"
                      key={client.id}
                      className={`py-2 px-4 ${
                        listClients.length === index + 1 ? "" : "border-b"
                      } w-full cursor-pointer hover:bg-blue-50 text-start`}
                      onClick={() => {
                        setSearchInputClients("");
                        setFormData({
                          ...formData,
                          client: {
                            id: client.id,
                            business_name: client.business_name,
                            email: client.email,
                          },
                        });
                      }}
                    >
                      <p className="body-text font-semibold">
                        {client.business_name}
                      </p>
                      <p className="label-text text-primary">{client.email}</p>
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <div className="">
            <label htmlFor="access_password">
              Access Password <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="access_password"
              id="access_password"
              className="border rounded-lg p-3 w-full outline-none"
              value={formData.access_password}
              placeholder="Enter access password"
              required
              onChange={(e) =>
                setFormData({
                  ...formData,
                  access_password: e.target.value,
                })
              }
            />
          </div>

          <button type="submit" className="primary-btn">
            Submit
          </button>
        </form>
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex items-center justify-center rounded-lg z-20">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="4"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4.93 4.93a10 10 0 0114.14 14.14l1.41 1.41a12 12 0 00-16.97-16.97l1.42 1.42z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
export default DocumentShareModal;
