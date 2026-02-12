/*
*I dont think I need this
*/
interface ExplainScreenProps {
  setScreen: (screen: string) => void;
  addLog: (message: string) => void;
}

export default function ExplainScreen({
  setScreen,
  addLog,
}: ExplainScreenProps) {
  addLog("[APP] Explaining run");

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
        <text fg="#FFFF00">Explain Run</text>
      </box>

      <box style={{ marginTop: 1 }}>
        <text>Select a run to understand its execution path</text>
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
        <box>
          <text>Execution trace and reasoning</text>
        </box>
        <box>
          <text fg="#888888">Load a run to view detailed explanation</text>
        </box>

        <box style={{ marginTop: 1 }}>
          <text fg="#AAAAAA">Model: gpt-4</text>
        </box>
        <box>
          <text fg="#AAAAAA">Duration: 2.3s</text>
        </box>
        <box>
          <text fg="#AAAAAA">Tokens: 1200 input, 450 output</text>
        </box>
      </box>

      <box style={{ marginTop: 2 }}>
        <text fg="#666666">Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
