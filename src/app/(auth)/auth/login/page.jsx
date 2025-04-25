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
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error handling is done in the login function
      console.error("Login error:", error);
    }
  };

  // Don't render the login form if we're redirecting
  if (loading || user) {
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
              <h3 className="heading-3">Login</h3>
              <p className="subtitle-text text-secondary-foreground">
                Login to access your account
              </p>
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
              </div>
              <div className="space-y-5">
                <button
                  type="submit"
                  className="primary-btn bg-primary-gradient w-full"
                >
                  Login
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
