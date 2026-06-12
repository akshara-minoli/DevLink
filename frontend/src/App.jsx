import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function Shell({ children }) {
  return (
    <div className="min-h-screen p-6">
      <header className="mx-auto mb-8 flex max-w-6xl flex-col items-start justify-between gap-4 rounded-2xl border border-sky-100 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-md md:flex-row md:items-center">
        <Link to="/" className="text-lg font-bold tracking-wide text-slate-900">
          DevLink
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-slate-600">
          <a className="transition hover:text-slate-900" href="#about">
            About Us
          </a>
          <a className="transition hover:text-slate-900" href="#contact">
            Contact Us
          </a>
          <Link className="transition hover:text-slate-900" to="/login">
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Get Started
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}

function WelcomePage() {
  const heroImages = [
    {
      src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
      alt: 'Team collaborating around a laptop',
    },
    {
      src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Developers discussing ideas in a bright office',
    },
    {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      alt: 'Coding workspace with multiple monitors',
    },
  ];

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-[0_18px_70px_rgba(15,23,42,0.08)] md:p-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Welcome to DevLink</p>
          <h1 className="max-w-[12ch] text-4xl font-semibold leading-none text-slate-900 sm:text-5xl lg:text-7xl">
            Build teams, manage projects, and keep developer workflows in one place.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            DevLink helps developers connect, share work, and collaborate around real projects with a simple
            full-stack experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
        </section>

        <aside className="grid gap-4 rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] sm:grid-cols-2 md:p-5">
          <img
            src={heroImages[0].src}
            alt={heroImages[0].alt}
            className="h-72 w-full rounded-[22px] object-cover sm:col-span-2"
          />
          <img src={heroImages[1].src} alt={heroImages[1].alt} className="h-48 w-full rounded-[22px] object-cover" />
          <img src={heroImages[2].src} alt={heroImages[2].alt} className="h-48 w-full rounded-[22px] object-cover" />
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]" id="about">
        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-[0_18px_70px_rgba(15,23,42,0.08)] md:p-10">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
            About Us
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">We help developers find the right people.</h2>
          <p className="mt-4 leading-7 text-slate-600">
            DevLink is built for teams that want to move quickly without losing clarity. It brings together
            profiles, project discovery, and collaboration tools so developers can focus on shipping useful work.
          </p>
          <div className="mt-6 grid gap-3 text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Profile-first collaboration</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Skill-based project matching</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Simple requests and approvals</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
            alt="Developer team brainstorming together"
            className="h-full min-h-72 w-full rounded-[28px] object-cover shadow-[0_18px_70px_rgba(15,23,42,0.08)] sm:row-span-2"
          />
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
            alt="Hands working together over a desk"
            className="h-36 w-full rounded-[28px] object-cover shadow-[0_18px_70px_rgba(15,23,42,0.08)]"
          />
          <img
            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80"
            alt="People talking in a modern workspace"
            className="h-36 w-full rounded-[28px] object-cover shadow-[0_18px_70px_rgba(15,23,42,0.08)]"
          />
        </div>
      </section>

      <section
        className="grid gap-6 rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-[0_18px_70px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr] md:p-10"
        id="contact"
      >
        <div>
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
            Contact Us
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">Reach out for collaboration or questions.</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Whether you are looking to join a team, start a project, or ask about the platform, we would love to
            hear from you.
          </p>

          <div className="mt-6 grid gap-3 text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Email: hello@devlink.app</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Phone: +1 (555) 123-4567</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">Location: Remote-first team</div>
          </div>
        </div>

        <form className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <label className="grid gap-2 text-slate-800">
            <span>Name</span>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
          <label className="grid gap-2 text-slate-800">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
          <label className="grid gap-2 text-slate-800">
            <span>Message</span>
            <textarea
              rows="5"
              placeholder="Tell us what you are building or how we can help..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const isRegister = mode === 'register';
  const title = isRegister ? 'Create account' : 'Log in';
  const heading = isRegister ? 'Create your DevLink account' : 'Welcome back';
  const prompt = isRegister ? 'Already have an account?' : 'Need an account?';
  const promptLink = isRegister ? '/login' : '/register';
  const promptLinkText = isRegister ? 'Log in' : 'Create one';

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_URL}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? 'Request failed.');
      }

      localStorage.setItem('devlink_token', data.token);
      localStorage.setItem('devlink_user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      setStatus('idle');
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-[0_18px_70px_rgba(15,23,42,0.08)] md:p-12">
        <Link className="inline-flex items-center text-sm font-semibold text-sky-600 transition hover:text-sky-500" to="/">
          ← Back to welcome page
        </Link>
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          {isRegister ? 'Create account page' : 'Login page'}
        </p>
        <h1 className="max-w-[10ch] text-4xl font-semibold leading-none text-slate-900 sm:text-5xl lg:text-7xl">
          {heading}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          {isRegister
            ? 'Set up your profile once, then start building your network and joining projects.'
            : 'Use your account to return to the home page and keep your collaboration work moving.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Fast setup
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Secure auth flow
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Ready for projects
          </span>
        </div>
      </section>

      <form
        className="rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-[0_18px_70px_rgba(15,23,42,0.08)] md:p-10"
        onSubmit={handleSubmit}
      >
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <h2 className="mb-4 text-3xl font-semibold text-slate-900">{isRegister ? 'Join DevLink' : 'Sign in to DevLink'}</h2>
        <div className="grid gap-4">
          {isRegister ? (
            <label className="grid gap-2 text-slate-800">
              <span>Name</span>
              <input
                name="name"
                type="text"
                placeholder="Alex Morgan"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/20"
              />
            </label>
          ) : null}
          <label className="grid gap-2 text-slate-800">
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="alex@example.com"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
          <label className="grid gap-2 text-slate-800">
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/20"
            />
          </label>
        </div>
        {message ? <p className="mt-4 min-h-6 text-sm text-rose-500">{message}</p> : null}
        <button
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Working...' : title}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          {prompt} <Link className="font-semibold text-slate-900 hover:text-sky-600" to={promptLink}>{promptLinkText}</Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          <Link className="font-semibold text-sky-600 hover:text-sky-500" to="/">
            Back to welcome page
          </Link>
        </p>
      </form>
    </main>
  );
}

function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Routes>
    </Shell>
  );
}

export default App;