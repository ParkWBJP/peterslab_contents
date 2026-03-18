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

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(" ");
  if (words.length === 1) {
    const segments: string[] = [];
    let current = "";
    for (const character of text) {
      const next = current + character;
      if (context.measureText(next).width > maxWidth && current) {
        segments.push(current);
        current = character;
      } else {
        current = next;
      }
    }
    if (current) {
      segments.push(current);
    }
    return segments;
  }

  const lines: string[] = [];
  let current = words[0] ?? "";
  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`;
    if (context.measureText(candidate).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

export async function composeSlideFrame({
  imageUrl,
  text,
  watermarkUrl,
  isFinal,
}: ComposeOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 900;
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

  context.fillStyle = "rgba(20, 12, 9, 0.24)";
  context.fillRect(0, canvas.height - 248, canvas.width, 248);

  context.fillStyle = "#fffaf2";
  context.font = "700 58px Arial";
  context.textBaseline = "top";
  const lines = wrapText(context, text, 920);
  lines.slice(0, 3).forEach((line, index) => {
    context.fillText(line, 76, canvas.height - 205 + index * 68);
  });

  const watermarkWidth = isFinal ? 178 : 198;
  const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;
  const badgeX = 28;
  const badgeY = 22;
  const badgeWidth = watermarkWidth + 52;
  const badgeHeight = watermarkHeight + 36;

  context.save();
  context.shadowColor = "rgba(64, 39, 28, 0.16)";
  context.shadowBlur = 18;
  context.fillStyle = "rgba(255, 251, 245, 0.94)";
  context.beginPath();
  context.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 26);
  context.fill();
  context.restore();

  context.fillStyle = "rgba(255, 225, 203, 0.65)";
  context.beginPath();
  context.roundRect(badgeX + 8, badgeY + 8, badgeWidth - 16, badgeHeight - 16, 20);
  context.fill();

  context.drawImage(
    watermark,
    badgeX + 26,
    badgeY + 18,
    watermarkWidth,
    watermarkHeight,
  );

  return canvas.toDataURL("image/png");
}
