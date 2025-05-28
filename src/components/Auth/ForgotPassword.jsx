"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaApple, FaArrowLeft, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/reset-password-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      setMessage("Password reset link sent to your email.");
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
              <h3 className="heading-3">Forgot your password?</h3>
              <p className="subtitle-text text-secondary-foreground">
                Don’t worry, happens to all of us. Enter your email below to
                recover your password
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-4">
                <fieldset className="border border-[#79747E] pb-2 px-4 rounded-md">
                  <legend className="px-1">Email</legend>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="xyz@example.com"
                    className="w-full bg-transparent outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </fieldset>
                {message && <div className="text-green-500">{message}</div>}
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
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-full h-[1px] bg-secondary-foreground"></div>
                <p className="text-center text-secondary-foreground min-w-max">
                  Or login with
                </p>
                <div className="w-full h-[1px] bg-secondary-foreground"></div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex-1 py-2 border-primary border rounded-lg"
                >
                  <FaFacebook size={24} color="#1877F2" className="mx-auto" />
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 border-primary border rounded-lg"
                >
                  <FcGoogle size={24} className="mx-auto" />
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 border-primary border rounded-lg"
                >
                  <FaApple size={24} className="mx-auto" />
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 rounded-[30px] overflow-hidden hidden md:block">
            <Image
              src={"/setpassword.png"}
              alt={"setpassword"}
              width={576}
              height={500}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;