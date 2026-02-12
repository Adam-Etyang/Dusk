# Command Modal - Debugging Guide

## Console Logs Added

The following console.log statements have been added for debugging:

### MainMenu.tsx
```
[MainMenu] Rendering - inputValue: X, isModalOpen: Y
[MainMenu] Input changed: X
[MainMenu] Input starts with '/', opening modal
[MainMenu] Input does not start with '/', closing modal
[MainMenu] About to render, isModalOpen: Y
[MainMenu] Command selected: COMMAND
[MainMenu] Executing: COMMAND
[MainMenu] Unknown command: COMMAND
```

### CommandModal.tsx
```
[CommandModal] isOpen: Y
[CommandModal] Key pressed: KEY, isOpen: Y
[CommandModal] Modal not open, ignoring key
[CommandModal] Up arrow pressed
[CommandModal] New selected index: X
[CommandModal] Down arrow pressed
[CommandModal] Return pressed at index: X
[CommandModal] Executing command: COMMAND
[CommandModal] Escape pressed, closing modal
[CommandModal] Not rendering, modal is closed
[CommandModal] Rendering modal with selected index: X
```

## How to Debug

1. **Start the app:**
   ```bash
   bun run src/cli.ts
   ```

2. **Check the console output** for the debug logs

3. **Expected Flow:**
   - MainMenu renders with initial state
   - Type "/" in the input box
   - Look for: `[MainMenu] Input starts with '/', opening modal`
   - Modal should render: `[CommandModal] Rendering modal with selected index: 0`
   - Press Up/Down arrows
   - Look for: `[CommandModal] Up arrow pressed` or `[CommandModal] Down arrow pressed`
   - Look for: `[CommandModal] New selected index: X`
   - Press Enter to select
   - Look for: `[CommandModal] Return pressed at index: X`
   - Look for: `[MainMenu] Command selected: COMMAND`
   - Look for: `[MainMenu] Executing: COMMAND`

## Possible Issues

1. **Modal doesn't open when typing "/"**
   - Check: `[MainMenu] Input changed:` logs
   - Check: `[MainMenu] Input starts with '/'` appears
   - Check: `[MainMenu] About to render, isModalOpen: true` appears
   - Check: `[CommandModal] isOpen: true` appears

2. **Keyboard input not working**
   - Check: `[CommandModal] Key pressed:` logs appear
   - Check: `[CommandModal] Modal not open, ignoring key` doesn't appear
   - The key.name should match expected names (up, down, return, escape)

3. **Command not executing**
   - Check: `[MainMenu] Command selected:` log appears
   - Check: `[MainMenu] Executing:` log appears with correct command
   - Check if command exists in switch statement

4. **Modal won't close**
   - Check: `[CommandModal] Escape pressed, closing modal` appears
   - Check: `[MainMenu] Input does not start with '/'` appears after Escape

## Testing Steps

1. Start app and type "/" → Modal should open
2. Press Up/Down → Index should change
3. Press Escape → Modal should close
4. Type "/" again → Modal should reopen
5. Use Up/Down to select "/run" → Press Enter
6. Screen should switch to run prompt screen

## Remove Debug Logs

When debugging is complete, search and remove all lines containing:
```
console.log("[MainMenu]
console.log("[CommandModal]
```
