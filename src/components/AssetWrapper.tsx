import { useRef, useState, type ReactNode } from "react";
import { X, Settings } from "lucide-react";
import clsx from "clsx";
import { useAssets } from "../store/AssetContext";
import DraggablePopover from "./DraggablePopover";

interface AssetWrapperProps {
  assetId: string;
  toolbar: ReactNode;
  children: ReactNode;
}

/**
 * 모든 에셋에 공통으로 적용되는 래퍼.
 * - 우상단 X 버튼으로 에셋 삭제
 * - 하단 얇은 핸들바(asset-drag-handle): hover 시 표시, 드래그하면 자유 배치 모드에서 에셋 이동
 * - 핸들바 우측 ⚙ 버튼: 클릭 시 portal 팝오버로 상세 설정 표시 (overflow 클리핑 없음)
 * - 팝오버는 상단 드래그 핸들로 위치 이동 가능
 */
export default function AssetWrapper({
  assetId,
  toolbar,
  children,
}: AssetWrapperProps) {
  const { removeAsset } = useAssets();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  const openPopover = () => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const popoverWidth = 280;

    let left = rect.right + 8;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = rect.left - popoverWidth - 8;
    }
    left = Math.max(8, left);

    let top = rect.top;
    if (top + 400 > window.innerHeight) {
      top = Math.max(8, window.innerHeight - 400);
    }

    setPopoverStyle({ left, top, minWidth: popoverWidth });
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative group w-full h-full overflow-hidden">
      {/* 에셋 콘텐츠 */}
      {children}

      {/* 삭제 버튼 */}
      <button
        onClick={() => removeAsset(assetId)}
        data-export-ignore="true"
        className="absolute top-1 right-1 z-20 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
        title="삭제"
      >
        <X size={12} />
      </button>

      {/* 하단 핸들바 (드래그 + 설정 버튼 중앙 배치) */}
      <div
        ref={barRef}
        data-export-ignore="true"
        className="asset-drag-handle absolute inset-x-0 bottom-0 z-10 h-8 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) {
            e.stopPropagation();
          }
        }}
      >
        <button
          className={clsx(
            "p-1.5 rounded transition-colors",
            isOpen ? "text-white bg-white/20" : "text-white/70 hover:text-white",
          )}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={isOpen ? () => setIsOpen(false) : openPopover}
          title="설정"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* 설정 팝오버 (DraggablePopover 컴포넌트 사용) */}
      <DraggablePopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        excludeRefs={[barRef, wrapperRef]} // 에셋 버튼 클릭 무시
        initialLeft={typeof popoverStyle.left === "number" ? popoverStyle.left : 0}
        initialTop={typeof popoverStyle.top === "number" ? popoverStyle.top : 0}
        minWidth={typeof popoverStyle.minWidth === "number" ? popoverStyle.minWidth : 280}
      >
        {toolbar}
      </DraggablePopover>
    </div>
  );
}
