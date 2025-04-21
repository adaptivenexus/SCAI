"use client";

import { GlobalContext } from "@/context/GlobalProvider";
import Image from "next/image";
import { useContext, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { BiLoaderAlt } from "react-icons/bi";

const AddOrManageClient = ({
  setIsAddClientOpen,
  isNew,
  oldClient,
  setEditClient,
}) => {
  const token = localStorage.getItem("accessToken");

  const { fetchClients } = useContext(GlobalContext);

  const [loading, startTransition] = useTransition();

  const [client, setClient] = useState({
    business_name: "",
    business_type: "",
    mobile_number: "",
    telephone_number: "",
    email: "",
    tin: "",
    business_address: "",
    postal_code: "",
    status: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    startTransition(async () => {
      if (isNew) {
        try {
          console.log(client);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SWAGGER_URL}/client/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(client),
            }
          );
          if (!response.ok) {
            console.log(await response.json());
            toast.error("Something went wrong or check your fields");
            return;
          }
          toast.success("Client added successfully");
          fetchClients();
          setIsAddClientOpen(false);
        } catch (error) {
          console.error("Error adding client:", error);
          toast.error("Something went wrong");
        }
      } else {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SWAGGER_URL}/client/${oldClient.id}/`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(client),
            }
          );
          if (!response.ok) {
            console.log(await response.json());
            toast.error("Something went wrong or check your fields");
            return;
          }
          toast.success("Client updated successfully");
          fetchClients();
          setIsAddClientOpen(false);
        } catch (error) {
          console.error("Error updating client:", error);
          toast.error("Something went wrong");
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value,
    });
  };

  useEffect(() => {
    if (!isNew) {
      setClient(oldClient);
    }
  }, [isNew, oldClient]);

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center"
      onClick={() => setIsAddClientOpen(false)}
    >
      <div
        className="bg-white rounded-lg p-10 space-y-4 max-w-[1300px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5 font-bold">
          {isNew ? "Add New Client" : "Edit Client"}
        </h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3 items-center">
            <Image
              src={client.AVATAR || "/placeholder.jpg"}
              alt="Client Avatar"
              width={100}
              height={100}
              className="rounded-full border-2"
            />
            <label htmlFor="avatar" className="flex flex-col">
              <input type="file" name="avatar" id="avatar" className="hidden" />
              <span className="primary-btn cursor-pointer">Upload Avatar</span>
            </label>
          </div>
          {/* <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Firstname"
                value={client.FIRST_NAME}
                onChange={(e) =>
                  setClient({ ...client, FIRST_NAME: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Lastname"
                value={client.LAST_NAME}
                onChange={(e) =>
                  setClient({ ...client, LAST_NAME: e.target.value })
                }
              />
            </div>
          </div> */}
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="mobile_number">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobile_number"
                id="mobile_number"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Mobile Number"
                value={client.mobile_number}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="telephone_number">Telephone Number</label>
              <input
                type="text"
                name="telephone_number"
                id="telephone_number"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium w-full outline-none"
                placeholder="Enter Telephone number"
                value={client.telephone_number}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Email"
                value={client.email}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="DOB">Date of Birth</label>
              <div className="border rounded-lg p-3 flex items-center justify-between">
                <input
                  type="date"
                  name="DOB"
                  id="DOB"
                  className="placeholder:text-secondary placeholder:font-medium w-full outline-none"
                  value={client.date_of_birth}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="passportNumber">
                Passport Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="passportNumber"
                id="passportNumber"
                placeholder="Enter Passport number"
                className="border rounded-lg p-3  placeholder:text-secondary placeholder:font-medium w-full outline-none"
                value={client.PASSPORT}
                onChange={(e) =>
                  setClient({
                    ...client,
                    PASSPORT: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="licenseNumber">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                id="licenseNumber"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your License Number"
                value={client.LICENSE_NUMBER}
                onChange={(e) =>
                  setClient({ ...client, LICENSE_NUMBER: e.target.value })
                }
              />
            </div>
          </div> */}

          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="tin">Social Security Number (SSN) / TIN</label>
              <input
                type="text"
                name="tin"
                id="tin"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter SSN / TIN number"
                value={client.tin}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                value={client.status}
                onChange={handleChange}
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="business_name">Business Name</label>
              <input
                type="text"
                name="business_name"
                id="business_name"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter business name"
                value={client.business_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="business_type">Business Type</label>
              <select
                name="business_type"
                id="business_type"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                value={client.business_type}
                onChange={handleChange}
              >
                <option value="">Select Business Type</option>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Service">Service</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="business_address">Business Address</label>
              <textarea
                name="business_address"
                id="business_address"
                rows={3}
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter your business address"
                value={client.business_address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button type="submit" className="primary-btn px-6 text-lg">
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddClientOpen(false);
                !isNew && setEditClient(null);
              }}
              className="primary-btn bg-slate-500 px-6 text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
        {/* add loading */}
        {loading && (
          <div className="absolute !m-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
            <BiLoaderAlt className="animate-spin text-primary" size={100} />
          </div>
        )}
      </div>
    </div>
  );
};
export default AddOrManageClient;
