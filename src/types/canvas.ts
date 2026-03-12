export type CanvasMode = "template" | "free";
export type CanvasOrientation = "portrait" | "landscape";
export type TemplateType =
  | "single-portrait"
  | "double-landscape"
  | "double-symmetric"
  | "double-twoshot"
  | "multi";

export interface CanvasSettings {
  mode: CanvasMode;
  orientation: CanvasOrientation;
  templateType?: TemplateType;
  multiCount: number; // 다인 템플릿 인원수 (미선택/기본값 4)
  backgroundColor: string;
  cardBackgroundColor: string;
  borderColor: string;
  titleBarColor: string;
  baseFontSize: number;
  borderRadius: number;
  showShadow: boolean;
  textureDensity: number;
  backgroundType?: "solid" | "gradient";
  gradientColorStart?: string;
  gradientColorEnd?: string;
  gradientAngle?: number;
}

export interface CanvasSettingsContextType {
  settings: CanvasSettings;
  updateSettings: (newSettings: Partial<CanvasSettings>) => void;
  resetSettings: () => void;
}
