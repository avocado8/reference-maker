import TemplateZone from "../../TemplateZone";

function SideCharacterCard({
  prefix,
}: {
  side: "left" | "right";
  prefix: "a" | "b";
}) {
  return (
    <div className="w-[300px] shrink-0 flex flex-col gap-4">
      {/* 이름 */}
      <div className="h-20 rounded-xl overflow-hidden">
        <TemplateZone
          slotId={`poster-${prefix}-name`}
          placeholder={
            prefix === "a" ? "A 이름 / 기본정보" : "B 이름 / 기본정보"
          }
        />
      </div>

      {/* 사진 */}
      <div className="h-[350px] rounded-2xl overflow-hidden">
        <TemplateZone
          slotId={`poster-${prefix}-image`}
          placeholder={prefix === "a" ? "A 사진" : "B 사진"}
        />
      </div>

      {/* 팔레트 */}
      <div className="h-[110px] rounded-xl overflow-hidden">
        <TemplateZone
          slotId={`poster-${prefix}-palette`}
          placeholder={prefix === "a" ? "A 컬러 팔레트" : "B 컬러 팔레트"}
        />
      </div>

      {/* 설명 */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden">
        <TemplateZone
          slotId={`poster-${prefix}-desc`}
          placeholder={prefix === "a" ? "A 설명" : "B 설명"}
        />
      </div>
    </div>
  );
}

function BottomOverlayText({
  side,
  slotId,
  placeholder,
}: {
  side: "left" | "right";
  slotId: string;
  placeholder: string;
}) {
  return (
    <div
      className={[
        "absolute bottom-8 w-[220px] h-[100px]",
        "rounded-2xl overflow-hidden border border-white/50",
        "bg-white/80 backdrop-blur-sm",
        side === "left" ? "left-8" : "right-8",
      ].join(" ")}
    >
      <TemplateZone slotId={slotId} placeholder={placeholder} />
    </div>
  );
}

export default function DoubleTemplateTwoshot() {
  return (
    <div className="w-full h-full p-20 flex gap-8">
      {/* 좌측 정보 */}
      <SideCharacterCard side="left" prefix="a" />

      {/* 중앙 영역 */}
      <div className="flex-1 min-w-0 h-full flex flex-col gap-4">
        {/* 큰 제목 */}
        <div className="h-20 rounded-2xl overflow-hidden">
          <TemplateZone slotId="poster-center-title" placeholder="페어명" />
        </div>

        {/* 큰 메인 그림 */}
        <div className="relative flex-1 min-h-0 rounded-3xl overflow-hidden">
          <TemplateZone
            slotId="poster-center-image"
            placeholder="가운데 큰 메인 그림"
          />

          {/* 하단 텍스트박스 2개 */}
          <BottomOverlayText
            side="left"
            slotId="poster-center-note-left"
            placeholder="왼쪽 텍스트"
          />
          <BottomOverlayText
            side="right"
            slotId="poster-center-note-right"
            placeholder="오른쪽 텍스트"
          />
        </div>
      </div>

      {/* 우측 정보 */}
      <SideCharacterCard side="right" prefix="b" />
    </div>
  );
}
