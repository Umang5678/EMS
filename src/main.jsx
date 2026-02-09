import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { ThemeProvider } from "././component/ThemeContext.js";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//   </StrictMode>
// );

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import "./index.css";
// import App from "./App.jsx";

// const clientId = "YOUR_GOOGLE_CLIENT_ID"; // 🔁 Replace this with your real client ID

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId={clientId}>
//       <App />
//     </GoogleOAuthProvider>
//   </StrictMode>
// );
