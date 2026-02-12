# Command Modal System

## Overview
When a user types "/" in the input box on the MainMenu screen, a modal appears showing all available commands they can select from.

## How It Works

### CommandModal.tsx
- Located in `src/tui/screens/CommandModal.tsx`
- Displays a list of available commands with descriptions
- Supports navigation with Up/Down arrow keys
- Press Enter to select a command
- Press Esc to close the modal

### Available Commands
- **/run** - Run a prompt with a model
- **/history** - View your prompt history
- **/compare** - Compare two runs side by side
- **/explain** - Explain the output of a run
- **/models** - List available AI models
- **/help** - Show help information
- **/clear** - Clear the current conversation
- **/exit** - Exit the application

### Integration with MainMenu
1. User types "/" in the input field
2. Modal automatically opens
3. User navigates with Up/Down keys
4. User presses Enter to select
5. Command is executed and modal closes

### Keyboard Shortcuts
- **Up/Down** - Navigate between commands
- **Enter** - Execute selected command
- **Esc** - Close modal without selecting
- **/** prefix - Automatically open modal

## Command Handlers
Each command in the modal has a handler in MainMenu:
- Navigation commands switch to different screens
- `/models` and `/help` log info to console
- `/clear` clears input
- `/exit` terminates the application

## Visual Design
- Modal appears centered on screen
- Selected command highlighted in green
- Double border for distinction
- Dark background (#1a1a1a)
- Command descriptions in gray

## Future Enhancements
- Search/filter commands as user types
- Keyboard shortcuts display in modal
- Command history
- Custom command definitions
