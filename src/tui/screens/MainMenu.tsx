import { useCallback, useState } from "react";
import { useKeyboard } from "@opentui/react";

interface Command {
  key: string;
  name: string;
  description: string;
}

interface MainMenuProps {
  setScreen: (screen: string) => void;
  addLog: (message: string) => void;
}

const AVAILABLE_COMMANDS: Command[] = [
  {
    key: "run",
    name: "/run",
    description: "Run a new prompt",
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
];

export default function MainMenu({ setScreen, addLog }: MainMenuProps) {
  const [inputValue, setInputValue] = useState("");
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const handleSelectCommand = useCallback(
    (commandKey: string) => {
      addLog(`[APP] Command selected: /${commandKey}`);
      setIsCommandMenuOpen(false);
      setInputValue("");

      switch (commandKey) {
        case "run":
          setScreen("run");
          break;
        case "history":
          setScreen("history");
          break;
        case "compare":
          setScreen("compare");
          break;
        case "explain":
          setScreen("explain");
          break;
        default:
          break;
      }
    },
    [addLog, setScreen],
  );

  const getFilteredCommands = useCallback(() => {
    if (!inputValue.startsWith("/")) {
      console.log(`[MainMenu] No command input`);
      return [];
    }

    const searchTerm = inputValue.slice(1).toLowerCase().trim();

    const filtered = AVAILABLE_COMMANDS.filter((cmd) => {
      const cmdName = cmd.name.slice(1);
      return cmdName.startsWith(searchTerm) || searchTerm === "";
    });

    console.log(
      `[MainMenu] Filtered commands: input="${inputValue}", search="${searchTerm}", results=${filtered.length}`,
    );
    return filtered;
  }, [inputValue]);

  const handleInputChange = useCallback(
    (value: string) => {
      console.log(`[MainMenu] Input changed: "${value}"`);
      setInputValue(value);

      if (value.startsWith("/")) {
        console.log(`[MainMenu] Opening command menu`);
        setIsCommandMenuOpen(true);
        setSelectedCommandIndex(0);

        // Auto-execute if only one command matches
        const searchTerm = value.slice(1).toLowerCase().trim();
        const filtered = AVAILABLE_COMMANDS.filter((cmd) => {
          const cmdName = cmd.name.slice(1);
          return cmdName.startsWith(searchTerm);
        });

        if (filtered.length === 1) {
          console.log(
            `[MainMenu] Auto-executing single match: /${filtered[0].key}`,
          );
          setTimeout(() => {
            handleSelectCommand(filtered[0].key);
          }, 100);
        }
      } else {
        console.log(`[MainMenu] Closing command menu`);
        setIsCommandMenuOpen(false);
      }
    },
    [handleSelectCommand],
  );

  useKeyboard((key) => {
    if (isCommandMenuOpen) {
      const filteredCommands = getFilteredCommands();

      if (key.name === "up") {
        setSelectedCommandIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1,
        );
        return;
      }
      if (key.name === "down") {
        setSelectedCommandIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0,
        );
        return;
      }
      if (key.name === "return") {
        const selectedCmd = filteredCommands[selectedCommandIndex];
        if (selectedCmd) {
          handleSelectCommand(selectedCmd.key);
        }
        return;
      }
      if (key.name === "escape") {
        setIsCommandMenuOpen(false);
        setInputValue("");
        return;
      }
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
      <box>
        <text fg="#FFFF00">Dusk.AI</text>
      </box>

      <box
        style={{
          flexDirection: "column",
          gap: 1,
          paddingBottom: 1,
        }}
      ></box>

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
          placeholder="Enter / for more commands"
          value={inputValue}
          onChange={(value: string) => {
            handleInputChange(value);
          }}
        />
      </box>


      {isCommandMenuOpen && (
        <box
          style={{
            position: "absolute",
            top: 12,
            left: 2,
            width: 50,
            border: true,
            borderStyle: "double",
            padding: 1,
            flexDirection: "column",
            gap: 0,
            backgroundColor: "#1a1a1a",
          }}
        >
          {getFilteredCommands().length > 0 ? (
            <>
              <box
                style={{
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {getFilteredCommands().map((cmd, index) => (
                  <box
                    key={cmd.key}
                    style={{
                      flexDirection: "column",
                      gap: 0,
                      paddingLeft: 1,
                      backgroundColor:
                        index === selectedCommandIndex
                          ? "#333333"
                          : "transparent",
                    }}
                  >
                    <box>
                      <text
                        fg={
                          index === selectedCommandIndex ? "#00FF00" : "#AAAAAA"
                        }
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
                  ↑↓: Select | Enter: Execute | Esc: Cancel
                </text>
              </box>
            </>
          ) : (
            <box>
              <text fg="#FF6666">
                No commands matching "{inputValue.slice(1)}"
              </text>
            </box>
          )}
        </box>
      )}
    </box>
  );
}
