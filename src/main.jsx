
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { BooksProvider } from "@/context/BooksContext.jsx";
import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { ToastProvider } from "@/context/ToastContext.jsx";
import FireProvider from "./context/Firebase.jsx";

createRoot(document.getElementById("root")).render(
  <FireProvider>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BooksProvider>
            <App />
          </BooksProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </FireProvider>,
);
