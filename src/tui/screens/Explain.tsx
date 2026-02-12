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
    <box style={{ border: true, padding: 2, flexDirection: "column", gap: 1 }}>
      <box>
        <text fg="#FFFF00">Explain Run</text>
      </box>

      <box>
        <text fg="#666666">Select a run to explain</text>
      </box>

      <box>
        <text fg="#666666">Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
