"use client";

import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";

export default function Provider({ children }: { children: React.ReactNode }) {
  return <ThemeProviderWrapper>{children}</ThemeProviderWrapper>;
}