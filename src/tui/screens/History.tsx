/**
 *Make this a modal screen and show history of prompt and jumps to that section of the chat Thread 
 */
interface HistoryScreenProps {
  setScreen: (screen: string) => void;
  addLog: (message: string) => void;
}

export default function HistoryScreen({
  setScreen,
  addLog,
}: HistoryScreenProps) {
  addLog("[APP] Viewing prompt history");

  const mockHistory = [
    {
      id: "run-1",
      prompt: "Explain React hooks",
      model: "gpt-4",
      status: "success",
      time: "2m ago",
    },
    {
      id: "run-2",
      prompt: "Write a CLI tool",
      model: "gpt-3.5-turbo",
      status: "success",
      time: "1h ago",
    },
    {
      id: "run-3",
      prompt: "Debug TypeScript error",
      model: "gpt-4",
      status: "failed",
      time: "2h ago",
    },
  ];

  return (
    <box
      style={{
        border: true,
        padding: 2,
        flexDirection: "column",
        gap: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <box>
        <text fg="#FFFF00">Prompt History</text>
      </box>

      <box
        style={{
          flexDirection: "column",
          gap: 1,
          marginTop: 1,
          flex: 1,
          overflow: "auto",
        }}
      >
        {mockHistory.map((run) => (
          <box key={run.id} style={{ flexDirection: "column", gap: 0 }}>
            <box>
              <text fg="#AAAAAA">
                {run.id}: "{run.prompt}"
              </text>
            </box>
            <box>
              <text fg="#888888">
                Model: {run.model} | Status: {run.status} | {run.time}
              </text>
            </box>
          </box>
        ))}
      </box>

      <box style={{ marginTop: 2 }}>
        <text fg="#666666">Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
