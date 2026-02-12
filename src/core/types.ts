/**
 * Shared type definitions across the application
 */

export interface CommandOptions {
  verbose?: boolean;
  [key: string]: any;
}

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  messages: ThreadMessage[];
}

export interface Run {
  id: string;
  prompt: string;
  model: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
}
