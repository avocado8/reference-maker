import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type {
  CanvasSettings,
  CanvasSettingsContextType,
} from "../types/canvas";

const defaultSettings: CanvasSettings = {
  mode: "template",
  orientation: "portrait",
  templateType: "double-twoshot",
  backgroundColor: "#ffffff",
  cardBackgroundColor: "#ffffff",
  borderColor: "#e5e7eb", // tailwind gray-200
  titleBarColor: "#374151", // tailwind gray-700
  baseFontSize: 16,
  borderRadius: 8,
  showShadow: true,
  textureDensity: 0,
};

const CanvasSettingsContext = createContext<
  CanvasSettingsContextType | undefined
>(undefined);

export function CanvasSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CanvasSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<CanvasSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <CanvasSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </CanvasSettingsContext.Provider>
  );
}

export function useCanvasSettings() {
  const context = useContext(CanvasSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useCanvasSettings must be used within a CanvasSettingsProvider",
    );
  }
  return context;
}
