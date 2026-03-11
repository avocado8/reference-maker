export type AssetType = "image" | "text" | "palette";

export interface BaseAssetType {
  id: string;
  type: AssetType;
}

export interface ImageAssetType extends BaseAssetType {
  type: "image";
  url: string;
  scale: number; // 확대/축소 비율
  panX: number; // 영역 내 수평 이동 (px)
  panY: number; // 영역 내 수직 이동 (px)
}

export interface TextAssetType extends BaseAssetType {
  type: "text";
  content: string;
  color?: string; // 텍스트 색상 (CSS color)
  fontSize?: number; // 폰트 크기 override (px)
  backgroundColor?: string; // 배경 색상 (CSS color)
}

export interface ColorItem {
  id: string;
  color: string;
  caption?: string;
  showCaption: boolean;
}

export interface PaletteSize {
  size: "S" | "M" | "L";
}

export interface PaletteAssetType extends BaseAssetType {
  type: "palette";
  colors: ColorItem[];
  size: PaletteSize["size"];
}

// 자유 배치 모드용 에셋 (위치 및 크기 정보 포함)
export interface FreeAssetType {
  assetId: string; // BaseAsset.id와 연결
  x: number;
  y: number;
  width: number;
  height: number;
}
