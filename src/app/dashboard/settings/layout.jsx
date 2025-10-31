"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  FiUser,
  FiShield,
  FiSettings,
  FiCreditCard,
  FiUserCheck,
  FiBell,
  FiUsers,
} from "react-icons/fi";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SettingsLayout = ({ children }) => {
  const { user } = useAuth();

  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/dashboard/settings/account-details",
      label: "Account Details",
      icon: FiUser,
      description: "Manage your personal information",
    },
    {
      href: "/dashboard/settings/security-privacy",
      label: "Security & Privacy",
      icon: FiShield,
      description: "Password and privacy settings",
    },
    ...(user?.role === "admin"
      ? [
          {
            href: "/dashboard/settings/interface-setting",
            label: "Interface Settings",
            icon: FiSettings,
            description: "Customize your interface",
          },
          {
            href: "/dashboard/settings/billing",
            label: "Plan & Billing",
            icon: FiCreditCard,
            description: "Subscription and payment details",
          },
          {
            href: "/dashboard/settings/account-controls",
            label: "Account Controls",
            icon: FiUserCheck,
            description: "Account management options",
          },
          {
            href: "/dashboard/settings/notification-settings",
            label: "Notification Settings",
            icon: FiBell,
            description: "Configure your notifications",
          },
          {
            href: "/dashboard/settings/role-mangement",
            label: "Role Management",
            icon: FiUsers,
            description: "Manage user roles and permissions",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent-primary/20">
      <div className="p-8">
        <div className="flex gap-8 relative">
          {/* Modern Navigation Sidebar */}
          <div className="w-80 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-6 shadow-lg sticky top-8">
              {/* Header Section moved to sidebar */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-accent-primary/20 flex-col">
                <div>
                  <h1 className="heading-4 text-foreground">Settings</h1>
                  <p className="body-text text-secondary-foreground">
                    Manage your account preferences and configurations
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                        isActive
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                          : "hover:bg-gradient-to-r hover:from-accent-primary hover:to-accent-secondary text-foreground hover:text-primary"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-white/20"
                            : "bg-accent-primary/50 group-hover:bg-white/80"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isActive
                              ? "text-white"
                              : "text-primary group-hover:text-primary"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`label-text font-semibold ${
                            isActive
                              ? "text-white"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-xs ${
                            isActive
                              ? "text-white/80"
                              : "text-secondary-foreground group-hover:text-primary/70"
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/80 backdrop-blur-sm border border-accent-primary/30 rounded-3xl shadow-lg overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsLayout;
