import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./white-brand-overrides.css";
import "./catalog-proofing.css";

createRoot(document.getElementById("root")!).render(<App />);
