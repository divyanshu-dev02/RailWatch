import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <App />

      {/* Global Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        newestOnTop
        pauseOnHover
      />
    </>
  </React.StrictMode>
);
