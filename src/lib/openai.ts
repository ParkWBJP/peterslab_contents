import OpenAI from "openai";

let client: OpenAI | null = null;

function readApiKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return null;
  }
  return apiKey;
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
  return process.env.OPENAI_TEXT_MODEL?.trim() || "gpt-4.1-mini";
}

export function getOpenAIImageModel() {
  return process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1-mini";
}

export function getOpenAIImageQuality() {
  // Cost-saving policy for the current MVP: always force low image quality.
  return "low" as const;
}
