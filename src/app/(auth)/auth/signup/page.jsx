"use client";

import Link from "next/link";
import { useState } from "react";

// icons
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { FaArrowLeft, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [aggrement, setAggrement] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    agency_name: "",
    phone_number: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call to create user
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

      if (!response.ok) {
        toast.error("Failed to create user");
        return;
      }
      toast.success("User created successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    }

    // Redirect to login page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center">
      <div className="space-y-6 bg-white px-20 py-10 rounded-2xl shadow-lg">
        <div>
          <Link
            href="/"
            className="flex gap-2 items-center bg-slate-50 rounded-full w-max px-4 py-1 border"
          >
            <FaArrowLeft />
            <span>Back</span>
          </Link>
        </div>
        <div className="flex gap-10">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h3 className="heading-3">Signup</h3>
              <p className="subtitle-text text-secondary-foreground">
                Let’s get you all st up so you can access your personal account.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Agency Name<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="text"
                      id="agency_name"
                      name="agency_name"
                      placeholder="e.g. Ledger Works"
                      className="w-full bg-transparent outline-none"
                      required
                      value={formData.agency_name}
                      onChange={handleChange}
                    />
                  </fieldset>
                </div>
                <div className="flex gap-4">
                  <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Email<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g. xyz@example.com"
                      className="w-full bg-transparent outline-none"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </fieldset>
                  <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Phone Number<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      placeholder="e.g. +1 (123) 456-7890"
                      className="w-full bg-transparent outline-none"
                      required
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </fieldset>
                </div>
                {/* <div className="flex gap-4">
                  <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Country<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      placeholder="India"
                      className="w-full bg-transparent outline-none"
                      />
                  </fieldset>
                  <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex-1">
                    <legend className="px-1">
                      Postal Code<span className="text-red-500">*</span>
                    </legend>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      placeholder="411028"
                      className="w-full bg-transparent outline-none"
                    />
                  </fieldset>
                </div> */}
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
                    required
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
                <fieldset className="border border-[#79747E]  pb-2 px-4 rounded-md flex items-center justify-between">
                  <legend className="px-1">
                    Confirm Password<span className="text-red-500">*</span>
                  </legend>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="password2"
                    name="password2"
                    placeholder="********"
                    className="w-full bg-transparent outline-none"
                    required
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
              </div>
              <label htmlFor="terms" className="flex gap-2">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="w-6 h-6 accent-primary"
                  checked={aggrement}
                  onChange={() => setAggrement(!aggrement)}
                  required
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
          <div className="flex-1 rounded-[30px] overflow-hidden bg-[#EFEFEF]">
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
