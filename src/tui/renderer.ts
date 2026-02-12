/**
 * Global renderer management for TUI
 * Provides access to the renderer instance throughout the application
 */

let globalRenderer: any = null;
let globalCleanup: (() => void) | null = null;

export function setRenderer(renderer: any): void {
  globalRenderer = renderer;
}

export function getRenderer() {
  return globalRenderer;
}

export function setCleanup(cleanup: () => void): void {
  globalCleanup = cleanup;
}

export function getCleanup() {
  return globalCleanup;
}

export async function executeCleanup(): Promise<void> {
  if (globalCleanup) {
    await globalCleanup();
  } else {
    process.exit(0);
  }
}
