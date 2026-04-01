import { useCanvasSettings } from "../../store/CanvasSettingsContext";
import DoubleTemplateSymmetric from "./templates/DoubleTemplateSymmetric";
import MultiTemplate from "./templates/MultiTemplate";
import SingleTemplatePortrait from "./templates/SingleTemplatePortrait";
import { getMultiCols } from "../../utils/getMultiDimensions";
import DoubleTemplateTwoshot from "./templates/DoubleTemplateTwoshot";
import { DoubleSimpleTemplate } from "./templates/DoubleSimpleTemplate";

export default function TemplateModeCanvas() {
  const { settings } = useCanvasSettings();

  const renderMulti = () => {
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
      {settings.templateType === "double-simple" && <DoubleSimpleTemplate />}
      {settings.templateType === "multi" && renderMulti()}
    </div>
  );
}
