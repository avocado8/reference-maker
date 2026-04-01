import { ImageIcon, Palette, Plus, Type } from "lucide-react";
import { useRef, useState } from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import { useAssets } from "../store/AssetContext";
import type {
  AssetType,
  ImageAssetType,
  PaletteAssetType,
  TextAssetType,
} from "../types/assets";
import ColorPaletteAsset from "./ColorPaletteAsset";
import ImageAsset from "./ImageAsset";
import TextAsset from "./TextAsset";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assetId = templateSlots[slotId];
  const asset = assetId ? assets.find((a) => a.id === assetId) : undefined;

  const handleAdd = (type: AssetType, textType?: string, initialData?: any) => {
    const id = addAsset(
      type,
      textType ? { textType, ...initialData } : initialData,
    );
    setTemplateSlot(slotId, id);
    setShowPicker(false);
  };

  const { handleImageUpload: handleImageChange } = useImageUpload({
    onSuccess: (url) => handleAdd("image", undefined, { url }),
  });

  // 에셋이 있으면 AssetWrapper가 내장된 각 컴포넌트를 그대로 렌더링
  // (X 버튼, 툴바는 AssetWrapper가 제공)
  if (asset) {
    // const isTextAsset = asset.type === "text";
    const isTransparent = asset.backgroundType === "transparent";

    return (
      <div
        className={`w-full h-full ${className || ""} ${!isTransparent ? "bg-neutral-100 shadow-md" : ""} transition-colors duration-200`}
      >
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
      if (only === "image") {
        fileInputRef.current?.click();
      } else {
        handleAdd(only, only === "text" ? "body" : undefined);
      }
    } else {
      setShowPicker(true);
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-200 shadow-md ${className || ""}`}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />
      {showPicker ? (
        <>
          <p className="text-xs text-neutral-400">추가할 유형 선택</p>
          <div className="flex gap-2">
            {isAllowed("image") && (
              <button
                onClick={() => fileInputRef.current?.click()}
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
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-500 transition-colors"
        >
          <Plus size={20} />
          <span className="text-xs text-neutral-400">
            {placeholder || "추가"}
          </span>
        </button>
      )}
    </div>
  );
}
