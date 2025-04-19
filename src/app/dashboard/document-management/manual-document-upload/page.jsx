"use client";
import { GoSearch } from "react-icons/go";
import { useState } from "react";
import FileUploader from "@/components/Dashboard/OverviewComponents/DragAndDropFile";
import ManualDocumentUploadFilesRow from "@/components/Dashboard/documentManagement/ManualDocumentUploadFilesRow";

const ManualDocumentUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFilesIndex, setUploadedFilesIndex] = useState([]);

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="bg-white p-8 shadow-md rounded-xl">
        <FileUploader setFiles={setFiles} files={files} />
      </div>

      <div className="bg-white p-8 shadow-md rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="heading-5">Files</h5>
          {/* search bar */}
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
                  <ManualDocumentUploadFilesRow
                    key={index}
                    file={file}
                    index={index}
                    files={files}
                    setFiles={setFiles}
                    setUploadedFilesIndex={setUploadedFilesIndex}
                    uploadedFilesIndex={uploadedFilesIndex}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManualDocumentUpload;

// <tr>
// <td className="border-b py-3"></td>
// <td className="border-b py-3 flex items-center gap-2 ">
//   <div className="group">
//     <AiOutlineLoading3Quarters
//       className="animate-spin block group-hover:hidden"
//       size={24}
//     />
//     <button className="group-hover:block hidden">
//       <IoCloseCircle size={24} className="text-red-500" />
//     </button>
//   </div>
//   <span>12/2/2024</span>
// </td>
// <td className="border-b py-3">invoice.pdf</td>
// <td className="border-b py-3">2.5 MB</td>
// <td className="border-b py-3">
//   <button type="button" className="block ">
//     <GoKebabHorizontal className="rotate-90" size={24} />
//   </button>
// </td>
// </tr>
