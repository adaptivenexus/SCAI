"use client";
import { IoMdArrowRoundBack } from "react-icons/io";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SettingsLayout = ({ children }) => {
  const { user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex gap-6 relative">
        <div className="space-y-6">
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-blue-500 text-white p-2 rounded-full"
            >
              <IoMdArrowRoundBack size={24} />
            </button>
            <h5 className="heading-5">Settings</h5>
          </div>
          <div className="bg-white p-4 shadow-md flex flex-col w-max sticky top-0 left-0 h-max rounded-lg">
            <div className="flex flex-col gap-2 w-max">
              <Link
                href={"/dashboard/settings/account-details"}
                className={`subtitle-text hover:bg-slate-100 rounded-lg px-2 py-2 ${
                  pathname === "/dashboard/settings/account-details" &&
                  "bg-slate-100"
                }`}
              >
                Account Details
              </Link>
              <Link
                href={"/dashboard/settings/security-privacy"}
                className={`subtitle-text hover:bg-slate-100 rounded-lg px-2 py-2 ${
                  pathname === "/dashboard/settings/security-privacy" &&
                  "bg-slate-100"
                }`}
              >
                Security & Privacy
              </Link>
              {user?.role === "admin" && (
                <>
                  <Link
                    href={"/dashboard/settings/interface-setting"}
                    className={`subtitle-text hover:bg-slate-100 rounded-lg px-2 py-2 ${
                      pathname === "/dashboard/settings/interface-settings" &&
                      "bg-slate-100"
                    }`}
                  >
                    Interface Settings
                  </Link>
                  <Link
                    href={"/dashboard/settings/billing"}
                    className={`subtitle-text hover:bg-slate-100 rounded-lg px-2 py-2 ${
                      pathname === "/dashboard/settings/billing" &&
                      "bg-slate-100"
                    }`}
                  >
                    Plan & Billing
                  </Link>
                  <Link
                    href={"/dashboard/settings/account-controls"}
                    className={`subtitle-text hover:bg-slate-100 rounded-lg px-2 py-2 ${
                      pathname === "/dashboard/settings/account-controls" &&
                      "bg-slate-100"
                    }`}
                  >
                    Account Controls
                  </Link>
                  <Link
                    href={"/dashboard/settings/notification-settings"}
                    className={`subtitle-text hover:bg-slate-100 rounded-lg px-2 py-2 ${
                      pathname ===
                        "/dashboard/settings/notification-settings" &&
                      "bg-slate-100"
                    }`}
                  >
                    Notification Settings
                  </Link>
                  <Link
                    href={"/dashboard/settings/role-mangement"}
                    className={`subtitle-text hover:bg-slate-100 rounded-lg px-2 py-2 ${
                      pathname === "/dashboard/settings/role-mangement" &&
                      "bg-slate-100"
                    }`}
                  >
                    Role Mangement
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};
export default SettingsLayout;
