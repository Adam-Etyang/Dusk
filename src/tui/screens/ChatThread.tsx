import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useCallback, useState } from "react";
import type { Thread, ThreadMessage } from "../../core/types";

interface ChatThreadProps {
  thread: Thread;
  setThread: (thread: Thread | ((prev: Thread) => Thread)) => void;
  setScreen: (screen: string) => void;
  setInputFocused: (focused: boolean) => void;
  addLog: (message: string) => void;
}

export default function ChatThread({
  thread,
  setThread,
  setScreen,
  setInputFocused,
  addLog,
}: ChatThreadProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    addLog(`[APP] Sending message to thread ${thread.id}: "${inputValue}"`);

    const userMessage: ThreadMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setThread((prev: Thread) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setTimeout(() => {
      const response = "Mock response from AI model";
      addLog(`[API] Response received for thread ${thread.id}`);

      setThread((prev: Thread) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: response,
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    }, 1500);

    setInputValue("");
  }, [inputValue, thread.id, addLog, setThread]);

  useKeyboard((key) => {
    if (key.name === "return" && inputValue.trim()) {
      handleSendMessage();
    }
    if (key.name === "escape") {
      setScreen("main");
    }
  });

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
      <box style={{ flexDirection: "row", gap: 2, paddingBottom: 1 }}>
        <box>
          <text attributes={TextAttributes.BOLD} fg="#FFFF00">
            {thread.title}
          </text>
        </box>
        <box>
          <text fg="#888888">ID: {thread.id}</text>
        </box>
      </box>

      <box
        style={{
          flexDirection: "column",
          gap: 1,
          flex: 1,
          overflow: "auto",
          paddingBottom: 1,
          borderBottom: true,
        }}
      >
        {thread.messages.map((msg) => (
          <box
            key={msg.id}
            style={{
              flexDirection: "column",
              gap: 0,
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            <box>
              <text
                fg={msg.role === "user" ? "#00FF00" : "#00AAFF"}
                attributes={TextAttributes.BOLD}
              >
                {msg.role === "user" ? "You:" : "AI:"}
              </text>
            </box>
            <box>
              <text fg="#FFFFFF">{msg.content}</text>
            </box>
          </box>
        ))}
      </box>

      <box
        title="Message"
        style={{
          border: true,
          height: 6,
          width: "100%",
          flexDirection: "column",
          padding: 1,
          gap: 1,
        }}
      >
        <input
          placeholder="Type your message..."
          value={inputValue}
          onChange={(value: string) => setInputValue(value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
      </box>

      <box>
        <text fg="#666666">Enter: Send | Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
