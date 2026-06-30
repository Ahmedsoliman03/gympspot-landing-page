"use client";

import { memo, useState } from "react";
import { m } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeScale, VIEWPORT } from "@/lib/motion";

interface VideoFrameProps {
  /** Path to the video file under /public, e.g. "/videos/gyms.mp4". */
  src?: string;
  /** Optional poster image under /public. Falls back to a themed gradient. */
  poster?: string;
  caption: string;
  className?: string;
}

/**
 * A polished, on-brand video frame. Until a real file is dropped at `src`,
 * it shows a gradient "poster" with a glowing play button. Clicking play
 * mounts a native <video> only then — so no video bytes are fetched until the
 * user actually asks for them (lazy, good for performance).
 */
const VideoFrameBase = ({ src, poster, caption, className }: VideoFrameProps) => {
  const [playing, setPlaying] = useState(false);
  const canPlay = Boolean(src);

  return (
    <m.div
      variants={fadeScale}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl shadow-black/50",
        className
      )}
    >
      {/* Decorative top sheen + primary glow ring */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-3xl ring-1 ring-inset ring-white/5" />

      {playing && canPlay ? (
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => canPlay && setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={caption}
        >
          {/* Poster */}
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.22),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.12),transparent_50%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

          {/* Play button */}
          <m.span
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_rgba(34,197,94,0.5)]"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
            <Play className="relative ms-1 size-8 fill-current" />
          </m.span>

          {/* Caption */}
          <span className="absolute bottom-5 start-6 z-10 text-sm font-bold text-foreground/80">
            {caption}
          </span>
        </button>
      )}
    </m.div>
  );
};

export const VideoFrame = memo(VideoFrameBase);
