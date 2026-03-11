import { Rnd } from "react-rnd";
import { useAssets } from "../../store/AssetContext";
import { useCanvasSettings } from "../../store/CanvasSettingsContext";
import ImageAsset from "../ImageAsset";
import TextAsset from "../TextAsset";
import ColorPaletteAsset from "../ColorPaletteAsset";
import type {
  AssetType,
  ImageAssetType,
  PaletteAssetType,
  TextAssetType,
} from "../../types/assets";
import { useState } from "react";

type GuideLines = {
  vertical: number | null;
  horizontal: number | null;
};

export default function FreeModeCanvas() {
  const { assets, freeAssets, updateFreeAsset } = useAssets();
  const { settings } = useCanvasSettings();

  const [guides, setGuides] = useState<GuideLines>({
    vertical: null,
    horizontal: null,
  });

  const SNAP_THRESHOLD = 30;

  const renderAsset = (assetId: string, type: AssetType) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return null;

    switch (type) {
      case "image":
        return <ImageAsset asset={asset as ImageAssetType} />;
      case "text":
        return <TextAsset asset={asset as TextAssetType} />;
      case "palette":
        return <ColorPaletteAsset asset={asset as PaletteAssetType} />;
      default:
        return null;
    }
  };

  const getCenterSnapResult = (
    x: number,
    y: number,
    width: number,
    height: number,
    id: string,
  ) => {
    let snappedX = x;
    let snappedY = y;

    let verticalGuide: number | null = null;
    let horizontalGuide: number | null = null;

    const currentCenterX = x + width / 2;
    const currentCenterY = y + height / 2;

    const canvasCenterX =
      settings.orientation === "portrait" ? 1200 / 2 : 1600 / 2;
    const canvasCenterY =
      settings.orientation === "portrait" ? 1600 / 2 : 1200 / 2;

    let minVerticalDistance = SNAP_THRESHOLD + 1;
    let minHorizontalDistance = SNAP_THRESHOLD + 1;

    // 1) 먼저 캔버스 중심선과 비교
    const canvasCenterXDistance = Math.abs(currentCenterX - canvasCenterX);
    if (canvasCenterXDistance < SNAP_THRESHOLD) {
      snappedX = canvasCenterX - width / 2;
      verticalGuide = canvasCenterX;
      minVerticalDistance = canvasCenterXDistance;
    }

    const canvasCenterYDistance = Math.abs(currentCenterY - canvasCenterY);
    if (canvasCenterYDistance < SNAP_THRESHOLD) {
      snappedY = canvasCenterY - height / 2;
      horizontalGuide = canvasCenterY;
      minHorizontalDistance = canvasCenterYDistance;
    }

    // 2) 다른 어셋과 비교
    freeAssets.forEach((other) => {
      if (other.assetId === id) return;

      const otherCenterX = other.x + other.width / 2;
      const otherCenterY = other.y + other.height / 2;

      const distanceX = Math.abs(currentCenterX - otherCenterX);
      const distanceY = Math.abs(currentCenterY - otherCenterY);

      // 세로 중심선 스냅
      if (distanceX < SNAP_THRESHOLD && distanceX < minVerticalDistance) {
        snappedX = otherCenterX - width / 2;
        verticalGuide = otherCenterX;
        minVerticalDistance = distanceX;
      }

      // 가로 중심선 스냅
      if (distanceY < SNAP_THRESHOLD && distanceY < minHorizontalDistance) {
        snappedY = otherCenterY - height / 2;
        horizontalGuide = otherCenterY;
        minHorizontalDistance = distanceY;
      }
    });

    return {
      x: snappedX,
      y: snappedY,
      guides: {
        vertical: verticalGuide,
        horizontal: horizontalGuide,
      },
    };
  };

  return (
    <div className="w-full h-full relative overflow-hidden shadow-inner">
      {/* export에서 제외할 가이드라인 */}
      <div
        data-export-ignore="true"
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-sky-300 pointer-events-none z-10"
      />
      <div
        data-export-ignore="true"
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-pink-300 pointer-events-none z-10"
      />

      {guides.vertical !== null && (
        <div
          data-export-ignore="true"
          className="absolute top-0 bottom-0 w-px bg-sky-400 pointer-events-none z-50"
          style={{ left: `${guides.vertical}px` }}
        />
      )}

      {guides.horizontal !== null && (
        <div
          data-export-ignore="true"
          className="absolute left-0 right-0 h-px bg-pink-400 pointer-events-none z-50"
          style={{ top: `${guides.horizontal}px` }}
        />
      )}

      {freeAssets.map((fa) => {
        const asset = assets.find((a) => a.id === fa.assetId);
        if (!asset) return null;

        return (
          <Rnd
            key={fa.assetId}
            size={{ width: fa.width, height: fa.height }}
            position={{ x: fa.x, y: fa.y }}
            onDrag={(e, d) => {
              const result = getCenterSnapResult(
                d.x,
                d.y,
                fa.width,
                fa.height,
                fa.assetId,
              );

              setGuides(result.guides);
            }}
            onDragStop={(e, d) => {
              const result = getCenterSnapResult(
                d.x,
                d.y,
                fa.width,
                fa.height,
                fa.assetId,
              );

              updateFreeAsset(fa.assetId, {
                x: result.x,
                y: result.y,
              });

              setGuides({
                vertical: null,
                horizontal: null,
              });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateFreeAsset(fa.assetId, {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                ...position,
              });
            }}
            bounds="parent"
            dragGrid={[1, 1]}
            className="group"
          >
            <div
              className="w-full h-full relative"
              style={{
                borderRadius: `${settings.borderRadius}px`,
                boxShadow:
                  asset.type === "text"
                    ? "none"
                    : settings.showShadow
                      ? "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
                      : "none",
                backgroundColor:
                  asset.type === "text" && asset.backgroundColor
                    ? asset.backgroundColor
                    : "transparent",
              }}
            >
              {renderAsset(fa.assetId, asset.type)}
            </div>
          </Rnd>
        );
      })}
    </div>
  );
}
