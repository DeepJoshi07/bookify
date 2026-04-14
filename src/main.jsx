import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { ToastProvider } from "@/context/ToastContext.jsx";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import FireProvider from "./context/Firebase.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ToastProvider>
      <FireProvider>
        <App />
      </FireProvider>
    </ToastProvider>
  </ThemeProvider>,
);
