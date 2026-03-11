import { useCanvasSettings } from "../../store/CanvasSettingsContext";
import DoubleTemplateLandscape from "./templates/DoubleTemplateLandscape";
import DoubleTemplateSymmetric from "./templates/DoubleTemplateSymmetric";
import SingleTemplatePortrait from "./templates/SingleTemplatePortrait";

export default function TemplateModeCanvas() {
  const { settings } = useCanvasSettings();

  const renderSinglePortrait = () => {
    return <SingleTemplatePortrait />;
  };

  const renderDoubleLandscape = () => {
    return <DoubleTemplateLandscape />;
  };

  const renderDoubleSymmetric = () => {
    return <DoubleTemplateSymmetric />;
  };

  return (
    <div className="w-full h-full relative transition-all duration-500 overflow-hidden">
      {settings.templateType === "single-portrait" && renderSinglePortrait()}
      {settings.templateType === "double-landscape" && renderDoubleLandscape()}
      {settings.templateType === "double-symmetric" && renderDoubleSymmetric()}
    </div>
  );
}
