import type { ToneType, IndustryType, ChatMessage } from "@/types";

/**
 * RISEN Framework
 * R - Role: Who the AI should act as
 * I - Instructions: Clear task directives
 * S - Steps: Ordered action sequence
 * E - End goal: Success criteria / desired outcome
 * N - Narrowing: Constraints, boundaries, exclusions
 */
export function buildRisenPrompt(
  rawPrompt: string,
  tone: ToneType,
  industry: IndustryType
): ChatMessage[] {
  const systemPrompt = `You are an elite prompt engineer specializing in the RISEN framework. Your task is to transform a raw, low-fidelity user prompt into a structured, high-tier prompt that will produce exceptional results from any AI model.

Apply the RISEN framework:

## R — ROLE
Assign the AI a specific expert persona. Define their expertise, years of experience, specialization area, and credentials relevant to "${industry}". The role should feel authentic and authoritative.

## I — INSTRUCTIONS
Convert the raw intent into crystal-clear task directives. Use imperative verbs. Break complex requests into discrete, unambiguous instructions. Each instruction should be independently actionable.

## S — STEPS
Define a logical sequence of actions the AI should follow. Number each step. Ensure steps flow naturally and build upon each other. Include decision points and conditional logic where appropriate.

## E — END GOAL
Articulate the ideal outcome with precision. Define what "success" looks like — quality metrics, deliverables, format specifications. Make the success criteria measurable where possible.

## N — NARROWING
Set explicit boundaries:
- What to EXCLUDE (off-topic areas, deprecated approaches)
- Length constraints
- Style constraints (${tone} tone)
- Technical constraints
- Industry-specific guardrails for ${industry}

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
      content: `Transform this raw prompt using the RISEN framework:\n\n---\n${rawPrompt}\n---\n\nIndustry context: ${industry}\nDesired tone: ${tone}\n\nReturn only the enriched, production-ready prompt.`,
    },
  ];
}
