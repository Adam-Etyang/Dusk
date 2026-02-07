#!/usr/bin/env bun
import { Command } from "commander";
import { startTUI } from "./tui";
import { executeCommand } from "./commands";

const program = new Command();

program
  .name("dusk")
  .description(
    "AI aggregator for the CLI - Run AI agents with reproducibility and inspectability",
  )
  .version("0.1.0");

// Global options
program
  .option("--no-tui", "Disable TUI and use direct command mode")
  .option("-v, --verbose", "Enable verbose logging");

// Run a prompt
program
  .command("run <prompt>")
  .description("Run a prompt with an AI model")
  .option("-m, --model <name>", "AI model to use (default: gpt-4)")
  .option("-k, --key <key>", "API key (use BYOK for custom key)")
  .action((prompt, options) => {
    executeCommand("run", { prompt, ...options });
  });

// View prompt history
program
  .command("history")
  .description("View prompt execution history")
  .option("-l, --limit <number>", "Limit number of results", "10")
  .option(
    "-f, --filter <status>",
    "Filter by status (success, failed, pending)",
  )
  .action((options) => {
    executeCommand("history", options);
  });

// Show runs as a DAG tree
program
  .command("runs")
  .description("View all runs as a directed acyclic graph (DAG)")
  .option("-t, --tree", "Display as tree view")
  .option("-j, --json", "Output as JSON")
  .option("--format <type>", "Tree or timeline format")
  .action((options) => {
    executeCommand("runs", options);
  });

// Retry a previous prompt
program
  .command("retry <run-id>")
  .description("Retry a prompt with a different model or parameters")
  .option("-m, --model <name>", "New model to use")
  .option("--same", "Retry with the same model")
  .option("-p, --prompt <text>", "Override prompt text")
  .action((runId, options) => {
    executeCommand("retry", { runId, ...options });
  });

// Branch from a specific run
program
  .command("branch <run-id>")
  .description("Create a new branch from a run for exploration")
  .option("-n, --name <name>", "Branch name")
  .action((runId, options) => {
    executeCommand("branch", { runId, ...options });
  });

// Compare outputs across runs
program
  .command("compare <run1-id> <run2-id>")
  .description("Compare outputs between two runs")
  .option("-d, --diff", "Show line-by-line diff")
  .option(
    "-f, --format <type>",
    "Comparison format (side-by-side, unified, json)",
  )
  .action((run1, run2, options) => {
    executeCommand("compare", { run1, run2, ...options });
  });

// Explain AI output
program
  .command("explain <run-id>")
  .description("Understand reasoning behind AI output")
  .option("-v, --verbose", "Show detailed explanation")
  .option("-t, --trace", "Show execution trace")
  .action((runId, options) => {
    executeCommand("explain", { runId, ...options });
  });

// List models
program
  .command("models")
  .description("List available AI models")
  .option("-l, --local", "Show only local models")
  .option("-r, --remote", "Show only remote models")
  .action((options) => {
    executeCommand("models", options);
  });

// Show run details
program
  .command("show <run-id>")
  .description("Show details of a specific run")
  .option("-f, --full", "Show full output")
  .action((runId, options) => {
    executeCommand("show", { runId, ...options });
  });

// Delete a run or branch
program
  .command("delete <run-id>")
  .description("Delete a run or branch")
  .option("-b, --branch", "Delete entire branch")
  .option("-f, --force", "Skip confirmation")
  .action((runId, options) => {
    executeCommand("delete", { runId, ...options });
  });

// Parse arguments
const args = process.argv.slice(2);
const globalOptions = program.opts();

// If no arguments provided, start TUI (unless --no-tui is set)
if (args.length === 0 && globalOptions.tui !== false) {
  startTUI();
} else {
  program.parse();
}
