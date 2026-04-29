import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { EditorProvider } from "./context/EditorContext";
import { EditorLayout } from "./components/layout/EditorLayout";
import { EditorHome } from "./pages/EditorHome";
import "./pages/EditorHome.css";

export const Editor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"meta" | string>("meta");

  return (
    <EditorProvider>
      <EditorLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        <Routes>
          <Route
            path="/"
            element={
              <EditorHome
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            }
          />
        </Routes>
      </EditorLayout>
    </EditorProvider>
  );
};
