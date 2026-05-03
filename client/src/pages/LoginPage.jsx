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
    <main className="mx-auto w-full max-w-lg animate-fade-in rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-700">Welcome back</p>
      <h1 className="text-3xl font-black text-slate-950">Login to DevLink</h1>
      <p className="mt-3 text-slate-600">Continue collaborating with your team and projects.</p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-slate-700" htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700" htmlFor="password">
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

        {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        New here?{' '}
        <Link className="font-semibold text-cyan-700 transition hover:text-sky-700" to="/get-started">
          Get Started
        </Link>
      </p>
    </main>
  );
}

export default LoginPage;