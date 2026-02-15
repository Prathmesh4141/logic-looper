import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";
import { AuthProvider } from "./context/AuthContext";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("New version available");
  },
  onOfflineReady() {
    console.log("App ready for offline use");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
