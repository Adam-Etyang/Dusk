import { bold, createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { useCallback, useState } from "react";

let globalRenderer: any = null;
let globalCleanup: (() => void) | null = null;

export async function startTUI() {
  const renderer = await createCliRenderer();
  globalRenderer = renderer;
  const root = createRoot(renderer);
  root.render(<DuskApp />);
}

export async function exitTUI() {
  if (globalCleanup) {
    await globalCleanup();
  } else {
    process.exit(0);
  }
}

function DuskApp() {
  const [screen, setScreen] = useState<
    "main" | "run" | "history" | "compare" | "explain"
  >("main");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gpt-5");
  const [status, setStatus] = useState("");

  useKeyboard((key) => {
    if (key.name === "escape") {
      setScreen("main");
    }
    if (key.name === "q") {
      exitTUI().catch(() => process.exit(0));
    }
  });

  const handleRunPrompt = useCallback(() => {
    if (!prompt) {
      setStatus("error");
      return;
    }
    setStatus("Executing prompt...");
    console.log("Executing prompt");

    // TODO: Call executeCommand("run", { prompt, model })
    //
    setTimeout(() => setStatus("Prompt executed"), 2000);
  }, [prompt, model]);

  if (screen === "main") {
    return <MainMenu setScreen={setScreen} />;
  }

  if (screen === "run") {
    return (
      <RunPromptScreen
        prompt={prompt}
        setPrompt={setPrompt}
        model={model}
        setModel={setModel}
        onSubmit={handleRunPrompt}
        status={status}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "history") {
    return <HistoryScreen setScreen={setScreen} />;
  }

  if (screen === "compare") {
    return <CompareScreen setScreen={setScreen} />;
  }

  if (screen === "explain") {
    return <ExplainScreen setScreen={setScreen} />;
  }

  return null;
}

function MainMenu({ setScreen }: { setScreen: any }) {
  const [commands, setCommands] = useState<
    { id: string; name: string; description: string }[]
  >([
    {
      id: "command1",
      name: "/Add",
      description: "Add your own API key",
    },
    {
      id: "command2",
      name: "/model",
      description: "select a specific model",
    },
    {
      id: "command3",
      name: "/history",
      description: "view history",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendPrompt = useCallback(() => {
    if (!inputValue.trim()) return;

    const newRun = {
      id: `run-${commands.length + 1}`,
      prompt: inputValue,
      model: "gpt-5.2",
      status: "pending",
      timestamp:
        new Date().toISOString().split("T")[0] +
        " " +
        new Date().toTimeString().split(" ")[0],
    };

    setCommands((prev) => [newRun, ...prev]);

    // Simulate run completion
    setTimeout(() => {
      setCommands((prev) =>
        prev.map((run) =>
          run.id === newRun.id ? { ...run, status: "success" } : run,
        ),
      );
    }, 2000);

    setInputValue("");
  }, [inputValue, commands.length]);

  useKeyboard((key) => {
    if (key.name === "return" && inputValue.trim()) {
      handleSendPrompt();
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
      {/* Header */}
      <text attributes={TextAttributes.BOLD} fg="#FFFF00">
        Dusk - Reproducible AI commands
      </text>

      {/* Sample commands list*/}
      <box
        style={{
          flexDirection: "column",
          gap: 1,
          flex: 1,
          overflow: "auto",
          paddingBottom: 1,
        }}
      >
        {commands.length === 0 ? (
          <text fg="#666666">
            No commands yet. Send a prompt to get started.
          </text>
        ) : (
          commands.map((command) => (
            <box
              key={command.id}
              style={{
                flexDirection: "column",
                gap: 0,
                paddingLeft: 1,
                paddingRight: 1,
                borderLeft: true,
              }}
            >
              <text fg="#FFFFFF">{command.name}</text>
              <text fg="#FFFFFF" attributes={TextAttributes.DIM}>
                {command.description}
              </text>
            </box>
          ))
        )}
      </box>

      {/* Input Box */}
      <box
        title="Prompt"
        style={{
          border: true,
          height: 3,
          width: "100%",
        }}
      >
        <input
          placeholder="Enter prompt (will create a new run)..."
          onInput={setInputValue}
          value={inputValue}
        />
      </box>

      {/* Help Text */}
      <text fg="#666666">
        Enter: Run | Q: Quit | Commands: /history /branch /compare /explain
      </text>
    </box>
  );
}

function RunPromptScreen({
  prompt,
  setPrompt,
  model,
  setModel,
  onSubmit,
  status,
  setScreen,
}: {
  prompt: string;
  setPrompt: any;
  model: string;
  setModel: any;
  onSubmit: () => void;
  status: string;
  setScreen: any;
}) {
  const [focused, setFocused] = useState<"prompt" | "model">("prompt");

  useKeyboard((key) => {
    if (key.name === "tab") {
      setFocused((prev) => (prev === "prompt" ? "model" : "prompt"));
    }
  });

  return (
    <box style={{ border: true, padding: 2, flexDirection: "column", gap: 2 }}>
      <text fg="#FFFF00">Run Prompt</text>

      <box title="Prompt" style={{ border: true, width: "100%", height: 5 }}>
        <input
          placeholder="Enter your prompt..."
          onInput={setPrompt}
          focused={focused === "prompt"}
        />
      </box>

      <box title="Model" style={{ border: true, width: 40, height: 3 }}>
        <input
          placeholder="gpt-4, gpt-3.5-turbo, etc."
          onInput={setModel}
          focused={focused === "model"}
          defaultValue={model}
        />
      </box>

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

      <box style={{ gap: 2 }}>
        <button onClick={onSubmit}>Run</button>
      </box>

      <text fg="#666666">
        Tab: Switch fields | Enter: Run | Esc: Back | Q: Quit
      </text>
    </box>
  );
}

function HistoryScreen({ setScreen }: { setScreen: any }) {
  return (
    <box style={{ border: true, padding: 2, flexDirection: "column", gap: 1 }}>
      <text fg="#FFFF00">Prompt History</text>

      <box style={{ flexDirection: "column", gap: 1, marginTop: 1 }}>
        <text>📌 Run #1: "Explain React hooks"</text>
        <text fg="#888888">Model: gpt-4 | Status: success | 2m ago</text>

        <text style={{ marginTop: 1 }}>📌 Run #2: "Write a CLI tool"</text>
        <text fg="#888888">
          Model: gpt-3.5-turbo | Status: success | 1h ago
        </text>

        <text style={{ marginTop: 1 }}>
          📌 Run #3: "Debug TypeScript error"
        </text>
        <text fg="#888888">Model: gpt-4 | Status: failed | 2h ago</text>
      </box>

      <text fg="#666666" style={{ marginTop: 2 }}>
        Esc: Back | Q: Quit
      </text>
    </box>
  );
}

function CompareScreen({ setScreen }: { setScreen: any }) {
  return (
    <box style={{ border: true, padding: 2, flexDirection: "column", gap: 1 }}>
      <text fg="#FFFF00">Compare commands</text>

      <text style={{ marginTop: 1 }}>
        Select two commands to compare their outputs
      </text>

      <box style={{ flexDirection: "column", gap: 1, marginTop: 1 }}>
        <text>📌 Run #1 vs Run #2</text>
        <text fg="#888888">Differences: 3 lines added, 1 line removed</text>
      </box>

      <text fg="#666666" style={{ marginTop: 2 }}>
        Esc: Back | Q: Quit
      </text>
    </box>
  );
}

function ExplainScreen({ setScreen }: { setScreen: any }) {
  return (
    <box style={{ border: true, padding: 2, flexDirection: "column", gap: 1 }}>
      <text fg="#FFFF00">Explain Run</text>

      <text style={{ marginTop: 1 }}>
        Select a run to understand its execution path
      </text>

      <box style={{ flexDirection: "column", gap: 1, marginTop: 1 }}>
        <text>🔍 Execution trace and reasoning</text>
        <text fg="#888888">Load a run to view detailed explanation</text>
      </box>

      <text fg="#666666" style={{ marginTop: 2 }}>
        Esc: Back | Q: Quit
      </text>
    </box>
  );
}
