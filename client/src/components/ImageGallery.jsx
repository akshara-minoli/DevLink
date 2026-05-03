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
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-12">
      <div className="mb-8">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-700">Gallery</p>
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Visual features showcase</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((item) => (
          <div
            key={item.title}
            className="group animate-fade-in overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-500 hover:border-sky-300 hover:bg-white hover:shadow-[0_18px_50px_rgba(14,165,233,0.12)]"
            style={{ animationDelay: item.delay }}
          >
            <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-emerald-50 transition-transform duration-300 group-hover:scale-105">
              <img
                src={item.src}
                alt={item.title}
                className="h-24 w-24 object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(255,79,216,0.6)]"
              />
            </div>
            <h3 className="text-center font-semibold text-slate-800 transition-colors duration-300 group-hover:text-sky-700">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
