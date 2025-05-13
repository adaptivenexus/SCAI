"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

const SharedUserDocuments = () => {
  const [otp, setOtp] = useState("");
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { batchid } = useParams();

  useEffect(() => {
    console.log(batchid);
  }, [batchid]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document-share/batch-access/${batchid}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }
      // // Check if any document is already accessed
      // if (
      //   data.documents.some(
      //     (doc) => doc.access_count > 0 || doc.last_accessed_at
      //   )
      // ) {
      //   setError("Documents already accessed.");
      //   toast.error("Documents no longer available.");
      //   return;
      // }
      setDocuments(data.documents);
      toast.success("Documents accessed successfully!");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // 973508

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-5">Access Shared Documents</h2>
      </div>

      {!documents.length && !error ? (
        <form onSubmit={handleVerify} className="mb-6">
          <div className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-1">
              <label htmlFor="otp" className="font-medium">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="otp"
                className="border rounded-lg p-3 w-full outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
            <button
              type="submit"
              className={`primary-btn ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      ) : null}

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : documents.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-accent-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Access Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Last Accessed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.document_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {doc.document_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {doc.access_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {doc.last_accessed_at
                      ? new Date(doc.last_accessed_at).toLocaleDateString()
                      : "Not accessed"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <a
                      href={doc.s3_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};
export default SharedUserDocuments;
