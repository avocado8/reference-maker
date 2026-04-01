import TemplateZone from "../../TemplateZone";

function RightStackZone({ type }: { type: "circle" | "small" | "large" }) {
  const config = {
    circle: {
      slotId: "single-simple-right-circle",
      placeholder: "오른쪽 작은 원 영역",
      wrapperClass: "w-80 h-80 rounded-full overflow-hidden",
    },
    small: {
      slotId: "single-simple-right-small",
      placeholder: "오른쪽 작은 사각형 영역",
      wrapperClass: "h-35 w-full rounded-2xl overflow-hidden",
    },
    large: {
      slotId: "single-simple-right-large",
      placeholder: "오른쪽 큰 사각형 영역",
      wrapperClass: "flex-1 min-h-0 w-full rounded-2xl overflow-hidden",
    },
  };

  const current = config[type];

  return (
    <div className={current.wrapperClass}>
      <TemplateZone
        slotId={current.slotId}
        placeholder={current.placeholder}
        shape={type === "circle" ? "circle" : "rect"}
      />
    </div>
  );
}

export const SingleSimpleTemplate = () => {
  return (
    <div className="w-full h-full p-20">
      <div className="w-[80%] h-full mx-auto flex gap-6">
        {/* 왼쪽 세로로 긴 직사각형 */}
        <div className="flex-1 min-w-0 rounded-3xl overflow-hidden">
          <TemplateZone
            slotId="single-simple-left"
            placeholder="왼쪽 세로 직사각형 영역"
          />
        </div>

        {/* 오른쪽 영역 */}
        <div className="w-96 shrink-0 flex flex-col items-center gap-4">
          <RightStackZone type="circle" />
          <RightStackZone type="small" />
          <RightStackZone type="large" />
        </div>
      </div>
    </div>
  );
};
