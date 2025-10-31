"use client";

import { useEffect, useState } from "react";
import {
  FiSettings,
  FiClock,
  FiGlobe,
  FiType,
  FiDollarSign,
} from "react-icons/fi";

const InterfaceSettingsPage = () => {
  const [region, setRegion] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    // Detect user's time zone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("Detected Time Zone:", userTimeZone);

    // Map time zone to region, time zone, language, and currency
    if (userTimeZone.includes("Calcutta") || userTimeZone.includes("India")) {
      setRegion("Asia / India");
      setTimeZone("GMT+5:30 (India Standard Time)");
      setLanguage("English (US)");
      setCurrency("INR ₹");
    } else if (userTimeZone.includes("Europe")) {
      setRegion("Europe / Germany");
      setTimeZone("GMT+1:00 (Central European Time)");
      setLanguage("English (UK)");
      setCurrency("EUR €");
    } else if (userTimeZone.includes("America/New_York")) {
      setRegion("America / USA");
      setTimeZone("GMT-5:00 (Eastern Standard Time)");
      setLanguage("English (US)");
      setCurrency("USD $");
    } else if (userTimeZone.includes("Asia/Tokyo")) {
      setRegion("Asia / Japan");
      setTimeZone("GMT+9:00 (Japan Standard Time)");
      setLanguage("Japanese");
      setCurrency("JPY ¥");
    } else if (userTimeZone.includes("Australia/Sydney")) {
      setRegion("Australia / Sydney");
      setTimeZone("GMT+10:00 (Australian Eastern Standard Time)");
      setLanguage("English (AU)");
      setCurrency("AUD $");
    } else if (userTimeZone.includes("Africa/Johannesburg")) {
      setRegion("Africa / Johannesburg");
      setTimeZone("GMT+2:00 (South Africa Standard Time)");
      setLanguage("English (ZA)");
      setCurrency("ZAR R");
    } else {
      // Default fallback
      setRegion("Unknown");
      setTimeZone("GMT+0:00 (UTC)");
      setLanguage("English (US)");
      setCurrency("USD $");
    }
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <FiSettings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="heading-4 text-foreground">Interface Settings</h2>
            <p className="body-text text-secondary-foreground">
              Customize how the dashboard looks and behaves for your experience
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-primary hover:shadow-lg transition-all duration-300 hover:scale-105">
            <FiRefreshCw className="w-4 h-4" />
            <span className="label-text font-medium">Reset to Default</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
            <FiSave className="w-4 h-4" />
            <span className="label-text font-medium">Save Changes</span>
          </button>
        </div> */}
      </div>

      {/* Settings Form */}
      <div className="bg-white/60 backdrop-blur-sm border border-accent-primary/30 rounded-3xl p-8 shadow-lg flex  gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          {/* Time Zone */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiClock className="w-4 h-4 text-primary" />
              Time Zone
            </label>
            <div className="relative">
              <select
                className="w-full py-4 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none appearance-none"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
              >
                <option>GMT+5:30 (India Standard Time)</option>
                <option>GMT-5:00 (Eastern Standard Time)</option>
                <option>GMT+1:00 (Central European Time)</option>
                <option>GMT+9:00 (Japan Standard Time)</option>
                <option>GMT+10:00 (Australian Eastern Standard Time)</option>
                <option>GMT+2:00 (South Africa Standard Time)</option>
                <option>GMT+0:00 (UTC)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-secondary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Region */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiGlobe className="w-4 h-4 text-primary" />
              Region
            </label>
            <div className="relative">
              <select
                className="w-full py-4 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none appearance-none"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option>Asia / India</option>
                <option>America / USA</option>
                <option>Europe / Germany</option>
                <option>Asia / Japan</option>
                <option>Australia / Sydney</option>
                <option>Africa / Johannesburg</option>
                <option>Unknown</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-secondary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiType className="w-4 h-4 text-primary" />
              Language
            </label>
            <div className="relative">
              <select
                className="w-full py-4 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none appearance-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>English (AU)</option>
                <option>English (ZA)</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>Japanese</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-secondary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 label-text font-semibold text-foreground">
              <FiDollarSign className="w-4 h-4 text-primary" />
              Currency
            </label>
            <div className="relative">
              <select
                className="w-full py-4 px-4 rounded-2xl border-2 border-accent-primary/50 bg-white focus:border-primary focus:shadow-lg transition-all duration-300 outline-none appearance-none"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>INR ₹</option>
                <option>USD $</option>
                <option>EUR €</option>
                <option>JPY ¥</option>
                <option>AUD $</option>
                <option>ZAR R</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-secondary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Current Settings Preview */}
        {/* <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary border border-primary/20 flex-1">
          <h4 className="label-text font-semibold text-foreground mb-4">
            Current Settings Preview
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-secondary-foreground">Time Zone:</span>
              <p className="font-medium text-foreground">{timeZone}</p>
            </div>
            <div>
              <span className="text-secondary-foreground">Region:</span>
              <p className="font-medium text-foreground">{region}</p>
            </div>
            <div>
              <span className="text-secondary-foreground">Language:</span>
              <p className="font-medium text-foreground">{language}</p>
            </div>
            <div>
              <span className="text-secondary-foreground">Currency:</span>
              <p className="font-medium text-foreground">{currency}</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default InterfaceSettingsPage;
