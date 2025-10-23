"use client";

import { MdDateRange } from "react-icons/md";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const EditClient = () => {
  const router = useRouter();
  const { id } = useParams(); // For App Router
  const searchParams = useSearchParams();
  const showVerifyModal = searchParams.get('verify') === '1';

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

  // Modal for verification
  if (showVerifyModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] max-w-[90vw] relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={() => router.replace(`/dashboard/client-management/edit-client/${id}`)}
          >
            ×
          </button>
          <h3 className="text-lg font-bold mb-4">Verify Client</h3>
          <pre className="text-xs bg-gray-100 rounded p-2 overflow-x-auto max-h-60 mb-4">
            {JSON.stringify(formData, null, 2)}
          </pre>
          <div className="flex gap-2">
            <button
              className="primary-btn px-6 text-lg"
              onClick={async () => {
                // Mark as verified (update status)
                try {
                  await fetch(`http://localhost:8080/api/clients/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, status: "Verified" }),
                  });
                  alert("Client verified successfully!");
                  router.replace(`/dashboard/client-management/edit-client/${id}`);
                } catch (error) {
                  alert("Error verifying client");
                }
              }}
            >
              Mark as Verified
            </button>
            <button
              className="primary-btn bg-slate-500 px-6 text-lg"
              onClick={() => router.replace(`/dashboard/client-management/edit-client/${id}`)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default edit form
  return (
    <div className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center">
      <div className="bg-white rounded-lg p-10 space-y-4 w-2/5 relative">
        <h5 className="heading-5 font-bold">Edit Client</h5>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
          className="space-y-4"
        >
          {/* ...existing code... */}
          {/* The rest of the form remains unchanged */}
          {/* ...existing code... */}
        </form>
      </div>
    </div>
  );
};
export default EditClient;