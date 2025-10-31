"use client";
import React, { useState } from "react";
import {
  FiBell,
  FiMail,
  FiShield,
  FiActivity,
  FiSave,
  FiX,
  FiCheck,
} from "react-icons/fi";

const NotificationSettingsPage = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [isToggled2, setIsToggled2] = useState(false);
  const [isToggled3, setIsToggled3] = useState(false);

  const emailNotifications = [
    {
      key: "productUpdates",
      title: "Product Updates",
      description:
        "Receive important product announcements, new features, and improvements.",
    },
    {
      key: "invitesRequests",
      title: "Invites & Requests",
      description:
        "Get notified when someone invites you to a workspace or project.",
    },
    {
      key: "tipsTutorials",
      title: "Tips & Tutorials",
      description:
        "Receive helpful tips and tutorials to use the product better.",
    },
    {
      key: "promotionalOffers",
      title: "Promotional Offers",
      description:
        "Occasional updates about offers, discounts, and pricing changes.",
    },
  ];

  const SecurityNotifications = [
    {
      key: "newLoginDetected",
      title: "New Login Detected",
      description:
        "Get notified when your account is accessed from a new device.",
    },
    {
      key: "passwordChangeAttempt",
      title: "Password Change Attempt",
      description: "Receive an alert if someone tries to change your password.",
    },
    {
      key: "2FATurnedOff",
      title: "2FA Turned Off",
      description: "Get notified when two-factor authentication is disabled.",
    },
  ];

  const ActivityNotifications = [
    {
      key: "newComment",
      title: "Team Activity Alerts",
      description: "Be notified about team activities.",
    },
    {
      key: "newFollower",
      title: "Team Invites",
      description:
        "Get notified when someone invites you to a workspace or project.",
    },
  ];

  const [checkboxes, setCheckboxes] = useState({
    productUpdates: true,
    invitesRequests: true,
    tipsTutorials: false,
    promotionalOffers: true,
    newLoginDetected: true,
    passwordChangeAttempt: true,
    twoFATurnedOff: true,
    newComment: true,
    newFollower: true,
  });

  const handleCheckboxChange = (key) => {
    setCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FiBell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="heading-4 text-foreground">Notification Settings</h2>
            <p className="body-text text-secondary-foreground">
              Stay updated with important alerts and manage your preferences
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-primary hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <FiX className="w-4 h-4" />
            <span className="label-text font-medium">Cancel</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
            <FiSave className="w-4 h-4" />
            <span className="label-text font-medium">Save Changes</span>
          </button>
        </div>
      </div>

      {/* Email Notifications Section */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FiMail className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-md">
              <h3 className="heading-5 text-foreground">Email Notifications</h3>
              <p className="text-sm text-secondary-foreground mt-1">
                Receive important updates and alerts via email for activities
                related to your account
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary-foreground">
              {isToggled ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={() => setIsToggled(!isToggled)}
              className={`relative w-16 h-8 rounded-full p-1 transition-all duration-300 ${
                isToggled
                  ? "bg-gradient-to-r from-primary to-secondary shadow-lg"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
                  isToggled ? "translate-x-8" : "translate-x-0"
                }`}
              >
                {isToggled && <FiCheck className="w-3 h-3 text-primary" />}
              </div>
            </button>
          </div>
        </div>

        {/* Email Notification Options */}
        <div className="space-y-4">
          {emailNotifications.map(({ key, title, description }) => (
            <div
              key={key}
              className="p-4 rounded-2xl border border-accent-primary/30 bg-white/50 hover:bg-white/80 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={key}
                    checked={checkboxes[key]}
                    onChange={() => handleCheckboxChange(key)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={key}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      checkboxes[key]
                        ? "bg-primary border-primary"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    {checkboxes[key] && (
                      <FiCheck className="w-3 h-3 text-white" />
                    )}
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={key}
                    className="label-text font-semibold text-foreground cursor-pointer"
                  >
                    {title}
                  </label>
                  <p className="text-sm text-secondary-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Notifications Section */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FiShield className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-md">
              <h3 className="heading-5 text-foreground">
                Security Notifications
              </h3>
              <p className="text-sm text-secondary-foreground mt-1">
                Get alerts about security events and account protection
                activities
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary-foreground">
              {isToggled2 ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={() => setIsToggled2(!isToggled2)}
              className={`relative w-16 h-8 rounded-full p-1 transition-all duration-300 ${
                isToggled2
                  ? "bg-gradient-to-r from-primary to-secondary shadow-lg"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
                  isToggled2 ? "translate-x-8" : "translate-x-0"
                }`}
              >
                {isToggled2 && <FiCheck className="w-3 h-3 text-primary" />}
              </div>
            </button>
          </div>
        </div>

        {/* Security Notification Options */}
        <div className="space-y-4">
          {SecurityNotifications.map(({ key, title, description }) => (
            <div
              key={key}
              className="p-4 rounded-2xl border border-accent-primary/30 bg-white/50 hover:bg-white/80 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={key}
                    checked={checkboxes[key]}
                    onChange={() => handleCheckboxChange(key)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={key}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      checkboxes[key]
                        ? "bg-primary border-primary"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    {checkboxes[key] && (
                      <FiCheck className="w-3 h-3 text-white" />
                    )}
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={key}
                    className="label-text font-semibold text-foreground cursor-pointer"
                  >
                    {title}
                  </label>
                  <p className="text-sm text-secondary-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Activity Notifications Section */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FiActivity className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-md">
              <h3 className="heading-5 text-foreground">
                Activity Notifications
              </h3>
              <p className="text-sm text-secondary-foreground mt-1">
                Stay informed about team activities and collaboration updates
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary-foreground">
              {isToggled3 ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={() => setIsToggled3(!isToggled3)}
              className={`relative w-16 h-8 rounded-full p-1 transition-all duration-300 ${
                isToggled3
                  ? "bg-gradient-to-r from-primary to-secondary shadow-lg"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
                  isToggled3 ? "translate-x-8" : "translate-x-0"
                }`}
              >
                {isToggled3 && <FiCheck className="w-3 h-3 text-primary" />}
              </div>
            </button>
          </div>
        </div>

        {/* Activity Notification Options */}
        <div className="space-y-4">
          {ActivityNotifications.slice(0, 2).map(
            ({ key, title, description }) => (
              <div
                key={key}
                className="p-4 rounded-2xl border border-accent-primary/30 bg-white/50 hover:bg-white/80 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={key}
                      checked={checkboxes[key]}
                      onChange={() => handleCheckboxChange(key)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={key}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        checkboxes[key]
                          ? "bg-primary border-primary"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {checkboxes[key] && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </label>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor={key}
                      className="label-text font-semibold text-foreground cursor-pointer"
                    >
                      {title}
                    </label>
                    <p className="text-sm text-secondary-foreground mt-1">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
