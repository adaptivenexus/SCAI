"use client";

import { useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GlobalContext } from "@/context/GlobalProvider";
import { toast } from "react-toastify";
import { authFetch } from "@/utils/auth";
import { extractEmail } from "@/utils";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
};

const DocumentShareModal = ({ setIsShareDocumentOpen, docs, handleReset }) => {
  const { user, refreshTokenFn } = useAuth();
  const { clients } = useContext(GlobalContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    expired_at: addHoursToCurrentTime(1),
    shared_by_agency: user.id,
    client_email: "",
    external_email: "",
  });
  const [emailError, setEmailError] = useState("");
  const [externalEmailError, setExternalEmailError] = useState("");
  const [loading, startTransition] = useTransition();
  const [parsedDataMap, setParsedDataMap] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [shareToExternal, setShareToExternal] = useState("no");

  const clientEmail = extractEmail(docs[0].client);
  const clientName = docs[0]?.client?.replace(/\s*\(.*?\)\s*$/, "") || "N/A";
  const clientId = clients.find((client) => clientEmail === client.email).id;

  const fetchParsedData = async (docId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${docId}/parsed-data/`,
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
        return data.parsed_data;
      } else {
        console.log("Error fetching parsed data:", response.statusText);
        return {};
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
      return {};
    }
  };

  useEffect(() => {
    const fetchAllParsedData = async () => {
      setIsFetching(true);
      const parsedDataPromises = docs.map(async (doc) => {
        const parsedData = await fetchParsedData(doc.id);
        return { id: doc.id, parsedData };
      });

      const results = await Promise.all(parsedDataPromises);
      const parsedDataMap = results.reduce((acc, { id, parsedData }) => {
        acc[id] = parsedData;
        return acc;
      }, {});
      setParsedDataMap(parsedDataMap);
      setIsFetching(false);
    };

    if (docs && docs.length > 0) fetchAllParsedData();
  }, [docs]);

  function addHoursToCurrentTime(hours) {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + hours);
    return currentTime.toISOString();
  }

  const extractFileName = (url) => {
    if (!url || typeof url !== "string") {
      toast.error("Document file is missing. Cannot share this document.");
      throw new Error("Document file is missing");
    }
    try {
      const parts = url.split("/");
      let fileName = parts[parts.length - 1];
      fileName = fileName.split("?")[0];
      fileName = decodeURIComponent(fileName);
      if (!fileName) {
        toast.error("Document file name is invalid. Cannot share this document.");
        throw new Error("Document file name is invalid");
      }
      return fileName;
    } catch (error) {
      console.error("Error extracting file name:", error);
      throw error;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      if (!docs || docs.length === 0) {
        toast.error("No documents selected to share.");
        return;
      }

      const emailErr = validateEmail(formData.client_email);
      if (emailErr) {
        setEmailError(emailErr);
        toast.error(emailErr);
        return;
      }

      if (shareToExternal === "yes") {
        const externalEmailErr = validateEmail(formData.external_email);
        if (externalEmailErr) {
          setExternalEmailError(externalEmailErr);
          toast.error(externalEmailErr);
          return;
        }
      }

      try {
        const accessToken = localStorage.getItem("accessToken");
        const shareDoc = {
          document_ids: docs.map((doc) => doc.id),
          client_id: clientId,
          agency_id: user.id,
        };

        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document-share/generate-batch-link/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(shareDoc),
          },
          refreshTokenFn
        );

        if (!res.ok) {
          const errorData = await res.json();
          toast.error(errorData.message || "Failed to share documents.");
          return;
        }

        const data = await res.json();
        const urlParts = data.shareable_url.split("/");
        const sharedID = urlParts[urlParts.length - 2];
        const sharedLink = `${process.env.NEXT_PUBLIC_BASE_URL}/shared-documents/${sharedID}`;

        // Send email to client
        const sendEmailToClient = await fetch(`/api/share-document-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clientName,
            email: formData.client_email,
            url: sharedLink,
          }),
        });

        if (!sendEmailToClient.ok) {
          toast.error("Failed to send email to client.");
          return;
        }

        // Send email to external email if selected
        if (shareToExternal === "yes") {
          const sendEmailToExternal = await fetch(`/api/share-document-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Recipient",
              email: formData.external_email,
              url: sharedLink,
            }),
          });

          if (!sendEmailToExternal.ok) {
            toast.error("Failed to send email to external recipient.");
            return;
          }
        }

        toast.success(`Document shared successfully to ${docs[0]?.client || "Client"}`);
        setIsShareDocumentOpen(false);
        handleReset();
        setTimeout(() => router.push("/dashboard/shared-doc"), 2000);
      } catch (error) {
        console.error("Error sharing documents:", error);
        toast.error("Something went wrong while sharing documents.");
      }
    });
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, client_email: clientEmail }));
  }, [clientEmail]);

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center z-10"
      onClick={() => setIsShareDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[1000px] w-full min-h-[500px] relative mt-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5 mb-4">Share Document</h5>
        <div className="flex gap-6">
          <div className="w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium">Client Name:</label>
              <span>{clientName || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="client_email" className="font-medium">
                Client Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="client_email"
                id="client_email"
                className="border rounded-lg p-3 w-full outline-none"
                value={formData.client_email}
                placeholder="Enter client email"
                required
                onChange={(e) => {
                  setFormData({ ...formData, client_email: e.target.value });
                  setEmailError("");
                }}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">
                Do you want to share documents to any other email?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="shareToExternal"
                    value="yes"
                    checked={shareToExternal === "yes"}
                    onChange={() => setShareToExternal("yes")}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="shareToExternal"
                    value="no"
                    checked={shareToExternal === "no"}
                    onChange={() => {
                      setShareToExternal("no");
                      setFormData({ ...formData, external_email: "" });
                      setExternalEmailError("");
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            {shareToExternal === "yes" && (
              <div className="flex flex-col gap-1">
                <label htmlFor="external_email" className="font-medium">
                  External Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="external_email"
                  id="external_email"
                  className="border rounded-lg p-3 w-full outline-none"
                  value={formData.external_email}
                  placeholder="Enter external email"
                  onChange={(e) => {
                    setFormData({ ...formData, external_email: e.target.value });
                    setExternalEmailError("");
                  }}
                />
                {externalEmailError && (
                  <p className="text-red-500 text-sm mt-1">{externalEmailError}</p>
                )}
              </div>
            )}
            <button
              onClick={handleSubmit}
              className={`primary-btn mt-4 ${
                !docs || docs.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!docs || docs.length === 0}
            >
              Confirm Share
            </button>
          </div>
          <div className="w-1/2 flex flex-col gap-1">
            <label className="font-medium">Documents ({docs.length}):</label>
            <div className="max-h-[300px] overflow-y-auto border rounded-lg p-4">
              {isFetching ? (
                <p>Loading document dates...</p>
              ) : (
                <div className="flex flex-col">
                  {docs.map((doc, index) => (
                    <div
                      key={index}
                      className={` ${
                        docs.length !== index && "border-b border-slate-300"
                      } py-4`}
                    >
                      <p className="font-semibold text-lg">
                        {extractFileName(doc.file)} (Date:{" "}
                        {formatDate(parsedDataMap[doc.id]?.document_date)})
                      </p>
                      <p>{parsedDataMap[doc.id]?.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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