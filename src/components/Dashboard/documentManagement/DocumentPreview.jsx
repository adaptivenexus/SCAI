"use client";

import { FiDownload } from "react-icons/fi";
import { GrClose } from "react-icons/gr";

const DocumentPreview = ({
  document,
  setIsDocumentPreviewOpen,
  setPreviewDocument,
}) => {
  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const ext = filename.split(".").pop().toLowerCase();
    return ext;
  };

  const getOfficeViewerUrl = (url) => {
    // Force cache bypass with random string and timestamp
    const bypassCache = `${Math.random()
      .toString(36)
      .substring(7)}_${Date.now()}`;
    const urlWithCache = url.includes("?")
      ? `${url}&v=${bypassCache}`
      : `${url}?v=${bypassCache}`;

    // Add cache busting to both the source URL and viewer URL
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      urlWithCache
    )}&v=${bypassCache}&wdAllowInteractivity=True&wopensuccess=1`;
  };

  const renderDocument = () => {
    const url = document;

    const type = getFileType(url);
    const supportedTypes = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

    if (supportedTypes.includes(type)) {
      return (
        <div className="relative w-full h-full">
          <iframe
            src={getOfficeViewerUrl(url)}
            className="w-full h-full rounded-lg"
            title="Document Preview"
            allowFullScreen
          />
          {/* Add a download button */}
          <a
            href={url}
            download
            type="button"
            className="absolute bg-white rounded-full p-2 top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FiDownload className="w-6 h-6" />
          </a>
        </div>
      );
    } else if (type === "pdf") {
      return (
        <div className="relative w-full h-full">
          <iframe
            src={url}
            className="w-full h-full rounded-lg"
            title="Document Preview"
            allowFullScreen
          />
        </div>
      );
    }
  };

  return (
    <div
      onClick={() => {
        setIsDocumentPreviewOpen(false);
        setPreviewDocument(null);
      }}
      className={`${"fixed inset-0 !m-0 z-50 bg-black/50 p-20"}`}
    >
      <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
        <div className="w-full h-full border rounded-lg">
          {renderDocument()}
        </div>
        <button
          onClick={() => {
            setIsDocumentPreviewOpen(false);
            setPreviewDocument(null);
          }}
          type="button"
          className="absolute bg-white rounded-full p-2 top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <GrClose className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;
