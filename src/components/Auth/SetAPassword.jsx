"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const SetAPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <div className="space-y-8 bg-white p-10 md:p-20 rounded-2xl shadow-lg">
        <div>
          <Link
            href="/"
            className="flex gap-2 items-center bg-slate-50 rounded-full w-max px-4 py-1 border"
          >
            <FaArrowLeft />
            <span>Back</span>
          </Link>
        </div>
        <div className="flex gap-10 items-center ">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h3 className="heading-3">Set a password</h3>
              <p className="subtitle-text text-secondary-foreground">
                Your previous password has been reseted.  set a new
                password for your account.
              </p>
            </div>
            <form onSubmit={() => {}} className="space-y-7">
              <div className="space-y-4">
                <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex items-center justify-between">
                  <legend className="px-1">
                    Password<span className="text-red-500">*</span>
                  </legend>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <IoIosEyeOff size={24} />
                    ) : (
                      <IoIosEye size={24} />
                    )}
                  </button>
                </fieldset>
                <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex items-center justify-between">
                  <legend className="px-1">
                    Confirm Password<span className="text-red-500">*</span>
                  </legend>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? (
                      <IoIosEyeOff size={24} />
                    ) : (
                      <IoIosEye size={24} />
                    )}
                  </button>
                </fieldset>
              </div>
              <div className="space-y-5">
                <button
                  type="submit"
                  className="primary-btn bg-primary-gradient w-full"
                >
                  Set Password
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 rounded-[30px] overflow-hidden hidden md:block">
            <Image
              src={"/setpassword.png"}
              alt={"Login"}
              width={576}
              height={444}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default SetAPassword;
