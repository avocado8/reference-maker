import { useRef, useState, useEffect } from "react";
import {
  Upload,
  X,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MessageCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Minus,
} from "lucide-react";
import { useAssets } from "../store/AssetContext";
import type { StickerAssetType } from "../types/assets";
import { FONT_CONFIG } from "../config/consts";
import clsx from "clsx";
import SliderControl from "./SliderControl";
import BackgroundControl, { getBackgroundStyle } from "./BackgroundControl";
import DraggablePopover from "./DraggablePopover";
import { useImageUpload } from "../hooks/useImageUpload";

// 말풍선 꼬리 CSS 속성 생성 유틸리티
function getTailStyle(
  direction: "top" | "bottom" | "left" | "right",
  bgStyle: string,
): React.CSSProperties {
  const size = 8; // 꼬리 크기
  const offset = -size + 1; // 테두리와 겹치게 살짝 넣음
  const isGradient = bgStyle.includes("gradient");
  const color = isGradient
    ? "white"
    : bgStyle === "transparent"
      ? "transparent"
      : bgStyle;

  const effColor = color || "#ffffff";

  switch (direction) {
    case "top":
      return {
        top: offset,
        left: "50%",
        transform: "translateX(-50%)",
        borderWidth: `0 ${size}px ${size}px ${size}px`,
        borderColor: `transparent transparent ${effColor} transparent`,
      };
    case "bottom":
      return {
        bottom: offset,
        left: "50%",
        transform: "translateX(-50%)",
        borderWidth: `${size}px ${size}px 0 ${size}px`,
        borderColor: `${effColor} transparent transparent transparent`,
      };
    case "left":
      return {
        left: offset,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: `${size}px ${size}px ${size}px 0`,
        borderColor: `transparent ${effColor} transparent transparent`,
      };
    case "right":
      return {
        right: offset,
        top: "50%",
        transform: "translateY(-50%)",
        borderWidth: `${size}px 0 ${size}px ${size}px`,
        borderColor: `transparent transparent transparent ${effColor}`,
      };
    default:
      return {};
  }
}

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
  const STICKER_STYLE = {
    shadow:
      "drop-shadow(0px 4px 8px rgba(0,0,0,0.1)) drop-shadow(0px 1px 3px rgba(0,0,0,0.3))",
    border:
      "drop-shadow(2.5px 2.5px #fff) drop-shadow(2.5px -2.5px #fff) drop-shadow(-2.5px 2.5px #fff) drop-shadow(-2.5px -2.5px #fff)",
    none: "",
  };

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

  // ── 이미지 업로드 ──────────────────────────────────────
  const { handleImageUpload: handleFile } = useImageUpload({
    onSuccess: (url) => updateSticker(sticker.id, { url }),
  });

  // ── Popover Toggles ────────────────────────────────────
  return (
    <>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          left: sticker.x,
          top: sticker.y,
          width: sticker.stickerType === "image" ? displaySize : "max-content",
          height: sticker.stickerType === "image" ? displaySize : "max-content",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        className="group"
      >
        {/* 회전 적용 wrapper */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transform: `rotate(${sticker.rotate}deg)`,
            transformOrigin: "center center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {sticker.stickerType === "image" ? (
            <>
              {sticker.url ? (
                <>
                  <img
                    src={sticker.url}
                    alt=""
                    draggable={false}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      filter: STICKER_STYLE[sticker.style],
                      pointerEvents: "none",
                      display: "block",
                    }}
                  />
                  <div
                    className="text-xs mt-1 text-neutral-400 select-none text-center opacity-80"
                    style={{ pointerEvents: "none" }}
                  >
                    {sticker.showAttribution && sticker.attributionText}
                  </div>
                </>
              ) : (
                <div
                  className="w-full h-full min-w-[100px] min-h-[100px] rounded-xl border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center gap-2 bg-white/50"
                  style={{ pointerEvents: "none" }}
                >
                  <Upload size={24} className="text-neutral-400" />
                  <span className="text-xs text-neutral-400">
                    이미지 업로드
                  </span>
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                color: sticker.color || "#000000",
                fontSize: `${(sticker.fontSize || 24) * sticker.scale}px`,
                fontWeight: sticker.fontWeight || "normal",
                fontStyle: sticker.fontStyle || "normal",
                textAlign: sticker.textAlign || "center",
                lineHeight: sticker.lineHeight || 1.2,
                letterSpacing: sticker.letterSpacing
                  ? `${sticker.letterSpacing}px`
                  : undefined,
                whiteSpace: "pre-wrap",
                filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
                background: getBackgroundStyle(sticker),
                padding: "8px",
                position: "relative",
              }}
              className={clsx(
                "rounded-2xl",
                FONT_CONFIG[sticker.fontFamily ?? "dotum"].className,
              )}
            >
              {sticker.content}
              {/* 말풍선 꼬리 렌더링 */}
              {sticker.tailDirection && sticker.tailDirection !== "none" && (
                <div
                  style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    ...getTailStyle(
                      sticker.tailDirection,
                      getBackgroundStyle(sticker),
                    ),
                  }}
                />
              )}
            </div>
          )}
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

      {/* 설정 팝오버 (DraggablePopover 컴포넌트 적용) */}
      <DraggablePopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        excludeRefs={[dragRef]} // 스티커 내부 클릭(설정 버튼 등) 시 닫히지 않게 보호
        initialLeft={
          typeof popoverStyle.left === "number" ? popoverStyle.left : 0
        }
        initialTop={typeof popoverStyle.top === "number" ? popoverStyle.top : 0}
        minWidth={240}
      >
        <p className="text-xs font-semibold text-neutral-300 px-4 py-2 border-b border-neutral-700">
          {sticker.stickerType === "image" ? "이미지 스티커" : "텍스트 스티커"}
        </p>
        <div className="flex flex-col gap-3 p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {sticker.stickerType === "image" ? (
            <>
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
              <div className="flex gap-1">
                <span className="text-xs flex-1 text-neutral-400">스타일</span>
                {[
                  {
                    value: "shadow",
                    label: "그림자",
                  },
                  {
                    value: "border",
                    label: "칼선",
                  },
                  {
                    value: "none",
                    label: "없음",
                  },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      updateSticker(sticker.id, { style: style.value })
                    }
                    className={clsx(
                      "text-xs p-1 rounded transition-colors",
                      (sticker.style ?? "none") === style.value
                        ? "bg-white text-neutral-800"
                        : "text-white/70 bg-white/20 hover:bg-white/30",
                    )}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* 말풍선 꼬리 */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <MessageCircle size={12} className="text-neutral-400" />
                  <span className="text-xs text-neutral-400">말풍선 꼬리</span>
                </div>
                <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-lg">
                  {(
                    [
                      {
                        value: "none",
                        icon: <Minus size={14} />,
                        label: "없음",
                      },
                      {
                        value: "top",
                        icon: <ArrowUp size={14} />,
                        label: "위",
                      },
                      {
                        value: "bottom",
                        icon: <ArrowDown size={14} />,
                        label: "아래",
                      },
                      {
                        value: "left",
                        icon: <ArrowLeft size={14} />,
                        label: "왼쪽",
                      },
                      {
                        value: "right",
                        icon: <ArrowRight size={14} />,
                        label: "오른쪽",
                      },
                    ] as const
                  ).map(({ value, icon, label }) => (
                    <button
                      key={value}
                      onClick={() =>
                        updateSticker(sticker.id, { tailDirection: value })
                      }
                      title={label}
                      className={clsx(
                        "flex-1 flex justify-center p-1.5 rounded transition-colors",
                        (sticker.tailDirection ?? "none") === value
                          ? "bg-white text-neutral-800 shadow"
                          : "text-white/70 hover:bg-white/20 hover:text-white",
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  내용
                </label>
                <textarea
                  value={sticker.content}
                  onChange={(e) =>
                    updateSticker(sticker.id, { content: e.target.value })
                  }
                  className="w-full text-xs bg-neutral-700 text-white rounded px-2 py-1.5 outline-none border border-neutral-600 focus:border-blue-500 min-h-[60px] resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-400 mb-1">
                  글자 색상
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={sticker.color || "#000000"}
                    onChange={(e) =>
                      updateSticker(sticker.id, { color: e.target.value })
                    }
                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-neutral-400 uppercase">
                    {sticker.color || "#000000"}
                  </span>
                </div>
              </div>

              {/* 글꼴 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">글꼴</span>
                <select
                  value={sticker.fontFamily ?? "dotum"}
                  onChange={(e) => {
                    const key = e.target.value as keyof typeof FONT_CONFIG;
                    updateSticker(sticker.id, { fontFamily: key });
                  }}
                  className="w-32 bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                >
                  {Object.entries(FONT_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 수평 정렬 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">수평 정렬</span>
                <div className="flex gap-1">
                  {(
                    [
                      {
                        value: "left",
                        icon: <AlignLeft size={14} />,
                        label: "왼쪽",
                      },
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
                      onClick={() =>
                        updateSticker(sticker.id, { textAlign: value })
                      }
                      title={label}
                      className={clsx(
                        "p-1.5 rounded transition-colors",
                        (sticker.textAlign ?? "center") === value
                          ? "bg-white text-neutral-800"
                          : "text-white/70 bg-white/20 hover:bg-white/30",
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* 굵기/스타일 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">스타일</span>
                <div className="flex gap-1">
                  {(
                    [
                      {
                        value: "normal" as const,
                        label: "기본",
                        assetUpdates: {
                          fontWeight: "normal",
                          fontStyle: "normal",
                        },
                        isActive:
                          (sticker.fontWeight ?? "normal") === "normal" &&
                          (sticker.fontStyle ?? "normal") === "normal",
                      },
                      {
                        value: "bold" as const,
                        label: "Bold",
                        assetUpdates: {
                          fontWeight: "bold",
                          fontStyle: "normal",
                        },
                        isActive: sticker.fontWeight === "bold",
                      },
                      {
                        value: "italic" as const,
                        label: "Italic",
                        assetUpdates: {
                          fontWeight: "normal",
                          fontStyle: "italic",
                        },
                        isActive: sticker.fontStyle === "italic",
                      },
                    ] as const
                  ).map(({ value, label, assetUpdates, isActive }) => (
                    <button
                      key={value}
                      onClick={() => updateSticker(sticker.id, assetUpdates)}
                      className={clsx(
                        "text-xs px-3 py-1 rounded transition-colors",
                        value === "bold" && "font-bold",
                        value === "italic" && "italic",
                        isActive
                          ? "bg-white text-neutral-800"
                          : "text-white/70 bg-white/20 hover:bg-white/30",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 배경 설정 */}
              <BackgroundControl
                backgroundType={sticker.backgroundType}
                backgroundColor={sticker.backgroundColor}
                gradientColorStart={sticker.gradientColorStart}
                gradientColorEnd={sticker.gradientColorEnd}
                gradientAngle={sticker.gradientAngle}
                onChange={(updates) => updateSticker(sticker.id, updates)}
              />
            </div>
          )}

          {/* 공통 컨트롤: 크기, 회전 */}
          <div>
            <SliderControl
              value={sticker.scale}
              onChange={(value) => updateSticker(sticker.id, { scale: value })}
              min={0.2}
              max={5}
              step={0.1}
              label="크기"
            />
          </div>

          <div>
            <SliderControl
              value={sticker.rotate}
              onChange={(value) => updateSticker(sticker.id, { rotate: value })}
              min={0}
              max={360}
              step={1}
              label="각도"
            />
          </div>

          {sticker.stickerType === "image" && (
            <>
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
            </>
          )}
        </div>
      </DraggablePopover>
    </>
  );
}
