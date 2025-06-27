import React from 'react';
import Link from 'next/link';

const DocumentTopSection = ({ clientName, documentName, category, documentDate, processDate, documentId }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-start justify-between gap-12">
      <div>
        {/* <h2 className="text-lg font-semibold">Document Details</h2> */}
        <div className="grid grid-cols-2 gap-x-24 gap-y-4 mt-2">
          <div>
            <strong>Client Name:</strong> {clientName}
          </div>
          <div>
            <strong>Document Name:</strong> {documentName}
          </div>
          <div>
            <strong>Category:</strong> {category}
          </div>
          <div>
            <strong>Document Date:</strong> {documentDate}
          </div>
          <div>
            <strong>Process Date:</strong> {processDate}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 min-w-max ml-16">
        <Link className="primary-btn"
          href="/dashboard/document-management/all-documents"
        >
          Back to All Documents
        </Link>
        {/* <Link className="primary-btn"
          href={`/dashboard/document-management/edit-document/${documentId}`}
        >
          Edit Document
        </Link> */}
      </div>
    </div>
  );
};

export default DocumentTopSection;