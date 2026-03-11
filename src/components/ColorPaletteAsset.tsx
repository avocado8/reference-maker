import { useAssets } from "../store/AssetContext";
import { type PaletteAssetType, type ColorItem } from "../types/assets";
import { Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import AssetWrapper from "./AssetWrapper";

function PaletteToolbar({ asset }: { asset: PaletteAssetType }) {
  const { updateAsset } = useAssets();
  const showAddButton = asset.showAddButton ?? true;

  return (
    <div className="min-w-[220px]">
      <p className="text-xs font-semibold text-neutral-300 px-4 py-2 border-b border-neutral-700">
        컬러 팔레트
      </p>
      <div className="flex flex-col gap-3 p-4">
        {/* 크기 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">크기</span>
          <div className="flex gap-1">
            {(["S", "M", "L"] as const).map((s) => (
              <button
                key={s}
                onClick={() => updateAsset(asset.id, { size: s })}
                className={clsx(
                  "text-xs font-bold w-8 py-1 rounded transition-all",
                  asset.size === s
                    ? "bg-white text-neutral-800"
                    : "text-white bg-white/20 hover:bg-white/30",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 추가 버튼 표시 여부 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">추가 버튼</span>
          <button
            onClick={() =>
              updateAsset(asset.id, { showAddButton: !showAddButton })
            }
            className={clsx(
              "text-xs px-3 py-1 rounded transition-colors",
              showAddButton
                ? "bg-blue-600 text-white"
                : "bg-white/20 text-white/70 hover:bg-white/30",
            )}
          >
            {showAddButton ? "표시" : "숨김"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ColorPaletteAssetProps {
  asset: PaletteAssetType;
}

export default function ColorPaletteAsset({ asset }: ColorPaletteAssetProps) {
  const { updateAsset } = useAssets();
  const showAddButton = asset.showAddButton ?? true;

  const handleAddColor = () => {
    if (asset.colors.length >= 5) return;
    const newColor: ColorItem = {
      id: crypto.randomUUID(),
      color: "#000000",
      showCaption: false,
      caption: "Color",
    };
    updateAsset(asset.id, { colors: [...asset.colors, newColor] });
  };

  const handleUpdateColor = (colorId: string, updates: Partial<ColorItem>) => {
    updateAsset(asset.id, {
      colors: asset.colors.map((c) =>
        c.id === colorId ? { ...c, ...updates } : c,
      ),
    });
  };

  const handleRemoveColor = (colorId: string) => {
    updateAsset(asset.id, {
      colors: asset.colors.filter((c) => c.id !== colorId),
    });
  };

  const sizeClasses = {
    S: "w-8 h-8",
    M: "w-12 h-12",
    L: "w-16 h-16",
  };

  return (
    <AssetWrapper assetId={asset.id} toolbar={<PaletteToolbar asset={asset} />}>
      <div className="w-full h-full p-4 flex items-center justify-center backdrop-blur">
        <div className="flex flex-wrap justify-center gap-1 py-5">
          {asset.colors.map((colorItem) => (
            <div
              key={colorItem.id}
              className="flex flex-col items-center gap-2 group/color relative"
            >
              <div className="relative">
                <label
                  className={clsx(
                    "block rounded-full border-4 border-white shadow-md transition-transform hover:scale-110 cursor-pointer overflow-hidden",
                    sizeClasses[asset.size],
                  )}
                  style={{ backgroundColor: colorItem.color }}
                >
                  <input
                    type="color"
                    value={colorItem.color}
                    onChange={(e) =>
                      handleUpdateColor(colorItem.id, { color: e.target.value })
                    }
                    className="sr-only"
                  />
                </label>

                <button
                  onClick={() => handleRemoveColor(colorItem.id)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/color:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {colorItem.showCaption && (
                <input
                  type="text"
                  value={colorItem.caption}
                  onChange={(e) =>
                    handleUpdateColor(colorItem.id, { caption: e.target.value })
                  }
                  className="text-xs font-bold text-center bg-transparent border-none outline-none w-16"
                  placeholder="Name"
                />
              )}
            </div>
          ))}

          {/* 추가 버튼: 5개 미만이고 showAddButton이 true일 때만 표시 */}
          {asset.colors.length < 5 && showAddButton && (
            <button
              onClick={handleAddColor}
              className={clsx(
                "flex items-center justify-center rounded-full border-2 border-dashed border-neutral-400 text-neutral-400 hover:border-neutral-500 hover:text-neutral-600 transition-all",
                sizeClasses[asset.size],
              )}
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      </div>
    </AssetWrapper>
  );
}
