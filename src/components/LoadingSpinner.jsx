import React from "react";

const LoadingSpinner = () => (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 9999,
  }}>
    <div style={{
      width: 64,
      height: 64,
      border: "8px solid #ccc",
      borderTop: "8px solid #2e7d32",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
  </div>
);

export default LoadingSpinner;
