import { useState } from "react";
import { useAssets } from "../store/AssetContext";
import type { AssetType } from "../types/assets";
import type {
  ImageAssetType,
  TextAssetType,
  PaletteAssetType,
} from "../types/assets";
import ImageAsset from "./ImageAsset";
import TextAsset from "./TextAsset";
import ColorPaletteAsset from "./ColorPaletteAsset";
import { ImageIcon, Palette, Plus, Type } from "lucide-react";

interface TemplateZoneProps {
  slotId: string;
  placeholder?: string;
  className?: string;
  allowedTypes?: AssetType[];
}

export default function TemplateZone({
  slotId,
  placeholder,
  className,
  allowedTypes,
}: TemplateZoneProps) {
  const { assets, addAsset, templateSlots, setTemplateSlot } = useAssets();
  const [showPicker, setShowPicker] = useState(false);

  const assetId = templateSlots[slotId];
  const asset = assetId ? assets.find((a) => a.id === assetId) : undefined;

  const handleAdd = (type: AssetType, textType?: string) => {
    const id = addAsset(type, textType ? { textType } : undefined);
    setTemplateSlot(slotId, id);
    setShowPicker(false);
  };

  // 에셋이 있으면 AssetWrapper가 내장된 각 컴포넌트를 그대로 렌더링
  // (X 버튼, 툴바는 AssetWrapper가 제공)
  if (asset) {
    return (
      <div className={`w-full h-full ${className || ""}`}>
        {asset.type === "image" && (
          <ImageAsset asset={asset as ImageAssetType} />
        )}
        {asset.type === "text" && <TextAsset asset={asset as TextAssetType} />}
        {asset.type === "palette" && (
          <ColorPaletteAsset asset={asset as PaletteAssetType} />
        )}
      </div>
    );
  }

  const isAllowed = (type: AssetType) =>
    !allowedTypes || allowedTypes.includes(type);

  const onClickAdd = () => {
    if (allowedTypes?.length === 1) {
      const only = allowedTypes[0];
      handleAdd(only, only === "text" ? "body" : undefined);
    } else {
      setShowPicker(true);
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center gap-2 ${className || ""}`}
    >
      {showPicker ? (
        <>
          <p className="text-xs text-neutral-400">추가할 유형 선택</p>
          <div className="flex gap-2">
            {isAllowed("image") && (
              <button
                onClick={() => handleAdd("image")}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs text-neutral-600 transition-colors border border-neutral-300"
              >
                <ImageIcon size={16} />
                이미지
              </button>
            )}
            {isAllowed("text") && (
              <button
                onClick={() => handleAdd("text", "body")}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs text-neutral-600 transition-colors border border-neutral-300"
              >
                <Type size={16} />
                텍스트
              </button>
            )}
            {isAllowed("palette") && (
              <button
                onClick={() => handleAdd("palette")}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs text-neutral-600 transition-colors border border-neutral-300"
              >
                <Palette size={16} />
                팔레트
              </button>
            )}
          </div>
          <button
            onClick={() => setShowPicker(false)}
            className="text-xs text-neutral-400 hover:text-neutral-600 mt-1"
          >
            취소
          </button>
        </>
      ) : (
        <button
          onClick={onClickAdd}
          className="flex flex-col items-center gap-1 text-neutral-300 hover:text-neutral-500 transition-colors"
        >
          <Plus size={20} />
          <span className="text-xs">{placeholder || "추가"}</span>
        </button>
      )}
    </div>
  );
}
