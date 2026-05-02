import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('devlink_token', response.data.token);
      localStorage.setItem('devlink_user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg animate-fade-in rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-card backdrop-blur-md sm:p-10">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-neon-sky">Welcome back</p>
      <h1 className="text-3xl font-black text-white">Login to DevLink</h1>
      <p className="mt-3 text-white/75">Continue collaborating with your team and projects.</p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-white/80" htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-xl border border-white/15 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-neon-sky/70"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2 text-sm text-white/80" htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="rounded-xl border border-white/15 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-neon-pink/70"
            placeholder="Enter your password"
          />
        </label>

        {error ? <p className="rounded-lg border border-rose-300/25 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-neon-pink via-brand-300 to-neon-sky px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-sm text-white/70">
        New here?{' '}
        <Link className="font-semibold text-neon-mint transition hover:text-neon-sky" to="/get-started">
          Get Started
        </Link>
      </p>
    </main>
  );
}

export default LoginPage;