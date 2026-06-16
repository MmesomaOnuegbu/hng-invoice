"use client";

import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Darkmode = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<string | null>(null);

  useEffect(() => {
    // Schedule the update to avoid synchronous cascading renders
    const frameId = requestAnimationFrame(() => {
      setResolvedTheme(theme === "system" ? systemTheme || "light" : theme || "light");
    });

    return () => cancelAnimationFrame(frameId);
  }, [theme, systemTheme]);

  // Return a placeholder with the same dimensions to avoid layout shift
  if (!resolvedTheme) {
    return <div className="h-6 w-6" aria-hidden="true" />;
  }

  return (
    <button 
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center focus:outline-none"
      aria-label="Toggle Dark Mode"
    >
      {resolvedTheme === "dark" ? (
        <MdLightMode className="text-2xl text-[#858BB2] hover:text-[#DFE3FA] transition-colors" />
      ) : (
        <MdDarkMode className="text-2xl text-[#7E88C3] hover:text-[#0C0E16] transition-colors" />
      )}
    </button>
  );
};

export default Darkmode;