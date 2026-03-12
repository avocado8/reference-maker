import { useState } from "react";
import { useCanvasSettings } from "../store/CanvasSettingsContext";
import { useAssets } from "../store/AssetContext";
import {
  Settings,
  Image as ImageIcon,
  LayoutTemplate,
  Text,
  Palette,
  Pencil,
  Sticker,
} from "lucide-react";
import clsx from "clsx";
import type { CanvasOrientation, TemplateType } from "../types/canvas";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { settings, updateSettings } = useCanvasSettings();
  const { addAsset, addSticker, clearAll } = useAssets();
  const [activeTab, setActiveTab] = useState<"assets" | "settings">("assets");

  const handleModeChange = (mode: "template" | "free") => {
    if (settings.mode === mode) return;

    const confirmed = window.confirm(
      "모드를 전환하면 현재 작업 중인 내용이 초기화됩니다. 계속하시겠습니까?",
    );
    if (confirmed) {
      updateSettings({ mode });
      clearAll();
    }
  };

  return (
    <div
      className={clsx(
        "bg-neutral-900 border-r border-neutral-700 flex flex-col h-full",
        className,
      )}
    >
      <div className="p-4 border-b border-neutral-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Pencil className="text-blue-500" />
          커미션 자료 메이커
        </h1>
      </div>

      <div className="flex bg-neutral-800 p-1 m-4 rounded-lg">
        <button
          onClick={() => setActiveTab("assets")}
          className={clsx(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
            activeTab === "assets"
              ? "bg-neutral-600 text-white shadow"
              : "text-neutral-400 hover:text-white",
          )}
        >
          설명서
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={clsx(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
            activeTab === "settings"
              ? "bg-neutral-600 text-white shadow"
              : "text-neutral-400 hover:text-white",
          )}
        >
          스타일 수정
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {activeTab === "settings" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                <LayoutTemplate size={16} /> 캔버스 모드
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleModeChange("template")}
                  className={clsx(
                    "p-3 rounded-lg border text-sm flex flex-col items-center gap-2 transition-all",
                    settings.mode === "template"
                      ? "bg-blue-600/20 border-blue-500 text-blue-400"
                      : "bg-neutral-800 border-neutral-700 hover:border-neutral-500",
                  )}
                >
                  <LayoutTemplate size={20} />
                  템플릿 모드
                </button>
                {/* <button
                  onClick={() => handleModeChange("free")}
                  className={clsx(
                    "p-3 rounded-lg border text-sm flex flex-col items-center gap-2 transition-all",
                    settings.mode === "free"
                      ? "bg-blue-600/20 border-blue-500 text-blue-400"
                      : "bg-neutral-800 border-neutral-700 hover:border-neutral-500",
                  )}
                >
                  <Move size={20} />
                  자유 배치
                </button> */}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                <Settings size={16} /> 스타일
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    방향
                  </label>
                  {settings.mode === "template" ? (
                    <>
                      <select
                        value={settings.templateType ?? "single-portrait"}
                        onChange={(e) => {
                          const newType = e.target.value as TemplateType;
                          // multi가 아닌 템플릿으로 변경 시 multiCount 초기화 → 다음에 multi 재선택 시 피커 표시
                          updateSettings(
                            newType !== "multi"
                              ? { templateType: newType, multiCount: undefined }
                              : { templateType: newType },
                          );
                        }}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-sm text-white"
                      >
                        <option value="single-portrait">
                          1인 세로 템플릿 (1200x1600)
                        </option>
                        <option value="double-symmetric">
                          2인 대칭 템플릿 (1600x1200)
                        </option>
                        <option value="double-twoshot">
                          2인 투샷 템플릿 (1600x1200)
                        </option>
                        <option value="multi">다인 템플릿 (동적 크기)</option>
                      </select>

                      {/* 다인 템플릿: 인원수 선택 후 변경 버튼 */}
                      {settings.templateType === "multi" &&
                        settings.multiCount !== undefined && (
                          <div className="mt-3">
                            <label className="block text-xs text-neutral-400 mb-2">
                              인원수 ({settings.multiCount}명)
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (n) => (
                                  <button
                                    key={n}
                                    onClick={() =>
                                      updateSettings({ multiCount: n })
                                    }
                                    className={clsx(
                                      "w-8 h-8 text-xs font-bold rounded-md transition-all",
                                      settings.multiCount === n
                                        ? "bg-blue-600 text-white"
                                        : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600",
                                    )}
                                  >
                                    {n}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </>
                  ) : (
                    <select
                      value={settings.orientation}
                      onChange={(e) =>
                        updateSettings({
                          orientation: e.target.value as CanvasOrientation,
                        })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-sm text-white"
                    >
                      <option value="portrait">세로형 (1200x1600)</option>
                      <option value="landscape">가로형 (1600x1200)</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    배경 설정
                  </label>
                  <div className="flex gap-2 mb-4 bg-neutral-800 p-1 rounded-md">
                    {(
                      [
                        { value: "solid", label: "단색" },
                        { value: "gradient", label: "그라데이션" },
                      ] as const
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() =>
                          updateSettings({ backgroundType: value })
                        }
                        className={clsx(
                          "flex-1 py-1 text-[10px] font-medium rounded transition-colors",
                          (settings.backgroundType ?? "solid") === value
                            ? "bg-neutral-600 text-white shadow"
                            : "text-neutral-400 hover:text-white",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {(settings.backgroundType ?? "solid") === "solid" ? (
                    <div className="flex items-center gap-3 bg-neutral-800/50 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(e) =>
                          updateSettings({ backgroundColor: e.target.value })
                        }
                        className="w-10 h-10 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-sm uppercase text-neutral-300 font-mono">
                        {settings.backgroundColor}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">시작색</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.gradientColorStart ?? "#ffffff"}
                            onChange={(e) =>
                              updateSettings({
                                gradientColorStart: e.target.value,
                              })
                            }
                            className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono uppercase text-neutral-400">
                            {settings.gradientColorStart}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">끝색</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.gradientColorEnd ?? "#e5e7eb"}
                            onChange={(e) =>
                              updateSettings({
                                gradientColorEnd: e.target.value,
                              })
                            }
                            className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono uppercase text-neutral-400">
                            {settings.gradientColorEnd}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-neutral-400">각도</span>
                          <span className="text-xs text-neutral-300">
                            {settings.gradientAngle ?? 180}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="45"
                          value={settings.gradientAngle ?? 180}
                          onChange={(e) =>
                            updateSettings({
                              gradientAngle: Number(e.target.value),
                            })
                          }
                          className="w-full accent-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    배경 노이즈
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={settings.textureDensity}
                    onChange={(e) =>
                      updateSettings({
                        textureDensity: parseFloat(e.target.value),
                      })
                    }
                    className="flex-1 accent-white"
                    title={`크기: ${Math.round(settings.textureDensity * 100)}%`}
                  />
                  <span className="ml-2 text-xs text-neutral-400 w-8 text-right shrink-0">
                    {Math.round(settings.textureDensity)}%
                  </span>
                </div>

                <button
                  onClick={() => addSticker()}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                >
                  <Sticker size={16} /> 스티커 추가
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="space-y-4">
            {settings.mode === "template" ? (
              <>
                <div className="text-sm text-neutral-300 bg-neutral-800 rounded-lg p-4 leading-relaxed">
                  <p className="font-bold text-neutral-300 mb-2">템플릿 모드</p>
                  <p>
                    사전 제작된 템플릿을 활용해 자료를 제작합니다. <br />{" "}
                    캔버스의 각 영역을 클릭하면 이미지, 텍스트, 팔레트 중 원하는
                    유형을 선택해 추가할 수 있습니다.
                    <br />
                    <br />
                    영역 하단의 설정 버튼으로 사진 크기, 글씨 색 등을 변경할 수
                    있습니다.
                    <br />
                    <br />
                    업로드한 자료는 로컬 브라우저에서만 사용되며 저장되지
                    않습니다.
                  </p>
                  <p className="mt-2 text-neutral-400 text-xs">
                    자료를 추가하면 우상단에 × 버튼이 나타나 삭제할 수 있습니다.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="font-bold text-neutral-300 mb-2">
                  자유 배치 모드
                </p>
                <p className="text-sm text-neutral-300">
                  원하는 자료를 자유롭게 추가하여 캔버스에 배치하세요. <br />
                  크기를 조절하거나 위치를 이동할 수 있습니다. 추가한 자료의
                  하단 툴바에서 자료 변경이 가능합니다.
                  <br />
                  <br />
                  배치 시 정렬선이 표시되며, 가까이 배치할 시 자동으로
                  정렬됩니다. 정렬선은 최종 파일에 포함되지 않습니다.
                  <br />
                  <br />
                  스타일 설정에서 캔버스 크기, 배경색, 폰트를 변경할 수
                  있습니다.
                </p>

                <button
                  onClick={() => addAsset("image")}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                >
                  <ImageIcon size={16} /> 이미지 추가
                </button>

                <button
                  onClick={() => addAsset("text")}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                >
                  <Text size={16} /> 텍스트 추가
                </button>

                <button
                  onClick={() => addAsset("palette")}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                >
                  <Palette size={16} /> 컬러 팔레트 추가
                </button>

                <button
                  onClick={() => addSticker()}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                >
                  <Sticker size={16} /> 스티커 추가
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
