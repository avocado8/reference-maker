import TemplateZone from "../../TemplateZone";

export default function DoubleTemplateSymmetric() {
  return (
    <div className="w-full h-full p-10 flex items-stretch justify-between gap-8">
      {/* 왼쪽 캐릭터 */}
      <div className="flex-1 flex items-start justify-between gap-6 min-w-0">
        {/* 왼쪽 세로 정보열 */}
        <div className="w-[240px] h-full flex flex-col items-center gap-6 shrink-0">
          <div className="w-full h-[250px] min-h-[250px] rounded-full overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone
              slotId="double2-a-photo-1"
              placeholder="A 사진 1"
              allowedTypes={["image"]}
            />
          </div>

          <div className="w-full h-[250px] min-h-[250px] rounded-full overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone
              slotId="double2-a-photo-2"
              placeholder="A 사진 2"
              allowedTypes={["image"]}
            />
          </div>

          <div className="w-full rounded-2xl min-h-[120px] overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone
              slotId="double2-a-palette"
              placeholder="A 컬러 팔레트"
            />
          </div>
        </div>

        {/* 왼쪽 가운데 본체 */}
        <div className="flex-1 h-full flex flex-col items-center gap-8 min-w-0">
          <div className="w-full flex-1 min-h-0 rounded-3xl overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone slotId="double2-a-full" placeholder="A 전신 이미지" />
          </div>

          <div className="w-full h-[230px] rounded-2xl overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone slotId="double2-a-desc" placeholder="A 텍스트 설명" />
          </div>
        </div>
      </div>

      {/* 오른쪽 캐릭터 - 좌우 대칭 */}
      <div className="flex-1 flex items-start justify-between gap-6 min-w-0">
        {/* 오른쪽 가운데 본체 */}
        <div className="flex-1 h-full flex flex-col items-center gap-8 min-w-0">
          <div className="w-full flex-1 min-h-0 rounded-3xl overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone slotId="double2-b-full" placeholder="B 전신 이미지" />
          </div>

          <div className="w-full h-[230px] rounded-2xl overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone slotId="double2-b-desc" placeholder="B 텍스트 설명" />
          </div>
        </div>

        {/* 오른쪽 세로 정보열 */}
        <div className="w-[240px] h-full flex flex-col items-center gap-6 shrink-0">
          <div className="w-full h-[250px] min-h-[250px] rounded-full overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone
              slotId="double2-b-photo-1"
              placeholder="B 사진 1"
              allowedTypes={["image"]}
            />
          </div>

          <div className="w-full h-[250px] min-h-[250px] rounded-full overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone
              slotId="double2-b-photo-2"
              placeholder="B 사진 2"
              allowedTypes={["image"]}
            />
          </div>

          <div className="w-full rounded-2xl min-h-[120px] overflow-hidden border-2 border-dashed border-neutral-300">
            <TemplateZone
              slotId="double2-b-palette"
              placeholder="B 컬러 팔레트"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
