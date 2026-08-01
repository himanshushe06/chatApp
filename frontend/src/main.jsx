import React from "react";
import ReactDOM from "react-dom/client";
import { ChatProvider } from "./context/ChatContext";
import { SocketProvider } from "./context/SocketContext";
import { MessageMenuProvider } from "./context/MessageMenuContext"

import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <SocketProvider>
            <MessageMenuProvider>
              <App />
              <Toaster
                  position="top-right"
                  toastOptions={{
                      duration: 2500,

                      style: {
                          background:
                              "var(--surface-bg)",
                          color:
                              "var(--text-primary)",
                          border:
                              "1px solid var(--border-color)",
                          borderRadius: "12px",
                          padding: "12px 16px",
                      },

                      success: {
                          duration: 2200,
                      },

                      error: {
                          duration: 3500,
                      },
                  }}
              />
            </MessageMenuProvider>
          </SocketProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);