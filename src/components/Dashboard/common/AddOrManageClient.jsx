"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AddOrManageClient = ({
  setIsAddClientOpen,
  isNew,
  oldClient,
  setEditClient,
}) => {
  const [client, setClient] = useState({
    FIRST_NAME: "",
    LAST_NAME: "",
    LICENSE_NUMBER: "",
    PASSPORT: "",
    ADDRESS: "",
    BUSINESS_NAME: "",
    BUSINESS_ADDRESS: "",
    MOBILE_NUMBER: "",
    TELEPHONE_NUMBER: "",
    WORK_CONTACT_NUMBER: "",
    EMAIL: "",
    DATE_OF_BIRTH: "",
    SOCIAL_SECURITY_NUMBER: "",
    AVATAR: "",
    DOCUMENTS: 0,
    CREATED_AT: "",
    STATUS: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsAddClientOpen(false);
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
          <div className="flex gap-2">
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
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="emailAddress">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emailAddress"
                id="emailAddress"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Email"
                value={client.EMAIL}
                onChange={(e) =>
                  setClient({ ...client, EMAIL: e.target.value })
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
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="securityNumber">
                Social Security Number (SSN) / TIN
              </label>
              <input
                type="text"
                name="securityNumber"
                id="securityNumber"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter SSN / TIN number"
                value={client.SOCIAL_SECURITY_NUMBER}
                onChange={(e) =>
                  setClient({
                    ...client,
                    SOCIAL_SECURITY_NUMBER: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="mobileNumber">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobileNumber"
                id="mobileNumber"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Mobile Number"
                value={client.MOBILE_NUMBER}
                onChange={(e) =>
                  setClient({ ...client, MOBILE_NUMBER: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="workContactNumber">Work Contact Number</label>
              <input
                type="text"
                name="workContactNumber"
                id="workContactNumber"
                placeholder="Enter Work Contact number"
                className="border rounded-lg p-3  placeholder:text-secondary placeholder:font-medium w-full outline-none"
                value={client.WORK_CONTACT_NUMBER}
                onChange={(e) =>
                  setClient({
                    ...client,
                    WORK_CONTACT_NUMBER: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="telephoneNumber">Telephone Number</label>
              <input
                type="text"
                name="telephoneNumber"
                id="telephoneNumber"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium w-full outline-none"
                placeholder="Enter Telephone number"
                value={client.TELEPHONE_NUMBER}
                onChange={(e) =>
                  setClient({
                    ...client,
                    TELEPHONE_NUMBER: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="DOB">Date of Birth</label>
              <div className="border rounded-lg p-3 flex items-center justify-between">
                <input
                  type="date"
                  name="DOB"
                  id="DOB"
                  className="placeholder:text-secondary placeholder:font-medium w-full outline-none"
                  value={client.DATE_OF_BIRTH}
                  onChange={(e) =>
                    setClient({ ...client, DATE_OF_BIRTH: e.target.value })
                  }
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
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                name="businessName"
                id="businessName"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter business name"
                value={client.BUSINESS_NAME}
                onChange={(e) =>
                  setClient({
                    ...client,
                    BUSINESS_NAME: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                id="address"
                rows={3}
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter your address"
                value={client.ADDRESS}
                onChange={(e) =>
                  setClient({
                    ...client,
                    ADDRESS: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="businessAddress">Business Address</label>
              <textarea
                name="businessAddress"
                id="businessAddress"
                rows={3}
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter your business address"
                value={client.BUSINESS_ADDRESS}
                onChange={(e) =>
                  setClient({
                    ...client,
                    BUSINESS_ADDRESS: e.target.value,
                  })
                }
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
      </div>
    </div>
  );
};
export default AddOrManageClient;
