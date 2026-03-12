import { useAssets } from "../store/AssetContext";
import { type TextAssetType } from "../types/assets";
import { FONT_CONFIG, type FontFamily } from "../config/consts";
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
import SliderControl from "./SliderControl";
import BackgroundControl, { getBackgroundStyle } from "./BackgroundControl";
import { useEffect, useRef, useCallback, useState } from "react";

const DEFAULT_FONT_SIZE = 16;

function rgbToHex(rgb: string): string {
  const m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!m) return "#000000";
  return (
    "#" +
    [m[1], m[2], m[3]]
      .map((n) => Number(n).toString(16).padStart(2, "0"))
      .join("")
  );
}

interface ActiveStyles {
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  color: string;
  fontSize: number;
  fontFamily: FontFamily;
}

// 계산된 CSS font-family 문자열을 FONT_CONFIG 키로 역매핑
function matchFontFamily(computed: string): FontFamily {
  const norm = computed.toLowerCase().replace(/["']/g, "");
  for (const [key, config] of Object.entries(FONT_CONFIG)) {
    const first = config.cssFamily
      .split(",")[0]
      .trim()
      .replace(/["']/g, "")
      .toLowerCase();
    if (norm.startsWith(first) || norm.includes(first)) {
      return key as FontFamily;
    }
  }
  return "sans";
}

// ─── Toolbar ──────────────────────────────────────────────────────────────

interface TextToolbarProps {
  asset: TextAssetType;
  activeStyles: ActiveStyles;
  onSaveSelection: () => void;
  onApplyInlineStyle: (styles: Record<string, string>) => boolean;
  onBeginSpanEdit: (initialStyles: Record<string, string>) => boolean;
  onUpdateCurrentSpan: (styles: Record<string, string>) => boolean;
}

function TextToolbar({
  asset,
  activeStyles,
  onSaveSelection,
  onApplyInlineStyle,
  onBeginSpanEdit,
  onUpdateCurrentSpan,
}: TextToolbarProps) {
  const { updateAsset } = useAssets();
  const currentSize = activeStyles.fontSize;

  // 선택영역 있으면 인라인 적용, 없으면 전체 에셋 업데이트
  const applyOrUpdate = (
    inlineStyles: Record<string, string>,
    assetUpdates: Parameters<typeof updateAsset>[1],
  ) => {
    const applied = onApplyInlineStyle(inlineStyles);
    if (!applied) updateAsset(asset.id, assetUpdates);
  };

  return (
    <div className="min-w-[260px]">
      <p className="text-xs font-semibold text-neutral-300 px-4 py-2 border-b border-neutral-700">
        텍스트
      </p>
      <div className="flex flex-col gap-3 p-4">
        {/* 글꼴 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">글꼴</span>
          <select
            value={activeStyles.fontFamily}
            onMouseDown={onSaveSelection}
            onChange={(e) => {
              const key = e.target.value as FontFamily;
              applyOrUpdate(
                { fontFamily: FONT_CONFIG[key].cssFamily },
                { fontFamily: key },
              );
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

        {/* 글씨 색 — 커서 위치 색상 반영 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">글씨 색</span>
          <input
            type="color"
            value={activeStyles.color}
            onMouseDown={() => onBeginSpanEdit({ color: activeStyles.color })}
            onChange={(e) => {
              const applied = onUpdateCurrentSpan({ color: e.target.value });
              if (!applied) updateAsset(asset.id, { color: e.target.value });
            }}
            className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
          />
        </div>

        {/* 크기 — 선택영역 있으면 해당 span에만 적용 */}
        <div
          onMouseDown={() => onBeginSpanEdit({ fontSize: `${currentSize}px` })}
        >
          <SliderControl
            label="크기"
            value={currentSize}
            min={10}
            max={100}
            step={1}
            unit="px"
            onChange={(val) => {
              const applied = onUpdateCurrentSpan({ fontSize: `${val}px` });
              if (!applied) updateAsset(asset.id, { fontSize: val });
            }}
          />
        </div>

        {/* 자간 */}
        <SliderControl
          label="자간"
          value={asset.letterSpacing ?? 0}
          min={-6}
          max={10}
          step={1}
          unit="px"
          onChange={(val) => updateAsset(asset.id, { letterSpacing: val })}
        />

        {/* 행간 */}
        <SliderControl
          label="행간"
          value={asset.lineHeight ?? 0}
          min={0}
          max={100}
          step={1}
          unit="px"
          onChange={(val) => updateAsset(asset.id, { lineHeight: val })}
        />

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

        {/* 굵기/스타일 — 커서 위치 상태 반영 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">스타일</span>
          <div className="flex gap-1">
            {(
              [
                {
                  value: "normal" as const,
                  label: "기본",
                  inlineStyles: { fontWeight: "normal", fontStyle: "normal" },
                  assetUpdates: { fontWeight: "normal", fontStyle: "normal" },
                  isActive:
                    activeStyles.fontWeight === "normal" &&
                    activeStyles.fontStyle === "normal",
                },
                {
                  value: "bold" as const,
                  label: "Bold",
                  inlineStyles: { fontWeight: "bold" },
                  assetUpdates: { fontWeight: "bold", fontStyle: "normal" },
                  isActive: activeStyles.fontWeight === "bold",
                },
                {
                  value: "italic" as const,
                  label: "Italic",
                  inlineStyles: { fontStyle: "italic" },
                  assetUpdates: { fontWeight: "normal", fontStyle: "italic" },
                  isActive: activeStyles.fontStyle === "italic",
                },
              ] as const
            ).map(({ value, label, inlineStyles, assetUpdates, isActive }) => (
              <button
                key={value}
                onMouseDown={onSaveSelection}
                onClick={() => applyOrUpdate(inlineStyles, assetUpdates)}
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

        {/* 배경색 */}
        <BackgroundControl
          backgroundType={asset.backgroundType}
          backgroundColor={asset.backgroundColor}
          gradientColorStart={asset.gradientColorStart}
          gradientColorEnd={asset.gradientColorEnd}
          gradientAngle={asset.gradientAngle}
          onChange={(updates) => updateAsset(asset.id, updates)}
        />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface TextAssetProps {
  asset: TextAssetType;
}

export default function TextAsset({ asset }: TextAssetProps) {
  const { updateAsset } = useAssets();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const currentSpanRef = useRef<HTMLSpanElement | null>(null);
  const [isEmpty, setIsEmpty] = useState(!asset.content);

  // 커서/선택 위치의 실제 스타일 (툴바 active 상태 표시용)
  const [activeStyles, setActiveStyles] = useState<ActiveStyles>({
    fontWeight: asset.fontWeight ?? "normal",
    fontStyle: asset.fontStyle ?? "normal",
    color: asset.color ?? "#000000",
    fontSize: asset.fontSize ?? DEFAULT_FONT_SIZE,
    fontFamily: asset.fontFamily ?? "dotum",
  });

  // 마운트 시 초기 HTML 설정 (이후에는 onInput으로만 DOM 관리)
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = asset.content ?? "";
      setIsEmpty(!asset.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // selectionchange: 커서가 에디터 안에 있을 때 실제 스타일 읽기
  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
      const range = sel.getRangeAt(0);
      if (!editorRef.current.contains(range.commonAncestorContainer)) return;

      const node = range.startContainer;
      const el = (
        node.nodeType === Node.TEXT_NODE ? node.parentElement : node
      ) as HTMLElement | null;
      if (!el) return;

      const s = window.getComputedStyle(el);
      setActiveStyles({
        fontWeight: parseInt(s.fontWeight) >= 600 ? "bold" : "normal",
        fontStyle: s.fontStyle === "italic" ? "italic" : "normal",
        color: s.color.startsWith("rgb")
          ? rgbToHex(s.color)
          : s.color || "#000000",
        fontSize: parseInt(s.fontSize) || DEFAULT_FONT_SIZE,
        fontFamily: matchFontFamily(s.fontFamily),
      });
    };

    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  // asset-level 스타일 변경 시 activeStyles 동기화 (에디터에 포커스 없을 때)
  useEffect(() => {
    setActiveStyles((prev) => ({
      ...prev,
      fontWeight: asset.fontWeight ?? prev.fontWeight,
      fontStyle: asset.fontStyle ?? prev.fontStyle,
      color: asset.color ?? prev.color,
      fontSize: asset.fontSize ?? prev.fontSize,
      fontFamily: asset.fontFamily ?? prev.fontFamily,
    }));
  }, [
    asset.fontWeight,
    asset.fontStyle,
    asset.color,
    asset.fontSize,
    asset.fontFamily,
  ]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    updateAsset(asset.id, { content: html });
    setIsEmpty(editorRef.current.textContent?.trim() === "");
  }, [asset.id, updateAsset]);

  // ── 선택영역 저장 (툴바 mousedown 전에 호출) ─────────────────────────
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  }, []);

  // ── 슬라이더/컬러피커용: mousedown 시 span 생성 후 currentSpanRef에 저장 ────────
  const beginSpanEdit = useCallback(
    (initialStyles: Record<string, string>): boolean => {
      saveSelection();
      currentSpanRef.current = null; // 이전 stale 참조 초기화
      const range = savedRangeRef.current;
      if (!range || range.collapsed) return false;

      const span = document.createElement("span");
      Object.entries(initialStyles).forEach(([key, value]) => {
        (span.style as unknown as Record<string, string>)[key] = value;
      });

      try {
        range.surroundContents(span);
      } catch {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }

      // 중첩 span의 동일 속성이 새 span을 override하는 것을 방지
      Object.keys(initialStyles).forEach((prop) => {
        const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
        span.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
          el.style.removeProperty(cssProp);
        });
      });

      editorRef.current?.normalize();
      currentSpanRef.current = span;
      savedRangeRef.current = null;

      if (editorRef.current) {
        updateAsset(asset.id, { content: editorRef.current.innerHTML });
      }
      return true;
    },
    [asset.id, saveSelection, updateAsset],
  );

  // ── 슬라이더 드래그 중 currentSpan 스타일 직접 업데이트 ──────────────
  const updateCurrentSpan = useCallback(
    (styles: Record<string, string>): boolean => {
      const span = currentSpanRef.current;
      if (!span) return false;

      Object.entries(styles).forEach(([key, value]) => {
        (span.style as unknown as Record<string, string>)[key] = value;
      });

      if (editorRef.current) {
        updateAsset(asset.id, { content: editorRef.current.innerHTML });
      }
      return true;
    },
    [asset.id, updateAsset],
  );

  // ── 선택영역에 인라인 span 적용 ──────────────────────────────────────
  const applyInlineStyle = useCallback(
    (styles: Record<string, string>): boolean => {
      const range = savedRangeRef.current;
      if (!range || range.collapsed) return false;

      const sel = window.getSelection();
      if (!sel) return false;
      sel.removeAllRanges();
      sel.addRange(range);

      const span = document.createElement("span");
      Object.entries(styles).forEach(([key, value]) => {
        (span.style as unknown as Record<string, string>)[key] = value;
      });

      try {
        range.surroundContents(span);
      } catch {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }

      editorRef.current?.normalize();

      if (editorRef.current) {
        updateAsset(asset.id, { content: editorRef.current.innerHTML });
      }

      // 적용 후 span 선택 유지 → selectionchange로 activeStyles 자동 갱신
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);

      savedRangeRef.current = null;
      return true;
    },
    [asset.id, updateAsset],
  );

  const verticalAlign = asset.verticalAlign ?? "top";

  return (
    <AssetWrapper
      assetId={asset.id}
      toolbar={
        <TextToolbar
          asset={asset}
          activeStyles={activeStyles}
          onSaveSelection={saveSelection}
          onApplyInlineStyle={applyInlineStyle}
          onBeginSpanEdit={beginSpanEdit}
          onUpdateCurrentSpan={updateCurrentSpan}
        />
      }
    >
      <div
        data-transparent-bg={asset.backgroundType === "transparent"}
        className={clsx(
          "w-full h-full p-2 transition-colors duration-200 flex flex-col overflow-hidden min-h-0 cursor-text",
          verticalAlign === "middle"
            ? "justify-center"
            : verticalAlign === "bottom"
              ? "justify-end"
              : "justify-start",
        )}
        style={{ background: getBackgroundStyle(asset) }}
        onClick={() => editorRef.current?.focus()}
      >
        <div className="relative w-full">
          {/* Placeholder */}
          {isEmpty && (
            <span
              className="absolute inset-0 text-neutral-400 pointer-events-none select-none"
              style={{
                fontSize: asset.fontSize
                  ? `${asset.fontSize}px`
                  : `${DEFAULT_FONT_SIZE}px`,
              }}
            >
              텍스트를 입력하세요...
            </span>
          )}
          {/* Contenteditable 에디터 */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            style={{
              color: asset.color ?? undefined,
              fontSize: asset.fontSize
                ? `${asset.fontSize}px`
                : `${DEFAULT_FONT_SIZE}px`,
              textAlign: asset.textAlign ?? "left",
              fontWeight: asset.fontWeight ?? "normal",
              fontStyle: asset.fontStyle ?? "normal",
              letterSpacing: asset.letterSpacing
                ? `${asset.letterSpacing}px`
                : undefined,
              lineHeight: asset.lineHeight
                ? `${asset.lineHeight}px`
                : undefined,
              outline: "none",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              minHeight: "1em",
            }}
            className={clsx(
              "w-full bg-transparent",
              FONT_CONFIG[asset.fontFamily ?? "dotum"].className,
            )}
          />
        </div>
      </div>
    </AssetWrapper>
  );
}
