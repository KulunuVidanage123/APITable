// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import { Toaster } from 'react-hot-toast'; 
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        success: {
          duration: 3000,
          style: { background: '#4ade80', color: 'white' }
        },
        error: {
          duration: 5000,
          style: { background: '#ef4444', color: 'white' }
        }
      }}
    />
  </>
);