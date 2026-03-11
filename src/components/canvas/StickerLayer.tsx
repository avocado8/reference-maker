import { useAssets } from "../../store/AssetContext";
import StickerAsset from "../StickerAsset";

interface StickerLayerProps {
  canvasScale: number;
}

export default function StickerLayer({ canvasScale }: StickerLayerProps) {
  const { stickerAssets } = useAssets();

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
      data-export-layer="stickers"
    >
      {stickerAssets.map((sticker) => (
        <div key={sticker.id} style={{ pointerEvents: "auto" }}>
          <StickerAsset sticker={sticker} canvasScale={canvasScale} />
        </div>
      ))}
    </div>
  );
}
