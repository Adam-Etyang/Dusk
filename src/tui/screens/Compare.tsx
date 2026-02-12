/*
*Should be a diff screen implement later
*/


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
        <text fg="#FFFF00">Compare Runs</text>
      </box>

      <box style={{ marginTop: 1 }}>
        <text>Select two runs to compare their outputs</text>
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
          <text>Run #1 vs Run #2</text>
        </box>
        <box>
          <text fg="#888888">Differences: 3 lines added, 1 line removed</text>
        </box>

        <box style={{ marginTop: 1 }}>
          <text fg="#AAAAAA">Similarity: 87%</text>
        </box>
      </box>

      <box style={{ marginTop: 2 }}>
        <text fg="#666666">Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
