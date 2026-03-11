import TemplateZone from "../../TemplateZone";
import { MULTI_GAP, MULTI_PADDING } from "../../../utils/getMultiDimensions";

interface MultiTemplateProps {
  count: number;
  cols: number;
}

function CharacterUnit({ index }: { index: number }) {
  const label = String.fromCharCode(65 + index); // A, B, C ...

  return (
    <div className="flex flex-col gap-4 bg-white/40 p-4 rounded-3xl border border-white/60 min-w-0">
      {/* 상단 작은 텍스트 */}
      <div className="h-14 rounded-xl overflow-hidden bg-neutral-100">
        <TemplateZone
          slotId={`multi-${index}-title`}
          placeholder={`${label}. 이름 / 기본정보`}
        />
      </div>

      {/* 상단 큰 이미지 */}
      <div className="h-[260px] rounded-2xl overflow-hidden bg-neutral-100">
        <TemplateZone
          slotId={`multi-${index}-image-main`}
          placeholder={`${label} 상단 이미지`}
        />
      </div>

      {/* 컬러 팔레트 */}
      <div className="h-[90px] flex justify-center rounded-xl overflow-hidden bg-neutral-100">
        <TemplateZone
          slotId={`multi-${index}-palette`}
          placeholder={`${label} 컬러 팔레트`}
        />
      </div>

      {/* 중간 설명 텍스트 */}
      <div className="h-[170px] rounded-xl overflow-hidden bg-neutral-100">
        <TemplateZone
          slotId={`multi-${index}-desc`}
          placeholder={`${label} 설명`}
        />
      </div>

      {/* 하단 이미지 */}
      <div className="h-[220px] rounded-2xl overflow-hidden bg-neutral-100">
        <TemplateZone
          slotId={`multi-${index}-image-sub`}
          placeholder={`${label} 하단 이미지`}
        />
      </div>
    </div>
  );
}

/**
 * 다인 템플릿 — count와 cols를 받아 고정 크기 그리드로 렌더링.
 * overflow 없이 getMultiDimensions()와 동일한 상수를 사용해 캔버스에 정확히 맞음.
 */
export default function MultiTemplate({ count, cols }: MultiTemplateProps) {
  return (
    <div className="w-full h-full" style={{ padding: `${MULTI_PADDING}px` }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${MULTI_GAP}px`,
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <CharacterUnit key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
