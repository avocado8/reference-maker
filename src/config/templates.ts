import type { ComponentType } from "react";
import SingleTemplatePortrait from "../components/canvas/templates/SingleTemplatePortrait";
import DoubleTemplateTwoshot from "../components/canvas/templates/DoubleTemplateTwoshot";
import DoubleTemplateSymmetric from "../components/canvas/templates/DoubleTemplateSymmetric";
import { DoubleSimpleTemplate } from "../components/canvas/templates/DoubleSimpleTemplate";
import MultiTemplate from "../components/canvas/templates/MultiTemplate";
import { SingleSimpleTemplate } from "../components/canvas/templates/SingleSimpleTemplate";

export type TemplateOrientation = "portrait" | "landscape";

export interface TemplateConfig {
  label: string;
  orientation: TemplateOrientation;
  component: ComponentType<any>;
}

export const TEMPLATES = {
  "single-portrait": {
    label: "1인 세로 템플릿",
    orientation: "portrait",
    component: SingleTemplatePortrait,
  },
  "single-simple": {
    label: "1인 간단 템플릿",
    orientation: "landscape",
    component: SingleSimpleTemplate,
  },
  "double-symmetric": {
    label: "2인 대칭 템플릿",
    orientation: "landscape",
    component: DoubleTemplateSymmetric,
  },
  "double-twoshot": {
    label: "2인 투샷 템플릿",
    orientation: "landscape",
    component: DoubleTemplateTwoshot,
  },
  "double-simple": {
    label: "2인 간단 템플릿",
    orientation: "landscape",
    component: DoubleSimpleTemplate,
  },
  // 다인 템플릿은 가변 크기이므로 orientation을 landscape으로 두더라도 TemplateModeCanvas 등에서 동적으로 처리할 수 있습니다.
  multi: {
    label: "다인 템플릿 (동적 크기)",
    orientation: "landscape",
    component: MultiTemplate,
  },
} as const satisfies Record<string, TemplateConfig>;

// TEMPLATES 객체의 키들을 유니온 타입으로 자동 추출
export type AvailableTemplateType = keyof typeof TEMPLATES;
