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
  textureType: "none",
  textureDensity: 0,
  backgroundType: "solid",
  gradientColorStart: "#ffffff",
  gradientColorEnd: "#e5e7eb",
  gradientAngle: 180,
  multiCount: 4,
  backgroundImage: "",
  backgroundImageScale: 100,
  enableBlurredBackground: false,
};

const CanvasSettingsContext = createContext<
  CanvasSettingsContextType | undefined
>(undefined);

export function CanvasSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CanvasSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<CanvasSettings>) => {
    setSettings((prev) => {
      // 배경 이미지가 변경되는 경우 이전 blob URL 해제
      if (
        newSettings.backgroundImage !== undefined &&
        prev.backgroundImage &&
        prev.backgroundImage !== newSettings.backgroundImage &&
        prev.backgroundImage.startsWith("blob:")
      ) {
        URL.revokeObjectURL(prev.backgroundImage);
      }
      return { ...prev, ...newSettings };
    });
  };

  const resetSettings = () => {
    if (
      settings.backgroundImage &&
      settings.backgroundImage.startsWith("blob:")
    ) {
      URL.revokeObjectURL(settings.backgroundImage);
    }
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
