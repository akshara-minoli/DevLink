import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function GetStartedPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
      });

      localStorage.setItem('devlink_token', response.data.token);
      localStorage.setItem('devlink_user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg animate-fade-in rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-card backdrop-blur-md sm:p-10">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-neon-lemon">Create account</p>
      <h1 className="text-3xl font-black text-white">Get Started with DevLink</h1>
      <p className="mt-3 text-white/75">Join the platform and start collaborating in minutes.</p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-white/80" htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            className="rounded-xl border border-white/15 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-neon-mint/70"
            placeholder="Your name"
          />
        </label>

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
            placeholder="At least 6 characters"
          />
        </label>

        <label className="grid gap-2 text-sm text-white/80" htmlFor="confirmPassword">
          Confirm Password
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
            className="rounded-xl border border-white/15 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-neon-lemon/70"
            placeholder="Re-enter your password"
          />
        </label>

        {error ? <p className="rounded-lg border border-rose-300/25 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-neon-mint via-neon-sky to-neon-pink px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Creating account...' : 'Get Started'}
        </button>
      </form>

      <p className="mt-6 text-sm text-white/70">
        Already have an account?{' '}
        <Link className="font-semibold text-neon-mint transition hover:text-neon-sky" to="/login">
          Login
        </Link>
      </p>
    </main>
  );
}

export default GetStartedPage;