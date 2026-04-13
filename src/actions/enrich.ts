"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/utils";
import { enrichPromptStream } from "@/engine/enricher";
import type { FrameworkType, ToneType, IndustryType } from "@/types";

export async function enrichAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const rawPrompt = formData.get("rawPrompt") as string;
  const framework = (formData.get("framework") as FrameworkType) || "co-star";
  const tone = (formData.get("tone") as ToneType) || "professional";
  const industry = (formData.get("industry") as IndustryType) || "general";
  const model = (formData.get("model") as string) || "nvidia/nemotron-3-super-120b-a12b";
  const temperature = parseFloat(formData.get("temperature") as string) || 0.7;

  if (!rawPrompt?.trim()) {
    return { error: "Please enter a prompt to enrich" };
  }

  // Get user's API key
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { apiKey: true },
  });

  const apiKey = user?.apiKey ? decryptApiKey(user.apiKey) : undefined;

  try {
    const stream = await enrichPromptStream({
      rawPrompt: rawPrompt.trim(),
      framework,
      tone,
      industry,
      model,
      temperature,
      apiKey,
    });

    // Collect full response for saving
    let fullResponse = "";
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullResponse += value;
    }

    // Save to history
    await prisma.prompt.create({
      data: {
        userId: session.user.id,
        rawPrompt: rawPrompt.trim(),
        enrichedPrompt: fullResponse,
        framework,
        tone,
        industry,
        model,
      },
    });

    return { success: true, enrichedPrompt: fullResponse };
  } catch (error: any) {
    return { error: error.message || "Enrichment failed" };
  }
}
