import React, { useState } from "react";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import { getTheme, applyTheme } from "../../utils/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getTheme);
  const dark = theme === "dark";

  const toggle = () => {
    const next = dark ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? "switch to light mode" : "switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </button>
  );
};

export default ThemeToggle;
