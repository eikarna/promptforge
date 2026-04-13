"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getPromptHistory(page = 1, pageSize = 20) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", prompts: [] };

  const prompts = await prisma.prompt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await prisma.prompt.count({
    where: { userId: session.user.id },
  });

  return {
    prompts: prompts.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
    total,
    pages: Math.ceil(total / pageSize),
  };
}

export async function deletePrompt(promptId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.prompt.deleteMany({
    where: { id: promptId, userId: session.user.id },
  });

  return { success: true };
}

export async function getPromptById(promptId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const prompt = await prisma.prompt.findFirst({
    where: { id: promptId, userId: session.user.id },
  });

  if (!prompt) return null;
  return { ...prompt, createdAt: prompt.createdAt.toISOString() };
}
