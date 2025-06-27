"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";
import DocumentTopSection from "@/components/Dashboard/documentManagement/view-document/DocumentTopSection";
import DocumentPreview from "@/components/Dashboard/documentManagement/view-document/DocumentPreview";
import DocumentSummary from "@/components/Dashboard/documentManagement/view-document/DocumentSummary";
import { useParams } from "next/navigation";
import { extractFilenameFromUrl, formatDate } from "@/utils";

const DocumentViewPage = () => {
  const { refreshTokenFn } = useAuth();
  const params = useParams();
  const documentId = params.id;

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