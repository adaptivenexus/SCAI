"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// icons
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { FaArrowLeft, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState("agency"); // "agency" or "member"
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard/overview");
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (activeTab === "member") {
        // Member login: direct, no OTP
        const result = await login(
          formData.email,
          formData.password,
          undefined,
          false,
          true
        );
        if (result && result.ok === false) {
          setError("Invalid email or password");
        }
      } else if (!otpStep) {
        // Agency Step 1: Email & Password
        const result = await login(formData.email, formData.password);
        if (result && result.ok === false) {
          setError(result.message || "Invalid email or password");
        }
        // else if (result && result.otpRequired) {
        //   // setOtpStep(true);
        // } else if (result && result.success) {
        //   // Successful login, handled by redirect effect
        // } else {
        //   // setOtpStep(true); // fallback: assume OTP required if no explicit success
        // }
      } else {
        // Agency Step 2: OTP
        let attempt = 0;
        let success = false;
        let lastError = null;
        while (attempt < 5 && !success) {
          const result = await login(formData.email, formData.password, otp);
          if (result && result.success) {
            success = true;
          } else {
            lastError = (result && result.message) || "OTP verification failed";
            attempt++;
            if (attempt < 5) {
              await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
            }
          }
        }
        if (!success) {
          setError(lastError);
        }
      }
    } catch (error) {
      setError("Something went wrong");
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render the login form if we're redirecting
  if (loading || user || submitting) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <div className="space-y-8 bg-white p-4 md:p-10 lg:p-20 rounded-2xl shadow-lg max-lg:w-full mx-4">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex gap-2 items-center bg-slate-50 rounded-full w-max px-4 py-1 border"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
        </div>
        <div className="flex gap-10">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h3 className="heading-3">
                {activeTab === "agency" ? "Agency Login" : "Member Login"}
              </h3>
              <p className="subtitle-text text-secondary-foreground">
                Login to access your account
              </p>
            </div>
            {/* Tabs for Agency and Member Login - moved above input fields */}
            <div className="flex justify-center mb-4">
              <button
                type="button"
                className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors duration-200 ${
                  activeTab === "agency"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => setActiveTab("agency")}
              >
                Agency Login
              </button>
              <button
                type="button"
                className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-colors duration-200 ${
                  activeTab === "member"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => setActiveTab("member")}
              >
                Member Login
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-4">
                <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md">
                  <legend className="px-1">Email</legend>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="xyz@example.com"
                    className="w-full bg-transparent outline-none"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={otpStep}
                  />
                </fieldset>
                <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex items-center justify-between">
                  <legend className="px-1">Password</legend>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={otpStep}
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
                {error && <div className="text-red-500">{error}</div>}
                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-primary underline text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>
                {otpStep && (
                  <>
                    <fieldset className="border border-[#79747E] pb-2 px-4 rounded-md">
                      <legend className="px-1">OTP</legend>
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        placeholder="Enter OTP"
                        className="w-full bg-transparent outline-none"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </fieldset>
                    <button
                      type="button"
                      className="text-primary underline text-sm mt-2"
                      onClick={async () => {
                        setError("");
                        try {
                          const res = await fetch(
                            `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/login/`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                email: formData.email,
                                password: formData.password,
                              }),
                            }
                          );
                          const data = await res.json();
                          if (res.ok) {
                            setError("OTP resent successfully.");
                          } else {
                            setError(data.message || "Failed to resend OTP");
                          }
                        } catch (err) {
                          setError("Something went wrong while resending OTP");
                        }
                      }}
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </div>
              <div className="space-y-5">
                <button
                  type="submit"
                  className="primary-btn bg-primary-gradient w-full"
                >
                  {otpStep ? "Verify OTP" : "Login"}
                </button>
                <p className="text-center">
                  Don’t have an account?{" "}
                  <Link href={"/auth/signup"} className="text-orange-500">
                    Sign up
                  </Link>
                </p>
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
          <div className="flex-1 hidden md:block rounded-[30px] overflow-hidden">
            <Image
              src={"/login.png"}
              alt={"Login"}
              width={595}
              height={667}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
