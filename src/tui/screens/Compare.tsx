interface CompareScreenProps {
  setScreen: (screen: string) => void;
  addLog: (message: string) => void;
}

export default function CompareScreen({
  setScreen,
  addLog,
}: CompareScreenProps) {
  addLog("[APP] Comparing runs");
  return (
    <box style={{ border: true, padding: 2, flexDirection: "column", gap: 1 }}>
      <box>
        <text fg="#FFFF00">Compare Runs</text>
      </box>

      <box>
        <text fg="#666666">No runs to compare</text>
      </box>

      <box>
        <text fg="#666666">Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
