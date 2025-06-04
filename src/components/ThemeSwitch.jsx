"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitch({ style, content }) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  if (resolvedTheme === "dark") {
    return (
      <div className={style} onClick={() => setTheme("light")}>
        <FiSun />
        {content}
      </div>
    );
  } else {
    return (
      <div className={style} onClick={() => setTheme("dark")}>
        <FiMoon />
        {content}
      </div>
    );
  }
}
