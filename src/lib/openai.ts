import OpenAI from "openai";

let client: OpenAI | null = null;

const API_KEY_ENV_NAMES = [
  "OPENAI_API_KEY",
  "OPENAI_APIKEY",
  "OPENAI_KEY",
  "NEXT_PUBLIC_OPENAI_API_KEY",
] as const;

function readApiKey() {
  for (const envName of API_KEY_ENV_NAMES) {
    const apiKey = process.env[envName]?.trim();
    if (apiKey && apiKey !== "your_openai_api_key_here") {
      return apiKey;
    }
  }

  return null;
}

export function getOpenAIClient() {
  const apiKey = readApiKey();

  if (!apiKey) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey });
  }

  return client;
}

export function hasOpenAIKey() {
  return Boolean(readApiKey());
}

export function getOpenAITextModel() {
  return process.env.OPENAI_TEXT_MODEL?.trim() || "gpt-5.4";
}

export function getOpenAIImageModel() {
  return process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1.5";
}

export function getOpenAIImageQuality() {
  return (process.env.OPENAI_IMAGE_QUALITY?.trim() || "high") as "low" | "medium" | "high";
}
