export type CanvasMode = "template" | "free";
export type CanvasOrientation = "portrait" | "landscape";
export type TemplateType =
  | "single-portrait"
  | "double-landscape"
  | "double-symmetric"
  | "double-twoshot"
  | "multi";
export type FontFamily = "sans" | "dotum" | "batang";

export interface CanvasSettings {
  mode: CanvasMode;
  orientation: CanvasOrientation;
  templateType?: TemplateType;
  multiCount?: number; // 다인 템플릿 인원수 (undefined = 미선택 → 픽커 표시)
  backgroundColor: string;
  cardBackgroundColor: string;
  borderColor: string;
  titleBarColor: string;
  fontFamily: FontFamily;
  baseFontSize: number;
  borderRadius: number;
  showShadow: boolean;
  textureDensity: number;
}

export interface CanvasSettingsContextType {
  settings: CanvasSettings;
  updateSettings: (newSettings: Partial<CanvasSettings>) => void;
  resetSettings: () => void;
}
