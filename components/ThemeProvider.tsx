"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We define the props locally so we don't have to rely on the deep 'dist/types' import
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}