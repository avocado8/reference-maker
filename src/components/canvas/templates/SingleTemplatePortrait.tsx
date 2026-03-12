import TemplateZone from "../../TemplateZone";

export default function SingleTemplatePortrait() {
  return (
    <div className="w-full h-full p-20 flex flex-col gap-8 overflow-hidden">
      {/* 상단: 이름/타이틀 및 대표 이미지 영역 */}
      <div className="flex gap-8 h-[680px]">
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-20 rounded-xl overflow-hidden">
            <TemplateZone slotId="portrait-name" placeholder="이름 / 타이틀" />
          </div>
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
            <TemplateZone slotId="portrait-main" placeholder="대표 이미지" />
          </div>
        </div>
        <div className="w-[400px] rounded-xl overflow-hidden">
          <TemplateZone slotId="portrait-sub" placeholder="전신 / SD" />
        </div>
      </div>

      {/* 중단: 팔레트 영역 */}
      <div className="h-[180px] rounded-xl overflow-hidden">
        <TemplateZone slotId="portrait-palette" placeholder="팔레트 / 설명" />
      </div>
      {/* 하단: 설명 섹션 3개 */}
      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {(
          ["portrait-desc-1", "portrait-desc-2", "portrait-desc-3"] as const
        ).map((slotId, i) => (
          <div
            key={slotId}
            className="flex-1 min-h-0 rounded-2xl overflow-hidden"
          >
            <TemplateZone slotId={slotId} placeholder={`설명 ${i + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
