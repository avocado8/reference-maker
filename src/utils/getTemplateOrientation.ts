import type { CanvasOrientation, TemplateType } from "../types/canvas";

export const getTemplateOrientation = (
  templateType?: TemplateType,
): CanvasOrientation => {
  switch (templateType) {
    case "single-portrait":
      return "portrait";
    case "double-landscape":
    case "double-symmetric":
      return "landscape";
    default:
      return "portrait";
  }
};
