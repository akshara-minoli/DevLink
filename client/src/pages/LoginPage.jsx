import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function LoginPage({ setIsLoggedIn }) {
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
        if (typeof setIsLoggedIn === 'function') setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg animate-fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-8">
      <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 9H18a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">Home</span>
      </Link>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-700 sm:mb-3">Welcome back</p>
      <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">Login to DevLink</h1>
      <p className="mt-2 text-sm text-slate-600 sm:mt-3">Continue collaborating with your team and projects.</p>

      <form className="mt-6 grid gap-3 sm:mt-8 sm:gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm" htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm" htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-400"
            placeholder="Enter your password"
          />
        </label>

        {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700 sm:p-3 sm:text-sm">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-12 sm:rounded-full sm:px-5 sm:py-3"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-600 sm:mt-6 sm:text-sm">
        New here?{' '}
        <Link className="font-semibold text-cyan-700 transition hover:text-sky-700" to="/get-started">
          Get Started
        </Link>
      </p>
    </main>
  );
}

export default LoginPage;