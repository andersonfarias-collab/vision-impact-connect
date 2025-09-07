import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import i18n after React is fully loaded
import("./i18n");

createRoot(document.getElementById("root")!).render(<App />);
