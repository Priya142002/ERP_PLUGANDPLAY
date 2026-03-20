import React, { createContext, useContext, useEffect, useState } from "react";

export type SuperAdminThemeMode = "light" | "dark";

export type SuperAdminThemeConfig = {
  mode: SuperAdminThemeMode;
  primary: string;
  secondary: string;
  accent: string;
  sidebar: string;
  header: string;
  card: string;
  background: string;
  text: {
    primary: string;
    secondary: string;
  };
};

const LIGHT_THEME: SuperAdminThemeConfig = {
  mode: "light",
  primary: "#002147",
  secondary: "#475569",
  accent: "#0ea5e9",
  sidebar: "#002147",
  header: "#ffffff",
  card: "#ffffff",
  background: "#f8fafc",
  text: {
    primary: "#0f172a",
    secondary: "#64748b"
  }
};

const DARK_THEME: SuperAdminThemeConfig = {
  mode: "dark",
  primary: "#38acf8",
  secondary: "#94a3b8",
  accent: "#34d399",
  sidebar: "#001a33",
  header: "#ffffff", // Topbar → White
  card: "#1e293b",
  background: "#f8fafc", // Background → Light White / Gray
  text: {
    primary: "#f1f5f9",
    secondary: "#94a3b8"
  }
};

type SuperAdminThemeContextType = {
  theme: SuperAdminThemeConfig;
  mode: SuperAdminThemeMode;
  setMode: (mode: SuperAdminThemeMode) => void;
  toggleTheme: () => void;
};

const SuperAdminThemeContext = createContext<SuperAdminThemeContextType | null>(null);

export function SuperAdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<SuperAdminThemeMode>(() => {
    const saved = localStorage.getItem("superadmin-theme") as SuperAdminThemeMode;
    return saved || "dark"; // Default to dark
  });

  const theme = mode === "light" ? LIGHT_THEME : DARK_THEME;

  // Apply theme CSS variables to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("sa-mode");
    
    // Set all theme variables
    root.style.setProperty("--sa-primary", theme.primary);
    root.style.setProperty("--sa-secondary", theme.secondary);
    root.style.setProperty("--sa-accent", theme.accent);
    root.style.setProperty("--sa-sidebar", theme.sidebar);
    root.style.setProperty("--sa-header", theme.header);
    root.style.setProperty("--sa-card", theme.card);
    root.style.setProperty("--sa-background", theme.background);
    root.style.setProperty("--sa-text-primary", theme.text.primary);
    root.style.setProperty("--sa-text-secondary", theme.text.secondary);
    root.style.setProperty("--sa-border", mode === "light" ? "#E5E7EB" : "#374151");
    root.style.setProperty("--sa-hover", mode === "light" ? "#F3F4F6" : "#1F2937");
    root.style.setProperty("--sa-success", mode === "light" ? "#059669" : "#10B981");
    root.style.setProperty("--sa-warning", mode === "light" ? "#D97706" : "#F59E0B");
    root.style.setProperty("--sa-error", mode === "light" ? "#DC2626" : "#EF4444");
    root.style.setProperty("--sa-info", mode === "light" ? "#2563EB" : "#3B82F6");

    localStorage.setItem("superadmin-theme", mode);

    return () => {
      root.classList.remove("sa-mode");
    };
  }, [mode, theme]);

  const toggleTheme = () => {
    setMode(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <SuperAdminThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>
      {children}
    </SuperAdminThemeContext.Provider>
  );
}

export function useSuperAdminTheme() {
  const ctx = useContext(SuperAdminThemeContext);
  if (!ctx) throw new Error("useSuperAdminTheme must be used inside SuperAdminThemeProvider");
  return ctx;
}
