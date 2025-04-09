"use client";

import { FaCheckCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCloseCircle } from "react-icons/io5";
import AddNewDocumentModal from "../common/AddDocumentModal";
import { useState } from "react";
import { toast } from "react-toastify";

const ManualDocumentUploadFilesRow = ({
  file,
  index,
  files,
  setFiles,
  setUploadedFilesIndex,
  uploadedFilesIndex,
}) => {
  const [formData, setFormData] = useState({
    client: undefined,
    category_id: undefined,
  });
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataNew = new FormData();
    formDataNew.append("client_id", parseInt(formData.client.id));
    formDataNew.append("category_id", parseInt(formData.category_id));
    formDataNew.append("file", file);
    console.log(formDataNew);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/document/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formDataNew,
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUploadedFilesIndex([...uploadedFilesIndex, index]);
        setIsOpenModal(false);
        toast.success("Document uploaded successfully");
      } else {
        toast.error(data);
        console.log(data);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  return (
    <tr>
      <td className="border-b py-3"></td>
      <td className="border-b py-3 flex items-center gap-2 ">
        <div>
          {uploadedFilesIndex.includes(index) ? (
            <FaCheckCircle className="text-green-500" size={24} />
          ) : (
            <div className="group">
              <AiOutlineLoading3Quarters
                className="animate-spin block group-hover:hidden"
                size={24}
              />
              <button
                type="button"
                onClick={() => {
                  setFiles(files.filter((f) => f !== file));
                }}
                className="group-hover:block hidden"
              >
                <IoCloseCircle size={24} className="text-red-500" />
              </button>
            </div>
          )}
        </div>
      </td>
      <td className="border-b py-3">{file.name}</td>
      <td className="border-b py-3">{(file.size / 1024).toFixed(2)} KB</td>
      <td className="border-b py-3">
        <div>
          {/* <button type="button" className="block ">
                    <GoKebabHorizontal className="rotate-90" size={24} />
                </button> 
            */}
          <button
            type="button"
            onClick={() => {
              setIsOpenModal(true);
            }}
            disabled={uploadedFilesIndex.includes(index)}
            className="text-primary"
          >
            Upload
          </button>
          {isOpenModal && (
            <AddNewDocumentModal
              file={file}
              setIsAddDocumentOpen={setIsOpenModal}
              handleSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
      </td>
    </tr>
  );
};
export default ManualDocumentUploadFilesRow;
