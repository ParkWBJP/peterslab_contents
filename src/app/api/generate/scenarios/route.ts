import { NextResponse } from "next/server";
import { z } from "zod";

import { extractJson } from "@/lib/json";
import { generateMockScenarios } from "@/lib/mock";
import { getOpenAIClient, getOpenAITextModel } from "@/lib/openai";
import { buildScenariosPrompt } from "@/lib/prompts";
import { createId } from "@/lib/utils";
import type { ScenarioOption, ScenariosResponse } from "@/lib/types";

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
  topic: z.string().min(1),
  topicDescription: z.string().optional(),
  avoidScenarioTitles: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json(generateMockScenarios(input));
  }

  try {
    const prompt = buildScenariosPrompt(input);
    const response = await client.responses.create({
      model: getOpenAITextModel(),
      input: [
        {
          role: "system",
          content: prompt.system,
        },
        {
          role: "user",
          content: prompt.user,
        },
      ],
    });

    const parsed = extractJson<{
      scenarios: Array<{
        title: string;
        hookType?: ScenarioOption["hook"];
        hook?: ScenarioOption["hook"];
        slides: string[];
      }>;
    }>(response.output_text);

    const scenarios: ScenarioOption[] = parsed.scenarios.slice(0, 3).map((item) => ({
      id: createId("scenario"),
      title: item.title.trim(),
      hook: item.hookType ?? item.hook ?? "question",
      slides: item.slides.slice(0, 7).map((text) => ({
        id: createId("slide"),
        text: text.trim(),
      })),
    }));

    const payload: ScenariosResponse = { scenarios, usedFallback: false };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(generateMockScenarios(input));
  }
}
