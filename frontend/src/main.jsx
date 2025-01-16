import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    {/*1.wrap component in the browerRouter to allow using react router*/}
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </StrictMode>
);
