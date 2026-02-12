
import { useCallback, useState } from "react";
import { useKeyboard } from "@opentui/react";
import type { Thread } from "../../core/types";
import CommandModal from "./CommandModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("[MainMenu] Rendering - inputValue:", inputValue, "isModalOpen:", isModalOpen);

  const handleInputChange = useCallback((value: string) => {
    console.log("[MainMenu] Input changed:", value);
    setInputValue(value);
    // Show modal when "/" is typed
    if (value.startsWith("/")) {
      console.log("[MainMenu] Input starts with '/', opening modal");
      setIsModalOpen(true);
    } else {
      console.log("[MainMenu] Input does not start with '/', closing modal");
      setIsModalOpen(false);
    }
  }, []);

  const handleSelectCommand = useCallback(
    (commandKey: string) => {
      console.log("[MainMenu] Command selected:", commandKey);
      addLog(`[APP] Command selected: /${commandKey}`);
      setIsModalOpen(false);

      switch (commandKey) {
        case "run":
          console.log("[MainMenu] Executing: run");
          setScreen("run");
          setInputValue("");
          break;
        case "history":
          console.log("[MainMenu] Executing: history");
          setScreen("history");
          setInputValue("");
          break;
        case "compare":
          console.log("[MainMenu] Executing: compare");
          setScreen("compare");
          setInputValue("");
          break;
        case "explain":
          console.log("[MainMenu] Executing: explain");
          setScreen("explain");
          setInputValue("");
          break;
        case "models":
          console.log("[MainMenu] Executing: models");
          addLog("[APP] Available models: gpt-4, gpt-3.5-turbo, claude-3, etc.");
          setInputValue("");
          break;
        case "help":
          console.log("[MainMenu] Executing: help");
          addLog("[APP] Commands: /run, /history, /compare, /explain, /models, /clear, /exit");
          setInputValue("");
          break;
        case "clear":
          console.log("[MainMenu] Executing: clear");
          setInputValue("");
          addLog("[APP] Conversation cleared");
          break;
        case "exit":
          console.log("[MainMenu] Executing: exit");
          process.exit(0);
          break;
        default:
          console.log("[MainMenu] Unknown command:", commandKey);
          setInputValue("");
      }
    },
    [addLog, setScreen]
  );

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

  useKeyboard((key) => {
    if (key.name === "r") {
      setScreen("run");
    }
    if (key.name === "h") {
      setScreen("history");
    }
    if (key.name === "c") {
      setScreen("compare");
    }
    if (key.name === "e") {
      setScreen("explain");
    }
  });

  console.log("[MainMenu] About to render, isModalOpen:", isModalOpen);

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

      <box
        style={{
          flexDirection: "column",
          gap: 1,
          flex: 1,
          overflow: "auto",
          paddingBottom: 1,
        }}
      >
        <box>
          <text fg="#888888">Quick Commands:</text>
        </box>
        <box>
          <text fg="#AAAAAA">R - Run a new prompt</text>
        </box>
        <box>
          <text fg="#AAAAAA">H - View history</text>
        </box>
        <box>
          <text fg="#AAAAAA">C - Compare runs</text>
        </box>
        <box>
          <text fg="#AAAAAA">E - Explain output</text>
        </box>
      </box>

      <box
        title="New Conversation"
        style={{
          border: true,
          padding: 1,
          flexDirection: "column",
          gap: 1,
        }}
      >
        <input
          placeholder="Enter your prompt or /help... (Enter to send)"
          value={inputValue}
          onChange={(value: string) => {
            console.log("[MainMenu] onChange triggered with value:", JSON.stringify(value));
            handleInputChange(value);
          }}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
      </box>

      <box>
        <text fg="#666666">
          R: Run | H: History | C: Compare | E: Explain | Q: Quit
        </text>
      </box>

      {console.log("[MainMenu] Rendering CommandModal with isOpen:", isModalOpen)}
      <CommandModal
        isOpen={isModalOpen}
        onSelectCommand={handleSelectCommand}
        onClose={() => setIsModalOpen(false)}
      />
    </box>
  );
}
