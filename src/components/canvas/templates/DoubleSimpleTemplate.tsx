import TemplateZone from "../../TemplateZone";

type Side = "left" | "right";

function SideRectZone({
  side,
  position,
}: {
  side: Side;
  position: "middle" | "bottom";
}) {
  const positionLabel = position === "middle" ? "가운데" : "하단";

  return (
    <div className="rounded-2xl overflow-hidden">
      <TemplateZone
        slotId={`double3-${position}-${side}`}
        placeholder={`${positionLabel} 영역`}
        className={
          position === "middle" ? "flex-1 min-h-0" : "h-[180px] shrink-0"
        }
      />
    </div>
  );
}

/** 상단 3분할 영역 */
function TopZone({ position }: { position: "left" | "center" | "right" }) {
  const labelMap = {
    left: "컬러파레트",
    center: "페어명",
    right: "컬러파레트",
  };

  return (
    <div
      className={[
        "h-24 rounded-2xl overflow-hidden",
        position === "center" ? "flex-1" : "w-48",
      ].join(" ")}
    >
      <TemplateZone
        slotId={`double3-top-${position}`}
        placeholder={labelMap[position]}
      />
    </div>
  );
}

export const DoubleSimpleTemplate = () => {
  return (
    <div className="w-full h-full p-20">
      <div className="w-[80%] h-full mx-auto flex flex-col gap-6">
        {/* 상단 3분할 */}
        <div className="flex gap-4">
          <TopZone position="left" />
          <TopZone position="center" />
          <TopZone position="right" />
        </div>

        {/* 가운데 좌/우 */}
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-6">
          <SideRectZone side="left" position="middle" />
          <SideRectZone side="right" position="middle" />
        </div>

        {/* 하단 좌/우 */}
        <div className="h-[180px] shrink-0 grid grid-cols-2 gap-6">
          <SideRectZone side="left" position="bottom" />
          <SideRectZone side="right" position="bottom" />
        </div>
      </div>
    </div>
  );
};
