import type { TemplateType } from "../types/canvas";
import { TEMPLATES } from "../config/templates";

export function getTemplateOrientation(
  templateType?: TemplateType,
): "portrait" | "landscape" {
  if (!templateType) return "portrait";
  const templateConfig = TEMPLATES[templateType];
  return templateConfig?.orientation ?? "portrait";
}
