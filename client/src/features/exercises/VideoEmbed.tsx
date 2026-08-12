import { useState } from "react";
import { resolveEmbedUrl } from "./youtube";
import { PlayIcon } from "../../components/icons";
import "./VideoEmbed.css";

interface VideoEmbedProps {
  videoUrl: string;
  title: string;
}

/** Loads the YouTube iframe only after a tap, so browsing the library never pays for N embeds up front. */
export default function VideoEmbed({ videoUrl, title }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button type="button" className="video-embed video-embed__poster" onClick={() => setLoaded(true)}>
        <span className="video-embed__play">
          <PlayIcon width={26} height={26} />
        </span>
        <span className="video-embed__poster-label">Play demo video</span>
      </button>
    );
  }

  const base = resolveEmbedUrl(videoUrl);
  const src = `${base}${base.includes("?") ? "&" : "?"}autoplay=1`;

  return (
    <div className="video-embed">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
