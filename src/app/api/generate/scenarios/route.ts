import { NextResponse } from "next/server";
import { z } from "zod";

import { extractJson } from "@/lib/json";
import { generateMockScenarios } from "@/lib/mock";
import { getOpenAIClient, getOpenAITextModel } from "@/lib/openai";
import { createId } from "@/lib/utils";
import type { ScenarioOption, ScenariosResponse } from "@/lib/types";

export const runtime = "nodejs";

const schema = z.object({
  language: z.enum(["ja", "ko", "en"]),
  petKind: z.enum(["dog", "cat", "common"]),
  contentType: z.enum(["fun", "info", "empathy", "health"]),
  topic: z.string().min(1),
  topicDescription: z.string().optional(),
});

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json(generateMockScenarios(input));
  }

  try {
    const response = await client.responses.create({
      model: getOpenAITextModel(),
      input: [
        {
          role: "system",
          content: `You create Instagram carousel scenarios for Japanese pet owners. Return only JSON with "scenarios": exactly 3 items. Each item must have "title", "hook", and "slides". "hook" must be one of question, impact, scrollStop. Each scenario needs 5 to 7 slides. The first slide must be a question, impact, or scroll-stopping opener. Keep each slide short enough to overlay on an image, around 20 Japanese characters if Japanese. Use a clean beginning-development-twist-ending flow. Final slide should work as a brand-fixed image slot. Output language: ${input.language}.`,
        },
        {
          role: "user",
          content: `Topic: ${input.topic}\nDescription: ${input.topicDescription ?? ""}\nTarget: ${input.petKind}\nGoal: ${input.contentType}`,
        },
      ],
    });

    const parsed = extractJson<{
      scenarios: Array<{
        title: string;
        hook: ScenarioOption["hook"];
        slides: string[];
      }>;
    }>(response.output_text);

    const scenarios: ScenarioOption[] = parsed.scenarios.slice(0, 3).map((item) => ({
      id: createId("scenario"),
      title: item.title.trim(),
      hook: item.hook,
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
