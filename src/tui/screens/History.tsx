interface HistoryScreenProps {
  setScreen: (screen: string) => void;
  addLog: (message: string) => void;
}

export default function HistoryScreen({
  setScreen,
  addLog,
}: HistoryScreenProps) {
  addLog("[APP] Viewing prompt history");
  return (
    <box style={{ border: true, padding: 2, flexDirection: "column", gap: 1 }}>
      <box>
        <text fg="#FFFF00">Prompt History</text>
      </box>

      <box>
        <text fg="#666666">No history yet</text>
      </box>

      <box>
        <text fg="#666666">Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
