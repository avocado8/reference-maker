import { useAssets } from "../store/AssetContext";
import { type TextAssetType } from "../types/assets";
import clsx from "clsx";
import AssetWrapper from "./AssetWrapper";
import { useCanvasSettings } from "../store/CanvasSettingsContext";

const DEFAULT_FONT_SIZE = 24;

function TextToolbar({ asset }: { asset: TextAssetType }) {
  const { updateAsset } = useAssets();
  const { settings } = useCanvasSettings();
  const currentSize = asset.fontSize ?? DEFAULT_FONT_SIZE;

  return (
    <>
      <label className="flex items-center gap-1 cursor-pointer" title="글씨 색">
        <span className="text-white text-xs">글씨 색</span>
        <input
          type="color"
          value={asset.color ?? "#000000"}
          onChange={(e) => updateAsset(asset.id, { color: e.target.value })}
          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
        />
      </label>
      <label
        className="flex items-center gap-1"
        title={`크기: ${currentSize}px`}
      >
        <span className="text-white text-xs">크기</span>
        <input
          type="range"
          min="10"
          max="96"
          step="1"
          value={currentSize}
          onChange={(e) =>
            updateAsset(asset.id, { fontSize: Number(e.target.value) })
          }
          className="w-20 accent-white"
        />
        <span className="text-white text-xs w-8">{currentSize}px</span>
      </label>
      {settings.mode === "free" ? (
        <label
          className="flex items-center gap-1 cursor-pointer"
          title="배경색"
        >
          <span className="text-white text-xs">배경색</span>
          <input
            type="color"
            value={asset.backgroundColor ?? "transparent"}
            onChange={(e) =>
              updateAsset(asset.id, { backgroundColor: e.target.value })
            }
            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
          />
        </label>
      ) : (
        <></>
      )}
    </>
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
          }}
          className={clsx(
            "w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-neutral-400",
          )}
        />
      </div>
    </AssetWrapper>
  );
}
