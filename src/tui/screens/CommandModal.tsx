import { useKeyboard } from "@opentui/react";
import { useState, useCallback } from "react";

interface Command {
  key: string;
  name: string;
  description: string;
}

interface CommandModalProps {
  isOpen: boolean;
  onSelectCommand: (commandKey: string) => void;
  onClose: () => void;
}

const AVAILABLE_COMMANDS: Command[] = [
  {
    key: "help",
    name: "/help",
    description: "Show help information",
  },
  {
    key: "run",
    name: "/run",
    description: "Run a prompt with a model",
  },
  {
    key: "history",
    name: "/history",
    description: "View your prompt history",
  },
  {
    key: "compare",
    name: "/compare",
    description: "Compare two runs side by side",
  },
  {
    key: "explain",
    name: "/explain",
    description: "Explain the output of a run",
  },
  {
    key: "models",
    name: "/models",
    description: "List available AI models",
  },
  {
    key: "clear",
    name: "/clear",
    description: "Clear the current conversation",
  },
  {
    key: "exit",
    name: "/exit",
    description: "Exit the application",
  },
];

export default function CommandModal({
  isOpen,
  onSelectCommand,
  onClose,
}: CommandModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  console.log("[CommandModal] Render - isOpen:", isOpen, "selectedIndex:", selectedIndex);

  useKeyboard((key) => {
    console.log("[CommandModal] Key pressed:", key.name, "isOpen:", isOpen);
    if (!isOpen) {
      console.log("[CommandModal] Modal not open, ignoring key");
      return;
    }

    if (key.name === "up") {
      console.log("[CommandModal] Up arrow pressed");
      setSelectedIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : AVAILABLE_COMMANDS.length - 1;
        console.log("[CommandModal] New selected index:", newIndex);
        return newIndex;
      });
    }
    if (key.name === "down") {
      console.log("[CommandModal] Down arrow pressed");
      setSelectedIndex((prev) => {
        const newIndex = prev < AVAILABLE_COMMANDS.length - 1 ? prev + 1 : 0;
        console.log("[CommandModal] New selected index:", newIndex);
        return newIndex;
      });
    }
    if (key.name === "return") {
      console.log("[CommandModal] Return pressed at index:", selectedIndex);
      const command = AVAILABLE_COMMANDS[selectedIndex];
      console.log("[CommandModal] Executing command:", command.key);
      onSelectCommand(command.key);
      setSelectedIndex(0);
    }
    if (key.name === "escape") {
      console.log("[CommandModal] Escape pressed, closing modal");
      onClose();
      setSelectedIndex(0);
    }
  });

  if (!isOpen) {
    console.log("[CommandModal] Not rendering, modal is closed");
    return null;
  }

  console.log("[CommandModal] Rendering modal with selected index:", selectedIndex);

  return (
    <box
      style={{
        position: "absolute",
        top: "center",
        left: "center",
        width: 60,
        height: 20,
        border: true,
        borderStyle: "double",
        padding: 1,
        flexDirection: "column",
        gap: 1,
        backgroundColor: "#1a1a1a",
      }}
    >
      <box>
        <text fg="#FFFF00">Available Commands</text>
      </box>

      <box
        style={{
          flexDirection: "column",
          gap: 0,
          flex: 1,
          overflow: "auto",
        }}
      >
        {AVAILABLE_COMMANDS.map((cmd, index) => (
          <box
            key={cmd.key}
            style={{
              flexDirection: "column",
              gap: 0,
              paddingLeft: 1,
              backgroundColor: index === selectedIndex ? "#333333" : "transparent",
            }}
          >
            <box>
              <text
                fg={index === selectedIndex ? "#00FF00" : "#AAAAAA"}
              >
                {cmd.name}
              </text>
            </box>
            <box>
              <text fg="#666666">{cmd.description}</text>
            </box>
          </box>
        ))}
      </box>

      <box style={{ marginTop: 1 }}>
        <text fg="#666666">
          Up/Down: Select | Enter: Execute | Esc: Close
        </text>
      </box>
    </box>
  );
}

export { AVAILABLE_COMMANDS };
