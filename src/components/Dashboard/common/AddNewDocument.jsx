import FileUploader from "../OverviewComponents/DragAndDropFile";

const AddNewDocument = ({ setIsAddDocumentOpen }) => {
  return (
    <div className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center">
      <div className="bg-white rounded-lg p-10 space-y-4 w-2/5 relative">
        <h5 className="heading-5 font-bold">Add New Document</h5>
        <div className="border rounded-xl px-4 py-10 ">
          <FileUploader />
        </div>
        <div className="flex gap-2 items-center">
          <button type="submit" className="primary-btn px-6 text-lg">
            Submit
          </button>
          <button
            type="button"
            onClick={() => setIsAddDocumentOpen(false)}
            className="primary-btn bg-slate-500 px-6 text-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddNewDocument;
