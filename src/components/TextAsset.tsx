import { useAssets } from "../store/AssetContext";
import { type TextAssetType } from "../types/assets";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import clsx from "clsx";
import AssetWrapper from "./AssetWrapper";
import { useCanvasSettings } from "../store/CanvasSettingsContext";

const DEFAULT_FONT_SIZE = 16;

function TextToolbar({ asset }: { asset: TextAssetType }) {
  const { updateAsset } = useAssets();
  const { settings } = useCanvasSettings();
  const currentSize = asset.fontSize ?? DEFAULT_FONT_SIZE;

  return (
    <div className="min-w-[260px]">
      <p className="text-xs font-semibold text-neutral-300 px-4 py-2 border-b border-neutral-700">
        텍스트
      </p>
      <div className="flex flex-col gap-3 p-4">
        {/* 글씨 색 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">글씨 색</span>
          <input
            type="color"
            value={asset.color ?? "#000000"}
            onChange={(e) => updateAsset(asset.id, { color: e.target.value })}
            className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
          />
        </div>

        {/* 크기 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 w-6 shrink-0">크기</span>
          <input
            type="range"
            min="10"
            max="96"
            step="1"
            value={currentSize}
            onChange={(e) =>
              updateAsset(asset.id, { fontSize: Number(e.target.value) })
            }
            className="flex-1 accent-white"
          />
          <span className="text-xs text-neutral-400 w-10 text-right shrink-0">
            {currentSize}px
          </span>
        </div>

        {/* 정렬 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">정렬</span>
          <div className="flex gap-1">
            {(
              [
                { value: "left", icon: <AlignLeft size={14} />, label: "왼쪽" },
                {
                  value: "center",
                  icon: <AlignCenter size={14} />,
                  label: "가운데",
                },
                {
                  value: "right",
                  icon: <AlignRight size={14} />,
                  label: "오른쪽",
                },
              ] as const
            ).map(({ value, icon, label }) => (
              <button
                key={value}
                onClick={() => updateAsset(asset.id, { textAlign: value })}
                title={label}
                className={clsx(
                  "p-1.5 rounded transition-colors",
                  (asset.textAlign ?? "left") === value
                    ? "bg-white text-neutral-800"
                    : "text-white/70 bg-white/20 hover:bg-white/30",
                )}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* 굵기 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">굵기</span>
          <div className="flex gap-1">
            {(
              [
                { value: "normal", label: "기본" },
                { value: "bold", label: "Bold" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateAsset(asset.id, { fontWeight: value })}
                className={clsx(
                  "text-xs px-3 py-1 rounded transition-colors",
                  value === "bold" && "font-bold",
                  (asset.fontWeight ?? "normal") === value
                    ? "bg-white text-neutral-800"
                    : "text-white/70 bg-white/20 hover:bg-white/30",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 배경색 (자유 배치 모드만) */}
        {settings.mode === "free" && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">배경색</span>
            <input
              type="color"
              value={asset.backgroundColor ?? "#ffffff"}
              onChange={(e) =>
                updateAsset(asset.id, { backgroundColor: e.target.value })
              }
              className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface TextAssetProps {
  asset: TextAssetType;
}

export default function TextAsset({ asset }: TextAssetProps) {
  const { updateAsset } = useAssets();

  return (
    <AssetWrapper assetId={asset.id} toolbar={<TextToolbar asset={asset} />}>
      <div className="w-full h-full p-2">
        <textarea
          value={asset.content}
          onChange={(e) => updateAsset(asset.id, { content: e.target.value })}
          placeholder="텍스트를 입력하세요..."
          style={{
            color: asset.color ?? undefined,
            fontSize: asset.fontSize
              ? `${asset.fontSize}px`
              : `${DEFAULT_FONT_SIZE}px`,
            textAlign: asset.textAlign ?? "left",
            fontWeight: asset.fontWeight ?? "normal",
          }}
          className={clsx(
            "w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-neutral-400",
          )}
        />
      </div>
    </AssetWrapper>
  );
}
