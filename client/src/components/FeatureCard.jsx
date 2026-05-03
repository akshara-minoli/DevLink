function FeatureCard({ title, description, image }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_70px_rgba(14,165,233,0.12)] sm:rounded-3xl sm:p-6">
      {image && (
        <div className="mb-4 h-24 overflow-hidden rounded-lg bg-gradient-to-br from-sky-50 to-emerald-50 p-3 transition-transform duration-300 group-hover:scale-105 sm:mb-5 sm:h-32 sm:rounded-2xl sm:p-4">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain opacity-90 transition-all duration-500 hover:opacity-100 hover:drop-shadow-lg"
          />
        </div>
      )}
      <h3 className="mb-2 text-sm font-semibold text-slate-900 sm:mb-3 sm:text-lg">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_18px_rgba(14,165,233,0.55)] sm:h-2.5 sm:w-2.5" />
        {title}
      </h3>
      <p className="text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">{description}</p>
    </article>
  );
}

export default FeatureCard;
