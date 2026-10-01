import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { Home } from "./pages/Home";
import { ScenariosList } from "./pages/ScenariosList";
import { Game } from "./pages/Game";
import { Instructions } from "./pages/Instructions";
import { About } from "./pages/About";
import "./styles/global.css";
import "./App.css";

// Lazy-loaded: the editor pulls in mermaid + cytoscape + katex (large,
// only needed by scenario authors, not by players)
const Editor = lazy(() =>
  import("./editor/Editor").then((m) => ({ default: m.Editor })),
);

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
            <Route
              path="/editor/*"
              element={
                <Suspense
                  fallback={
                    <div className="app__loading">Wczytywanie edytora…</div>
                  }
                >
                  <Editor />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
