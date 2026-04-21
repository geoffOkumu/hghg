"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#f9fafb",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
        success: {
          style: {
            background: "#065f46",
            color: "#ecfdf5",
          },
          iconTheme: {
            primary: "#34d399",
            secondary: "#065f46",
          },
        },
        error: {
          style: {
            background: "#7f1d1d",
            color: "#fef2f2",
          },
          iconTheme: {
            primary: "#f87171",
            secondary: "#7f1d1d",
          },
        },
      }}
    />
  );
}
