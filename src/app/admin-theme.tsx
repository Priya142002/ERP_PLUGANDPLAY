import React, { createContext, useContext, useEffect, useState } from "react";

export type AdminThemeMode = "light" | "dark" | "auto";

export type AdminThemeConfig = {
  mode: AdminThemeMode;
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

const LIGHT_THEME: AdminThemeConfig = {
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

const DARK_THEME: AdminThemeConfig = {
  mode: "dark",
  primary: "#38acf8",
  secondary: "#94a3b8",
  accent: "#34d399",
  sidebar: "#001a33",
  header: "#ffffff",
  card: "#1e293b",
  background: "#f8fafc",
  text: {
    primary: "#f1f5f9",
    secondary: "#94a3b8"
  }
};

type AdminThemeContextType = {
  theme: AdminThemeConfig;
  mode: AdminThemeMode;
  setMode: (mode: AdminThemeMode) => void;
  toggleTheme: () => void;
};

const AdminThemeContext = createContext<AdminThemeContextType | null>(null);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AdminThemeMode>(() => {
    const saved = localStorage.getItem("admin-theme") as AdminThemeMode;
    return saved || "light"; // Default to light
  });

  // Determine actual theme based on mode (handle "auto")
  const actualMode = mode === "auto" 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light")
    : mode;

  const theme = actualMode === "light" ? LIGHT_THEME : DARK_THEME;

  // Apply theme CSS variables to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("admin-mode");
    root.setAttribute("data-theme", actualMode);
    
    // Load custom theme if exists
    const savedCustomTheme = localStorage.getItem("admin-custom-theme");
    let customTheme = null;
    if (savedCustomTheme) {
      try {
        customTheme = JSON.parse(savedCustomTheme);
      } catch (e) {
        console.error("Failed to parse custom theme", e);
      }
    }
    
    // Set all theme variables (use custom theme if available)
    const primaryColor = customTheme?.primary || theme.primary;
    const sidebarColor = customTheme?.sidebar || theme.sidebar;
    const headerColor = customTheme?.header || theme.header;
    
    root.style.setProperty("--admin-primary", primaryColor);
    root.style.setProperty("--admin-secondary", theme.secondary);
    root.style.setProperty("--admin-accent", theme.accent);
    root.style.setProperty("--admin-sidebar", sidebarColor);
    root.style.setProperty("--admin-header", headerColor);
    root.style.setProperty("--admin-card", theme.card);
    root.style.setProperty("--admin-background", theme.background);
    root.style.setProperty("--admin-text-primary", theme.text.primary);
    root.style.setProperty("--admin-text-secondary", theme.text.secondary);
    root.style.setProperty("--admin-border", actualMode === "light" ? "#E5E7EB" : "#374151");
    root.style.setProperty("--admin-hover", actualMode === "light" ? "#F3F4F6" : "#1F2937");
    root.style.setProperty("--admin-success", actualMode === "light" ? "#059669" : "#10B981");
    root.style.setProperty("--admin-warning", actualMode === "light" ? "#D97706" : "#F59E0B");
    root.style.setProperty("--admin-error", actualMode === "light" ? "#DC2626" : "#EF4444");
    root.style.setProperty("--admin-info", actualMode === "light" ? "#2563EB" : "#3B82F6");

    // Also set Tailwind CSS custom properties for broader compatibility
    root.style.setProperty("--color-primary", primaryColor);
    root.style.setProperty("--color-primary-rgb", hexToRgb(primaryColor));
    
    localStorage.setItem("admin-theme", mode);

    return () => {
      root.classList.remove("admin-mode");
      root.removeAttribute("data-theme");
    };
  }, [mode, actualMode, theme]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 33, 71"; // fallback to default primary
  };

  const toggleTheme = () => {
    setMode(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <AdminThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used inside AdminThemeProvider");
  return ctx;
}
