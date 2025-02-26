"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const VerifyCode = () => {
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
              <h3 className="heading-3">Verify code</h3>
              <p className="subtitle-text text-secondary-foreground">
                An authentication code has been sent to your email.
              </p>
            </div>
            <form onSubmit={() => {}} className="space-y-7">
              <div className="space-y-4">
                <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex items-center justify-between">
                  <legend className="px-1">Enter Code</legend>
                  <input
                    type={"text"}
                    id="otpCode"
                    name="otpCode"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                  />
                </fieldset>
              </div>
              <div className="space-y-5">
                <p className="text-start">
                  Didn’t receive a code?{" "}
                  <button type="button" className="text-orange-500">
                    Resend
                  </button>
                </p>
                <button
                  type="submit"
                  className="primary-btn bg-primary-gradient w-full"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 rounded-[30px] overflow-hidden hidden md:block">
            <Image
              src={"/verifycode.png"}
              alt={"Login"}
              width={576}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default VerifyCode;
