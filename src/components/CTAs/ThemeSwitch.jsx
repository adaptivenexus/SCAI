"use client";

import { useState } from "react";

// Icons Import
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState("light");

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={handleToggle}
      className="w-[56] p-1 rounded-full bg-accent-secondary custom-switch-shadow relative "
    >
      <span
        className={`w-[24px] h-[24px] bg-secondary rounded-full duration-300 flex items-center justify-center ${
          theme === "light" ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        {theme === "light" ? (
          <FaSun className="text-background" />
        ) : (
          <FaMoon className="text-background" />
        )}
      </span>
    </button>
  );
};
export default ThemeSwitch;
