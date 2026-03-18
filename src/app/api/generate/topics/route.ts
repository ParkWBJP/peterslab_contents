import { NextResponse } from "next/server";
import { z } from "zod";

import { extractJson } from "@/lib/json";
import { generateMockTopics } from "@/lib/mock";
import { getOpenAIClient, getOpenAITextModel } from "@/lib/openai";
import { buildTopicsPrompt } from "@/lib/prompts";
import { createId } from "@/lib/utils";
import type { TopicSuggestion, TopicsResponse } from "@/lib/types";

export const runtime = "nodejs";

const schema = z.object({
  language: z.enum(["ja", "ko", "en"]),
  petKind: z.enum(["dog", "cat", "common"]),
  contentType: z.enum([
    "fun",
    "info",
    "empathy",
    "health",
    "productPromo",
    "anniversary",
  ]),
  avoidTitles: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json(generateMockTopics(input));
  }

  try {
    const prompt = buildTopicsPrompt(input);
    const inputPayload = [
      {
        role: "system" as const,
        content: prompt.system,
      },
      {
        role: "user" as const,
        content: prompt.user,
      },
    ];
    let response;

    try {
      response = await client.responses.create({
        model: getOpenAITextModel(),
        tools: [{ type: "web_search" }],
        input: inputPayload,
      });
    } catch {
      // If web search is unavailable in the deployment runtime, retry with plain text generation.
      response = await client.responses.create({
        model: getOpenAITextModel(),
        input: inputPayload,
      });
    }

    const parsed = extractJson<{
      topics: Array<{
        title: string;
        shortTagline: string;
        detailedDescription: string;
        whyInteresting: string;
        seasonalOrTrendPoint: string;
        categoryTag: string;
      }>;
    }>(
      response.output_text,
    );

    const topics: TopicSuggestion[] = parsed.topics.slice(0, 3).map((topic) => ({
      id: createId("topic"),
      title: topic.title.trim(),
      shortTagline: topic.shortTagline.trim(),
      detailedDescription: topic.detailedDescription.trim(),
      whyInteresting: topic.whyInteresting.trim(),
      seasonalOrTrendPoint: topic.seasonalOrTrendPoint.trim(),
      categoryTag: topic.categoryTag.trim(),
    }));

    const payload: TopicsResponse = { topics, usedFallback: false };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(generateMockTopics(input));
  }
}
