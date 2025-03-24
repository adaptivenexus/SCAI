"use client";

import DocumentViewer from "../documentManagement/DocumentViewer";

const ManageDocument = ({
  setIsManageDocumentOpen,
  setEditDocument,
  editDocument,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center"
      onClick={() => setIsManageDocumentOpen(false)}
    >
      <div
        className="bg-white rounded-lg space-y-4 p-10 max-w-[1300px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="heading-5 font-bold">Edit Document</h5>
        <form onSubmit={handleSubmit} className="flex flex-col justify-between">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex gap-2">
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="clientName">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    placeholder="Enter client name"
                    value={editDocument.associatedTo.name}
                    onChange={(e) =>
                      setEditDocument({
                        ...editDocument,
                        associatedTo: {
                          ...editDocument.associatedTo,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                    value={editDocument.category}
                    onChange={(e) =>
                      setEditDocument({
                        ...editDocument,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                    <option value="Legal">Legal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentName">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentName"
                  id="documentName"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document name"
                  value={editDocument.documentName}
                  onChange={(e) =>
                    setEditDocument({
                      ...editDocument,
                      documentName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <label htmlFor="documentDate">
                  Document Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="documentDate"
                  id="documentDate"
                  className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                  placeholder="Enter document date"
                  value={editDocument.documentDate}
                  onChange={(e) =>
                    setEditDocument({
                      ...editDocument,
                      documentDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label>Status</label>
                <div className="flex gap-4">
                  <label htmlFor="status1" className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      id="status1"
                      checked={editDocument.status === "Verified"}
                      onChange={() =>
                        setEditDocument({
                          ...editDocument,
                          status: "Verified",
                        })
                      }
                    />
                    <span>Verified</span>
                  </label>
                  <label htmlFor="status2" className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      id="status2"
                      checked={editDocument.status === "Not Verified"}
                      onChange={() =>
                        setEditDocument({
                          ...editDocument,
                          status: "Not Verified",
                        })
                      }
                    />
                    <span>Not Verified</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex-1 h-[70vh]">
              <DocumentViewer document={editDocument.url} />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button type="submit" className="primary-btn px-6 text-lg">
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsManageDocumentOpen(false);
                setEditDocument && setEditDocument(null);
              }}
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

export default ManageDocument;
