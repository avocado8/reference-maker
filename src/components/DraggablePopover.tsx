import { createPortal } from "react-dom";
import { useRef, useState, useEffect, type ReactNode } from "react";

interface DraggablePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  /** 팝오버 밖 영역 클릭 감지 시 제외할 Element 리스트 (ex. 팝오버를 연 버튼) */
  excludeRefs?: React.RefObject<HTMLElement | null>[];
  children: ReactNode;
  initialLeft?: number;
  initialTop?: number;
  minWidth?: number;
}

export default function DraggablePopover({
  isOpen,
  onClose,
  excludeRefs = [],
  children,
  initialLeft = 0,
  initialTop = 0,
  minWidth = 240,
}: DraggablePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({
    left: initialLeft,
    top: initialTop,
    minWidth,
  });

  // 상태 변경 감지하여 위치(스타일) 복원
  useEffect(() => {
    if (isOpen) {
      setPopoverStyle({ left: initialLeft, top: initialTop, minWidth });
    }
  }, [isOpen, initialLeft, initialTop, minWidth]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClose = (e: MouseEvent) => {
      const target = e.target as Node;
      // 팝오버 내부 클릭 무시
      if (popoverRef.current?.contains(target)) return;
      // 제외 엘리먼트 내부 클릭 무시 (팝오버를 여닫는 버튼 등)
      if (excludeRefs.some((ref) => ref.current?.contains(target))) return;

      onClose();
    };

    const handleScroll = (e: Event) => {
      // 팝오버 내부 스크롤 이벤트면 무시
      if (popoverRef.current?.contains(e.target as Node)) {
        return;
      }
      onClose();
    };

    document.addEventListener("mousedown", handleClose);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose, excludeRefs]);

  // ── 팝오버 헤더바 드래그 로직
  const onPopoverDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft =
      typeof popoverStyle.left === "number" ? popoverStyle.left : 0;
    const startTop =
      typeof popoverStyle.top === "number" ? popoverStyle.top : 0;

    const onMove = (ev: MouseEvent) => {
      setPopoverStyle((prev) => ({
        ...prev,
        left: startLeft + ev.clientX - startX,
        top: startTop + ev.clientY - startY,
      }));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        zIndex: 9999,
        ...popoverStyle,
      }}
      className="bg-neutral-800 border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* 드래그 핸들 (공통) */}
      <div
        onMouseDown={onPopoverDragStart}
        className="h-4 flex items-center justify-center cursor-grab active:cursor-grabbing bg-neutral-900/50 hover:bg-neutral-700/60 transition-colors"
        title="드래그하여 팝오버 이동"
      >
        <div className="flex gap-0.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-0.5 h-0.5 rounded-full bg-neutral-500" />
          ))}
        </div>
      </div>
      {children}
    </div>,
    document.body,
  );
}
