"use client";

import { useAuth } from "@/context/AuthContext";
import { calculatePercentage, formatDate } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { RiVisaLine } from "react-icons/ri";
import { useRouter } from "nextjs-toploader/app";
import BillingHistoryRow from "@/components/Dashboard/settingsComponents/BillingHistoryRow";
import { handleCheckout } from "@/utils/paymentGateway";

const BillingPage = () => {
  const { subscription, previousSubscriptions, subscriptionDetails } =
    useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [scanPercentage, setScanPercentage] = useState(0);
  const [isOpenManagePlan, setIsOpenManagePlan] = useState(false);
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
    subscription && Object.keys(subscription).length > 0 &&
    subscriptionDetails && Object.keys(subscriptionDetails).length > 0;

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
    <div className="flex flex-col gap-6">
      <h4 className="heading-4">Billing & Subscription</h4>
      <div className="flex gap-5 w-full">
        <div className="flex-1 bg-white p-6 shadow-md rounded-xl flex justify-between  ">
          <div className="flex flex-col gap-3">
            <h5 className="heading-5">Plan Details</h5>
            <div className="space-y-2">
              <div className="space-y-0.5">
                <p className="subtitle-text text-secondary-foreground">
                  {subscriptionDetails.name}
                  {subscriptionDetails.price === "0.00"
                    ? ""
                    : ` - $${subscriptionDetails.price}/Month`}
                </p>
                {subscriptionDetails.price !== "0.00" && (
                  <p className="subtitle-text text-secondary-foreground">
                    Billed Monthly
                  </p>
                )}
              </div>
              <p className="subtitle-text text-primary">Single User Plan</p>
            </div>
            <div className="relative flex items-center gap-2 mt-auto">
              <button
                type="button"
                onClick={() => {
                  setIsOpenManagePlan(!isOpenManagePlan);
                }}
                className="primary-btn"
              >
                Manage Plan
              </button>

              {isOpenManagePlan && (
                <div
                  ref={dropdownRef}
                  className="absolute top-12 left-0 flex flex-col bg-white rounded-lg shadow-md"
                >
                  {/* Renew Plan Option */}
                  <button
                    onClick={() =>
                      handleCheckout(subscriptionDetails.id, false)
                    }
                    type="button"
                    disabled={
                      subscription.plan === subscriptionDetails.id &&
                      subscriptionDetails.id === 0
                    }
                    className="w-max h-max font-medium text-green-600 py-2 px-4 hover:bg-slate-100 min-w-full text-start"
                  >
                    Renew Existing Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenManagePlan(false);
                      router.push("/dashboard/billing/upgrade-plan");
                    }}
                    className="w-max h-max font-medium text-primary py-2 px-4 hover:bg-slate-100 min-w-full text-start"
                  >
                    Upgrade Plan
                  </button>
                  <div className="w-full h-[1px] bg-slate-200"></div>
                  <button
                    type="button"
                    className="w-max h-max font-medium py-2 px-4 hover:bg-slate-100 min-w-full text-start"
                  >
                    Auto Renew Turn on
                  </button>
                  {subscriptionDetails.name !== "Free Plan" && (
                    <>
                      <div className="w-full h-[1px] bg-slate-200"></div>
                      <button
                        type="button"
                        className="w-max h-max font-medium text-red-500 py-2 px-4 hover:bg-slate-100 min-w-full text-start"
                      >
                        Cancel Subscription
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between text-center">
            <div className="space-y-2">
              <h5 className="heading-5">Next Billing Date</h5>
              <div className="space-y-0.5">
                <p className="subtitle-text text-secondary-foreground">
                  {formatDate(expiryDate)}
                </p>
                <p className="subtitle-text text-primary">
                  (Auto-renewal disabled)
                </p>
              </div>
            </div>
            {isPlanExpired ? (
              <p className="label-text text-[#DF5753]">
                <b>Plan expired</b>
              </p>
            ) : (
              // Show "Expiring Soon" only if plan expires in 5 days or less
              (() => {
                if (expiryDate) {
                  const expiry = getDateOnly(expiryDate);
                  const diffTime = expiry - todayDateOnly;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0 && diffDays <= 5) {
                    return (
                      <p className="label-text text-[#DF5753]">
                        Expiring Soon: Renew before {formatDate(expiryDate)}.
                      </p>
                    );
                  }
                }
                return null;
              })()
            )}
          </div>
        </div>
        <div className="flex-1 bg-white p-6 shadow-md rounded-xl space-y-3">
          <div className="">
            <h5 className="heading-5">Payment Method</h5>
            <p className="subtitle-text text-secondary-foreground">
              Change how You Pay for Your Plan
            </p>
          </div>

          <div className="p-4 rounded-xl border flex gap-5">
            <div>
              <RiVisaLine color="#1634CC" size={60} />
            </div>
            <div className="flex-1 flex justify-between">
              <div className="space-y-2">
                <div>
                  <p className="body-text">Visa ending in 1234</p>
                  <p className="label-text text-secondary-foreground">
                    Expires 03/2026
                  </p>
                </div>
                <p className="label-text text-secondary-foreground">
                  billing1234@gmail.com
                </p>
              </div>
              <button type="button" className="secondary-btn w-max h-max px-10">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 shadow-md rounded-xl space-y-5 flex gap-6">
        {/* Usage Summary - 50% width, with border */}
        <div className="w-1/2 flex flex-col justify-between border border-gray-200 rounded-lg p-4 bg-white">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <h5 className="heading-5">Usage Summary</h5>
                {/* <button type="button" className="secondary-btn w-max h-max px-10">
          View Usage
        </button> */}
              </div>
              {/* <button type="button" className="secondary-btn w-max h-max px-10">
        Add Add-on
      </button> */}
            </div>
            <div className="space-y-3">
              <p className="subtitle-text text-secondary-foreground">
                Overall Usage:{" "}
                {Math.min(
                  safeNumber(subscription?.used_scans),
                  safeNumber(subscriptionDetails?.allowed_smart_scan)
                )}{" "}
                pages used out of {safeNumber(subscriptionDetails?.allowed_smart_scan)}.
              </p>
              <div className="w-full h-6 rounded-lg border overflow-hidden">
                <div
                  className={`h-full bg-primary-gradient`}
                  style={{
                    width: `${Number.isFinite(scanPercentage)
                      ? scanPercentage > 100
                        ? 100
                        : scanPercentage < 0
                        ? 0
                        : scanPercentage
                      : 0}%`,
                  }}
                ></div>
              </div>
              <p className="subtitle-text text-secondary-foreground">
                Remaining:{" "}
                {Math.max(
                  0,
                  safeNumber(subscriptionDetails?.allowed_smart_scan) -
                    safeNumber(subscription?.used_scans)
                )}{" "}
                Credits left.
              </p>
            </div>
          </div>
        </div>
        {/* Extra Cost Details - 50% width, with border and aligned label */}
        <div
          className="w-1/2 flex flex-col justify-between border border-gray-200 rounded-lg p-4 bg-white"
          style={{ marginTop: 0 }}
        >
          <div className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <h5 className="heading-5">Extra Cost Details</h5>
              </div>
              {/* Empty div to align with Add Add-on button */}
              <div style={{ width: "120px" }}></div>
            </div>
            <div className="space-y-3">
              <p className="subtitle-text text-secondary-foreground">
                <b>After exceeding your plan's free scans,</b> each additional
                page will be charged at{" "}
                <b>${subscriptionDetails.exceeds_page_limit_cost}/per page</b>.
              </p>
              <p className="subtitle-text text-secondary-foreground">
                Extra usage page count in this cycle:{" "}
                <b>
                  {Math.max(
                    0,
                    safeNumber(subscription?.used_scans) -
                      safeNumber(subscriptionDetails?.allowed_smart_scan)
                  )}
                </b>
              </p>
              <p className="subtitle-text text-secondary-foreground">
                Estimated extra cost:{" "}
                <b>
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
                </b>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-xl space-y-5">
        <h5 className="heading-5">Billing history</h5>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-3 bg-accent-primary text-foreground">Date</th>
                <th className="py-3 bg-accent-primary text-foreground">Plan</th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Amount
                </th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Payment Method
                </th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Status
                </th>
                <th className="py-3 bg-accent-primary text-foreground">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {previousSubscriptions.length > 0 ? (
                previousSubscriptions.map((item) => (
                  <BillingHistoryRow key={item.id} item={item} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No Subscriptions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default BillingPage;
