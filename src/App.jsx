import React from "react";
import { useSelector } from "react-redux";
import UploadPage from "./pages/UploadPage";
import EditorPage from "./pages/EditorPage";

function App() {
  const { currentImage } = useSelector((state) => state.images);

  // Show editor if image is loaded, otherwise show upload page
  return currentImage ? <EditorPage /> : <UploadPage />;
}

export default App;
