import { useKeyboard } from "@opentui/react";
import { useState } from "react";

interface RunPromptScreenProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  model: string;
  setModel: (model: string) => void;
  onSubmit: () => void;
  status: string;
  setScreen: (screen: string) => void;
  addLog: (message: string) => void;
}

export default function RunPromptScreen({
  prompt,
  setPrompt,
  model,
  setModel,
  onSubmit,
  status,
  setScreen,
  addLog,
}: RunPromptScreenProps) {
  const [focused, setFocused] = useState<"prompt" | "model">("prompt");

  useKeyboard((key) => {
    if (key.name === "tab") {
      setFocused((prev) => (prev === "prompt" ? "model" : "prompt"));
    }
    if (key.name === "return") {
      onSubmit();
    }
  });

  return (
    <box
      style={{
        border: true,
        padding: 2,
        flexDirection: "column",
        gap: 2,
        width: "100%",
        height: "100%",
      }}
    >
      <box>
        <text fg="#FFFF00">Run Prompt</text>
      </box>

      <box title="Prompt" style={{ border: true, width: "100%", height: 5 }}>
        <input
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(value: string) => setPrompt(value)}
          focused={focused === "prompt"}
        />
      </box>

      <box title="Model" style={{ border: true, width: 40, height: 3 }}>
        <input
          placeholder="gpt-4, gpt-3.5-turbo, etc."
          value={model}
          onChange={(value: string) => setModel(value)}
          focused={focused === "model"}
        />
      </box>

      <box>
        <text
          fg={
            status.includes("error")
              ? "red"
              : status.includes("Executing")
                ? "yellow"
                : status.includes("executed")
                  ? "green"
                  : "#999"
          }
        >
          {status || "Ready"}
        </text>
      </box>

      <box>
        <text fg="#666666">
          Tab: Switch fields | Enter: Run | Esc: Back | Q: Quit
        </text>
      </box>
    </box>
  );
}
