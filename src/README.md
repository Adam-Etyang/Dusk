# Dusk - Source Directory Structure

## Directory Organization

```
src/
├── cli.ts              # CLI entry point and command setup
├── index.tsx           # Application entry point (demo)
├── tui.ts              # TUI barrel export
├── cli/                # CLI configuration (future expansion)
├── commands/           # Command implementations (one file per command)
│   ├── index.ts        # Command aggregator
│   ├── run.ts          # Run command
│   ├── history.ts      # History command
│   ├── runs.ts         # Runs command
│   ├── retry.ts        # Retry command
│   ├── branch.ts       # Branch command
│   ├── compare.ts      # Compare command
│   ├── explain.ts      # Explain command
│   ├── models.ts       # Models command
│   ├── show.ts         # Show command
│   └── delete.ts       # Delete command
├── tui/                # Terminal UI implementation
│   ├── index.tsx       # TUI entry point & main DuskApp component
│   ├── renderer.ts     # Global renderer management
│   ├── screens/        # Individual screen components
│   │   ├── MainMenu.tsx      # Main menu screen
│   │   ├── RunPrompt.tsx     # Run prompt screen
│   │   ├── History.tsx       # History screen
│   │   ├── Compare.tsx       # Compare screen
│   │   ├── Explain.tsx       # Explain screen
│   │   └── ChatThread.tsx    # Chat thread screen
│   └── core/           # TUI-specific logic (future)
│       └── types.ts
├── components/         # Reusable UI components
│   └── InputBox.tsx
├── core/               # Core logic and utilities
│   ├── types.ts        # Shared type definitions
│   └── utils.ts        # Utility functions
└── README.md           # This file
```

## Module Responsibilities

### `cli.ts`
- Main CLI entry point using Commander.js
- Defines all CLI commands and their options
- Routes to TUI or direct command execution

### `commands/`
- Individual command implementations
- Each command file exports a handler function
- `index.ts` aggregates and routes to handlers

### `tui/`
- Terminal UI implementation using OpenTUI + React
- `index.tsx` - Main DuskApp component and TUI initialization
- `renderer.ts` - Global renderer state management
- `screens/` - Individual screen/page components

### `core/`
- Shared type definitions (ThreadMessage, Thread, Run, etc.)
- Common utilities and helpers
- `types.ts` - TypeScript interfaces
- `utils.ts` - Utility functions

### `components/`
- Reusable UI components used across screens
- Input fields, buttons, dialogs, etc.

## Key Patterns

### Accessing the Renderer
Use exported functions from `tui/renderer.ts`:
```ts
import { getRenderer } from "./tui";

const renderer = getRenderer();
renderer.console.toggle();
```

### Adding a New Command
1. Create a new file in `/commands/` (e.g., `commands/newcommand.ts`)
2. Export a handler function: `export async function handleNewCommand(options)`
3. Import and register in `commands/index.ts`
4. Define the command in `cli.ts`

### Adding a New Screen
1. Create a React component in `/tui/screens/` (e.g., `screens/NewScreen.tsx`)
2. Import in `tui/index.tsx`
3. Add case to the screen router in DuskApp component
4. Pass necessary props from parent component

## OpenTUI Note
In OpenTUI, text elements cannot be direct children of box containers. Always wrap text in a box:
```tsx
// ❌ Wrong
<box>
  <text>Hello</text>
</box>

// ✅ Correct
<box>
  <box>
    <text>Hello</text>
  </box>
</box>
```

## Future Expansion
- `/api/` - API client for backend communication
- `/store/` - State management (if needed)
- `/hooks/` - Custom React hooks
- `/services/` - Business logic services
