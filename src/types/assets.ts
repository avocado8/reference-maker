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
  showAttribution?: boolean; // 출처 표기 on/off
  attributionText?: string; // 출처 텍스트
}

export interface TextAssetType extends BaseAssetType {
  type: "text";
  content: string;
  color?: string; // 텍스트 색상 (CSS color)
  fontSize?: number; // 폰트 크기 override (px)
  backgroundColor?: string; // 배경 색상 (CSS color)
  textAlign?: "left" | "center" | "right";
  fontWeight?: "normal" | "bold";
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
  showAddButton?: boolean; // 컬러 추가 버튼 표시 여부 (기본값: true)
}

// 스티커 (투명 배경 이미지, 캔버스 위 자유 배치)
export interface StickerAssetType {
  id: string;
  url: string;
  scale: number; // 크기 배율 (0.1 ~ 3), scale=1 → max 200px
  x: number; // 캔버스 좌상단 기준 위치 (px)
  y: number;
}

// 자유 배치 모드용 에셋 (위치 및 크기 정보 포함)
export interface FreeAssetType {
  assetId: string; // BaseAsset.id와 연결
  x: number;
  y: number;
  width: number;
  height: number;
}
