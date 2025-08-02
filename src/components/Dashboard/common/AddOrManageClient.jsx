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
    status: "Pending", // Changed default value to empty string
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    console.log("Form validation error " + validationError);
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    startTransition(async () => {
      if (isNew) {
        try {
            // Ensure localStorage is accessed only on the client side
            const accessToken =
            typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

          console.log(client);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SWAGGER_URL}/client/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(client),
            }
          );
          if (!response.ok) {
            const result = await response.json();
            console.log(await result);

            if (!response.ok) {
              for (const key in result) {
                if (Array.isArray(result[key])) {
                  setMessage({ type: "error", text: result[key]  });
                  return
                }
              }
            }
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
          // Ensure localStorage is accessed only on the client side
          const accessToken =
          typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SWAGGER_URL}/client/${oldClient.id}/`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(client),
            }
          );
          if (!response.ok) {
            console.log(await response.json());
            const errorData = await response.json();
            setMessage({ type: "error", text: errorData.error  });
            //toast.error("Something went wrong or check your fields");
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

    // Clear error immediately when user fixes field
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    // Check if all fields are empty
    const allFieldsEmpty = Object.values(client).every(
      (value) => value === "" || value === undefined || value === null
    );
    if (allFieldsEmpty) {
      return "Please fill the details";
    }

    // Business name validation
    if (!client.business_name) {
      return "Business Name is required";
    }

     // Business type validation
    if (!client.business_type) {
      return "Please select a Business Type";
    }

    // Email validation
    if (!client.email) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(client.email)) {
      return "Invalid email address";
    }

    // Mobile number validation
    if (!client.mobile_number) {
      return "Mobile number is required";
    }

    if (!/^\d+$/.test(client.mobile_number)) {
      return "Please enter digits only in Mobile number";
    }

    if (client.mobile_number.length !== 10) {
      return "Please enter exactly 10 digits in Mobile number";
    }

    // Telephone number validation (optional, only if provided)
    if (client.telephone_number) {
      if (!/^\d+$/.test(client.telephone_number)) {
        return "Please enter digits only in Telephone number";
      }
      const digitCount = client.telephone_number.length;
      if (digitCount < 10 || digitCount > 15) {
        return "Telephone number must be 10-15 digits (optional)";
      }
    }

    

    
    // if (client.business_name.match(/['";\\]/)) {
    //   return "Business Name contains invalid characters (e.g., quotes, semicolons)";
    // }
    // if (client.business_name.match(/\d/)) {
    //   return "Please enter characters only in Business Name, numbers not allowed";
    // }
    // if (!/^[a-zA-Z\s]+$/.test(client.business_name)) {
    //   return "Please enter a valid Business Name (letters only).";
    // }

    // TIN validation
    if (!client.tin) {
      return "SSN/TIN Number is required";
    }

   
    if (client.business_type.match(/['";\\]/)) {
      return "Business Type contains invalid characters (e.g., quotes, semicolons)";
    }
    if (client.business_type.match(/\d/)) {
      return "Please enter characters only in Business Type, numbers not allowed";
    }

    // Business address validation (optional, only length check)
    if (client.business_address) {
      if (client.business_address.length > 200) {
        return "Business Address cannot exceed 200 characters";
      }
      if (client.business_address.match(/['";\\]/)) {
        return "Business Address contains invalid characters (e.g., quotes, semicolons)";
      }
    }

    // Postal code validation (optional, only if provided)
    if (client.postal_code) {
      if (!/^\d+$/.test(client.postal_code)) {
        return "Please enter digits only in Postal code";
      }
      if (!/^\d{5,6}$/.test(client.postal_code)) {
        return "Postal code must be 5 or 6 digits";
      }
    }

    // Status validation (optional, only if explicitly selected)
    if (client.status) {
      const validStatuses = ["Pending", "Verified", "Rejected", "Inactive"];
      if (!validStatuses.includes(client.status)) {
        return "Invalid status selected";
      }
    }

    return "";
  };

  useEffect(() => {
    if (!isNew && oldClient) {
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
            {/* Success/Error Messages */}
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
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
                    d={
                      message.type === "success"
                        ? "M5 13l4 4L19 7"
                        : "M6 18L18 6M6 6l12 12"
                    }
                  />
                </svg>
                {message.text}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="business_name">
                Business Name <span className="text-red-500">*</span>
              </label>
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
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="business_type">
                Business Type <span className="text-red-500">*</span>
              </label>
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
              <label htmlFor="tin">
                Social Security Number (SSN) / TIN{" "}
                <span className="text-red-500">*</span>
              </label>
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
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                value={client.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
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
