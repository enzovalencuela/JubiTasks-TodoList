"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) return null;

  return(
    <label
      className="group relative inline-flex cursor-pointer items-center justify-start"
    >
      <input
        className="peer sr-only"
        type="checkbox"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
      />
      <span
        className="mr-4 text-xl font-semibold tracking-wider text-[var(--primary)] transition-all duration-300 group-hover:text-[var(--primary)] peer-checked:text-[var(--primary)]"
      >
        {isDark ? "Modo escuro" : "Modo claro"}
      </span>
      <div
        className="relative h-6 w-12 rounded-full bg-[var(--primary)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500
               after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500
               peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary)] peer-checked:to-[var(--secondary)] peer-checked:after:translate-x-6 peer-checked:after:from-white peer-checked:after:to-[var(--primary)]
               hover:after:scale-95 active:after:scale-90"
      >
        <span
          className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"
        ></span>

        <span
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_var(--primary)]"
        ></span>
      </div>
    </label>
  );
}