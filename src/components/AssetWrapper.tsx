import { createPortal } from "react-dom";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { X, Settings } from "lucide-react";
import clsx from "clsx";
import { useAssets } from "../store/AssetContext";

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
 */
export default function AssetWrapper({
  assetId,
  toolbar,
  children,
}: AssetWrapperProps) {
  const { removeAsset } = useAssets();
  const [isOpen, setIsOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  const openPopover = () => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const popoverWidth = 280;

    // 우측에 공간이 있으면 우측, 없으면 좌측에 배치 (에셋을 가리지 않음)
    let left = rect.right + 8;
    if (left + popoverWidth > window.innerWidth - 8) {
      left = rect.left - popoverWidth - 8;
    }
    left = Math.max(8, left);

    // 하단이 뷰포트를 벗어나면 위로 올림
    let top = rect.top;
    if (top + 400 > window.innerHeight) {
      top = Math.max(8, window.innerHeight - 400);
    }

    setPopoverStyle({ left, top, minWidth: popoverWidth });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = (e: MouseEvent) => {
      if (
        !popoverRef.current?.contains(e.target as Node) &&
        !barRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => setIsOpen(false);
    document.addEventListener("mousedown", handleClose);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className="relative group w-full h-full overflow-hidden">
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

      {/* 설정 팝오버 (portal — overflow 클리핑 완전 탈출) */}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ position: "fixed", zIndex: 9999, ...popoverStyle }}
            className="bg-neutral-800 border border-neutral-600 rounded-lg shadow-2xl overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {toolbar}
          </div>,
          document.body,
        )}
    </div>
  );
}
