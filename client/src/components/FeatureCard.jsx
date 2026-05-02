function FeatureCard({ title, description, image }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-card backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-neon-sky/40 hover:bg-white/10 hover:shadow-glow">
      {image && (
        <div className="mb-5 h-32 overflow-hidden rounded-2xl bg-gradient-to-br from-neon-pink/20 to-neon-sky/20 p-4 transition-transform duration-300 group-hover:scale-105">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain opacity-90 transition-all duration-500 hover:opacity-100 hover:drop-shadow-lg"
          />
        </div>
      )}
      <h3 className="mb-3 text-lg font-semibold text-white">
        <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-neon-pink shadow-[0_0_20px_rgba(255,79,216,0.8)]" />
        {title}
      </h3>
      <p className="leading-7 text-white/75">{description}</p>
    </article>
  );
}

export default FeatureCard;
