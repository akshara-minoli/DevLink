import FeatureCard from '../components/FeatureCard';
import HeroVideo from '../components/HeroVideo';
import AnimatedBlob from '../components/AnimatedBlob';
import ImageGallery from '../components/ImageGallery';

const features = [
  {
    title: 'Skill-based matching',
    description: 'Surface collaboration opportunities based on the skills developers want to use and grow.',
    image: '/images/skills.svg',
  },
  {
    title: 'Project management',
    description: 'Organize projects, members, and collaboration stages in one place.',
    image: '/images/projects.svg',
  },
  {
    title: 'Join request system',
    description: 'Review and manage membership requests before granting access to projects.',
    image: '/images/requests.svg',
  },
  {
    title: 'Role-based access control',
    description: 'Assign permissions by role so every collaborator sees and does only what they should.',
    image: '/images/rbac.svg',
  },
];

function HomePage() {
  return (
    <main className="grid gap-6 sm:gap-8">
      <section className="grid gap-4 sm:gap-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-8 lg:p-12">
          <HeroVideo />
          <AnimatedBlob />
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-700 sm:mb-4">
            MERN collaboration platform
          </p>
          <h1 className="max-w-[12ch] text-2xl font-black leading-[0.98] text-slate-950 sm:text-4xl lg:text-6xl">
            Connect developers, build teams, and launch projects faster.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:mt-5 sm:text-base lg:text-lg">
            DevLink helps developers create profiles, showcase skills, find the right projects, and collaborate with controlled access.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:brightness-110"
              href="#features"
            >
              Explore now
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
              href="#features"
            >
              Explore features
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="grid gap-4 sm:gap-5">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-700 sm:mb-3">Features</p>
          <h2 className="text-xl font-bold text-slate-950 sm:text-2xl lg:text-3xl">Built for modern developer collaboration.</h2>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title} description={feature.description} image={feature.image} />
          ))}
        </div>
      </section>

      <ImageGallery />
    </main>
  );
}

export default HomePage;
