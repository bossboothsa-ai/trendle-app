import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/theme.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register PWA Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('SW registration failed: ', err);
        });
    });
}
