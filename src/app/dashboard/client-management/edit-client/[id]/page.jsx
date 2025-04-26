"use client";

import { MdDateRange } from "react-icons/md";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const EditClient = () => {
  const router = useRouter();
  const { id } = useParams(); // For App Router

  const [formData, setFormData] = useState({
    id: ``,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    telephoneNumber: "",
    email: "",
    dateOfBirth: "",
    licenceNumber: "",
    passportNumber: "",
    businessName: "",
    businessType: "",
    socialSecurityNumber: "",
    status: "",
    businessAddress: "",
  });

  const [loading, setLoading] = useState(true);

  console.log(`Fetching: http://localhost:8080/api/clients/${id}`);

  useEffect(() => {
    async function fetchClient() {
      try {
        console.log(`Fetching: http://localhost:8080/api/clients/${id}`);
        const response = await fetch(`http://localhost:8080/api/clients/${id}`);
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching client:", error);
        setLoading(false);
      }
    }
    if (id) fetchClient();
  }, [id]);

  const handleChange = (e) => {
    console.log(`Fetching: http://localhost:8080/api/clients/${id}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8080/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Client updated successfully!");
      router.push("/dashboard/client-management/client-list");
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center">
      <div className="bg-white rounded-lg p-10 space-y-4 w-2/5 relative">
        <h5 className="heading-5 font-bold">Edit Client</h5>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
          className="space-y-4"
        >
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="emailAddress">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your First Name"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="phoneNumber">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Last Number"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="phoneNumber">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobileNumber"
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Mobile Number"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="phoneNumber">
                Telephone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telephoneNumber"
                id="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleChange}
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Telephone Number"
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
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="DOB">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-lg p-3 flex items-center justify-between">
                <input
                  type="text"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  placeholder="dd/mm/yyyy"
                  className="placeholder:text-secondary placeholder:font-medium w-full outline-none"
                />
                <button type="button">
                  <MdDateRange size={32} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="securityNumber">
                Passport Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="passportNumber"
                id="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter SSN / TIN number"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="businessName">
                Licence Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="licenceNumber"
                id="licenceNumber"
                value={formData.licenceNumber}
                onChange={handleChange}
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter licence number"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="securityNumber">
                Social Security Number (SSN) / TIN{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="socialSecurityNumber"
                id="socialSecurityNumber"
                value={formData.socialSecurityNumber}
                onChange={handleChange}
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter SSN / TIN number"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="businessName">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="border rounded-lg p-3 outline-none text-secondary font-medium"
              >
                <option value="Verified">Verified</option>
                <option value="Not Verified">Not Verified</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="businessName">
                Business Name (optional) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                id="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter business name"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="securityNumber">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType"
                id="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="border rounded-lg p-3 outline-none text-secondary font-medium"
              >
                <option hidden disabled className="text-secondary font-medium">
                  Select business type
                </option>
                <option value="limitedliability">
                  Limited Liability Company
                </option>
                <option value="soleproprietorship">Sole proprietorship</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <label htmlFor="homeAddress">Business Address (Optional)</label>
            <textarea
              name="businessAddress"
              id="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              rows={3}
              className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
              placeholder="Enter your business address"
            ></textarea>
          </div>
          <div className="flex gap-2 items-center">
            <button type="submit" className="primary-btn px-6 text-lg">
              Submit
            </button>
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/client-management/client-list")
              }
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
export default EditClient;