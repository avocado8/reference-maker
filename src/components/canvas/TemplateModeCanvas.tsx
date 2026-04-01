import { useCanvasSettings } from "../../store/CanvasSettingsContext";
import { getMultiCols } from "../../utils/getMultiDimensions";
import { TEMPLATES, type AvailableTemplateType } from "../../config/templates";

export default function TemplateModeCanvas() {
  const { settings } = useCanvasSettings();

  const type = settings.templateType as AvailableTemplateType;
  if (!type) return null;

  const TemplateComponent = TEMPLATES[type]?.component;

  if (!TemplateComponent) return null;

  // multi 컴포넌트를 위한 동적 prop 설정
  const dynamicProps =
    type === "multi"
      ? { count: settings.multiCount, cols: getMultiCols(settings.multiCount) }
      : { count: 0, cols: 0 };

  return (
    <div className="w-full h-full relative transition-all duration-500 overflow-hidden">
      <TemplateComponent {...dynamicProps} />
    </div>
  );
}
