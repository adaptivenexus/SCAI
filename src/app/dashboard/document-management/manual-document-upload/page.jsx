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
        {/* <form onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="client_id">Client</label>
            <input
              type="number"
              name="client_id"
              id="client_id"
              className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none w-full"
              placeholder="Client"
              value={formData.client_id == undefined ? 0 : formData.client_id}
              onChange={(e) =>
                setFormData({ ...formData, client_id: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <label htmlFor="category_id">Category</label>
            <input
              type="number"
              name="category_id"
              id="category_id"
              className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none w-full"
              placeholder="Category"
              value={
                formData.category_id == undefined ? 0 : formData.category_id
              }
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <label htmlFor="file">Document</label>
            <input
              type="file"
              name="file"
              id="file"
              className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none w-full"
              placeholder="Document"
              onChange={(e) => setFiles(e.target.files)}
              required
            />
          </div>
          <button type="submit" className="primary-btn">
            Submit
          </button>
        </form> */}
        <FileUploader setFiles={setFiles} />
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
