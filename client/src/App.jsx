import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GetStartedPage from './pages/GetStartedPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-hero-neon text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-neon-pink/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-neon-sky/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-neon-mint/15 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-xl font-black tracking-[0.24em] text-white drop-shadow-[0_8px_24px_rgba(255,79,216,0.25)]">
            DevLink
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-white/75">
            <Link className="transition hover:text-neon-mint" to="/">
              Home
            </Link>
            <Link className="transition hover:text-neon-pink" to="/login">
              Login
            </Link>
            <Link className="transition hover:text-neon-sky" to="/get-started">
              Get Started
            </Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
