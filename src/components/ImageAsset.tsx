import { useRef, useState } from "react";
import { Upload } from "lucide-react";
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
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-white text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
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
            className="w-20 accent-white"
            title={`크기: ${Math.round(asset.scale * 100)}%`}
          />
          <button
            onClick={() =>
              updateAsset(asset.id, { panX: 0, panY: 0, scale: 1 })
            }
            className="text-white text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
          >
            위치 초기화
          </button>
        </>
      )}
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
    </>
  );
}

export default function ImageAsset({ asset }: ImageAssetProps) {
  const { updateAsset } = useAssets();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!asset.url) return;
    if ((e.target as HTMLElement).closest("button, input")) return;
    e.preventDefault();

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
      <div
        className="w-full h-full flex items-center justify-center select-none"
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
              하단의 변경 버튼으로 이미지 업로드
            </span>
          </div>
        )}
      </div>
    </AssetWrapper>
  );
}
