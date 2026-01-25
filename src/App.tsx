import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { GameSetupProvider } from "./contexts/GameSetupProvider";
import { Home } from "./pages/Home";
import { ScenariosList } from "./pages/ScenariosList";
import { ScenarioSetup } from "./pages/ScenarioSetup";
import { Game } from "./pages/Game";
import Instructions from "./pages/Instructions.tsx";
import About from "./pages/About.tsx";
import packageJson from "../package.json";
import "./styles/global.css";
import "./App.css";

function App() {
  return (
    <GameSetupProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scenarios" element={<ScenariosList />} />
              <Route path="/scenarios/:id/setup" element={<ScenarioSetup />} />
              <Route path="/game/:id" element={<Game />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer version={`v${packageJson.version}`} />
        </div>
      </Router>
    </GameSetupProvider>
  );
}

export default App;
