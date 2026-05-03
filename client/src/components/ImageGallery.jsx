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
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-8 md:p-12">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-700 sm:mb-3">Gallery</p>
        <h2 className="text-xl font-bold text-slate-950 sm:text-2xl lg:text-3xl">Visual features showcase</h2>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:gap-6 lg:grid-cols-4">
        {images.map((item) => (
          <div
            key={item.title}
            className="group animate-fade-in overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all duration-500 hover:border-sky-300 hover:bg-white hover:shadow-[0_18px_50px_rgba(14,165,233,0.12)] sm:rounded-2xl sm:p-6"
            style={{ animationDelay: item.delay }}
          >
            <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-sky-50 to-emerald-50 transition-transform duration-300 group-hover:scale-105 sm:mb-4 sm:h-40 sm:rounded-xl">
              <img
                src={item.src}
                alt={item.title}
                className="h-16 w-16 object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(255,79,216,0.6)] sm:h-24 sm:w-24"
              />
            </div>
            <h3 className="text-center text-xs font-semibold text-slate-800 transition-colors duration-300 group-hover:text-sky-700 sm:text-sm">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
