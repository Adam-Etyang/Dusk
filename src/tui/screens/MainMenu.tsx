import { useCallback, useState } from "react";
import type { Thread } from "../../core/types";

interface MainMenuProps {
  setScreen: (screen: string) => void;
  setInputFocused: (focused: boolean) => void;
  addLog: (message: string) => void;
  setCurrentThread: (thread: Thread | null) => void;
}

export default function MainMenu({
  setScreen,
  setInputFocused,
  addLog,
  setCurrentThread,
}: MainMenuProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSendPrompt = useCallback(() => {
    if (!inputValue.trim()) return;

    addLog(`[APP] Creating thread with prompt: "${inputValue}"`);

    const threadId = `thread-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newThread: Thread = {
      id: threadId,
      title: inputValue.substring(0, 50),
      model: "gpt-5.2",
      createdAt: timestamp,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "user",
          content: inputValue,
          timestamp,
        },
      ],
    };

    setCurrentThread(newThread);
    setScreen("thread");
    setInputValue("");
  }, [inputValue, addLog, setCurrentThread, setScreen]);

  return (
    <box
      style={{
        border: true,
        padding: 1,
        flexDirection: "column",
        gap: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <box>
        <text fg="#FFFF00">Dusk - AI CLI Aggregator</text>
      </box>

      <box style={{ flex: 1, overflow: "auto" }}>
        <text fg="#888888">Ready for input</text>
      </box>

      <box
        title="New Prompt"
        style={{
          border: true,
          padding: 1,
          flexDirection: "column",
          gap: 1,
        }}
      >
        <input
          placeholder="Enter your prompt..."
          value={inputValue}
          onChange={(value: string) => setInputValue(value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />

        <box style={{ gap: 2 }}>
          <button onClick={handleSendPrompt}>Send</button>
        </box>
      </box>

      <box>
        <text fg="#666666">Esc: Menu | Q: Quit</text>
      </box>
    </box>
  );
}
