"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

export default function FileUploader({ setFiles }) {
  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  // Remove file
  const removeFile = (name) => {
    setFiles(files.filter((file) => file.name !== name));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    //   "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    //   "application/pdf": [".pdf"],
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    //     ".xlsx",
    //   ],
    // },
    multiple: true,
  });

  return (
    <div className="w-full !h-full">
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className={`w-full !h-full rounded-xl !flex !flex-col !items-center !justify-center cursor-pointer transition-all ${
          isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <FiUploadCloud className="w-10 h-10 text-gray-500 mb-2" />
          <p className="text-gray-600">
            {isDragActive
              ? "Drop your files here"
              : "Drag & Drop files or click to upload"}
          </p>
          <p>Or</p>
          <p className="bg-foreground text-background px-6 py-3 rounded-full">
            Click to Upload Documents
          </p>
        </div>
      </div>
    </div>
  );
}
