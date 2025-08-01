"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosEye, IoMdArrowDropdown } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { FaArrowLeft, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { handleCheckout } from "@/utils/paymentGateway";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [aggrement, setAggrement] = useState(false);
  const { subscriptions, login } = useAuth();

  const [formData, setFormData] = useState({
    agency_name: "",
    phone_number: "",
    email: "",
    password: "",
    password2: "",
    plan: 5, // Default to 6, update in useEffect if needed
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const router = useRouter();

  // Use useEffect to update plan from URL param on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const selectedPlan = params.get("plan");
      if (selectedPlan) {
        setFormData((prev) => ({
          ...prev,
          plan: parseInt(selectedPlan),
        }));
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    console.log("Form validation error " + validationError);
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    if (!aggrement) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to create user";
        if (data.message) {
          errorMessage = data.message;
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            if (
              firstError[0] &&
              typeof firstError[0] === "object" &&
              firstError[0].string
            ) {
              errorMessage = firstError[0].string;
            } else {
              errorMessage = firstError[0] || "Unknown error";
            }
          } else if (
            firstError &&
            typeof firstError === "object" &&
            firstError.string
          ) {
            errorMessage = firstError.string;
          } else {
            errorMessage = firstError || "Unknown error";
          }
        } else if (data.error && typeof data.error === "string") {
          const match = data.error.match(/string='([^']+)'/);
          if (match && match[1]) {
            errorMessage = match[1];
          } else {
            errorMessage = data.error;
          }
        }

        toast.error(errorMessage);
        setMessage({ type: "error", text: errorMessage });
        return;
      }

      await login(formData.email, formData.password, false);

      setMessage({ type: "success", text: "User created successfully" });

      if (formData.plan !== 5) {
        await handleCheckout(formData.plan, true);
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred";
      setMessage({ type: "error", text: errorMessage });
      console.error(error);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    console.log("Form validation in progress");

    if (!formData.agency_name) {
      return "Agency Name is required";
    }
    if (!formData.email) {
      return "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Invalid email address";
    }
    if (!formData.phone_number) {
      return "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      return "Phone number must be exactly 10 digits";
    }
    if (!formData.password) {
      return "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      return "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
    }
    if (!formData.password2) {
      return "Please re-enter password";
    } else if (formData.password !== formData.password2) {
      return "Passwords do not match";
    }

    return "";
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 bg-white p-4 md:p-10 lg:px-20 lg:py-10 rounded-2xl shadow-lg max-lg:w-full m-4">
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
              <h3 className="heading-3">Signup</h3>
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        message.type === "success"
                          ? "M5 13l4 4L19 7"
                          : "M6 18L18 6M6 6l12 12"
                      }
                    />
                  </svg>
                  {message.text}
                </div>
              )}
              <p className="subtitle-text text-secondary-foreground">
                Let’s get you all set up so you can access your personal
                account.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <fieldset className="border border-[#79747E] pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Agency Name<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="text"
                      id="agency_name"
                      name="agency_name"
                      placeholder="e.g. Ledger Works"
                      className="w-full bg-transparent outline-none"
                      value={formData.agency_name}
                      onChange={handleChange}
                    />
                  </fieldset>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  <fieldset className="border border-[#79747E] pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Email<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g. xyz@example.com"
                      className="w-full bg-transparent outline-none"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </fieldset>
                  <fieldset className="border border-[#79747E] pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Phone Number<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      placeholder="e.g. +1 (123) 456-7890"
                      className="w-full bg-transparent outline-none"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </fieldset>
                </div>
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
                    value={formData.password}
                    onChange={handleChange}
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
                    id="password2"
                    name="password2"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                    value={formData.password2}
                    onChange={handleChange}
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

                <div className="relative">
                  <select
                    className="bg-white border border-[#79747E] rounded-md px-4 py-2 w-full outline-none appearance-none"
                    name="plan"
                    id="plan"
                    value={formData.plan}
                    onChange={handleChange}
                  >
                    {subscriptions.map((subscription) => (
                      <option key={subscription.id} value={subscription.id}>
                        {subscription.name} - ${subscription.price}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <IoMdArrowDropdown size={24} />
                  </div>
                </div>
              </div>
              <label htmlFor="terms" className="flex gap-2">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="w-6 h-6 accent-primary"
                  checked={aggrement}
                  onChange={() => setAggrement(!aggrement)}
                />
                <p>
                  I agree to all the{" "}
                  <Link href={"/"} className="text-orange-500">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href={"/"} className="text-orange-500">
                    Privacy Policies
                  </Link>
                </p>
              </label>
              <div className="space-y-5">
                <button
                  type="submit"
                  className="primary-btn bg-primary-gradient w-full"
                >
                  Create account
                </button>
                <p className="text-center">
                  Already have an account?{" "}
                  <Link href={"/auth/login"} className="text-orange-500">
                    Login
                  </Link>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-full h-[1px] bg-secondary-foreground"></div>
                <p className="text-center text-secondary-foreground min-w-max">
                  Or Sign up with
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
          <div className="flex-1 hidden md:block rounded-[30px] overflow-hidden bg-[#EFEFEF]">
            <Image
              src={"/signup.png"}
              alt={"Login"}
              width={650}
              height={700}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
