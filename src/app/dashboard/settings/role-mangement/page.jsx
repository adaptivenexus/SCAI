"use client";
import { HiChevronUpDown } from "react-icons/hi2";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoFilterSharp } from "react-icons/io5";
import Image from "next/image";

const RoleMangementPage = () => {
  return (
    <div className=" w-full p-6 bg-white shadow-lg space-y-6 rounded-xl border">
      <div className="space-y-2 flex justify-between gap-3">
        <div className="space-y-2">
          <h4 className="heading-4">Project members</h4>
          <p className="subtitle-text text-secondary-foreground">
            Project members can be given access to data in the project. Users
            with the "Viewer" role do not consume seats.
          </p>
        </div>
        <div>
          <button className="primary-btn h-max w-max ">+ Add Members</button>
          <div className="flex flex-col items-end mt-4 gap-2">
            <h2 className="heading-5 text-foreground">5 of 20 </h2>
            <p className="body-text text-secondary-foreground ">User Seats </p>
            <h2 className="body-text text-secondary-foreground ">
              20 included in plan
            </h2>
            <h2 className="body-text text-primary ">Get More Seats</h2>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search for name or email"
          className="px-3 py-2 border rounded-md w-full focus:outline-primary "
        />
        <button className="p-2 border rounded bg-accent-secondary ">
          <IoFilterSharp className="h-5 w-5" />
        </button>
      </div>
      <table className="w-full text-center border-separate border-spacing-y-2">
        <thead>
          <tr className="text-forground body-text ">
            <th className="text-start">Member</th>
            <th className="text-center">Roles</th>
            <th>Added</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, idx) => (
            <tr key={idx} className="bg-white border-b">
              <td className="flex items-center gap-3 py-4">
                <Image
                  src="/user.jpg" 
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full aspect-square object-cover"
                />
                <div>
                  <div className="text-forground label-text text-start">
                    Jack Reid
                  </div>
                  <div className="text-secondary-foreground label-text">
                    JackReid123@gmail.com
                  </div>
                </div>
              </td>
              <td className="text-forground label-text   ">
                <div className="flex items-center justify-center gap-1">
                  Administrator
                  <HiChevronUpDown className="text-primary w-5 h-5 cursor-pointer" />
                </div>
              </td>
              <td className="text-forground label-text">2 hours ago</td>
              <td className="text-forground label-text">51 minutes ago</td>
              <td>
                <div className="flex items-center justify-center gap-1">
                  <HiOutlineDotsVertical className="text-primary w-5 h-5 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleMangementPage;
