import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptApiKey } from "@/lib/utils";
import { enrichPromptStream } from "@/engine/enricher";
import type { FrameworkType, ToneType, IndustryType } from "@/types";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { rawPrompt, framework, tone, industry, model, temperature } = body;

  if (!rawPrompt?.trim()) {
    return new Response("Empty prompt", { status: 400 });
  }

  // Get user API key
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { apiKey: true },
  });

  const apiKey = user?.apiKey ? decryptApiKey(user.apiKey) : undefined;

  try {
    const llmStream = await enrichPromptStream({
      rawPrompt: rawPrompt.trim(),
      framework: framework as FrameworkType || "co-star",
      tone: tone as ToneType || "professional",
      industry: industry as IndustryType || "general",
      model: model || "nvidia/nemotron-3-super-120b-a12b",
      temperature: temperature ?? 0.7,
      apiKey,
    });

    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const reader = llmStream.getReader();
        const encoder = new TextEncoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullResponse += value;
            controller.enqueue(encoder.encode(value));
          }

          // Save to DB after stream completes
          await prisma.prompt.create({
            data: {
              userId: session.user!.id!,
              rawPrompt: rawPrompt.trim(),
              enrichedPrompt: fullResponse,
              framework: (framework as string) || "co-star",
              tone: (tone as string) || "professional",
              industry: (industry as string) || "general",
              model: model || "nvidia/nemotron-3-super-120b-a12b",
            },
          });

          controller.close();
        } catch (error: any) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    return new Response(error.message || "Enrichment failed", { status: 500 });
  }
}
