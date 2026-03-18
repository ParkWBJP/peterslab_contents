import { NextResponse } from "next/server";
import { z } from "zod";

import { extractJson } from "@/lib/json";
import { generateMockTopics } from "@/lib/mock";
import { getOpenAIClient, getOpenAITextModel } from "@/lib/openai";
import { createId } from "@/lib/utils";
import type { TopicSuggestion, TopicsResponse } from "@/lib/types";

export const runtime = "nodejs";

const schema = z.object({
  language: z.enum(["ja", "ko", "en"]),
  petKind: z.enum(["dog", "cat", "common"]),
  contentType: z.enum(["fun", "info", "empathy", "health"]),
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json(generateMockTopics(input));
  }

  try {
    const response = await client.responses.create({
      model: getOpenAITextModel(),
      tools: [{ type: "web_search" }],
      input: [
        {
          role: "system",
          content: `You are a social strategist for Japanese pet brands. Return only JSON with a "topics" array of exactly 5 items. Each item must include "title" and "description". Keep titles short, intuitive, Instagram-ready, and emotionally resonant for pet owners in Japan. Reflect both Japan and overseas trends when useful, but reinterpret them for Japanese users. Avoid medical certainty. Output language: ${input.language}.`,
        },
        {
          role: "user",
          content: `Target: ${input.petKind}. Goal: ${input.contentType}. Prioritize save/share/empathy potential. Description should be one short sentence.`,
        },
      ],
    });

    const parsed = extractJson<{ topics: Array<{ title: string; description: string }> }>(
      response.output_text,
    );

    const topics: TopicSuggestion[] = parsed.topics.slice(0, 5).map((topic) => ({
      id: createId("topic"),
      title: topic.title.trim(),
      description: topic.description.trim(),
    }));

    const payload: TopicsResponse = { topics, usedFallback: false };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(generateMockTopics(input));
  }
}
