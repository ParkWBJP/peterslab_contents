import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import ffmpegPath from "ffmpeg-static";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  frames: z.array(z.string().min(10)).min(1),
  slideDuration: z.number().min(1).max(3),
});

function dataUrlToBuffer(value: string) {
  const [, encoded] = value.split(",", 2);
  return Buffer.from(encoded, "base64");
}

function resolveFfmpegPath() {
  const importedPath = typeof ffmpegPath === "string" ? ffmpegPath : "";
  if (importedPath && !importedPath.startsWith("\\ROOT\\") && !importedPath.startsWith("/ROOT/")) {
    return importedPath;
  }

  const executable = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  return path.join(process.cwd(), "node_modules", "ffmpeg-static", executable);
}

async function runFfmpeg(args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(resolveFfmpegPath(), args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

export async function POST(request: Request) {
  const input = schema.parse(await request.json());
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yukiharu-video-"));

  try {
    const concatLines: string[] = [];

    for (const [index, frame] of input.frames.entries()) {
      const filePath = path.join(tempDir, `frame-${String(index).padStart(3, "0")}.png`);
      await fs.writeFile(filePath, dataUrlToBuffer(frame));
      concatLines.push(`file '${filePath.replace(/\\/g, "/")}'`);
      concatLines.push(`duration ${input.slideDuration}`);
    }

    const lastFile = path.join(
      tempDir,
      `frame-${String(input.frames.length - 1).padStart(3, "0")}.png`,
    );
    concatLines.push(`file '${lastFile.replace(/\\/g, "/")}'`);

    const concatPath = path.join(tempDir, "frames.txt");
    const outputPath = path.join(tempDir, "yukiharu-slideshow.mp4");
    await fs.writeFile(concatPath, concatLines.join("\n"));

    await runFfmpeg([
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatPath,
      "-vf",
      "fps=30,format=yuv420p",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      outputPath,
    ]);

    const output = await fs.readFile(outputPath);
    return NextResponse.json({
      dataUrl: `data:video/mp4;base64,${output.toString("base64")}`,
      mimeType: "video/mp4",
      fileName: "yukiharu-slideshow.mp4",
    });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
