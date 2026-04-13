"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptApiKey } from "@/lib/utils";

export async function saveApiKey(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const apiKey = formData.get("apiKey") as string;
  if (!apiKey?.trim()) {
    return { error: "API key is required" };
  }

  const encrypted = encryptApiKey(apiKey.trim());

  await prisma.user.update({
    where: { id: session.user.id },
    data: { apiKey: encrypted },
  });

  return { success: true };
}

export async function removeApiKey() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { apiKey: null },
  });

  return { success: true };
}

export async function hasApiKey() {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { apiKey: true },
  });

  return !!user?.apiKey;
}

export async function savePreferences(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const data = {
    defaultFramework: (formData.get("defaultFramework") as string) || "co-star",
    defaultTone: (formData.get("defaultTone") as string) || "professional",
    defaultIndustry: (formData.get("defaultIndustry") as string) || "general",
    defaultModel: (formData.get("defaultModel") as string) || "nvidia/nemotron-3-super-120b-a12b",
    temperature: parseFloat(formData.get("temperature") as string) || 0.7,
  };

  await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data },
  });

  return { success: true };
}

export async function getPreferences() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });
}
