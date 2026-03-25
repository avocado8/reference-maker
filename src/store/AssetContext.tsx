import * as Sentry from "@sentry/react";
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type {
  AssetType,
  ImageAssetType,
  TextAssetType,
  PaletteAssetType,
  FreeAssetType,
  StickerAssetType,
} from "../types/assets";

interface AssetContextType {
  assets: (ImageAssetType | TextAssetType | PaletteAssetType)[];
  freeAssets: FreeAssetType[];
  templateSlots: Record<string, string>; // slotId -> assetId
  stickerAssets: StickerAssetType[];
  addAsset: (type: AssetType, initialData?: any) => string;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, updates: any) => void;
  updateFreeAsset: (assetId: string, updates: Partial<FreeAssetType>) => void;
  setTemplateSlot: (slotId: string, assetId: string) => void;
  addSticker: (stickerType: "image" | "text") => string;
  updateSticker: (id: string, updates: any) => void;
  removeSticker: (id: string) => void;
  clearAll: () => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<
    (ImageAssetType | TextAssetType | PaletteAssetType)[]
  >([]);
  const [freeAssets, setFreeAssets] = useState<FreeAssetType[]>([]);
  const [templateSlots, setTemplateSlots] = useState<Record<string, string>>(
    {},
  );
  const [stickerAssets, setStickerAssets] = useState<StickerAssetType[]>([]);

  const addAsset = useCallback((type: AssetType, initialData?: any): string => {
    Sentry.captureMessage(`add ${type} asset`);
    const id = crypto.randomUUID();
    let newAsset: ImageAssetType | TextAssetType | PaletteAssetType;

    switch (type) {
      case "image":
        newAsset = {
          id,
          type: "image",
          url: initialData?.url || "",
          scale: 1,
          panX: 0,
          panY: 0,
        };
        break;
      case "text":
        newAsset = {
          id,
          type: "text",
          content: "",
        };
        break;
      case "palette":
        newAsset = {
          id,
          type: "palette",
          size: "M",
          colors: [
            {
              id: crypto.randomUUID(),
              color: "#3b82f6",
              showCaption: true,
              caption: "Hair",
            },
          ],
        };
        break;
      default:
        return "";
    }

    setAssets((prev) => [...prev, newAsset]);

    // 자유 배치 모드일 경우 초기 위치 설정
    setFreeAssets((prev) => [
      ...prev,
      { assetId: id, x: 50, y: 50, width: 300, height: 200 },
    ]);

    return id;
  }, []);

  const removeAsset = useCallback((id: string) => {
    Sentry.captureMessage(`remove asset`);
    setAssets((prev) => {
      const assetToRemove = prev.find((a) => a.id === id);
      if (
        assetToRemove?.type === "image" &&
        assetToRemove.url.startsWith("blob:")
      ) {
        URL.revokeObjectURL(assetToRemove.url);
      }
      return prev.filter((a) => a.id !== id);
    });
    setFreeAssets((prev) => prev.filter((a) => a.assetId !== id));
    setTemplateSlots((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === id) delete next[k];
      });
      return next;
    });
  }, []);

  const updateAsset = useCallback((id: string, updates: any) => {
    Sentry.captureMessage(`update asset`);
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  }, []);

  const updateFreeAsset = useCallback(
    (assetId: string, updates: Partial<FreeAssetType>) => {
      setFreeAssets((prev) =>
        prev.map((a) => (a.assetId === assetId ? { ...a, ...updates } : a)),
      );
    },
    [],
  );

  const setTemplateSlot = useCallback((slotId: string, assetId: string) => {
    setTemplateSlots((prev) => ({ ...prev, [slotId]: assetId }));
  }, []);

  const addSticker = useCallback((stickerType: "image" | "text"): string => {
    Sentry.captureMessage(`add ${stickerType} sticker`);
    const id = crypto.randomUUID();
    const offset = Math.floor(Math.random() * 100);
    const base = {
      id,
      scale: 1,
      x: 80 + offset,
      y: 80 + offset,
      rotate: 0,
      type: "sticker" as const,
    };

    if (stickerType === "image") {
      setStickerAssets((prev) => [
        ...prev,
        { ...base, stickerType: "image", url: "" },
      ]);
    } else {
      setStickerAssets((prev) => [
        ...prev,
        { ...base, stickerType: "text", content: "새 텍스트" },
      ]);
    }
    return id;
  }, []);

  const updateSticker = useCallback((id: string, updates: any) => {
    setStickerAssets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  }, []);

  const removeSticker = useCallback((id: string) => {
    Sentry.captureMessage(`remove sticker`);
    setStickerAssets((prev) => {
      const stickerToRemove = prev.find((s) => s.id === id);
      if (
        stickerToRemove?.stickerType === "image" &&
        stickerToRemove.url.startsWith("blob:")
      ) {
        URL.revokeObjectURL(stickerToRemove.url);
      }
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    assets.forEach((a) => {
      if (a.type === "image" && a.url.startsWith("blob:")) {
        URL.revokeObjectURL(a.url);
      }
    });
    stickerAssets.forEach((s) => {
      if (s.stickerType === "image" && s.url.startsWith("blob:")) {
        URL.revokeObjectURL(s.url);
      }
    });
    setAssets([]);
    setFreeAssets([]);
    setTemplateSlots({});
    setStickerAssets([]);
  }, [assets, stickerAssets]);

  return (
    <AssetContext.Provider
      value={{
        assets,
        freeAssets,
        templateSlots,
        stickerAssets,
        addAsset,
        removeAsset,
        updateAsset,
        updateFreeAsset,
        setTemplateSlot,
        addSticker,
        updateSticker,
        removeSticker,
        clearAll,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
}
