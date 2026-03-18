type ComposeOptions = {
  imageUrl: string;
  text: string;
  watermarkUrl: string;
  isFinal: boolean;
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function getTokens(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    const segments = Array.from(segmenter.segment(trimmed))
      .map((part) => part.segment)
      .filter((part) => part.trim().length > 0);

    if (segments.length > 1) {
      return segments;
    }
  }

  if (trimmed.includes(" ")) {
    return trimmed.split(/\s+/).filter(Boolean);
  }

  return Array.from(trimmed);
}

function joinTokens(tokens: string[]) {
  return tokens.some((token) => /\s/.test(token) || /^[A-Za-z0-9]/.test(token))
    ? tokens.join(" ")
    : tokens.join("");
}

function buildLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const tokens = getTokens(text);
  if (!tokens.length) {
    return [text];
  }

  const lines: string[] = [];
  let currentTokens: string[] = [];

  for (const token of tokens) {
    const candidateTokens = [...currentTokens, token];
    const candidate = joinTokens(candidateTokens);

    if (
      currentTokens.length > 0 &&
      context.measureText(candidate).width > maxWidth &&
      lines.length < maxLines - 1
    ) {
      lines.push(joinTokens(currentTokens));
      currentTokens = [token];
      continue;
    }

    if (
      currentTokens.length > 0 &&
      context.measureText(candidate).width > maxWidth &&
      lines.length === maxLines - 1
    ) {
      const finalTokens = [...currentTokens];
      while (finalTokens.length > 1) {
        const withEllipsis = `${joinTokens([...finalTokens, "…"])}`;
        if (context.measureText(withEllipsis).width <= maxWidth) {
          lines.push(withEllipsis);
          return lines;
        }
        finalTokens.pop();
      }
      lines.push(`${joinTokens(finalTokens)}…`);
      return lines;
    }

    currentTokens = candidateTokens;
  }

  if (currentTokens.length) {
    lines.push(joinTokens(currentTokens));
  }

  return lines;
}

function fitTextLayout(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const fontSizes = [70, 64, 58, 52, 48, 44];

  for (const fontSize of fontSizes) {
    context.font = `700 ${fontSize}px Arial`;
    const lines = buildLines(context, text, maxWidth, 2);
    if (lines.length <= 2 && lines.every((line) => context.measureText(line).width <= maxWidth)) {
      return {
        fontSize,
        lineHeight: Math.round(fontSize * 1.16),
        lines,
      };
    }
  }

  const fallbackSize = 42;
  context.font = `700 ${fallbackSize}px Arial`;
  return {
    fontSize: fallbackSize,
    lineHeight: Math.round(fallbackSize * 1.18),
    lines: buildLines(context, text, maxWidth, 2),
  };
}

export async function composeSlideFrame({
  imageUrl,
  text,
  watermarkUrl,
  isFinal,
}: ComposeOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas unavailable");
  }

  const [background, watermark] = await Promise.all([
    loadImage(imageUrl),
    loadImage(watermarkUrl),
  ]);

  const scale = Math.max(canvas.width / background.width, canvas.height / background.height);
  const width = background.width * scale;
  const height = background.height * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  context.fillStyle = "#f6ede4";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(background, x, y, width, height);

  if (isFinal) {
    return canvas.toDataURL("image/png");
  }

  const overlayHeight = 356;
  const gradient = context.createLinearGradient(0, canvas.height - overlayHeight, 0, canvas.height);
  gradient.addColorStop(0, "rgba(22, 13, 10, 0)");
  gradient.addColorStop(0.34, "rgba(22, 13, 10, 0.28)");
  gradient.addColorStop(1, "rgba(22, 13, 10, 0.62)");
  context.fillStyle = gradient;
  context.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight);

  const textWidth = 828;
  const textX = 74;
  const layout = fitTextLayout(context, text, textWidth);
  const textBlockHeight = layout.lineHeight * layout.lines.length;
  const textBackgroundY = canvas.height - 238 - textBlockHeight / 2;

  context.fillStyle = "rgba(255, 247, 238, 0.12)";
  context.beginPath();
  context.roundRect(52, textBackgroundY - 28, 890, textBlockHeight + 52, 28);
  context.fill();

  context.fillStyle = "#fffaf2";
  context.font = `700 ${layout.fontSize}px Arial`;
  context.textBaseline = "top";
  layout.lines.forEach((line, index) => {
    context.fillText(line, textX, textBackgroundY + index * layout.lineHeight);
  });

  const watermarkWidth = 204;
  const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;
  const badgeX = 28;
  const badgeY = 24;
  const badgeWidth = watermarkWidth + 44;
  const badgeHeight = watermarkHeight + 28;

  context.save();
  context.shadowColor = "rgba(31, 18, 12, 0.22)";
  context.shadowBlur = 20;
  context.fillStyle = "rgba(255, 252, 248, 0.96)";
  context.beginPath();
  context.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 24);
  context.fill();
  context.restore();

  context.strokeStyle = "rgba(226, 198, 181, 0.72)";
  context.lineWidth = 1.5;
  context.beginPath();
  context.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 24);
  context.stroke();

  context.drawImage(watermark, badgeX + 22, badgeY + 14, watermarkWidth, watermarkHeight);

  return canvas.toDataURL("image/png");
}
