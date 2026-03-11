import { useCanvasSettings } from "../../store/CanvasSettingsContext";
import DoubleTemplateSymmetric from "./templates/DoubleTemplateSymmetric";
import MultiTemplate from "./templates/MultiTemplate";
import SingleTemplatePortrait from "./templates/SingleTemplatePortrait";
import { getMultiCols } from "../../utils/getMultiDimensions";
import DoubleTemplateTwoshot from "./templates/DoubleTemplateTwoshot";

/** 다인 템플릿 인원수 선택 화면 (multiCount가 undefined일 때 표시) */
function MultiCountPicker() {
  const { updateSettings } = useCanvasSettings();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-neutral-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-700 mb-2">
          인원수 선택
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3 max-w-md">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => updateSettings({ multiCount: n })}
            className="w-16 h-16 text-xl font-bold rounded-2xl bg-white border-2 border-neutral-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-400">최대 10인까지 지원됩니다</p>
    </div>
  );
}

export default function TemplateModeCanvas() {
  const { settings } = useCanvasSettings();

  const renderMulti = () => {
    if (settings.multiCount === undefined) {
      return <MultiCountPicker />;
    }
    const count = settings.multiCount;
    const cols = getMultiCols(count);
    return <MultiTemplate count={count} cols={cols} />;
  };

  return (
    <div className="w-full h-full relative transition-all duration-500 overflow-hidden">
      {settings.templateType === "single-portrait" && (
        <SingleTemplatePortrait />
      )}
      {settings.templateType === "double-symmetric" && (
        <DoubleTemplateSymmetric />
      )}
      {settings.templateType === "double-twoshot" && <DoubleTemplateTwoshot />}
      {settings.templateType === "multi" && renderMulti()}
    </div>
  );
}
