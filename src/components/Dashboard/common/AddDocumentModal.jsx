"use client";

import DocumentViewer from "../documentManagement/DocumentViewer";

const AddNewDocumentModal = ({
  file,
  setIsAddDocumentOpen,
  handleSubmit,
  formData,
  setFormData,
}) => {
  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center"
      onClick={() => setIsAddDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[1300px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5 font-bold">Add Document</h5>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col justify-between"
        >
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex gap-2">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="client_id">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="client_id"
                    id="client_id"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    placeholder="Enter client name"
                    onChange={handleOnChange}
                    value={
                      formData.client_id === undefined ? 0 : formData.client_id
                    }
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="category_id">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="category_id"
                    id="category_id"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    placeholder="Enter Category"
                    onChange={handleOnChange}
                    value={
                      formData.category_id === undefined
                        ? 0
                        : formData.category_id
                    }
                  />
                  {/* <select
                    name="category"
                    id="category"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    value={
                      formData.category === undefined ? "" : formData.category
                    }
                    onChange={handleOnChange}
                  >
                    <option value="">Select Category</option>
                    <option value="1">Personal</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="Legal">Legal</option>
                    <option value="Other">Other</option>
                  </select> */}
                </div>
              </div>
              {/* <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentName">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentName"
                  id="documentName"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document name"
                />
              </div> */}
              {/* <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentDate">
                  Document Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="documentDate"
                  id="documentDate"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document date"
                />
              </div> */}

              {/* <div className="flex flex-col gap-1">
                <label>Status</label>
                <div className="flex gap-4">
                  <label htmlFor="status1" className="flex items-center gap-2">
                    <input type="radio" name="status" id="status1" />
                    <span>Verified</span>
                  </label>
                  <label htmlFor="status2" className="flex items-center gap-2">
                    <input type="radio" name="status" id="status2" />
                    <span>Not Verified</span>
                  </label>
                </div>
              </div>*/}
            </div>
            <div className="flex-1 h-[70vh]">
              <h2 className="text-lg text-center font-medium mb-4">Preview</h2>
              <DocumentViewer document={file.preview} />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button type="submit" className="primary-btn px-6 text-lg">
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAddDocumentOpen(false)}
              className="primary-btn bg-slate-500 px-6 text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDocumentModal;
