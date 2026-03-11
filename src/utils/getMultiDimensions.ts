/**
 * 다인 템플릿 레이아웃 상수 및 계산 유틸리티
 *
 * CharacterUnit 구성 높이:
 *   title(56) + image-main(260) + palette(90) + desc(170) + image-sub(220)
 *   + gap-4 * 4(64) + p-4 * 2(32) = 892px
 */

export const MULTI_UNIT_WIDTH = 360; // 캐릭터 카드 1개 너비 (px)
export const MULTI_UNIT_HEIGHT = 892; // 캐릭터 카드 1개 높이 (px)
export const MULTI_GAP = 24; // gap-6 (px)
export const MULTI_PADDING = 32; // p-8 (px, 한쪽)

/**
 * 인원수에 따른 열(column) 수 결정
 * - 1~4명: 1열 레이아웃 (1행)
 * - 5~6명: 3열 (2행)
 * - 7~8명: 4열 (2행)
 * - 9명: 3열 (3행, 3x3)
 * - 10명: 5열 (2행, 5x2)
 */
export const getMultiCols = (count: number): number => {
  if (count <= 4) return count;
  if (count <= 6) return 3;
  if (count <= 8) return 4;
  if (count === 9) return 3;
  return 5; // 10명
};

/**
 * 인원수에 따른 캔버스 픽셀 크기 계산
 * 공식: width = unitWidth * cols + gap * (cols-1) + padding * 2
 *       height = unitHeight * rows + gap * (rows-1) + padding * 2
 */
export const getMultiDimensions = (
  count: number,
): { width: number; height: number } => {
  const cols = getMultiCols(count);
  const rows = Math.ceil(count / cols);
  return {
    width:
      MULTI_UNIT_WIDTH * cols +
      MULTI_GAP * (cols - 1) +
      MULTI_PADDING * 2,
    height:
      MULTI_UNIT_HEIGHT * rows +
      MULTI_GAP * (rows - 1) +
      MULTI_PADDING * 2,
  };
};
