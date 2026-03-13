import clsx from "clsx";
import type { BackgroundFields } from "../types/assets";
import SliderControl from "./SliderControl";

export function getBackgroundStyle(fields: BackgroundFields): string {
  if (fields.backgroundType === "gradient") {
    return `linear-gradient(${fields.gradientAngle ?? 180}deg, ${fields.gradientColorStart ?? "#ffffff"}, ${fields.gradientColorEnd ?? "#e5e7eb"})`;
  }
  if (fields.backgroundType === "transparent") {
    return "transparent";
  }
  return fields.backgroundColor ?? "white";
}

interface BackgroundControlProps extends BackgroundFields {
  onChange: (updates: Partial<BackgroundFields>) => void;
}

export default function BackgroundControl({
  backgroundType,
  backgroundColor,
  gradientColorStart,
  gradientColorEnd,
  gradientAngle,
  onChange,
}: BackgroundControlProps) {
  const current = backgroundType ?? "solid";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">배경 방식</span>
        <div className="flex gap-1">
          {(
            [
              { value: "solid", label: "단색" },
              { value: "gradient", label: "그라데이션" },
              { value: "transparent", label: "투명" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ backgroundType: value })}
              className={clsx(
                "text-[10px] px-2 py-0.5 rounded transition-colors",
                current === value
                  ? "bg-white text-neutral-800"
                  : "text-white/70 bg-white/20 hover:bg-white/30",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {current === "solid" && (
        <div className="flex items-center justify-between ml-2 border-l-2 border-neutral-600 pl-2">
          <span className="text-xs text-neutral-400">배경색</span>
          <input
            type="color"
            value={backgroundColor ?? "#ffffff"}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
          />
        </div>
      )}

      {current === "gradient" && (
        <div className="space-y-2 ml-2 border-l-2 border-neutral-600 pl-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">시작색</span>
            <input
              type="color"
              value={gradientColorStart ?? "#ffffff"}
              onChange={(e) => onChange({ gradientColorStart: e.target.value })}
              className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">끝색</span>
            <input
              type="color"
              value={gradientColorEnd ?? "#e5e7eb"}
              onChange={(e) => onChange({ gradientColorEnd: e.target.value })}
              className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
          <SliderControl
            label="각도"
            value={gradientAngle ?? 180}
            min={0}
            max={360}
            step={45}
            unit="°"
            onChange={(val) => onChange({ gradientAngle: val })}
          />
        </div>
      )}
    </div>
  );
}
