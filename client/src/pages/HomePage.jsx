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
    <main className="grid gap-8">
      <section className="grid gap-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-500/35 via-fuchsia-500/20 to-neon-sky/20 p-8 shadow-glow sm:p-10 lg:p-12">
          <HeroVideo />
          <AnimatedBlob />
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-neon-lemon">
            MERN collaboration platform
          </p>
          <h1 className="max-w-[12ch] text-4xl font-black leading-[0.98] text-white sm:text-5xl lg:text-6xl">
            Connect developers, build teams, and launch projects faster.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            DevLink helps developers create profiles, showcase skills, find the right projects, and collaborate with controlled access.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-neon-pink via-brand-300 to-neon-sky px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:brightness-110"
              href="#features"
            >
              Explore now
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-black/20 px-5 py-3 font-semibold text-white transition hover:border-neon-mint/50 hover:bg-white/10"
              href="#features"
            >
              Explore features
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="grid gap-5">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-neon-sky">Features</p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Built for modern developer collaboration.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
