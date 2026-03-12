export const FONT_CONFIG = {
  sans: {
    label: "기본 고딕",
    className: "font-sans",
    cssFamily: 'system-ui, "Avenir", "Helvetica", "Arial", sans-serif',
  },
  dotum: {
    label: "Pretendard",
    className: "font-dotum",
    cssFamily: '"Pretendard", "Dotum", "Apple SD Gothic Neo", sans-serif',
  },
  batang: {
    label: "KoPub Batang",
    className: "font-batang",
    cssFamily: '"KopubWorldBatang", "Batang", "AppleMyungjo", serif',
  },
  handwrite: {
    label: "손글씨 (강원체)",
    className: "font-handwrite",
    cssFamily: '"Handwrite", "Batang", "AppleMyungjo", serif',
  },
  bmdohyeon: {
    label: "배달의민족 도현체",
    className: "font-bmdohyeon",
    cssFamily: '"BMDohyeon", "Dotum", "Apple SD Gothic Neo", sans-serif',
  },
  scdream: {
    label: "S-Core Dream",
    className: "font-scdream",
    cssFamily: '"SCDream", "Dotum", "Apple SD Gothic Neo", sans-serif',
  },
  msmadi: {
    label: "Ms Madi (영문 전용)",
    className: "font-msmadi",
    cssFamily: '"MsMadi", cursive, sans-serif',
  },
} as const;

export type FontFamily = keyof typeof FONT_CONFIG;
