interface RunPromptScreenProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  model: string;
  setModel: (model: string) => void;
  onSubmit: () => void;
  status: string;
  setScreen: (screen: string) => void;
  addLog: (message: string) => void;
}

export default function RunPromptScreen({
  prompt,
  setPrompt,
  model,
  setModel,
  onSubmit,
  status,
  setScreen,
  addLog,
}: RunPromptScreenProps) {
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
        <text fg="#FFFF00">Run Prompt</text>
      </box>

      <box
        title="Prompt"
        style={{
          border: true,
          padding: 1,
          height: 6,
          width: "100%",
          flexDirection: "column",
        }}
      >
        <input
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(value: string) => setPrompt(value)}
        />
      </box>

      <box>
        <text fg="#666666">Esc: Back | Q: Quit</text>
      </box>
    </box>
  );
}
