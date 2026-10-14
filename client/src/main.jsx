import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#151516",
            color: "#f5f2ed",
            border: "1px solid #36363a",
            borderRadius: "10px",
            fontSize: "14px",
            boxShadow: "0 20px 50px -15px rgba(0,0,0,0.8)",
          },
          success: { iconTheme: { primary: "#ff6a1a", secondary: "#0a0a0a" } },
          error: { iconTheme: { primary: "#ff5c5c", secondary: "#0a0a0a" } },
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>,
);
