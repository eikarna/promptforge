import type { EnrichmentRequest, ChatMessage, FrameworkType } from "@/types";
import { buildCoStarPrompt } from "./templates/co-star";
import { buildRisenPrompt } from "./templates/risen";
import { buildHybridPrompt } from "./templates/hybrid";
import { getProvider } from "@/providers/registry";

const frameworkBuilders: Record<
  FrameworkType,
  (raw: string, tone: any, industry: any) => ChatMessage[]
> = {
  "co-star": buildCoStarPrompt,
  risen: buildRisenPrompt,
  hybrid: buildHybridPrompt,
};

export async function enrichPrompt(
  request: EnrichmentRequest
): Promise<string> {
  const builder = frameworkBuilders[request.framework];
  if (!builder) {
    throw new Error(`Unknown framework: ${request.framework}`);
  }

  const messages = builder(request.rawPrompt, request.tone, request.industry);
  const provider = getProvider(request.apiKey);

  return provider.chat({
    model: request.model,
    messages,
    temperature: request.temperature,
    maxTokens: 4096,
  });
}

export async function enrichPromptStream(
  request: EnrichmentRequest
): Promise<ReadableStream<string>> {
  const builder = frameworkBuilders[request.framework];
  if (!builder) {
    throw new Error(`Unknown framework: ${request.framework}`);
  }

  const messages = builder(request.rawPrompt, request.tone, request.industry);
  const provider = getProvider(request.apiKey);

  return provider.streamChat({
    model: request.model,
    messages,
    temperature: request.temperature,
    maxTokens: 4096,
  });
}
