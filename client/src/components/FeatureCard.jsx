function FeatureCard({ title, description, image }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_70px_rgba(14,165,233,0.12)]">
      {image && (
        <div className="mb-5 h-32 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 p-4 transition-transform duration-300 group-hover:scale-105">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain opacity-90 transition-all duration-500 hover:opacity-100 hover:drop-shadow-lg"
          />
        </div>
      )}
      <h3 className="mb-3 text-lg font-semibold text-slate-900">
        <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_18px_rgba(14,165,233,0.55)]" />
        {title}
      </h3>
      <p className="leading-7 text-slate-600">{description}</p>
    </article>
  );
}

export default FeatureCard;
