import { useAssets } from "../store/AssetContext";
import { type TextAssetType } from "../types/assets";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
} from "lucide-react";
import clsx from "clsx";
import AssetWrapper from "./AssetWrapper";
import { useEffect, useRef } from "react";

const DEFAULT_FONT_SIZE = 16;

function TextToolbar({ asset }: { asset: TextAssetType }) {
  const { updateAsset } = useAssets();
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
            max="120"
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

        {/* 자간 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 w-6 shrink-0">자간</span>
          <input
            type="range"
            min="-6"
            max="10"
            step="1"
            value={asset.letterSpacing ?? 0}
            onChange={(e) =>
              updateAsset(asset.id, { letterSpacing: Number(e.target.value) })
            }
            className="flex-1 accent-white"
          />
          <span className="text-xs text-neutral-400 w-10 text-right shrink-0">
            {asset.letterSpacing ?? 0}px
          </span>
        </div>

        {/* 행간 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 w-6 shrink-0">행간</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={asset.lineHeight ?? 0}
            onChange={(e) =>
              updateAsset(asset.id, { lineHeight: Number(e.target.value) })
            }
            className="flex-1 accent-white"
          />
          <span className="text-xs text-neutral-400 w-10 text-right shrink-0">
            {asset.lineHeight ?? 0}px
          </span>
        </div>

        {/* 수평 정렬 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">수평 정렬</span>
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

        {/* 수직 정렬 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">수직 정렬</span>
          <div className="flex gap-1">
            {(
              [
                {
                  value: "top",
                  icon: <AlignVerticalJustifyStart size={14} />,
                  label: "상단",
                },
                {
                  value: "middle",
                  icon: <AlignVerticalJustifyCenter size={14} />,
                  label: "중앙",
                },
                {
                  value: "bottom",
                  icon: <AlignVerticalJustifyEnd size={14} />,
                  label: "하단",
                },
              ] as const
            ).map(({ value, icon, label }) => (
              <button
                key={value}
                onClick={() => updateAsset(asset.id, { verticalAlign: value })}
                title={label}
                className={clsx(
                  "p-1.5 rounded transition-colors",
                  (asset.verticalAlign ?? "top") === value
                    ? "bg-white text-neutral-800"
                    : "text-white/70 bg-white/20 hover:bg-white/30",
                )}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* 모양 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">굵기</span>
          <div className="flex gap-1">
            {(
              [
                { value: "normal", label: "기본" },
                { value: "bold", label: "Bold" },
                { value: "italic", label: "Italic" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  updateAsset(asset.id, {
                    fontWeight: value,
                    fontStyle: value === "italic" ? "italic" : "normal",
                  })
                }
                className={clsx(
                  "text-xs px-3 py-1 rounded transition-colors",
                  value === "bold" && "font-bold",
                  value === "italic" && "italic",
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

        {/* 배경색 */}
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

        {/* 폰트 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">폰트</span>
          <select
            value={asset.fontFamily ?? "sans"}
            onChange={(e) =>
              updateAsset(asset.id, { fontFamily: e.target.value as any })
            }
            className="w-32 bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="sans">기본 고딕</option>
            <option value="dotum">Pretendard</option>
            <option value="batang">KoPub Batang</option>
            <option value="handwrite">손글씨</option>
          </select>
        </div>
      </div>
    </div>
  );
}

interface TextAssetProps {
  asset: TextAssetType;
}

export default function TextAsset({ asset }: TextAssetProps) {
  const { updateAsset } = useAssets();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 내용이나 폰트 설정이 바뀔 때마다 높이 자동 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 높이를 초기화한 후 scrollHeight를 측정해야 정확한 높이를 얻을 수 있음
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [asset.content, asset.fontSize, asset.fontFamily, asset.fontWeight]);

  const verticalAlign = asset.verticalAlign ?? "top";

  return (
    <AssetWrapper assetId={asset.id} toolbar={<TextToolbar asset={asset} />}>
      <div
        className={clsx(
          "w-full h-full p-2 transition-colors duration-200 flex flex-col overflow-hidden min-h-0 cursor-text",
          verticalAlign === "middle"
            ? "justify-center"
            : verticalAlign === "bottom"
              ? "justify-end"
              : "justify-start",
        )}
        style={{ backgroundColor: asset.backgroundColor ?? "transparent" }}
        onClick={() => textareaRef.current?.focus()}
      >
        <textarea
          ref={textareaRef}
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
            fontStyle: asset.fontStyle ?? "normal",
            maxHeight: "100%",
            letterSpacing: asset.letterSpacing
              ? `${asset.letterSpacing}px`
              : undefined,
            lineHeight: asset.lineHeight ? `${asset.lineHeight}px` : undefined,
          }}
          className={clsx(
            "w-full bg-transparent border-none outline-none resize-none overflow-hidden placeholder:text-neutral-400 shrink-0",
            asset.fontFamily === "dotum"
              ? "font-dotum"
              : asset.fontFamily === "batang"
                ? "font-batang"
                : asset.fontFamily === "handwrite"
                  ? "font-handwrite"
                  : "font-sans",
          )}
        />
      </div>
    </AssetWrapper>
  );
}
