"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import DocumentTopSection from "@/components/Dashboard/documentManagement/view-document/DocumentTopSection";
import DocumentPreview from "@/components/Dashboard/documentManagement/view-document/DocumentPreview";
import DocumentSummary from "@/components/Dashboard/documentManagement/view-document/DocumentSummary";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { extractFilenameFromUrl, formatDate } from "@/utils";

const DocumentViewPage = () => {
  const { refreshTokenFn } = useAuth();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = params.id;
  const showVerifyModal = searchParams.get('verify') === '1';

  const [document, setDocument] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocumentAndParsedData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch document
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${documentId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
          refreshTokenFn
        );
        if (!res.ok) throw new Error("Failed to fetch document");
        const docData = await res.json();
        setDocument(docData);

        // Fetch parsed data
        const parsedRes = await authFetch(
          `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${documentId}/parsed-data/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
          refreshTokenFn
        );
        if (!parsedRes.ok) throw new Error("Failed to fetch parsed data");
        const parsedDataJson = await parsedRes.json();
        setParsedData(parsedDataJson.parsed_data || {});
      } catch (err) {
        setError(err.message || "Failed to fetch document");
      } finally {
        setLoading(false);
      }
    };
    if (documentId) fetchDocumentAndParsedData();
  }, [documentId, refreshTokenFn]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!document) return <div className="p-6">No document found.</div>;

  if (showVerifyModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] max-w-[90vw] relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={() => router.replace(`/dashboard/document-management/view-document/${documentId}`)}
          >
            ×
          </button>
          <h3 className="text-lg font-bold mb-4">Verify Document</h3>
          <pre className="text-xs bg-gray-100 rounded p-2 overflow-x-auto max-h-60 mb-4">
            {JSON.stringify(document, null, 2)}
          </pre>
          <div className="flex gap-2">
            <button
              className="primary-btn px-6 text-lg"
              onClick={async () => {
                // Mark as verified (update is_verified)
                try {
                  await fetch(`${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/${documentId}/`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({ ...document, is_verified: true }),
                  });
                  alert("Document verified successfully!");
                  router.replace(`/dashboard/document-management/view-document/${documentId}`);
                } catch (error) {
                  alert("Error verifying document");
                }
              }}
            >
              Mark as Verified
            </button>
            <button
              className="primary-btn bg-slate-500 px-6 text-lg"
              onClick={() => router.replace(`/dashboard/document-management/view-document/${documentId}`)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col">
      <h2 className="heading-5 mb-6">Document Preview</h2>
      <DocumentTopSection
        clientName={document.client}
        documentName={parsedData?.parsed_data?.suggested_title ||
                      extractFilenameFromUrl(document.file)}
        category={document.category?.name || parsedData?.parsed_data?.document_type}
        documentDate={parsedData?.document_date}
        processDate={formatDate(document.uploaded_at)}
        documentId={document.id}
      />
      <div className="flex mt-6">
        <div className="w-1/2">
          <DocumentPreview document={{ file: document.file }} />
        </div>
        <div className="w-1/2 pl-6">
          <DocumentSummary document={{ document, parsed_data: parsedData }} />
        </div>
      </div>
    </div>
  );
};

export default DocumentViewPage;