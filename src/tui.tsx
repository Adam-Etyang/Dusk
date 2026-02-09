import {
  bold,
  ConsolePosition,
  createCliRenderer,
  TextAttributes,
} from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { useCallback, useState } from "react";

let globalRenderer: any = null;
let globalCleanup: (() => void) | null = null;

export async function startTUI() {
  const renderer = await createCliRenderer({
    consoleOptions: {
      position: ConsolePosition.BOTTOM,
      sizePercent: 30,
    },
  });

  globalRenderer = renderer;
  
  // Handle cleanup on process signals
  const cleanup = () => {
    if (renderer) {
      try {
        renderer.dispose?.();
      } catch (e) {
        // ignore
      }
    }
    process.exit(0);
  };
  
  globalCleanup = cleanup;
  process.on("SIGINT", cleanup);
  
  const root = createRoot(renderer);
  renderer.keyInput.on("keypress", (key) => {
    if (key.name === "`") {
      renderer.console.toggle();
    }
  });
  root.render(<DuskApp />);
}

export async function exitTUI() {
  if (globalCleanup) {
    await globalCleanup();
  } else {
    process.exit(0);
  }
}

interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Thread {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  messages: ThreadMessage[];
}

function DuskApp() {
  const [screen, setScreen] = useState<
    "main" | "run" | "history" | "compare" | "explain" | "thread"
  >("main");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gpt-5");
  const [status, setStatus] = useState("");
  const [inputFocused, setInputFocused] = useState(screen === "main");
  const [logs, setLogs] = useState<string[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);

  useKeyboard((key) => {
    if (key.name === "escape") {
      setScreen("main");
    }
    if (key.name === "q" && !inputFocused) {
      exitTUI().catch(() => process.exit(0));
    }
  });

  // Intercept console.log to capture logs
  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
    // Also output to stderr so it appears in the native console too
    console.log(message);
  }, []);

  const handleRunPrompt = useCallback(() => {
    if (!prompt) {
      setStatus("error");
      addLog("[ERROR] Prompt is required");
      return;
    }
    setStatus("Executing prompt...");
    addLog("[APP] Executing prompt...");

    // TODO: Call executeCommand("run", { prompt, model })
    //
    setTimeout(() => {
      setStatus("Prompt executed");
      addLog("[APP] Prompt executed");
    }, 2000);
  }, [prompt, model, addLog]);

  if (screen === "main") {
    return (
      <MainMenu
        setScreen={setScreen}
        setInputFocused={setInputFocused}
        addLog={addLog}
        setCurrentThread={setCurrentThread}
      />
    );
  }

  if (screen === "thread" && currentThread) {
    return (
      <ChatThread
        thread={currentThread}
        setThread={setCurrentThread}
        setScreen={setScreen}
        setInputFocused={setInputFocused}
        addLog={addLog}
      />
    );
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
        addLog={addLog}
      />
    );
  }

  if (screen === "history") {
    return <HistoryScreen setScreen={setScreen} addLog={addLog} />;
  }

  if (screen === "compare") {
    return <CompareScreen setScreen={setScreen} addLog={addLog} />;
  }

  if (screen === "explain") {
    return <ExplainScreen setScreen={setScreen} addLog={addLog} />;
  }

  return null;
}

function MainMenu({
  setScreen,
  setInputFocused,
  addLog,
  setCurrentThread,
}: {
  setScreen: any;
  setInputFocused: any;
  addLog: any;
  setCurrentThread: any;
}) {
  const [commands, setCommands] = useState<
    {
      id: string;
      name?: string;
      description?: string;
      prompt?: string;
      model?: string;
      status?: string;
      timestamp?: string;
    }[]
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

    // Simulate server response
    setTimeout(() => {
      const response =
        "This is a mock response from the AI model. In the real implementation, this would come from the server API.";
      addLog(`[API] Response received for thread ${threadId}`);

      setCurrentThread((prev: Thread | null) => {
        if (!prev) return null;
        return {
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
        };
      });
    }, 1500);

    const newRun = {
      id: threadId,
      prompt: inputValue,
      model: "gpt-5.2",
      status: "pending",
      timestamp:
        new Date().toISOString().split("T")[0] +
        " " +
        new Date().toTimeString().split(" ")[0],
    };

    setCommands((prev) => [newRun, ...prev]);
    setInputValue("");
    setScreen("thread");
  }, [inputValue, commands.length, addLog, setScreen]);

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
        Dusk.Agent
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
              <text fg="#FFFFFF">
                {command.prompt ? `📌 ${command.prompt}` : command.name}
              </text>
              <text fg="#FFFFFF" attributes={TextAttributes.DIM}>
                {command.model
                  ? `Model: ${command.model} | Status: ${command.status}`
                  : command.description}
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
          value={inputValue}
          onChange={(value: string) => setInputValue(value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
      </box>

      {/* Help Text */}
      <box
        style={{
          flexDirection: "row",
        }}
      >
        <text fg="#666666">
          Enter: Run | Q: Quit | Commands: /history /branch /compare /explain
        </text>
      </box>
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
  addLog,
}: {
  prompt: string;
  setPrompt: any;
  model: string;
  setModel: any;
  onSubmit: () => void;
  status: string;
  setScreen: any;
  addLog: any;
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

//TODO:Make floating screen for this
function HistoryScreen({ setScreen, addLog }: { setScreen: any; addLog: any }) {
  addLog("[APP] Viewing prompt history");
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

//TODO:split screen for this
function CompareScreen({ setScreen, addLog }: { setScreen: any; addLog: any }) {
  addLog("[APP] Comparing runs");
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

//TODO:Delete this
function ExplainScreen({ setScreen, addLog }: { setScreen: any; addLog: any }) {
  addLog("[APP] Explaining run");
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

function ChatThread({
  thread,
  setThread,
  setScreen,
  setInputFocused,
  addLog,
}: {
  thread: Thread;
  setThread: any;
  setScreen: any;
  setInputFocused: any;
  addLog: any;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    addLog(`[APP] Sending message to thread ${thread.id}: "${inputValue}"`);

    // Add user message
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

    // Simulate server response
    setTimeout(() => {
      const response =
        "This is another mock response from the AI model. The conversation continues...";
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
    if (key.name === "q" && !inputValue) {
      process.exit(0);
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
      <box style={{ flexDirection: "row", gap: 2, paddingBottom: 1 }}>
        <text attributes={TextAttributes.BOLD} fg="#FFFF00">
          {thread.title}
        </text>
        <text fg="#888888">ID: {thread.id}</text>
        <text fg="#888888">Model: {thread.model}</text>
      </box>

      {/* Messages */}
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
        {thread.messages.length === 0 ? (
          <text fg="#666666">No messages yet</text>
        ) : (
          thread.messages.map((msg) => (
            <box
              key={msg.id}
              style={{
                flexDirection: "column",
                gap: 0,
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <text
                fg={msg.role === "user" ? "#00FF00" : "#00AAFF"}
                attributes={TextAttributes.BOLD}
              >
                {msg.role === "user" ? "You:" : "AI:"}
              </text>
              <text fg="#FFFFFF">{msg.content}</text>
            </box>
          ))
        )}
      </box>

      {/* Input Box with Info */}
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

        <box
          style={{
            flexDirection: "row",
            gap: 2,
          }}
        >
          <text fg="#888888">Model: {thread.model}</text>
          <text fg="#888888">Dir: {process.cwd()}</text>
        </box>
      </box>

      {/* Help Text */}
      <text fg="#666666">Enter: Send | Esc: Back to Main | Q: Quit</text>
    </box>
  );
}
