"use client";

import { GrClose } from "react-icons/gr";

const DocumentPreview = ({ document, setIsDocumentPreviewOpen, type }) => {
  const url = document;

  const supportedTypes = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

  if (supportedTypes.includes(type)) {
    // download the file
  } else if (type === "pdf") {
    return (
      <div
        onClick={() => {
          setIsDocumentPreviewOpen(false);
        }}
        className={`${"fixed inset-0 !m-0 z-50 bg-black/50 p-20"}`}
      >
        <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
          <div className="w-full h-full border rounded-lg">
            <div className="relative w-full h-full">
              <iframe
                src={url}
                className="w-full h-full rounded-lg"
                title="Document Preview"
                allowFullScreen
              />
            </div>
          </div>
          <button
            onClick={() => {
              setIsDocumentPreviewOpen(false);
            }}
            type="button"
            className="absolute bg-white rounded-full p-2 top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <GrClose className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }
};

export default DocumentPreview;
