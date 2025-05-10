"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/auth";

const TransactionSuccess = () => {
  const router = useRouter();
  const [status, setStatus] = useState("initializing");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [error, setError] = useState("");
  const [startTime] = useState(Math.floor(Date.now() / 1000));
  const [type, setType] = useState("");
  const [plan, setPlan] = useState(null);

  const { subscription, refreshTokenFn, getSubscription } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setType(searchParams.get("type"));
    setPlan(searchParams.get("plan"));
  }, []);

  const verifySession = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setError("No session ID provided");
        return false;
      }

      const response = await fetch(
        `/api/verify-session?session_id=${sessionId}&start_time=${startTime}`
      );

      if (!response.ok) {
        throw new Error("Failed to verify session");
      }

      const data = await response.json();
      setMessage(data.message || "");

      if (data.timeRemaining) {
        setTimeRemaining(Math.ceil(data.timeRemaining));
      }

      switch (data.status) {
        case "complete":
          setStatus("success");
          return false; // Stop polling
        case "processing":
        case "pending":
          setStatus("processing");
          return data.shouldRetry; // Continue polling if shouldRetry is true
        case "failed":
          setStatus("failed");
          setError(data.message);
          return false; // Stop polling
        case "timeout":
          setStatus("timeout");
          setError(data.message);
          return false; // Stop polling
        default:
          if (!data.valid) {
            setStatus("error");
            setError(data.message || "Verification failed");
            return false; // Stop polling
          }
          return data.shouldRetry; // Continue polling based on response
      }
    } catch (err) {
      setStatus("error");
      setError(err.message);
      return false; // Stop polling on error
    }
  }, [startTime]);

  useEffect(() => {
    let pollInterval;

    const startPolling = async () => {
      // Initial verification
      const shouldContinue = await verifySession();

      if (shouldContinue) {
        // Start polling if needed
        pollInterval = setInterval(async () => {
          const shouldContinuePolling = await verifySession();
          if (!shouldContinuePolling) {
            clearInterval(pollInterval);
          }
        }, 2000); // Poll every 2 seconds
      }
    };

    startPolling();

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [verifySession]);
  useEffect(() => {
    if (status !== "success") return;
    let intervalId;

    const startCountdown = () => {
      intervalId = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    };

    startCountdown();
    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === "success" && countdown === 0) {
      const redirect = () => {
        router.push("/dashboard/overview");
      };
      redirect();
    }
  }, [countdown, status, router]);

  const updatePlan = async () => {
    if (type === "upgrade") {
      // Placeholder: Add logic for handling plan upgrade
      const currentPlan = {
        is_active: false,
        expires_on: subscription.expires_on,
        plan: subscription.plan,
        agency: subscription.agency,
        used_scans: subscription.used_scans,
        registered_users_count: subscription.registered_users_count,
        used_storage: subscription.used_storage,
      };

      const resUpdateCurrentPlan = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency_subscription/agency-subscriptions/${subscription.id}/`,
        {
          method: "PUT",
          body: JSON.stringify(currentPlan),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
        refreshTokenFn
      );
      if (!resUpdateCurrentPlan.ok) {
        setStatus("error");
        setError("Failed to update plan");
      }

      const newPlan = {
        is_active: true,
        expires_on: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10), // Extracts the date in "YYYY-MM-DD" format
        plan: plan,
        used_scans: 0,
        registered_users_count: currentPlan.registered_users_count,
        used_storage: currentPlan.used_storage,
        agency: subscription.agency,
      };
      const resAddNewPlan = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency_subscription/agency-subscriptions/`,
        {
          method: "POST",
          body: JSON.stringify(newPlan),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
        refreshTokenFn
      );
      if (!resAddNewPlan.ok) {
        setStatus("error");
        setError("Failed to add new plan");
      }
      getSubscription();
      console.log(subscription);
    } else if (type === "registration") {
      // Placeholder: Add logic for handling new registration
      const newSubscription = {
        is_active: true,
        expires_on: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10), // Extracts the date in "YYYY-MM-DD" format
        plan: plan,
        used_scans: 0,
        registered_users_count: 0,
        used_storage: 0,
        agency: subscription.agency,
      };

      const resAddNewSubscription = await authFetch(
        `${process.env.NEXT_PUBLIC_SWAGGER_URL}/agency_subscription/agency-subscriptions/`,
        {
          method: "POST",
          body: JSON.stringify(newSubscription),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
        refreshTokenFn
      );

      if (!resAddNewSubscription.ok) {
        setStatus("error");
        setError("Failed to add new subscription");
      }

      getSubscription();
      console.log(subscription);
    }
  };

  useEffect(() => {
    if (status === "success") {
      updatePlan();
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case "initializing":
        return (
          <div className="flex flex-col items-center gap-6 py-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Initializing Payment Verification...
            </h3>
            <FaSpinner className="animate-spin text-5xl text-primary" />
          </div>
        );
      case "processing":
        return (
          <div className="flex flex-col items-center gap-6 py-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Processing Payment...
            </h3>
            <FaSpinner className="animate-spin text-5xl text-primary" />
            <p className="text-gray-600 text-center">{message}</p>
            {timeRemaining && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <BiTime className="text-lg" />
                <span>Time remaining: {timeRemaining} seconds</span>
              </div>
            )}
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-2">
              <FaRegCheckCircle className="text-5xl text-green-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {type === "upgrade"
                  ? "Plan Upgraded Successfully!"
                  : "Registration Successful!"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                {type === "upgrade"
                  ? "Your plan has been upgraded successfully. You now have access to all premium features."
                  : "Your account has been created successfully. Welcome aboard!"}
              </p>
            </div>
            <Link
              href="/dashboard/overview"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Go to Dashboard
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting in {countdown} seconds...
            </p>
          </div>
        );
      case "failed":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-2">
              <IoMdClose className="text-5xl text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Payment Failed
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard/billing/upgrade-plan"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Try Again
              </Link>
              <Link
                href="/dashboard/overview"
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        );
      case "timeout":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mb-2">
              <BiTime className="text-5xl text-yellow-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Verification Timeout
              </h3>
              <p className="text-yellow-600 mb-2">{error}</p>
              <p className="text-sm text-gray-600 mb-6">
                Please check your email for confirmation or contact support if
                needed.
              </p>
            </div>
            <Link
              href="/dashboard/overview"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Go to Dashboard
            </Link>
          </div>
        );
      case "error":
      default:
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-2">
              <IoMdClose className="text-5xl text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Verification Error
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard/billing/upgrade-plan"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Try Again
              </Link>
              <Link
                href="/dashboard/overview"
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {renderContent()}
      </div>
    </div>
  );
};

export default TransactionSuccess;
