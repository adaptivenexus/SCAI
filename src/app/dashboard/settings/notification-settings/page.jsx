"use client";
import React, { useState } from "react";

const NotificationSettingsPage = () => {
  const [isToggled, setIsToggled] = useState(false);

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

  const [checkboxes, setCheckboxes] = useState({
    productUpdates: true,
    invitesRequests: true,
    tipsTutorials: false,
    promotionalOffers: true,
  });

  const handleCheckboxChange = (key) => {
    setCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="heading-4">Notification Settings</h4>
        <p className="subtitle-text text-secondary-foreground">
          Stay updated with important alerts and updates. You can manage your
          preferences below.
        </p>
      </div>

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
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
