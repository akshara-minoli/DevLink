import React from 'react';

export default function AnimatedBlob() {
  return (
    <>
      <div className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 translate-z-0 rounded-full bg-gradient-to-br from-neon-pink to-neon-mint opacity-30 blur-3xl animate-blob-slow mix-blend-screen" />
      <div className="pointer-events-none absolute -left-14 top-8 h-40 w-40 translate-z-0 rounded-full bg-gradient-to-tr from-neon-sky to-brand-400 opacity-28 blur-2xl animate-blob-fast mix-blend-screen" />
      <div className="pointer-events-none absolute left-1/2 top-32 h-36 w-36 -translate-x-1/2 rounded-full bg-gradient-to-br from-neon-mint to-neon-pink opacity-22 blur-2xl animate-float mix-blend-overlay" />
    </>
  );
}
