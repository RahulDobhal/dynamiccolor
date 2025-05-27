import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import ColorGenerator from "./components/ColorGenerator";
import ComparisonView from "./components/ComparisonView";
import { typography } from "./styles/tokens";
import { Chat } from "./components/Chat";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${typography.fontFamily};
    background-color: #f5f5f5;
  }
`;

function App() {
  const [view, setView] = useState<"generator" | "comparison">("generator");

  return (
    <>
      <GlobalStyle />
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <button
          onClick={() => setView("generator")}
          style={{
            padding: "8px 16px",
            margin: "0 8px",
            backgroundColor: view === "generator" ? "#0D99FF" : "#e0e0e0",
            color: view === "generator" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Generator
        </button>
        <button
          onClick={() => setView("comparison")}
          style={{
            padding: "8px 16px",
            margin: "0 8px",
            backgroundColor: view === "comparison" ? "#0D99FF" : "#e0e0e0",
            color: view === "comparison" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Plugin Comparison
        </button>
        <Chat />
      </div>

      {view === "generator" ? <ColorGenerator /> : <ComparisonView />}
    </>
  );
}

export default App;
