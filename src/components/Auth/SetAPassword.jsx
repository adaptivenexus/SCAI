"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const SetAPassword = () => {
  const { uidb64, token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/reset-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uidb64,
            token,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setMessage("Your password has been reset successfully. Please click here to login.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <div className="space-y-8 bg-white p-10 md:p-20 rounded-2xl shadow-lg">
        <div>
          <Link
            href="/auth/login"
            className="flex gap-2 items-center bg-slate-50 rounded-full w-max px-4 py-1 border"
          >
            <FaArrowLeft />
            <span>Back</span>
          </Link>
        </div>
        <div className="flex gap-10 items-center">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h3 className="heading-3">Set a password</h3>
              <p className="subtitle-text text-secondary-foreground">
                Your previous password has been reset. Set a new password for your account.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-4">
                <fieldset className="border border-[#79747E] pb-2 px-4 rounded-md flex items-center justify-between">
                  <legend className="px-1">
                    Password<span className="text-red-500">*</span>
                  </legend>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
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
                <fieldset className="border border-[#79747E] pb-2 px-4 rounded-md flex items-center justify-between">
                  <legend className="px-1">
                    Confirm Password<span className="text-red-500">*</span>
                  </legend>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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
                {message && (
                  <div className="text-green-500">
                    {message}{" "}
                    <Link href="/auth/login" className="text-primary underline">
                      Login
                    </Link>
                  </div>
                )}
                {error && <div className="text-red-500">{error}</div>}
              </div>
              <div className="space-y-5">
                <button
                  type="submit"
                  className={`primary-btn bg-primary-gradient w-full ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Set Password"}
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