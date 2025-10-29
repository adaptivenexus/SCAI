"use client";

import { useEffect, useState } from "react";

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
    <div className="space-y-6">
      <div className="space-y-1">
        <h4 className="heading-4">Interface Settings</h4>
        <p className="subtitle-text text-secondary-foreground">
          Customize how the dashboard looks and behaves for your experience.
        </p>
      </div>
      <div className="space-y-4">
        {/* Time Zone */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">
            Time Zone:
          </label>
          <select
            className="w-full p-4 border rounded-xl outline-none bg-slate-50"
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
        </div>
        {/* Region */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">Region</label>
          <select
            className="w-full p-4 border rounded-xl outline-none bg-slate-50"
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
        </div>
        {/* Language */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">Language</label>
          <select
            className="w-full p-4 border rounded-xl outline-none bg-slate-50"
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
        </div>
        {/* Currency */}
        <div className="space-y-2">
          <label className="subtitle-text font-semibold block">Currency</label>
          <select
            className="w-full p-4 border rounded-xl outline-none bg-slate-50"
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
        </div>
      </div>
    </div>
  );
};

export default InterfaceSettingsPage;
