"use client";

import FileUploader from "@/components/Dashboard/OverviewComponents/DragAndDropFile";
import { GoSearch } from "react-icons/go";

import { useState } from "react";
import DocumentUploadRow from "@/components/Dashboard/documentManagement/DocumentUploadRow";
import Link from "next/link";

const AddDocument = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFilesIndex, setUploadedFilesIndex] = useState([]);

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="bg-white p-8 shadow-md rounded-xl">
        <FileUploader setFiles={setFiles} files={files} />
      </div>
      {files.length > 0 && (
        <div className="bg-white p-8 shadow-md rounded-xl flex flex-col items-end gap-5">
          <div className="flex items-center justify-between w-full">
            <h5 className="heading-5">Process</h5>
            {/* <div className="flex gap-2">
            <button type="button" className="primary-btn">
              Pause All
            </button>
            <button type="button" className="primary-btn">
              Cancel All
            </button>
          </div> */}
          </div>

          <div className="w-full flex items-center justify-between bg-accent-primary p-4 rounded-xl">
            <p className="subtitle-text">Scanning</p>
            <div className="flex items-center gap-2">
              <span>
                {uploadedFilesIndex.length}/{files.length} Scanned
              </span>
              <div className="border h-4 w-[300px] rounded-full bg-white overflow-hidden">
                <div
                  className="bg-primary h-full"
                  style={{
                    width: `${
                      files.length < 1
                        ? 0
                        : (uploadedFilesIndex.length / files.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {files.length > 0 && (
        <div className="bg-white p-8 shadow-md rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="heading-5">Files</h5>
            {/* search bar */}
            <div className="flex items-center gap-2">
              <Link
                href={"/dashboard/document-management/all-documents"}
                className="primary-btn"
              >
                View All Documents
              </Link>

              <label
                htmlFor="search"
                className="w-[300px] bg-[#F6F7FB] rounded-xl border p-2 flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search File"
                  className="flex-1 bg-transparent outline-none placeholder:text-secondary-foreground"
                />
                <button type="button" className="block">
                  <GoSearch size={24} />
                </button>
              </label>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-start border-b py-3"></th>
                <th className="text-start border-b py-3">Status</th>
                <th className="text-start border-b py-3">Name</th>
                <th className="text-start border-b py-3">Size</th>
                <th className="text-start border-b py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files &&
                files.map((file, index) => {
                  return (
                    <DocumentUploadRow
                      key={index}
                      file={file}
                      setUploadedFilesIndex={setUploadedFilesIndex}
                      uploadedFilesIndex={uploadedFilesIndex}
                      index={index}
                      files={files}
                      setFiles={setFiles}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AddDocument;
