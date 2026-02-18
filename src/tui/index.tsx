import {
  ConsolePosition,
  createCliRenderer,
  TextAttributes,
} from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { useCallback, useState } from "react";
import {
  getRenderer,
  setRenderer,
  setCleanup,
  executeCleanup,
} from "./renderer";
import type { Thread, ThreadMessage } from "../core/types";
import MainMenu from "./screens/MainMenu";
import RunPromptScreen from "./screens/RunPrompt";
import HistoryScreen from "./screens/History";
import CompareScreen from "./screens/Compare";
import ExplainScreen from "./screens/Explain";
import ChatThread from "./screens/ChatThread";

export async function startTUI() {
  const renderer = await createCliRenderer({
    consoleOptions: {
      position: ConsolePosition.BOTTOM,
      sizePercent: 30,
    },
  });

  setRenderer(renderer);

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

  setCleanup(cleanup);
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
  await executeCleanup();
}

function DuskApp() {
  const [screen, setScreen] = useState<
    "main" | "run" | "history" | "compare" | "explain" | "thread"
  >("main");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gpt-5");
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);

  useKeyboard((key) => {
    if (key.name === "escape") {
      setScreen("main");
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
        addLog={addLog}
      />
    );
  }

  if (screen === "thread" && currentThread) {
   return (
     <ChatThread
       thread={currentThread}
       setThread={setCurrentThread}
       setScreen={setScreen}
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
        setInputFocused={() => {}}
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
