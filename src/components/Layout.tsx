import CanvasWorkspace from "./CanvasWorkspace";
import Sidebar from "./Sidebar";
import { useBeforeUnload } from "../hooks/useBeforeUnload";

export default function Layout() {
  useBeforeUnload();
  return (
    <div className="flex h-screen w-full bg-neutral-900 text-neutral-100 overflow-hidden">
      {/* 고정 사이드바 메뉴 넓이: w-80 (320px) */}
      <Sidebar className="w-80 shrink-0" />

      {/* 캔버스가 스크롤될 수 있는 메인 작업 영역 */}
      <main className="flex-1 h-full overflow-auto relative flex flex-col">
        <CanvasWorkspace />
      </main>
    </div>
  );
}
