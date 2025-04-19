"use client";
import React, { useState } from "react";

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
      description:
        "Be notified about team activities.",
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
    <div className="space-y-6 ">
      <div className="space-y-2 flex items-center justify-between">
        <div>
          <h4 className="heading-4">Notification Settings</h4>
          <p className="subtitle-text text-secondary-foreground">
            Stay updated with important alerts and updates. You can manage your
            preferences below.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="primary-btn">Save changes</button>
          <button className="secondary-btn">Cancel</button>
        </div>
      </div>

      {/* Email notification */}
      <div className="w-full p-6 bg-white shadow-lg space-y-6 rounded-xl border">
        <div>
          <div className="flex justify-between  ">
            <div className=" w-[30%] space-y-2">
              <h2 className="heading-5 text-foreground ">
                Notification Settings
              </h2>
              <p className="body-text text-scondary-foreground">
                Receive important updates and alerts via email for activities
                related to your personal account, team collaboration, and system
                notifications.
              </p>
            </div>

            <div className=" space-y-4 w-[50%]">
              <button
                onClick={() => setIsToggled(!isToggled)}
                className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ${
                  isToggled ? "bg-primary" : "bg-secondary-foreground"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                    isToggled ? "translate-x-7" : ""
                  }`}
                />
              </button>

              {/* notification checkboxes and lists */}

              <div className="space-y-6">
                {emailNotifications.map(({ key, title, description }) => (
                  <div key={key} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={key}
                      checked={checkboxes[key]}
                      onChange={() => handleCheckboxChange(key)}
                      className="mt-1 h-5 w-5 "
                    />
                    <div>
                      <label
                        htmlFor={key}
                        className="text-lg font-semibold text-foreground"
                      >
                        {title}
                      </label>
                      <p className="text-sm text-secondary-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className=" border-b-2 border-gray-300 my-4"></div>
        {/* security notifications */}

        <div className="space-y-2 flex items-center justify-between">
          <div className=" w-[30%] space-y-2">
            <h2 className="heading-5 text-foreground ">
              Security Notifications
            </h2>
            <p className="body-text text-scondary-foreground">
              Receive important updates and alerts via email for activities
              related to your personal account, team collaboration, and system
              notifications.
            </p>
          </div>

          <div className=" space-y-4 w-[50%]">
            <button
              onClick={() => setIsToggled2(!isToggled2)}
              className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ${
                isToggled2 ? "bg-primary" : "bg-secondary-foreground"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                  isToggled2 ? "translate-x-7" : ""
                }`}
              />
            </button>

            {/* security notifications checkboxes and lists */}
            <div className="space-y-6">
              {SecurityNotifications.map(({ key, title, description }) => (
                <div key={key} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={key}
                    checked={checkboxes[key]}
                    onChange={() => handleCheckboxChange(key)}
                    className="mt-1 h-5 w-5 "
                  />
                  <div>
                    <label
                      htmlFor={key}
                      className="text-lg font-semibold text-foreground"
                    >
                      {title}
                    </label>
                    <p className="text-sm text-secondary-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" border-b-2 border-gray-300 my-4"></div>
        {/* activity notifications */}

        <div className="space-y-2 flex items-center justify-between">
          <div className=" w-[30%] space-y-2">
            <h2 className="heading-5 text-foreground ">
              Activity Notifications
            </h2>
            <p className="body-text text-scondary-foreground">
              Receive important updates and alerts via email for activities
              related to your personal account, team collaboration, and system
              notifications.
            </p>
          </div>

          <div className=" space-y-4 w-[50%]">
            <button
              onClick={() => setIsToggled3(!isToggled3)}
              className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ${
                isToggled3 ? "bg-primary" : "bg-secondary-foreground"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                  isToggled3 ? "translate-x-7" : ""
                }`}
              />
            </button>

            {/* activity notifications checkboxes and lists */}
            <div className="space-y-6">
              {ActivityNotifications.slice(0, 2).map(({ key, title, description }) => (
                <div key={key} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={key}
                    checked={checkboxes[key]}
                    onChange={() => handleCheckboxChange(key)}
                    className="mt-1 h-5 w-5 "
                  />
                  <div>
                    <label
                      htmlFor={key}
                      className="text-lg font-semibold text-foreground"
                    >
                      {title}
                    </label>
                    <p className="text-sm text-secondary-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
