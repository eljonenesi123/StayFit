/** Resolves an Exercise.videoUrl into an embeddable iframe src. */
export function resolveEmbedUrl(videoUrl: string): string {
  if (videoUrl.startsWith("search:")) {
    const query = videoUrl.slice("search:".length);
    return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
  }

  const watchMatch = videoUrl.match(/[?&]v=([\w-]{6,})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = videoUrl.match(/youtu\.be\/([\w-]{6,})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  if (videoUrl.includes("/embed/")) return videoUrl;

  return videoUrl;
}
