import React from 'react';

export default function HeroVideo({ src }) {
  const fallback = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
        autoPlay
        muted
        loop
        playsInline
        src={src || fallback}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
    </div>
  );
}
