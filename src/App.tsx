import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { Home } from "./pages/Home";
import { ScenariosList } from "./pages/ScenariosList";
import { Game } from "./pages/Game";
import { Instructions } from "./pages/Instructions";
import { About } from "./pages/About";
import "./styles/global.css";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scenarios" element={<ScenariosList />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
