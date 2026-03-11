import { createPortal } from "react-dom";
import { useRef, useState, useEffect } from "react";
import { Upload, X, Settings } from "lucide-react";
import { useAssets } from "../store/AssetContext";
import type { StickerAssetType } from "../types/assets";
import clsx from "clsx";

interface StickerAssetProps {
  sticker: StickerAssetType;
  canvasScale: number;
}

export default function StickerAsset({
  sticker,
  canvasScale,
}: StickerAssetProps) {
  const { updateSticker, removeSticker } = useAssets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number }>({
    mx: 0,
    my: 0,
    ox: 0,
    oy: 0,
  });

  const BASE_SIZE = 150; // scale=1 일 때 최대 변 길이 (px in canvas space)
  const displaySize = BASE_SIZE * sticker.scale;

  // ── 드래그 ─────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-sticker-control]")) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      ox: sticker.x,
      oy: sticker.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragStart.current.mx) / canvasScale;
      const dy = (e.clientY - dragStart.current.my) / canvasScale;
      updateSticker(sticker.id, {
        x: dragStart.current.ox + dx,
        y: dragStart.current.oy + dy,
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, canvasScale, sticker.id, updateSticker]);

  // ── 팝오버 ────────────────────────────────────────────
  const openPopover = () => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    const popoverWidth = 240;
    let left = rect.right + 8;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = rect.left - popoverWidth - 8;
    }
    left = Math.max(8, left);
    let top = rect.top;
    if (top + 280 > window.innerHeight) {
      top = Math.max(8, window.innerHeight - 280);
    }
    setPopoverStyle({ left, top, minWidth: popoverWidth });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = (e: MouseEvent) => {
      if (
        !popoverRef.current?.contains(e.target as Node) &&
        !dragRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => setIsOpen(false);
    document.addEventListener("mousedown", handleClose);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // ── 이미지 업로드 ──────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateSticker(sticker.id, { url });
    e.target.value = "";
  };

  return (
    <>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          left: sticker.x,
          top: sticker.y,
          width: displaySize,
          height: displaySize,
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          backgroundColor: sticker.url ? "transparent" : "white",
        }}
        className="group"
      >
        {/* 이미지 본체 */}
        {sticker.url ? (
          <img
            src={sticker.url}
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter:
                "drop-shadow(0px 4px 8px rgba(0,0,0,0.1)) drop-shadow(0px 1px 3px rgba(0,0,0,0.3))",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            className="w-full h-full rounded-xl border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center gap-2 bg-white/10"
            style={{ pointerEvents: "none" }}
          >
            <Upload size={24} className="text-neutral-400" />
            <span className="text-xs text-neutral-400">스티커 이미지</span>
          </div>
        )}

        <div
          className="absolute bottom-2 right-4 text-xs text-neutral-400 select-none"
          style={{ pointerEvents: "none" }}
        >
          {sticker.showAttribution && sticker.attributionText}
        </div>

        {/* 컨트롤 버튼들 (hover 시 표시) */}
        <div
          data-sticker-control
          data-export-ignore="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ pointerEvents: "none" }}
        >
          {/* 삭제 버튼 */}
          <button
            data-sticker-control
            onClick={(e) => {
              e.stopPropagation();
              removeSticker(sticker.id);
            }}
            style={{ pointerEvents: "auto" }}
            className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center shadow-md transition-colors"
          >
            <X size={12} />
          </button>

          {/* 설정 버튼 */}
          <button
            data-sticker-control
            onClick={(e) => {
              e.stopPropagation();
              openPopover();
            }}
            style={{ pointerEvents: "auto" }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center shadow-md transition-colors"
          >
            <Settings size={12} />
          </button>
        </div>
      </div>

      {/* 팝오버 (portal) */}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              zIndex: 9999,
              ...popoverStyle,
            }}
            className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
          >
            <p className="text-xs font-semibold text-neutral-300 px-4 py-2 border-b border-neutral-700">
              스티커
            </p>
            <div className="flex flex-col gap-3 p-4">
              {/* 이미지 업로드 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-white text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition-colors"
              >
                {sticker.url ? "이미지 변경" : "이미지 업로드"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />

              {/* 크기 슬라이더 */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  크기: {Math.round(sticker.scale * 100)}%
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="5"
                  step="0.1"
                  value={sticker.scale}
                  onChange={(e) =>
                    updateSticker(sticker.id, {
                      scale: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-white"
                />
              </div>

              {/* 출처 표기 on/off */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">출처 표기</span>
                <button
                  onClick={() =>
                    updateSticker(sticker.id, {
                      showAttribution: !sticker.showAttribution,
                    })
                  }
                  className={clsx(
                    "text-xs px-3 py-1 rounded transition-colors",
                    sticker.showAttribution
                      ? "bg-blue-600 text-white"
                      : "bg-white/20 text-white/70 hover:bg-white/30",
                  )}
                >
                  {sticker.showAttribution ? "ON" : "OFF"}
                </button>
              </div>

              {/* 출처 텍스트 입력 (ON일 때만) */}
              {sticker.showAttribution && (
                <input
                  type="text"
                  value={sticker.attributionText ?? ""}
                  onChange={(e) =>
                    updateSticker(sticker.id, {
                      attributionText: e.target.value,
                    })
                  }
                  placeholder="출처 텍스트 입력..."
                  className="w-full text-xs bg-neutral-700 text-white rounded px-2 py-1.5 outline-none border border-neutral-600 focus:border-blue-500"
                />
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
