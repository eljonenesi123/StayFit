/**
 * Claude's vision API accepts still images, not video streams. For a video
 * upload we grab one representative frame (the midpoint) via an offscreen
 * <video>/<canvas> pair and send that frame as the image — the rest of the
 * pipeline never has to know whether the source was a photo or a clip.
 */

export interface ImagePayload {
  mediaType: string;
  data: string; // base64, no "data:...;base64," prefix
  previewUrl: string; // object URL for on-screen preview
}

const MAX_DIMENSION = 1024;

export async function fileToImagePayload(file: File): Promise<ImagePayload> {
  if (file.type.startsWith("image/")) {
    return imageFileToPayload(file);
  }
  if (file.type.startsWith("video/")) {
    return videoFileToFramePayload(file);
  }
  throw new Error("Unsupported file type — please choose a photo or video.");
}

async function imageFileToPayload(file: File): Promise<ImagePayload> {
  const bitmap = await createImageBitmap(file);
  const { canvas, mediaType } = drawToCanvas(bitmap, file.type);
  const data = canvasToBase64(canvas, mediaType);
  return { mediaType, data, previewUrl: canvas.toDataURL(mediaType) };
}

async function videoFileToFramePayload(file: File): Promise<ImagePayload> {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Couldn't read that video file."));
    });

    video.currentTime = Math.min(video.duration / 2, video.duration - 0.05);
    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error("Couldn't read that video file."));
    });

    const { canvas, mediaType } = drawToCanvas(video, "image/jpeg");
    const data = canvasToBase64(canvas, mediaType);
    return { mediaType, data, previewUrl: canvas.toDataURL(mediaType) };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawToCanvas(
  source: CanvasImageSource & { videoWidth?: number; videoHeight?: number; width?: number; height?: number },
  fileType: string
): { canvas: HTMLCanvasElement; mediaType: string } {
  const width = source.videoWidth || (source.width as number);
  const height = source.videoHeight || (source.height as number);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported in this browser.");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  const mediaType = fileType === "image/png" ? "image/png" : "image/jpeg";
  return { canvas, mediaType };
}

function canvasToBase64(canvas: HTMLCanvasElement, mediaType: string): string {
  const dataUrl = canvas.toDataURL(mediaType, 0.85);
  return dataUrl.slice(dataUrl.indexOf(",") + 1);
}
