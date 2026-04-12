import { BooksProvider } from "@/context/BooksContext.jsx";
import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { ToastProvider } from "@/context/ToastContext.jsx";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import FireProvider from "./context/Firebase.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <FireProvider>
    <ThemeProvider>
      <ToastProvider>
        <BooksProvider>
          <App />
        </BooksProvider>
      </ToastProvider>
    </ThemeProvider>
  </FireProvider>,
);
