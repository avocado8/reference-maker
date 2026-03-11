import { useRef, useState, useEffect } from "react";
import { useCanvasSettings } from "../store/CanvasSettingsContext";
import clsx from "clsx";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import TemplateModeCanvas from "./canvas/TemplateModeCanvas";
import FreeModeCanvas from "./canvas/FreeModeCanvas";
import StickerLayer from "./canvas/StickerLayer";
import { getTemplateOrientation } from "../utils/getTemplateOrientation";
import { getMultiDimensions } from "../utils/getMultiDimensions";

// 인원수 미선택 상태(피커 표시)에 쓰이는 기본 크기
const MULTI_PICKER_DIMENSIONS = { width: 1200, height: 900 };

export default function CanvasWorkspace() {
  const { settings } = useCanvasSettings();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const getCanvasDimensions = () => {
    // 다인 템플릿: 인원수에 따라 동적 크기 계산
    if (settings.mode === "template" && settings.templateType === "multi") {
      return settings.multiCount !== undefined
        ? getMultiDimensions(settings.multiCount)
        : MULTI_PICKER_DIMENSIONS;
    }
    const orientation =
      settings.mode === "template"
        ? getTemplateOrientation(settings.templateType)
        : settings.orientation;
    return orientation === "portrait"
      ? { width: 1200, height: 1600 }
      : { width: 1600, height: 1200 };
  };

  const dimensions = getCanvasDimensions();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / dimensions.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [dimensions.width]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, {
        width: dimensions.width,
        height: dimensions.height,
        filter: (node) => {
          if (!(node instanceof HTMLElement)) return true;
          return node.dataset.exportIgnore !== "true";
        },
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });
      const link = document.createElement("a");
      link.download = `character-sheet-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-neutral-800 flex flex-col items-center overflow-auto p-12">
      {/* 캔버스 툴바 (상단 액션 메뉴) */}
      <div className="w-full max-w-[1600px] flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">미리보기 및 편집</h2>
          <p className="text-sm text-neutral-400">
            현재 모드:{" "}
            {settings.mode === "template" ? "템플릿 모드" : "자유 배치 모드"}
          </p>
          <p className="text-sm text-neutral-400">
            새로고침 시 작업 내역이 초기화됩니다. 업로드한 자료는 로컬
            브라우저에서만 사용되며 저장되지 않습니다.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
        >
          <Download size={20} />
          완성본 저장
        </button>
      </div>

      {/* 캔버스 스케일 컨테이너 (다인 템플릿은 1600px 초과 가능하므로 max-w 제거) */}
      <div ref={containerRef} className="w-full">
        {/* transform이 layout에 영향 없으므로 실제 시각적 크기만큼 높이 확보 */}
        <div
          style={{
            width: dimensions.width * scale,
            height: dimensions.height * scale,
          }}
        >
          {/* 실제 렌더링될 캔버스 영역 (고정 크기, 스케일로 축소 표시) */}
          <div
            ref={canvasRef}
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              backgroundColor: settings.backgroundColor,
              color: "#000",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className={clsx(
              "relative overflow-hidden shrink-0 transition-all duration-300 shadow-2xl",
              settings.fontFamily === "dotum"
                ? "font-dotum"
                : settings.fontFamily === "batang"
                  ? "font-batang"
                  : "font-sans",
            )}
          >
            {" "}
            {/* 배경 질감 레이어 */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: "url('/textures/noise2.jpg')",
                backgroundRepeat: "repeat",
                backgroundSize: "1000px 1000px",
                opacity: settings.textureDensity / 100,
              }}
            />
            {/* 실제 내용 */}
            <div className="relative z-10 w-full h-full">
              {settings.mode === "template" ? (
                <TemplateModeCanvas />
              ) : (
                <FreeModeCanvas />
              )}
              <StickerLayer canvasScale={scale} />

              <div
                className="absolute bottom-2 right-6 text-sm text-neutral-600 select-none"
                style={{ pointerEvents: "none" }}
              >
                @OL__SA
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
