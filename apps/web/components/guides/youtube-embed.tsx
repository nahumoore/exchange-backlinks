"use client"

import { useState } from "react"
import Image from "next/image"
import { IconPlayerPlayFilled } from "@tabler/icons-react"

/**
 * Click-to-load YouTube embed. Renders only the thumbnail until the reader
 * hits play, so the article doesn't pay for YouTube's ~1MB player on load.
 * Uses youtube-nocookie.com so nothing is set before the click.
 */
export function YouTube({
  id,
  title,
  channel,
  start,
  caption,
}: {
  id: string
  title: string
  channel: string
  /** Start offset in seconds. */
  start?: number
  caption?: React.ReactNode
}) {
  const [playing, setPlaying] = useState(false)
  const params = new URLSearchParams({ autoplay: "1", rel: "0" })
  if (start) params.set("start", String(start))

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-ink shadow-card">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 size-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={`Play video: ${title}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-10 pb-4 text-left">
              <span className="block text-xs font-medium text-white/70">
                {channel}
              </span>
              <span className="mt-0.5 block text-[15px] leading-snug font-semibold text-white">
                {title}
              </span>
            </span>
            <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-lifted transition-transform group-hover:scale-105">
              <IconPlayerPlayFilled
                className="ml-0.5 size-7"
                aria-hidden="true"
              />
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm leading-6 text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
