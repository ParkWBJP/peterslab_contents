export function extractJson<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]+?)```/i)?.[1]?.trim();
  const target = fenced ?? trimmed;
  const firstBrace = Math.min(
    ...["[", "{"]
      .map((token) => target.indexOf(token))
      .filter((index) => index >= 0),
  );

  if (Number.isFinite(firstBrace) && firstBrace >= 0) {
    const sliced = target.slice(firstBrace);
    const lastBracket = Math.max(sliced.lastIndexOf("]"), sliced.lastIndexOf("}"));
    if (lastBracket >= 0) {
      return JSON.parse(sliced.slice(0, lastBracket + 1)) as T;
    }
  }

  return JSON.parse(target) as T;
}
