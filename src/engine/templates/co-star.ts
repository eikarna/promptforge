import type { ToneType, IndustryType, ChatMessage } from "@/types";

/**
 * CO-STAR Framework
 * C - Context: Background information for the task
 * O - Objective: What the prompt aims to achieve
 * S - Style: Writing style to adopt
 * T - Tone: Emotional register
 * A - Audience: Who the output is for
 * R - Response: Desired output format
 */
export function buildCoStarPrompt(
  rawPrompt: string,
  tone: ToneType,
  industry: IndustryType
): ChatMessage[] {
  const systemPrompt = `You are an elite prompt engineer specializing in the CO-STAR framework. Your task is to transform a raw, low-fidelity user prompt into a structured, high-tier prompt that will produce exceptional results from any AI model.

Apply the CO-STAR framework:

## C — CONTEXT
Analyze the raw prompt and infer the broader background context. Fill in missing context that would help an AI understand the full picture. Include relevant domain knowledge for the "${industry}" industry.

## O — OBJECTIVE  
Extract and sharpen the core objective. Make it specific, measurable, and actionable. Remove ambiguity.

## S — STYLE
Set the writing style to match a ${tone} register. Reference specific writing conventions appropriate for ${industry}.

## T — TONE
Calibrate the emotional tone to "${tone}". Define how the output should feel — authoritative, empathetic, analytical, etc.

## A — AUDIENCE
Infer the target audience from context and industry. Specify their expertise level, expectations, and needs.

## R — RESPONSE FORMAT
Define the ideal output structure — bullet points, narrative, code, table, step-by-step, etc. Be explicit about length, sections, and formatting requirements.

---

OUTPUT RULES:
1. Return ONLY the enriched prompt — no meta-commentary, no explanations
2. The enriched prompt should be self-contained and ready to paste into any AI
3. Use clear section headers with markdown formatting
4. Be specific and detailed — vague prompts produce vague outputs
5. Include constraints and guardrails where appropriate
6. The enriched prompt should be 3-5x more detailed than the raw input`;

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Transform this raw prompt using the CO-STAR framework:\n\n---\n${rawPrompt}\n---\n\nIndustry context: ${industry}\nDesired tone: ${tone}\n\nReturn only the enriched, production-ready prompt.`,
    },
  ];
}
