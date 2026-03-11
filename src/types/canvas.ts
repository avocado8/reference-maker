export type CanvasMode = "template" | "free";
export type CanvasOrientation = "portrait" | "landscape";
export type TemplateType =
  | "single-portrait"
  | "double-landscape"
  | "double-symmetric";
export type FontFamily = "sans" | "dotum" | "batang";

export interface CanvasSettings {
  mode: CanvasMode;
  orientation: CanvasOrientation;
  templateType?: TemplateType;
  backgroundColor: string;
  cardBackgroundColor: string;
  borderColor: string;
  titleBarColor: string;
  fontFamily: FontFamily;
  baseFontSize: number;
  borderRadius: number;
  showShadow: boolean;
}

export interface CanvasSettingsContextType {
  settings: CanvasSettings;
  updateSettings: (newSettings: Partial<CanvasSettings>) => void;
  resetSettings: () => void;
}
