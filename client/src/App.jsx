import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GetStartedPage from './pages/GetStartedPage';
import Dashboard from './pages/Dashboard';
import EditProfilePage from './pages/EditProfilePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('devlink_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('devlink_token');
    localStorage.removeItem('devlink_user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-emerald-200/35 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-6 lg:px-8 lg:py-6">
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5">
          <Link to="/" className="text-lg font-black tracking-[0.24em] text-slate-900 drop-shadow-[0_8px_24px_rgba(14,165,233,0.12)] sm:text-xl">
            DevLink
          </Link>
          {location.pathname !== '/edit-profile' && (
            <nav className="flex flex-wrap items-center gap-3 text-xs text-slate-600 sm:gap-4 sm:text-sm">
              {/* Show Logout only on the dashboard page when authenticated. Otherwise show Login/Get Started (e.g., home). */}
              {location.pathname === '/dashboard' && isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-gradient-to-r from-rose-400 to-pink-400 px-3 py-1.5 font-semibold text-slate-950 transition hover:scale-105 hover:brightness-110"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link className="transition hover:text-fuchsia-700" to="/login">
                    Login
                  </Link>
                  <Link className="transition hover:text-cyan-700" to="/get-started">
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          )}
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/get-started" element={<GetStartedPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
