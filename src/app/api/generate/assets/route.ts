import { NextResponse } from "next/server";
import { z } from "zod";

import { extractJson } from "@/lib/json";
import { generateMockAssets } from "@/lib/mock";
import {
  getOpenAIClient,
  getOpenAIImageModel,
  getOpenAIImageQuality,
  getOpenAITextModel,
} from "@/lib/openai";
import { BRAND_HASHTAGS, buildAssetsPrompt } from "@/lib/prompts";
import type { AssetsResponse } from "@/lib/types";

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
  scenarioTitle: z.string().min(1),
  slides: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1),
    }),
  ),
  promptOverrides: z.array(z.string()).optional(),
  regenerateIndex: z.number().int().optional(),
});

async function makeImage(client: NonNullable<ReturnType<typeof getOpenAIClient>>, prompt: string) {
  const imageResponse = await client.images.generate({
    model: getOpenAIImageModel(),
    prompt,
    size: "1024x1024",
    quality: getOpenAIImageQuality(),
  });

  const base64 = imageResponse.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error("Missing image payload");
  }
  return `data:image/png;base64,${base64}`;
}

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json(generateMockAssets(input));
  }

  try {
    const prompt = buildAssetsPrompt(input);
    const promptPlan = await client.responses.create({
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
      slides: Array<{ slideId: string; prompt: string }>;
      caption: string;
      hashtags: string[];
    }>(promptPlan.output_text);

    const promptsById = new Map(
      parsed.slides.map((slide) => [slide.slideId, slide.prompt]),
    );

    const targetIndexes =
      typeof input.regenerateIndex === "number"
        ? [input.regenerateIndex]
        : input.slides.map((_, index) => index);

    const slides = [...input.slides];
    const outputSlides = await Promise.all(
      targetIndexes.map(async (index) => {
        const slide = slides[index];
        const isFinal = index === slides.length - 1;
        const prompt =
          input.promptOverrides?.[index] ||
          promptsById.get(slide.id) ||
          `${slide.text}, warm pet Instagram editorial, vertical 4:5 composition, Japanese audience empathy, clean composition`;

        if (isFinal) {
          return {
            slideId: slide.id,
            text: slide.text,
            prompt,
            imageUrl:
              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiNkOTllNzEiLz48L3N2Zz4=",
            isFinal: true,
          };
        }

        const imageUrl = await makeImage(client, prompt);
        return {
          slideId: slide.id,
          text: slide.text,
          prompt,
          imageUrl,
          isFinal: false,
        };
      }),
    );

    const merged = slides.map((slide, index) => {
      const fresh = outputSlides.find((item) => item.slideId === slide.id);
      const prompt =
        input.promptOverrides?.[index] ||
        promptsById.get(slide.id) ||
        `${slide.text}, warm pet Instagram editorial, vertical 4:5 composition, Japanese audience empathy`;
      return (
        fresh ?? {
          slideId: slide.id,
          text: slide.text,
          prompt,
          imageUrl:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiPjxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiNkOWQ5ZDkiLz48L3N2Zz4=",
          isFinal: index === slides.length - 1,
        }
      );
    });

    const payload: AssetsResponse = {
      slides: merged,
      caption: parsed.caption,
      hashtags: [...new Set([...BRAND_HASHTAGS, ...parsed.hashtags])].slice(0, 15),
      usedFallback: false,
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(generateMockAssets(input));
  }
}
