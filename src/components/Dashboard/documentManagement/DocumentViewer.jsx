"use client";

import { useState } from "react";
import {
  FiMaximize2,
  FiMinimize2,
  FiUpload,
  FiTrash2,
  FiFile,
  FiDownload,
} from "react-icons/fi";

const DocumentViewer = ({ document, onFileSelect, onDelete }) => {
  const [isFullView, setIsFullView] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const ext = filename.split(".").pop().toLowerCase();
    return ext;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect && onFileSelect(file);
    }
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
    const url = previewUrl || document;
    if (!url) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-lg">
          <div className="text-center">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <FiUpload className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Upload Document
                <br />
                <span className="text-xs text-gray-400">
                  (PDF, Word, Excel, etc.)
                </span>
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      );
    }

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
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 text-red-500"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
            <label
              htmlFor="file-upload"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer"
            >
              <FiUpload className="w-5 h-5" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </label>
            <a
              href={url}
              download
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer"
            >
              <FiDownload className="w-5 h-5" />
            </a>
          </div>
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
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 text-red-500"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
            <label
              htmlFor="file-upload"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer"
            >
              <FiUpload className="w-5 h-5" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </label>
            <a
              href={url}
              download
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer"
            >
              <FiDownload className="w-5 h-5" />
            </a>
          </div>
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-center p-8 rounded-lg w-full">
          <FiFile className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
          <p className="text-sm text-gray-600 mb-4">
            {url.split("/").pop()} ({type.toUpperCase()})
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Preview not available for this file type
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={url}
              download
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FiDownload /> Download
            </a>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        isFullView ? "fixed inset-0 !m-0 z-50 bg-white p-4" : "h-64"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full h-full border rounded-lg">
        {renderDocument()}
        <button
          type="button"
          onClick={() => setIsFullView(!isFullView)}
          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
        >
          {isFullView ? (
            <FiMinimize2 className="w-5 h-5" />
          ) : (
            <FiMaximize2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentViewer;
