import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import clsx from "clsx";
import { useAssets } from "../store/AssetContext";
import type { ImageAssetType } from "../types/assets";
import AssetWrapper from "./AssetWrapper";

interface ImageAssetProps {
  asset: ImageAssetType;
}

function ImageToolbar({ asset }: { asset: ImageAssetType }) {
  const { updateAsset } = useAssets();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-w-[260px]">
      <p className="text-xs font-semibold text-neutral-300 px-4 py-2 border-b border-neutral-700">
        이미지
      </p>
      <div className="flex flex-col gap-3 p-4">
        {/* 이미지 변경 + 크기 슬라이더 + 초기화 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-white text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors shrink-0"
          >
            변경
          </button>
          {asset.url && (
            <>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={asset.scale}
                onChange={(e) =>
                  updateAsset(asset.id, { scale: parseFloat(e.target.value) })
                }
                className="flex-1 accent-white"
                title={`크기: ${Math.round(asset.scale * 100)}%`}
              />
              <span className="text-xs text-neutral-400 w-8 text-right shrink-0">
                {Math.round(asset.scale * 100)}%
              </span>
              <button
                onClick={() =>
                  updateAsset(asset.id, { panX: 0, panY: 0, scale: 1 })
                }
                className="text-white text-xs bg-white/20 hover:bg-white/30 px-2 py-1.5 rounded transition-colors shrink-0"
              >
                초기화
              </button>
            </>
          )}
        </div>

        {/* 출처 표기 on/off */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">출처 표기</span>
          <button
            onClick={() =>
              updateAsset(asset.id, {
                showAttribution: !asset.showAttribution,
              })
            }
            className={clsx(
              "text-xs px-3 py-1 rounded transition-colors",
              asset.showAttribution
                ? "bg-blue-600 text-white"
                : "bg-white/20 text-white/70 hover:bg-white/30",
            )}
          >
            {asset.showAttribution ? "ON" : "OFF"}
          </button>
        </div>

        {/* 출처 텍스트 입력 (ON일 때만) */}
        {asset.showAttribution && (
          <input
            type="text"
            value={asset.attributionText ?? ""}
            onChange={(e) =>
              updateAsset(asset.id, { attributionText: e.target.value })
            }
            placeholder="출처 텍스트 입력..."
            className="w-full text-xs bg-neutral-700 text-white rounded px-2 py-1.5 outline-none border border-neutral-600 focus:border-blue-500"
          />
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) updateAsset(asset.id, { url: URL.createObjectURL(file) });
        }}
        className="hidden"
      />
    </div>
  );
}

export default function ImageAsset({ asset }: ImageAssetProps) {
  const { updateAsset } = useAssets();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!asset.url) return;
    if ((e.target as HTMLElement).closest("button, input")) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const originPanX = asset.panX;
    const originPanY = asset.panY;

    const handleMove = (ev: MouseEvent) => {
      updateAsset(asset.id, {
        panX: originPanX + (ev.clientX - startX),
        panY: originPanY + (ev.clientY - startY),
      });
    };

    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  return (
    <AssetWrapper assetId={asset.id} toolbar={<ImageToolbar asset={asset} />}>
      <div className="w-full h-full relative select-none">
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            cursor: asset.url ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onMouseDown={handleMouseDown}
        >
          {asset.url ? (
            <img
              src={asset.url}
              alt="Uploaded"
              draggable={false}
              className="w-full h-full object-contain"
              style={{
                transform: `translate(${asset.panX}px, ${asset.panY}px) scale(${asset.scale})`,
                transformOrigin: "center",
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-neutral-400 pointer-events-none">
              <Upload size={32} />
              <span className="text-sm font-medium">
                하단의 설정 버튼으로 이미지 업로드
              </span>
            </div>
          )}
        </div>

        {/* 출처 표기 오버레이 (내보내기에 포함됨) */}
        {asset.showAttribution && (
          <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-neutral-600 px-2 py-0.5 bg-white/80 pointer-events-none">
            {asset.attributionText || ""}
          </div>
        )}
      </div>
    </AssetWrapper>
  );
}
