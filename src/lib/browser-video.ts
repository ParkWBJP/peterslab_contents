import type { RenderVideoRequest, RenderedVideo } from "@/lib/types";
import { slugifyFileName } from "@/lib/utils";

const VIDEO_MIME_TYPES = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

function pickSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  const supportsCheck = typeof MediaRecorder.isTypeSupported === "function";
  if (!supportsCheck) {
    return VIDEO_MIME_TYPES[VIDEO_MIME_TYPES.length - 1];
  }

  return VIDEO_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? null;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load frame image"));
    image.src = src;
  });
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read rendered video"));
    reader.readAsDataURL(blob);
  });
}

export async function renderVideoInBrowser(
  input: RenderVideoRequest,
  fileNameBase: string,
): Promise<RenderedVideo> {
  if (typeof window === "undefined") {
    throw new Error("Browser video rendering is unavailable on the server");
  }

  const mimeType = pickSupportedMimeType();
  if (!mimeType) {
    throw new Error("This browser does not support in-browser video rendering");
  }

  const images = await Promise.all(input.frames.map((frame) => loadImage(frame)));
  const width = images[0]?.naturalWidth || 1080;
  const height = images[0]?.naturalHeight || 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  const stream = canvas.captureStream(30);

  if (!context || !stream) {
    throw new Error("Unable to initialize the video canvas");
  }

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 6_000_000,
  });

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const stopped = new Promise<void>((resolve, reject) => {
    recorder.onstop = () => resolve();
    recorder.onerror = () => reject(new Error("Video recording failed"));
  });

  recorder.start(250);

  try {
    for (const image of images) {
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      await wait(input.slideDuration * 1000);
    }

    await wait(180);
    recorder.stop();
    await stopped;
  } finally {
    stream.getTracks().forEach((track) => track.stop());
  }

  const blob = new Blob(chunks, { type: mimeType });
  const extension = mimeType.includes("mp4") ? "mp4" : "webm";

  return {
    dataUrl: await blobToDataUrl(blob),
    mimeType,
    fileName: `${slugifyFileName(fileNameBase) || "yukiharu-slideshow"}.${extension}`,
  };
}
