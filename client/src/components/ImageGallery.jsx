import React from 'react';

export default function ImageGallery() {
  const images = [
    {
      src: '/images/skills.svg',
      title: 'Skills Network',
      delay: '0ms',
    },
    {
      src: '/images/projects.svg',
      title: 'Project Hub',
      delay: '200ms',
    },
    {
      src: '/images/requests.svg',
      title: 'Collaboration',
      delay: '400ms',
    },
    {
      src: '/images/rbac.svg',
      title: 'Access Control',
      delay: '600ms',
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-600/10 via-transparent to-neon-sky/5 p-8 shadow-card backdrop-blur-md md:p-12">
      <div className="mb-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-neon-lemon">Gallery</p>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Visual features showcase</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((item) => (
          <div
            key={item.title}
            className="group animate-fade-in overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-500 hover:border-neon-pink/50 hover:bg-white/10 hover:shadow-glow"
            style={{ animationDelay: item.delay }}
          >
            <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/15 to-neon-sky/15 transition-transform duration-300 group-hover:scale-105">
              <img
                src={item.src}
                alt={item.title}
                className="h-24 w-24 object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(255,79,216,0.6)]"
              />
            </div>
            <h3 className="text-center font-semibold text-white transition-colors duration-300 group-hover:text-neon-pink">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
