import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useAssets } from "../store/AssetContext";

interface AssetWrapperProps {
  assetId: string;
  toolbar: ReactNode;
  children: ReactNode;
}

/**
 * 모든 에셋에 공통으로 적용되는 래퍼.
 * - 우상단 X 버튼으로 에셋 삭제
 * - 하단 툴바(asset-drag-handle): hover 시 표시, 드래그하면 자유 배치 모드에서 에셋 이동
 * - 툴바 내 버튼/input 클릭 시에는 에셋 이동 대신 해당 컨트롤이 동작
 */
export default function AssetWrapper({
  assetId,
  toolbar,
  children,
}: AssetWrapperProps) {
  const { removeAsset } = useAssets();

  return (
    <div className="relative group w-full h-full overflow-hidden">
      {/* 에셋 콘텐츠 */}
      {children}

      {/* 삭제 버튼 */}
      <button
        onClick={() => removeAsset(assetId)}
        className="absolute top-1 right-1 z-20 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
        title="삭제"
      >
        <X size={12} />
      </button>

      {/* 툴바 (드래그 핸들 겸 컨트롤 영역) */}
      <div
        className="asset-drag-handle absolute inset-x-0 bottom-0 z-10 px-3 py-2 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
        onMouseDown={(e) => {
          // 컨트롤 조작 시에는 에셋 이동 이벤트가 발생하지 않도록 차단
          if (
            (e.target as HTMLElement).closest("button, input, select, label")
          ) {
            e.stopPropagation();
          }
        }}
      >
        {toolbar}
      </div>
    </div>
  );
}
