import type { LLMProvider } from "@/types";
import { OpenRouterProvider } from "./openrouter";

export function getProvider(apiKey?: string): LLMProvider {
  const key = apiKey || process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("No API key. Set your OpenRouter key in Settings or configure OPENROUTER_API_KEY env var.");
  }
  return new OpenRouterProvider(key);
}
