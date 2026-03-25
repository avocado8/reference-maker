import * as Sentry from "@sentry/react";
import { useState, useRef } from "react";
import { useCanvasSettings } from "../store/CanvasSettingsContext";
import { useAssets } from "../store/AssetContext";
import {
  Settings,
  Image as ImageIcon,
  LayoutTemplate,
  Text,
  Palette,
  Pencil,
  X,
} from "lucide-react";
import clsx from "clsx";
import SliderControl from "./SliderControl";
import type { CanvasOrientation, TemplateType } from "../types/canvas";

interface SidebarProps {
  className?: string;
}

const renderDivider = () => {
  return <div className="border-t border-neutral-700"></div>;
};

export default function Sidebar({ className }: SidebarProps) {
  const { settings, updateSettings } = useCanvasSettings();
  const { addAsset, addSticker, clearAll } = useAssets();
  const [activeTab, setActiveTab] = useState<"info" | "settings">("settings");
  const bgImageInputRef = useRef<HTMLInputElement>(null);

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
          onClick={() => {
            Sentry.captureMessage(`change tab to info`);
            setActiveTab("info");
          }}
          className={clsx(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
            activeTab === "info"
              ? "bg-neutral-600 text-white shadow"
              : "text-neutral-400 hover:text-white",
          )}
        >
          안내
        </button>
        <button
          onClick={() => {
            Sentry.captureMessage(`change tab to settings`);
            setActiveTab("settings");
          }}
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
                          Sentry.captureMessage(
                            `change template type to ${e.target.value}`,
                          );
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
                        <option value="single-portrait">1인 세로 템플릿</option>
                        <option value="double-symmetric">
                          2인 대칭 템플릿
                        </option>
                        <option value="double-twoshot">2인 투샷 템플릿</option>
                        <option value="multi">다인 템플릿 (동적 크기)</option>
                      </select>

                      {/* 다인 템플릿: 인원수 선택 후 변경 버튼 */}
                      {settings.templateType === "multi" && (
                        <div className="mt-3">
                          <label className="block text-xs text-neutral-400 mb-2">
                            인원수 ({settings.multiCount}명)
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(
                              (n) => (
                                <button
                                  key={n}
                                  onClick={() => {
                                    Sentry.captureMessage(
                                      `change multi template count to ${n}`,
                                    );
                                    updateSettings({ multiCount: n });
                                  }}
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

                {renderDivider()}

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    배경 설정
                  </label>
                  <div className="flex gap-2 mb-4 bg-neutral-800 p-1 rounded-md">
                    {(
                      [
                        { value: "solid", label: "단색" },
                        { value: "gradient", label: "그라데이션" },
                        { value: "image", label: "이미지" },
                      ] as const
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          Sentry.captureMessage(
                            `change background type to ${value}`,
                          );
                          updateSettings({ backgroundType: value });
                        }}
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
                        onChange={(e) => {
                          updateSettings({ backgroundColor: e.target.value });
                        }}
                        className="w-10 h-10 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-sm uppercase text-neutral-300 font-mono">
                        {settings.backgroundColor}
                      </span>
                    </div>
                  ) : settings.backgroundType === "gradient" ? (
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
                  ) : (
                    <div className="space-y-4 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                      <div className="space-y-3">
                        <span className="text-xs text-neutral-400 block">
                          배경 이미지
                        </span>

                        {settings.backgroundImage ? (
                          <div className="relative group rounded-md overflow-hidden bg-neutral-900 border border-neutral-700">
                            <img
                              src={settings.backgroundImage}
                              alt="Background preview"
                              className="w-full h-24 object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                              <button
                                onClick={() => bgImageInputRef.current?.click()}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition"
                                title="이미지 변경"
                              >
                                <ImageIcon size={18} className="text-white" />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                updateSettings({ backgroundImage: "" })
                              }
                              className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 p-1 rounded-full text-white shadow-lg transition"
                              title="이미지 삭제"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => bgImageInputRef.current?.click()}
                            className="w-full h-24 rounded-lg border-2 border-dashed border-neutral-700 hover:border-neutral-500 flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-neutral-400 transition-all bg-neutral-800/30"
                          >
                            <ImageIcon size={24} />
                            <span className="text-xs">이미지 업로드</span>
                          </button>
                        )}

                        {settings.backgroundImage && (
                          <div className="pt-2">
                            <SliderControl
                              label="배경 크기"
                              value={settings.backgroundImageScale ?? 100}
                              onChange={(val) =>
                                updateSettings({ backgroundImageScale: val })
                              }
                              min={10}
                              max={300}
                              step={1}
                            />
                          </div>
                        )}

                        {settings.backgroundImage && (
                          <div className="space-y-2 pt-2">
                            <SliderControl
                              label="좌우 위치"
                              value={settings.backgroundImagePanX ?? 50}
                              onChange={(val) =>
                                updateSettings({ backgroundImagePanX: val })
                              }
                              min={0}
                              max={100}
                              step={1}
                            />
                            <SliderControl
                              label="상하 위치"
                              value={settings.backgroundImagePanY ?? 50}
                              onChange={(val) =>
                                updateSettings({ backgroundImagePanY: val })
                              }
                              min={0}
                              max={100}
                              step={1}
                            />
                          </div>
                        )}

                        {settings.backgroundImage && (
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-neutral-400">
                              배경 흐림 효과
                            </span>
                            <button
                              onClick={() =>
                                updateSettings({
                                  enableBlurredBackground:
                                    !settings.enableBlurredBackground,
                                })
                              }
                              className={clsx(
                                "w-10 h-5 rounded-full p-1 transition-colors",
                                settings.enableBlurredBackground
                                  ? "bg-blue-600"
                                  : "bg-neutral-700",
                              )}
                            >
                              <div
                                className={clsx(
                                  "w-3 h-3 bg-white rounded-full transition-transform",
                                  settings.enableBlurredBackground
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                )}
                              />
                            </button>
                          </div>
                        )}

                        <input
                          type="file"
                          ref={bgImageInputRef}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              updateSettings({ backgroundImage: url });
                            }
                            e.target.value = "";
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {renderDivider()}

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    배경 노이즈
                  </label>
                  {/* none / dark / light 선택 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        Sentry.captureMessage("change texture type to none");
                        updateSettings({ textureType: "none" });
                      }}
                      className={clsx(
                        "flex-1 py-2 rounded-lg border transition-colors",
                        settings.textureType === "none"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-neutral-700 bg-neutral-800",
                      )}
                    >
                      <span className="text-xs">없음</span>
                    </button>
                    <button
                      onClick={() => {
                        Sentry.captureMessage("change texture type to dark");
                        updateSettings({ textureType: "dark" });
                      }}
                      className={clsx(
                        "flex-1 py-2 rounded-lg border transition-colors",
                        settings.textureType === "dark"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-neutral-700 bg-neutral-800",
                      )}
                    >
                      <span className="text-xs">어두운 노이즈</span>
                    </button>
                    <button
                      onClick={() => {
                        Sentry.captureMessage("change texture type to light");
                        updateSettings({ textureType: "light" });
                      }}
                      className={clsx(
                        "flex-1 py-2 rounded-lg border transition-colors",
                        settings.textureType === "light"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-neutral-700 bg-neutral-800",
                      )}
                    >
                      <span className="text-xs">밝은 노이즈</span>
                    </button>
                  </div>

                  {settings.textureType !== "none" && (
                    <div className="pt-2">
                      <SliderControl
                        label="노이즈 농도"
                        value={settings.textureDensity}
                        onChange={(val) =>
                          updateSettings({ textureDensity: val })
                        }
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  )}
                </div>

                {renderDivider()}

                <div className="flex flex-col gap-2">
                  <label className="block text-xs text-neutral-400 mb-1">
                    스티커 추가
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addSticker("image")}
                      className="flex flex-col items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                    >
                      <ImageIcon size={16} />
                      <span className="text-[10px]">이미지 스티커</span>
                    </button>
                    <button
                      onClick={() => addSticker("text")}
                      className="flex flex-col items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                    >
                      <Text size={16} />
                      <span className="text-[10px]">텍스트 스티커</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "info" && (
          <div className="space-y-4">
            {settings.mode === "template" ? (
              <>
                <div className="text-sm text-neutral-300 bg-neutral-800 rounded-lg p-4 leading-relaxed">
                  <p className="font-bold text-neutral-300 mb-2">템플릿 모드</p>
                  <p>
                    사전 제작된 템플릿을 활용해 자료를 제작합니다. <br />
                    <br />
                    캔버스의 각 영역을 클릭하면 원하는 자료를 추가할 수
                    있습니다. 영역 하단의 설정 버튼으로 사진 크기, 글씨 색 등을
                    변경할 수 있습니다.
                    <br />
                    <br />
                    사이드바의 '스타일 설정'에서 캔버스 스타일을 수정하고,
                    스티커를 추가할 수 있습니다.
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

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => addSticker("image")}
                    className="flex flex-col items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                  >
                    <ImageIcon size={16} />
                    <span className="text-[10px]">이미지 스티커</span>
                  </button>
                  <button
                    onClick={() => addSticker("text")}
                    className="flex flex-col items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 py-3 rounded-lg border border-neutral-700 transition"
                  >
                    <Text size={16} />
                    <span className="text-[10px]">텍스트 스티커</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
