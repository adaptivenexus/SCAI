import { MdDateRange } from "react-icons/md";

const AddNewClient = ({ setIsAddClientOpen }) => {
  return (
    <div className="flex fixed top-0 inset-0 bg-black bg-opacity-50 !m-0 items-center justify-center">
      <div className="bg-white rounded-lg p-10 space-y-4 w-2/5 relative">
        <h5 className="heading-5 font-bold">Add New Client</h5>
        <form className="space-y-4">
          <div className="flex flex-col flex-1 gap-1">
            <label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
              placeholder="Enter Your Fullname"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="emailAddress">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emailAddress"
                id="emailAddress"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter Your Phone Number"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="DOB">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-lg p-3 flex items-center justify-between">
                <input
                  type="text"
                  name="DOB"
                  id="DOB"
                  placeholder="dd/mm/yyyy"
                  className="placeholder:text-secondary placeholder:font-medium w-full outline-none"
                />
                <button type="button">
                  <MdDateRange size={32} />
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="securityNumber">
                Social Security Number (SSN) / TIN{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="securityNumber"
                id="securityNumber"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter SSN / TIN number"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="alternatePhone">
                Alternate Phone Number (Optional)
              </label>
              <input
                type="text"
                name="alternatePhone"
                id="alternatePhone"
                placeholder="Enter Alternate number"
                className="border rounded-lg p-3  placeholder:text-secondary placeholder:font-medium w-full outline-none"
              />
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="businessName">
                Business Name (optional) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                id="businessName"
                className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
                placeholder="Enter business name"
              />
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <label htmlFor="businessType">Business Type (optional)</label>
            <select
              name="businessType"
              id="businessType"
              className="border rounded-lg p-3 outline-none text-secondary font-medium"
            >
              <option hidden disabled className="text-secondary font-medium">
                Select business type
              </option>
              <option value="limitedliability">
                Limited Liability Company
              </option>
              <option value="soleproprietorship">Sole proprietorship</option>
            </select>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <label htmlFor="homeAddress">Home Address (Optional)</label>
            <textarea
              name="homeAddress"
              id="homeAddress"
              rows={3}
              className="border rounded-lg p-3 placeholder:text-secondary placeholder:font-medium outline-none"
              placeholder="Enter your address"
            ></textarea>
          </div>
          <div className="flex gap-2 items-center">
            <button type="submit" className="primary-btn px-6 text-lg">
              Submit
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddClientOpen(false);
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
export default AddNewClient;
