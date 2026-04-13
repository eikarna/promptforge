export type FrameworkType = "co-star" | "risen" | "hybrid";

export type ToneType =
  | "professional"
  | "casual"
  | "academic"
  | "creative"
  | "technical"
  | "persuasive";

export type IndustryType =
  | "general"
  | "technology"
  | "finance"
  | "healthcare"
  | "marketing"
  | "legal"
  | "education"
  | "e-commerce"
  | "saas";

export interface EnrichmentRequest {
  rawPrompt: string;
  framework: FrameworkType;
  tone: ToneType;
  industry: IndustryType;
  model: string;
  temperature: number;
  apiKey?: string;
}

export interface EnrichmentResult {
  enrichedPrompt: string;
  framework: FrameworkType;
  tokensUsed?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatParams {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMProvider {
  name: string;
  chat(params: ChatParams): Promise<string>;
  streamChat(params: ChatParams): Promise<ReadableStream<string>>;
}

export const FRAMEWORKS: Record<FrameworkType, string> = {
  "co-star": "CO-STAR",
  risen: "RISEN",
  hybrid: "Hybrid",
};

export const TONES: Record<ToneType, string> = {
  professional: "Professional",
  casual: "Casual",
  academic: "Academic",
  creative: "Creative",
  technical: "Technical",
  persuasive: "Persuasive",
};

export const INDUSTRIES: Record<IndustryType, string> = {
  general: "General",
  technology: "Technology",
  finance: "Finance",
  healthcare: "Healthcare",
  marketing: "Marketing",
  legal: "Legal",
  education: "Education",
  "e-commerce": "E-Commerce",
  saas: "SaaS",
};

export const MODELS = [
  {
    id: "nvidia/nemotron-3-super-120b-a12b",
    name: "NVIDIA Nemotron Super 120B",
    provider: "openrouter",
  },
  {
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    name: "NVIDIA Nemotron Nano 30B (Free)",
    provider: "openrouter",
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "openrouter",
  },
  {
    id: "google/gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro",
    provider: "openrouter",
  },
] as const;
