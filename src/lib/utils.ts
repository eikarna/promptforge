import { clsx, type ClassValue } from "clsx";

// Lightweight clsx replacement (no dep needed)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Simple XOR encryption for API keys (not military-grade, but obfuscates at rest)
const CIPHER_KEY = process.env.AUTH_SECRET || "fallback-key-change-this";

export function encryptApiKey(key: string): string {
  const encoded = Buffer.from(key, "utf-8");
  const keyBytes = Buffer.from(CIPHER_KEY, "utf-8");
  const result = Buffer.alloc(encoded.length);
  for (let i = 0; i < encoded.length; i++) {
    result[i] = encoded[i] ^ keyBytes[i % keyBytes.length];
  }
  return result.toString("base64");
}

export function decryptApiKey(encrypted: string): string {
  const encoded = Buffer.from(encrypted, "base64");
  const keyBytes = Buffer.from(CIPHER_KEY, "utf-8");
  const result = Buffer.alloc(encoded.length);
  for (let i = 0; i < encoded.length; i++) {
    result[i] = encoded[i] ^ keyBytes[i % keyBytes.length];
  }
  return result.toString("utf-8");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
