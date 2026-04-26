import React from "react";
import { Routes, Route } from "react-router-dom";
import { EditorProvider } from "./context/EditorContext";
import { EditorLayout } from "./components/layout/EditorLayout";
import { EditorHome } from "./pages/EditorHome";
import "./pages/EditorHome.css";

export const Editor: React.FC = () => {
  return (
    <EditorProvider>
      <EditorLayout>
        <Routes>
          <Route path="/" element={<EditorHome />} />
        </Routes>
      </EditorLayout>
    </EditorProvider>
  );
};
