"use client";

import { useAuth } from "@/context/AuthContext";
import { calculatePercentage, formatDate } from "@/utils";
import { useEffect, useRef, useState } from "react";
import FloatingMenu from "@/components/Dashboard/Overlay/FloatingMenu";
import { RiVisaLine } from "react-icons/ri";
import { useRouter } from "nextjs-toploader/app";
import BillingHistoryRow from "@/components/Dashboard/settingsComponents/BillingHistoryRow";
import { handleCheckout } from "@/utils/paymentGateway";
import {
  FiCreditCard,
  FiCalendar,
  FiSettings,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiEdit3,
  FiRefreshCw,
  FiArrowUp,
  FiX,
} from "react-icons/fi";

const BillingPage = () => {
  const { subscription, previousSubscriptions, subscriptionDetails } =
    useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [scanPercentage, setScanPercentage] = useState(0);
  const [isOpenManagePlan, setIsOpenManagePlan] = useState(false);
  const manageBtnRef = useRef(null);
  const router = useRouter();

  // Ensure numeric values are safe to render
  const safeNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // Helper to compare only date part
  const getDateOnly = (dateStr) => {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Use subscription.expires_on or subscriptionDetails.end_date as needed
  const expiryDate = subscription.expires_on || subscriptionDetails.end_date;
  const isPlanExpired =
    expiryDate &&
    !isNaN(Date.parse(expiryDate)) &&
    getDateOnly(expiryDate) < todayDateOnly;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (subscriptionDetails) {
      const percentage = calculatePercentage(
        safeNumber(subscription?.used_scans),
        safeNumber(subscriptionDetails?.allowed_smart_scan)
      );
      setScanPercentage(Number.isFinite(percentage) ? percentage : 0);
    }
  }, [subscription]);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenManagePlan(false);
      }
    };

    if (isOpenManagePlan) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenManagePlan]);

  // Show loader until essential billing data is ready
  const isDataReady =
    isMounted &&
    subscription &&
    Object.keys(subscription).length > 0 &&
    subscriptionDetails &&
    Object.keys(subscriptionDetails).length > 0;

  if (!isDataReady) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="flex items-center gap-3 text-gray-600">
          <span className="inline-block w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
          <FiCreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="heading-4 text-foreground">Billing & Subscription</h2>
          <p className="body-text text-secondary-foreground">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>
      </div>

      {/* Plan Details and Payment Method Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Plan Details Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FiBarChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="heading-5 text-foreground">Plan Details</h3>
              <p className="text-sm text-secondary-foreground">
                Current subscription information
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary border border-primary/20">
              <div className="space-y-4">
                {/* Plan Details Section */}
                <div className="flex items-center justify-between">
                  <h4 className="label-text font-semibold text-foreground">
                    {subscriptionDetails.name}
                  </h4>
                  {subscriptionDetails.price !== "0.00" && (
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
                      ${subscriptionDetails.price}/Month
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-primary font-medium">
                      Single User Plan
                    </span>
                  </div>
                  {subscriptionDetails.price !== "0.00" && (
                    <p className="text-sm text-secondary-foreground">
                      Billed Monthly
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-white/20 my-4"></div>

                {/* Next Billing Date Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="label-text font-semibold text-foreground">
                        Next Billing Date
                      </h4>
                      <p className="body-text text-foreground font-medium">
                        {formatDate(expiryDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-primary text-xs font-medium">
                      Auto-renewal disabled
                    </span>
                    {isPlanExpired ? (
                      <div className="flex items-center gap-2">
                        <FiAlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">
                          Plan expired
                        </span>
                      </div>
                    ) : (
                      (() => {
                        if (expiryDate) {
                          const expiry = getDateOnly(expiryDate);
                          const diffTime = expiry - todayDateOnly;
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24)
                          );
                          if (diffDays > 0 && diffDays <= 5) {
                            return (
                              <div className="flex items-center gap-2">
                                <FiClock className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-medium text-orange-600">
                                  Expiring Soon
                                </span>
                              </div>
                            );
                          }
                        }
                        return (
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-primary font-medium">
                              Active Plan
                            </span>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Manage Plan Button */}
            <div className="relative">
              <button
                type="button"
                ref={manageBtnRef}
                onClick={() => setIsOpenManagePlan(!isOpenManagePlan)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <FiSettings className="w-4 h-4" />
                <span className="label-text font-medium">Manage Plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FiCreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="heading-5 text-foreground">Payment Method</h3>
              <p className="text-sm text-secondary-foreground">
                Change how you pay for your plan
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-accent-primary/30 bg-white/50">
            <div className="flex items-center gap-6">
              <div className="w-16 h-12 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
                <RiVisaLine color="#1634CC" size={40} />
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <h4 className="body-text font-medium text-foreground">
                    Visa ending in 1234
                  </h4>
                  <p className="text-sm text-secondary-foreground">
                    Expires 03/2026
                  </p>
                  <p className="text-sm text-secondary-foreground">
                    billing1234@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary text-primary hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <FiEdit3 className="w-4 h-4" />
              <span className="label-text font-medium">
                Edit Payment Method
              </span>
            </button>
          </div>
          {/* Security Badge */}
          <div className="mt-4 p-4 rounded-2xl border border-green-200 bg-green-50 flex items-center gap-3">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Your payment info is fully secured
              </p>
              {/* <p className="text-xs text-green-700">256-bit SSL encryption & PCI-DSS compliant</p> */}
            </div>
          </div>
        </div>
      </div>
      {/* Usage Summary and Extra Cost Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage Summary Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="heading-5 text-foreground">Usage Summary</h3>
              <p className="text-sm text-secondary-foreground">
                Track your current usage and remaining credits
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary border border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-foreground">
                    Overall Usage
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {Math.min(
                      safeNumber(subscription?.used_scans),
                      safeNumber(subscriptionDetails?.allowed_smart_scan)
                    )}{" "}
                    / {safeNumber(subscriptionDetails?.allowed_smart_scan)}{" "}
                    pages
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-white/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        Number.isFinite(scanPercentage)
                          ? scanPercentage > 100
                            ? 100
                            : scanPercentage < 0
                            ? 0
                            : scanPercentage
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-foreground">
                    Remaining Credits
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {Math.max(
                      0,
                      safeNumber(subscriptionDetails?.allowed_smart_scan) -
                        safeNumber(subscription?.used_scans)
                    )}{" "}
                    left
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl border border-accent-primary/30 bg-white/50">
              <FiBarChart className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Usage Percentage
                </p>
                <p className="text-xs text-secondary-foreground">
                  {Number.isFinite(scanPercentage)
                    ? Math.round(scanPercentage)
                    : 0}
                  % of your plan used
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Cost Details Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="heading-5 text-foreground">Extra Cost Details</h3>
              <p className="text-sm text-secondary-foreground">
                Overage charges and additional costs
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3 mb-4">
                <FiAlertTriangle className="w-5 h-5 text-orange-500" />
                <h4 className="label-text font-semibold text-orange-700">
                  Overage Policy
                </h4>
              </div>
              <p className="text-sm text-orange-600">
                After exceeding your plan's free scans, each additional page
                will be charged at{" "}
                <span className="font-semibold">
                  ${subscriptionDetails.exceeds_page_limit_cost}/per page
                </span>
                .
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-accent-primary/30 bg-white/50">
                <span className="text-sm text-secondary-foreground">
                  Extra pages this cycle
                </span>
                <span className="text-sm font-medium text-foreground">
                  {Math.max(
                    0,
                    safeNumber(subscription?.used_scans) -
                      safeNumber(subscriptionDetails?.allowed_smart_scan)
                  )}{" "}
                  pages
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-accent-primary/30 bg-white/50">
                <span className="text-sm text-secondary-foreground">
                  Estimated extra cost
                </span>
                <span className="text-lg font-semibold text-primary">
                  $
                  {(() => {
                    const extraPages = Math.max(
                      0,
                      safeNumber(subscription?.used_scans) -
                        safeNumber(subscriptionDetails?.allowed_smart_scan)
                    );
                    const costPerPage = safeNumber(
                      subscriptionDetails?.exceeds_page_limit_cost
                    );
                    const total = extraPages * costPerPage;
                    return Number.isFinite(total) ? total.toFixed(2) : "0.00";
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FiClock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="heading-5 text-foreground">Billing History</h3>
            <p className="text-sm text-secondary-foreground">
              View your past transactions and invoices
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-accent-primary/30 overflow-hidden bg-white/50">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-accent-primary to-accent-secondary">
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">
                  Date
                </th>
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">
                  Plan
                </th>
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">
                  Amount
                </th>
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">
                  Payment Method
                </th>
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">
                  Status
                </th>
                <th className="py-4 px-6 text-left label-text font-semibold text-foreground">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-primary/20">
              {previousSubscriptions.length > 0 ? (
                previousSubscriptions.map((item) => (
                  <BillingHistoryRow key={item.id} item={item} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-accent-primary/50 flex items-center justify-center">
                        <FiClock className="w-8 h-8 text-secondary-foreground" />
                      </div>
                      <div>
                        <h4 className="label-text font-medium text-foreground">
                          No Billing History
                        </h4>
                        <p className="text-sm text-secondary-foreground">
                          Your transaction history will appear here
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Plan Dropdown - anchored via portal */}
      <FloatingMenu
        open={isOpenManagePlan}
        anchorRef={manageBtnRef}
        placement="bottom-end"
        onClose={() => setIsOpenManagePlan(false)}
        className="w-80"
      >
        <button
          onClick={() => {
            handleCheckout(subscriptionDetails.id, false);
            setIsOpenManagePlan(false);
          }}
          type="button"
          disabled={
            subscription.plan === subscriptionDetails.id &&
            subscriptionDetails.id === 0
          }
          className="w-full flex items-center gap-3 px-6 py-4 hover:bg-green-50 transition-colors text-left disabled:opacity-50"
        >
          <FiRefreshCw className="w-4 h-4 text-green-600" />
          <span className="label-text font-medium text-green-600">
            Renew Existing Plan
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpenManagePlan(false);
            router.push("/dashboard/billing/upgrade-plan");
          }}
          className="w-full flex items-center gap-3 px-6 py-4 hover:bg-blue-50 transition-colors text-left"
        >
          <FiArrowUp className="w-4 h-4 text-primary" />
          <span className="label-text font-medium text-primary">
            Upgrade Plan
          </span>
        </button>
        <div className="h-px bg-accent-primary/30 mx-4"></div>
        <button
          type="button"
          onClick={() => setIsOpenManagePlan(false)}
          className="w-full flex items-center gap-3 px-6 py-4 hover:bg-accent-primary/20 transition-colors text-left"
        >
          <FiCheckCircle className="w-4 h-4 text-foreground" />
          <span className="label-text font-medium text-foreground">
            Auto Renew Turn on
          </span>
        </button>
        {subscriptionDetails.name !== "Free Plan" && (
          <>
            <div className="h-px bg-accent-primary/30 mx-4"></div>
            <button
              type="button"
              onClick={() => setIsOpenManagePlan(false)}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors text-left"
            >
              <FiX className="w-4 h-4 text-red-500" />
              <span className="label-text font-medium text-red-500">
                Cancel Subscription
              </span>
            </button>
          </>
        )}
      </FloatingMenu>
    </div>
  );
};
export default BillingPage;
