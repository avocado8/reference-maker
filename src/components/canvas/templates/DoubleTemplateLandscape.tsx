import TemplateZone from "../../TemplateZone";

export default function DoubleTemplateLandscape() {
  return (
    <div className="w-full h-full p-8 flex gap-8">
      {/* 좌측 캐릭터 */}
      <div className="flex-1 flex flex-col gap-6 bg-white/40 p-6 rounded-3xl border border-white/60">
        <div className="h-[500px] rounded-2xl overflow-hidden border-2 border-dashed border-neutral-400">
          <TemplateZone slotId="landscape-a-image" placeholder="Character A" />
        </div>
        <div className="h-[180px] flex justify-center rounded-lg border-2 border-dashed border-neutral-400 overflow-hidden">
          <TemplateZone slotId="landscape-a-palette" placeholder="팔레트" />
        </div>
        <div className="flex-1 min-h-0 rounded-xl border-2 border-dashed border-neutral-400  overflow-hidden">
          <TemplateZone slotId="landscape-a-desc" placeholder="설명 A" />
        </div>
      </div>

      {/* 우측 캐릭터 */}
      <div className="flex-1 flex flex-col gap-6 bg-white/40 p-6 rounded-3xl border border-white/60">
        <div className="h-[500px] rounded-2xl overflow-hidden border-2 border-dashed border-neutral-400">
          <TemplateZone slotId="landscape-b-image" placeholder="Character B" />
        </div>
        <div className="h-[180px] flex justify-center rounded-lg border-2 border-dashed border-neutral-400 overflow-hidden">
          <TemplateZone slotId="landscape-b-palette" placeholder="팔레트" />
        </div>
        <div className="flex-1 min-h-0 rounded-xl border-2 border-dashed border-neutral-400 overflow-hidden">
          <TemplateZone slotId="landscape-b-desc" placeholder="설명 B" />
        </div>
      </div>
    </div>
  );
}
