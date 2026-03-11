import { CanvasSettingsProvider } from "./store/CanvasSettingsContext";
import { AssetProvider } from "./store/AssetContext";
import Layout from "./components/Layout";

function App() {
  return (
    <CanvasSettingsProvider>
      <AssetProvider>
        <Layout />
      </AssetProvider>
    </CanvasSettingsProvider>
  );
}

export default App;
