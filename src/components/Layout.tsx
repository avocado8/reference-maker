import { useState } from "react";
import { Menu } from "lucide-react";
import clsx from "clsx";
import CanvasWorkspace from "./CanvasWorkspace";
import Sidebar from "./Sidebar";
import { useBeforeUnload } from "../hooks/useBeforeUnload";

export default function Layout() {
  useBeforeUnload();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* 모바일 배경 딤 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바: 모바일에서는 오버레이 드로어, 데스크탑에서는 고정 배치 */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-80 transition-transform duration-300",
          "md:relative md:z-auto md:translate-x-0 md:shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* 모바일 메뉴 열기 버튼 */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-3 left-3 z-40 bg-neutral-800 border border-neutral-700 p-2 rounded-lg text-neutral-300 hover:text-white shadow-lg transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {/* 캔버스가 스크롤될 수 있는 메인 작업 영역 */}
      <main className="flex-1 h-full overflow-auto relative flex flex-col">
        <CanvasWorkspace />
      </main>
    </div>
  );
}
