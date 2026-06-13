import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const emptyProject = {
  title: '',
  description: '',
  category: 'Web App',
  techStack: '',
  requiredSkills: '',
  teamSize: 3,
  status: 'recruiting',
  repositoryUrl: '',
  liveUrl: '',
};
const titleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full-stack Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Data Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Cybersecurity Engineer',
  'QA Engineer',
  'Software Engineer',
  'Blockchain Developer',
  'Game Developer',
  'Technical Lead',
  'Project Manager',
  'Student Developer',
  'Freelance Developer',
  'Other',
];
const categoryOptions = [
  'Web App',
  'Mobile App',
  'Desktop App',
  'API / Backend',
  'Library / Package',
  'Machine Learning Model',
  'Game',
  'Blockchain / Web3',
  'DevOps / Tools',
  'Other',
];
const skillOptions = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express.js',
  'PostgreSQL',
  'MongoDB',
  'Prisma',
  'Docker',
  'Git',
  'Tailwind CSS',
  'REST APIs',
  'GraphQL',
  'Python',
  'Java',
  'Figma',
  'AWS',
  'C',
  'C++',
  'C#',
  'PHP',
  'Go',
  'Rust',
  'Kotlin',
  'Swift',
  'Dart',
  'Ruby',
  'R',
  'HTML5',
  'CSS3',
  'Sass',
  'Bootstrap',
  'React.js',
  'Next.js',
  'Angular',
  'Vue.js',
  'Redux',
  'Material UI',
  'NestJS',
  'Spring Boot',
  'ASP.NET Core',
  'Django',
  'Flask',
  'Laravel',
  'Ruby on Rails',
  'MySQL',
  'SQLite',
  'Oracle Database',
  'Microsoft SQL Server',
  'Firebase Firestore',
  'Redis',
  'Microsoft Azure',
  'Google Cloud Platform',
  'Kubernetes',
  'Jenkins',
  'GitHub Actions',
  'Terraform',
  'Ansible',
  'Linux',
  'React Native',
  'Flutter',
  'Xamarin',
  'Machine Learning',
  'Deep Learning',
  'TensorFlow',
  'PyTorch',
  'Pandas',
  'NumPy',
  'Data Analysis',
  'Computer Vision',
  'NLP',
  'Generative AI',
  'Selenium',
  'Cypress',
  'JUnit',
  'Jest',
  'Postman',
  'Playwright',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'Adobe XD',
  'Photoshop',
  'Illustrator',
  'User Research',
  'Wireframing',
  'Prototyping',
  'Ethical Hacking',
  'Penetration Testing',
  'Network Security',
  'OWASP',
  'Security Auditing',
  'Agile',
  'Scrum',
  'Kanban',
  'Jira',
  'Trello',
  'Confluence',
  'Blockchain',
  'Web3',
  'Internet of Things (IoT)',
  'AR/VR',
  'Microservices',
  'Other',
];

function getStoredUser() {
  const value = localStorage.getItem('devlink_user');
  return value ? JSON.parse(value) : null;
}

function useAuth() {
  const [user, setUser] = useState(getStoredUser);
  const token = localStorage.getItem('devlink_token');
  const navigate = useNavigate();

  function saveSession(nextUser, nextToken) {
    localStorage.setItem('devlink_user', JSON.stringify(nextUser));
    localStorage.setItem('devlink_token', nextToken);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem('devlink_user');
    localStorage.removeItem('devlink_token');
    setUser(null);
    navigate('/');
  }

  return { user, token, saveSession, logout, setUser };
}

// Shared pending-requests count — fetched once and cleared when the owner visits /requests.
function usePendingRequests(user) {
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    if (!user) { setPendingRequests(0); return; }
    api('/api/requests/pending-count')
      .then((data) => setPendingRequests(data.count))
      .catch(() => {}); // silent — badge is non-critical
  }, [user]);

  function clearPending() { setPendingRequests(0); }

  return { pendingRequests, clearPending, setPendingRequests };
}

async function api(path, options = {}) {
  const token = localStorage.getItem('devlink_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? 'Request failed.');
  return data;
}

function asCsv(value) {
  return Array.isArray(value) ? value.join(', ') : value ?? '';
}

function splitCsv(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('devlink_theme') ?? 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('devlink_theme', theme);
  }, [theme]);

  return [theme, setTheme];
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'D';
}

function formatDate(value) {
  if (!value) return 'Recently';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getExperienceLevel(skillCount = 0) {
  if (skillCount >= 18) return 'Senior';
  if (skillCount >= 10) return 'Mid-level';
  if (skillCount >= 4) return 'Junior';
  return 'Getting started';
}

function getProjectProgress(status = 'planning') {
  return {
    planning: 18,
    recruiting: 42,
    active: 74,
    completed: 100,
    paused: 56,
  }[status] ?? 35;
}

function getRelativeTime(value) {
  if (!value) return 'Just now';
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function calculateMatchPercent(profileSkills = [], selectedSkills = []) {
  if (!selectedSkills.length) return Math.min(95, (profileSkills.length || 1) * 7);
  const overlap = profileSkills.filter((skill) => selectedSkills.includes(skill)).length;
  return Math.max(15, Math.round((overlap / selectedSkills.length) * 100));
}

function Icon({ name, className = '' }) {
  const paths = {
    spark: 'M11 2l1.8 5.1L18 9l-5.1 1.8L11 16l-1.8-5.2L4 9l5.2-1.9L11 2z',
    stack: 'M4 7l8-4 8 4-8 4-8-4zm0 5l8-4 8 4-8 4-8-4zm0 5l8-4 8 4-8 4-8-4z',
    users: 'M9 11a3 3 0 1 0-0.001-6.001A3 3 0 0 0 9 11zm10 2.5c0-2.2-2.2-4-5-4s-5 1.8-5 4V16h10v-2.5zM4 13c0-1.9 1.6-3.5 3.5-3.5S11 11.1 11 13V16H4v-3z',
    bell: 'M12 3a5 5 0 0 0-5 5v2.1C7 11 6.4 12.5 5.4 13.7L4 15h16l-1.4-1.3c-1-1.2-1.6-2.7-1.6-4V8a5 5 0 0 0-5-5zm0 18a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z',
    check: 'M9.2 16.2 4.8 11.8l1.4-1.4 3 3 8-8 1.4 1.4-9.4 9.4z',
    clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 4v4.2l3 1.8-.8 1.4-3.7-2.2V8h1.5z',
    project: 'M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13zM6 7h12v2H6V7zm0 4h12v2H6v-2zm0 4h8v2H6v-2z',
    request: 'M6 4h12l2 3v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7l2-3zm0 3h12l-1-1.5H7L6 7zm3 3 3 3 3-3 1.4 1.4L12 17l-4.4-4.6L9 10z',
    admin: 'M12 2 4 5v6c0 4.9 3.4 9.4 8 11 4.6-1.6 8-6.1 8-11V5l-8-3z',
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={paths[name] ?? paths.spark} />
    </svg>
  );
}

function UserAvatar({ user, size = 'md', className = '' }) {
  const dimension = size === 'lg' ? 'avatar-lg' : size === 'sm' ? 'avatar-sm' : 'avatar-md';
  const label = user?.name ?? 'DevLink user';

  return (
    <span className={`avatar ${dimension} ${className}`.trim()} aria-label={label}>
      {user?.avatar_url ? <img src={user.avatar_url} alt={label} /> : <span>{getInitials(user?.name)}</span>}
    </span>
  );
}

function NavItem({ to, end = false, children, className = '' }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${className}`.trim()}
    >
      {children}
    </NavLink>
  );
}

function StatCard({ icon, label, value, hint, trend }) {
  return (
    <article className="stat-card panel">
      <div className="stat-top">
        <span className="stat-icon"><Icon name={icon} /></span>
        {trend ? <span className={`stat-trend ${trend.startsWith('+') ? 'positive' : 'neutral'}`}>{trend}</span> : null}
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      {hint ? <span className="stat-hint">{hint}</span> : null}
    </article>
  );
}

function Badge({ children, tone = 'default' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function SkeletonCard() {
  return (
    <article className="panel skeleton-card" aria-hidden="true">
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-row">
        <div className="skeleton-chip" />
        <div className="skeleton-chip" />
        <div className="skeleton-chip" />
      </div>
    </article>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

function Shell({ auth, pendingRequests, children, theme, setTheme }) {
  const unread = Number(auth.user?.unread ?? 0);
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function closeMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  return (
    <div className="app">
      {!isAuthPage ? (
        isAdminPage && auth.user?.role === 'admin' ? (
          <header className="topbar admin-topbar">
            <div className="topbar-brand">
              <span className="brand-mark"><Icon name="admin" /></span>
              <div>
                <span className="brand">DevLink Admin</span>
                <span className="brand-subtitle">Platform control center</span>
              </div>
            </div>
            <div className="topbar-actions" ref={menuRef}>
              <button type="button" className="theme-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button type="button" className="icon-button" onClick={() => setMenuOpen((value) => !value)}>
                <UserAvatar user={auth.user} size="sm" />
              </button>
              {menuOpen ? (
                <div className="avatar-menu">
                  <div className="avatar-menu-header">
                    <strong>{auth.user.name}</strong>
                    <span>{auth.user.email}</span>
                  </div>
                  <Link className="menu-item" to="/admin" onClick={() => setMenuOpen(false)}>Admin home</Link>
                  <button type="button" className="menu-item" onClick={() => { setMenuOpen(false); auth.logout(); }}>
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          </header>
        ) : (
          <header className="topbar">
            <div className="topbar-brand">
              <span className="brand-mark"><Icon name="spark" /></span>
              <div>
                <Link className="brand" to="/">
                  DevLink
                </Link>
                <span className="brand-subtitle">Developer collaboration platform</span>
              </div>
            </div>
            <nav className="topbar-nav">
              {isWelcomePage ? (
                <>
                  <a href="#about" className="nav-link">About</a>
                  <a href="#contact" className="nav-link">Contact</a>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link className="nav-cta" to="/register">Get Started</Link>
                </>
              ) : auth.user ? (
                <>
                  <NavItem to="/dashboard" end>Dashboard</NavItem>
                  <NavItem to="/projects">Projects</NavItem>
                  <NavItem to="/profiles">Developers</NavItem>
                  <NavItem to="/requests">
                    Requests
                    {pendingRequests > 0 ? <span className="nav-badge">{pendingRequests}</span> : null}
                  </NavItem>
                  <NavItem to="/notifications">
                    Notifications{unread ? <span className="nav-badge">{unread}</span> : null}
                  </NavItem>
                  {auth.user.role === 'admin' ? <NavItem to="/admin">Admin</NavItem> : null}
                </>
              ) : (
                <>
                  <NavItem to="/projects">Projects</NavItem>
                  <NavItem to="/profiles">Developers</NavItem>
                  <Link to="/login" className="nav-link">Log in</Link>
                  <Link className="nav-cta" to="/register">Get Started</Link>
                </>
              )}
            </nav>
            <div className="topbar-actions" ref={menuRef}>
              <button type="button" className="theme-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              {auth.user ? (
                <button type="button" className="icon-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Open user menu">
                  <UserAvatar user={auth.user} size="sm" />
                </button>
              ) : null}
              {menuOpen && auth.user ? (
                <div className="avatar-menu">
                  <div className="avatar-menu-header">
                    <strong>{auth.user.name}</strong>
                    <span>{auth.user.email}</span>
                  </div>
                  <Link className="menu-item" to="/profile/edit" onClick={() => setMenuOpen(false)}>Edit profile</Link>
                  <Link className="menu-item" to="/notifications" onClick={() => setMenuOpen(false)}>Notifications</Link>
                  {auth.user.role === 'admin' ? <Link className="menu-item" to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link> : null}
                  <button type="button" className="menu-item" onClick={() => { setMenuOpen(false); auth.logout(); }}>Log out</button>
                </div>
              ) : null}
            </div>
          </header>
        )
      ) : null}
      {children}
    </div>
  );
}

function Protected({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function Landing({ auth }) {
  return (
    <main className="landing">
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=85"
          alt="Bright collaborative workspace with developers planning a project"
        />
        <div className="hero-copy">
          <p>Developer collaboration platform</p>
          <h1>DevLink</h1>
          <span>
            Showcase your skills, discover matching projects, request collaborators, and build useful things with
            developers who fit the work.
          </span>
          <div className="actions">
            <Link className="btn btn-primary" to="/register">Get Started</Link>
          </div>
        </div>
      </section>
      <section className="stats-strip">
        <div><strong>Skill-first</strong><span>Profiles built around real technical strengths.</span></div>
        <div><strong>Project-ready</strong><span>Create projects with stack, status, needs, and team size.</span></div>
        <div><strong>Owner control</strong><span>Approve requests and invite matching collaborators.</span></div>
      </section>
      <section className="feature-grid">
        {[
          ['Skill-rich profiles', 'Showcase technologies, personal details, social links, and project history.'],
          ['Project discovery', 'Search and filter opportunities by skills, stack, category, and status.'],
          ['Join approvals', 'Owners review applicants before approved members join the team.'],
          ['Smart notifications', 'Stay updated when requests, reviews, and matching projects appear.'],
        ].map(([item, text]) => (
          <article className="feature" key={item}>
            <h3>{item}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="info-section" id="about">
        <div>
          <p className="eyebrow">About Us</p>
          <h2>DevLink helps developers find the right people for the right projects.</h2>
        </div>
        <p>
          Build a profile around your skills, publish projects that need collaborators, browse opportunities by stack
          and status, and use skill matching to discover developers who fit your team.
        </p>
      </section>
      <section className="info-section contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact Us</p>
          <h2>Questions, feedback, or collaboration ideas?</h2>
        </div>
        <div className="contact-grid">
          <span>Email: hello@devlink.app</span>
          <span>Phone: +1 (555) 123-4567</span>
          <span>Location: Remote-first</span>
        </div>
      </section>
    </main>
  );
}

function AuthPage({ mode, auth }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const isRegister = mode === 'register';

  function togglePassword(fieldName) {
    setVisiblePasswords((current) => ({ ...current, [fieldName]: !current[fieldName] }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    if (isRegister && payload.password !== payload.confirmPassword) {
      setBusy(false);
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const data = await api(`/api/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      auth.saveSession(data.user, data.token);
      if (data.user.role === 'admin') {
        navigate('/admin');
        return;
      }

      navigate(isRegister ? '/profile/setup' : '/dashboard');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <section>
        <Link className="back-link" to="/">Back to welcome page</Link>
        <h1>{isRegister ? 'Create your developer profile' : 'Welcome back'}</h1>
        <p>
          {isRegister
            ? 'After registration you will go straight to profile setup so DevLink can match you with the right projects.'
            : 'Log in to manage your profile, requests, projects, recommendations, and notifications.'}
        </p>
      </section>
      <form className="panel form" onSubmit={submit}>
        <Link className="back-link form-back" to="/">Back to welcome page</Link>
        <h2>{isRegister ? 'Register' : 'Log in'}</h2>
        {isRegister ? (
          <>
            <Field label="Name"><input name="name" required placeholder="Alex Morgan" /></Field>
            <Field label="Phone number"><input name="phone" type="tel" required placeholder="+94 77 123 4567" /></Field>
          </>
        ) : null}
        <Field label="Email"><input name="email" type="email" required placeholder="alex@example.com" /></Field>
        <Field label="Password">
          <div className="password-field">
            <input
              name="password"
              type={visiblePasswords.password ? 'text' : 'password'}
              required
              placeholder="Minimum 6 characters"
            />
            <button type="button" onClick={() => togglePassword('password')}>
              {visiblePasswords.password ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        {isRegister ? (
          <Field label="Re-enter password">
            <div className="password-field">
              <input
                name="confirmPassword"
                type={visiblePasswords.confirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
              />
              <button type="button" onClick={() => togglePassword('confirmPassword')}>
                {visiblePasswords.confirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>
        ) : null}
        {message ? <p className="error">{message}</p> : null}
        <Button disabled={busy}>{busy ? 'Working...' : isRegister ? 'Create account' : 'Log in'}</Button>
        <p className="muted">
          {isRegister ? 'Already registered?' : 'New to DevLink?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link>
        </p>
      </form>
    </main>
  );
}

function ProfileSetup({ auth }) {
  return <ProfileEditor auth={auth} setup />;
}

function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    api(`/api/profiles/${id}`)
      .then((data) => setProfile(data.profile))
      .catch((error) => setMessage(error.message));
  }, [id]);

  if (!id) {
    return <main className="content narrow"><p className="error">Missing profile id.</p></main>;
  }

  if (message && !profile) {
    return (
      <main className="content narrow">
        <button type="button" className="back-link" onClick={() => navigate(-1)}>
          Back
        </button>
        <p className="error">{message}</p>
      </main>
    );
  }

  if (!profile) {
    return <main className="content narrow"><p>Loading profile...</p></main>;
  }

  const profileSkills = profile.skills?.map((skill) => skill.name) ?? [];
  const profileProjects = profile.projects ?? [];

  return (
    <main className="content narrow">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        Back
      </button>
      <section className="panel profile-detail">
        <div className="profile-detail-head">
          <div>
            <p className="eyebrow">Developer profile</p>
            <h1>{profile.name}</h1>
            <p className="muted">{profile.title ?? profile.role}</p>
          </div>
          {profile.profile_complete ? <span className="badge">Profile complete</span> : null}
        </div>

        <p>{profile.bio ?? 'No bio yet.'}</p>

        <div className="two-col profile-meta">
          <div>
            <strong>Location</strong>
            <span>{profile.location ?? 'Not added'}</span>
          </div>
          <div>
            <strong>Member since</strong>
            <span>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>

        <TagRow label="Skills" items={profileSkills} />

        <div className="link-row">
          {profile.github_url ? <a href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a> : null}
          {profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a> : null}
          {profile.portfolio_url ? <a href={profile.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a> : null}
        </div>

        <section className="profile-projects">
          <div className="section-title">
            <h2>Projects</h2>
          </div>
          <div className="cards single">
            {profileProjects.length ? profileProjects.map((project) => (
              <article className="card profile-project" key={project.id}>
                <div className="card-head">
                  <div>
                    <h3>{project.title}</h3>
                    <p className="muted">{project.category} · {project.status}</p>
                  </div>
                  <span className="badge">{project.role}</span>
                </div>
                <p>{project.description}</p>
              </article>
            )) : <p className="empty">No projects listed yet.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

function ProfileEditor({ auth, setup = false }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [otherTitle, setOtherTitle] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [otherSkill, setOtherSkill] = useState('');

  useEffect(() => {
    api('/api/profile/me')
      .then((data) => {
        const profileData = data.profile;
        const currentSkills = profileData.skills?.map((skill) => skill.name) ?? [];
        const presetSkills = currentSkills.filter((skill) => skillOptions.includes(skill));
        const customSkills = currentSkills.filter((skill) => !skillOptions.includes(skill));

        setProfile(profileData);
        
        const dbTitle = profileData.title ?? '';
        if (dbTitle && !titleOptions.includes(dbTitle)) {
          setTitle('Other');
          setOtherTitle(dbTitle);
        } else {
          setTitle(dbTitle);
        }

        setSelectedSkills(customSkills.length ? [...presetSkills, 'Other'] : presetSkills);
        setOtherSkill(customSkills.join(', '));
      })
      .catch((error) => setMessage(error.message));
  }, []);

  function toggleSkill(skill) {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill],
    );
  }

  async function submit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    const skills = selectedSkills
      .filter((skill) => skill !== 'Other')
      .concat(selectedSkills.includes('Other') ? splitCsv(otherSkill) : []);

    if (!skills.length) {
      setMessage('Select at least one skill or add an other skill.');
      return;
    }

    const finalTitle = title === 'Other' ? otherTitle.trim() : title;
    const payload = { ...form, title: finalTitle, skills };

    try {
      const data = await api('/api/profile/me', { method: 'PUT', body: JSON.stringify(payload) });
      const updatedUser = {
        ...auth.user,
        name: data.profile.name,
        title: data.profile.title,
        location: data.profile.location,
        avatar_url: data.profile.avatar_url,
        github_url: data.profile.github_url,
        linkedin_url: data.profile.linkedin_url,
        portfolio_url: data.profile.portfolio_url,
        profileComplete: data.profile.profile_complete,
      };
      localStorage.setItem('devlink_user', JSON.stringify(updatedUser));
      auth.setUser(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteProfile() {
    if (!confirm('Delete your profile and account? This cannot be undone.')) return;

    try {
      await api('/api/profile/me', { method: 'DELETE' });
      auth.logout();
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!profile) return <main className="content"><p>Loading profile...</p></main>;

  return (
    <main className="content narrow">
      <form className="panel form" onSubmit={submit}>
        <h1>{setup ? 'Set up your profile' : 'Edit profile'}</h1>
        <div className="two-col">
          <Field label="Name"><input name="name" defaultValue={profile.name ?? ''} required /></Field>
          <Field label="Title">
            <select name="title" value={title} onChange={(event) => setTitle(event.target.value)} required>
              <option value="">Choose your title</option>
              {titleOptions.map((option) => (
                <option value={option} key={option}>{option}</option>
              ))}
            </select>
            {title === 'Other' ? (
              <input
                value={otherTitle}
                onChange={(e) => setOtherTitle(e.target.value)}
                placeholder="Type your custom title"
                required
                style={{ marginTop: '0.5rem' }}
              />
            ) : null}
          </Field>
        </div>
        <Field label="Bio"><textarea name="bio" defaultValue={profile.bio ?? ''} rows="4" required /></Field>
        <div className="two-col">
          <Field label="Location"><input name="location" defaultValue={profile.location ?? ''} /></Field>
          <Field label="Skills">
            <div className="multi-select">
              {skillOptions.map((skill) => (
                <label className="check-pill" key={skill}>
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
            {selectedSkills.includes('Other') ? (
              <input
                value={otherSkill}
                onChange={(event) => setOtherSkill(event.target.value)}
                placeholder="Type other skills separated by commas"
              />
            ) : null}
          </Field>
        </div>
        <div className="two-col">
          <Field label="GitHub"><input name="githubUrl" defaultValue={profile.github_url ?? ''} /></Field>
          <Field label="LinkedIn"><input name="linkedinUrl" defaultValue={profile.linkedin_url ?? ''} /></Field>
        </div>
        <div className="two-col">
          <Field label="Portfolio"><input name="portfolioUrl" defaultValue={profile.portfolio_url ?? ''} /></Field>
          <Field label="Avatar URL"><input name="avatarUrl" defaultValue={profile.avatar_url ?? ''} /></Field>
        </div>
        {message ? <p className="error">{message}</p> : null}
        <div className="form-actions">
          <Button>{setup ? 'Complete profile' : 'Save profile'}</Button>
          {!setup ? <Button type="button" variant="danger" onClick={deleteProfile}>Delete profile</Button> : null}
        </div>
      </form>
    </main>
  );
}

function Dashboard({ auth }) {
  if (auth.user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [profileData, allProjects, reqs, notes] = await Promise.all([
      api('/api/profile/me'),
      api('/api/projects'),
      api('/api/requests'),
      api('/api/notifications'),
    ]);
    setProfile(profileData.profile);
    setProjects(allProjects.projects);
    setRequests(reqs);
    setNotifications(notes.notifications);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, []);

  const mine = projects.filter((project) => String(project.owner_id) === String(auth.user.id));
  const joinedProjectIds = new Set(
    (requests.outgoing ?? [])
      .filter((request) => request.status === 'approved')
      .map((request) => String(request.project_id)),
  );
  const joinedProjects = projects.filter(
    (project) => joinedProjectIds.has(String(project.id)) && String(project.owner_id) !== String(auth.user.id),
  );
  const approvedCollaborations = (requests.incoming ?? []).filter((request) => request.status === 'approved').length;
  const unreadNotifications = notifications.filter((note) => !note.is_read).length;
  const skillsCount = profile?.skills?.length ?? 0;
  const experience = getExperienceLevel(skillsCount);
  const location = profile?.location ?? auth.user?.location ?? 'Remote';

  if (loading) {
    return (
      <main className="content dashboard-page">
        <section className="dashboard-hero panel">
          <div className="dashboard-hero-copy">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </div>
          <div className="dashboard-hero-aside">
            <SkeletonCard />
          </div>
        </section>
        <section className="stats-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </section>
      </main>
    );
  }

  return (
    <main className="content dashboard-page">
      <section className="dashboard-hero panel">
        <div className="dashboard-hero-copy">
          <div className="hero-profile-row">
            <UserAvatar user={profile ?? auth.user} size="lg" />
            <div>
              <Badge tone="primary">{experience}</Badge>
              <h1>{auth.user.name}</h1>
              <p className="muted">{auth.user.title ?? 'Complete your title and skills to improve matching.'}</p>
            </div>
          </div>
          <div className="hero-metadata">
            <span><Icon name="users" /> {location}</span>
            <span><Icon name="stack" /> {skillsCount} skills</span>
            <span><Icon name="project" /> {mine.length} projects</span>
            <span><Icon name="check" /> {approvedCollaborations} collaborations</span>
          </div>
        </div>
        <div className="dashboard-hero-aside">
          <div className="hero-callout">
            <p>Profile completion</p>
            <strong>{auth.user.profileComplete ? 'Ready for collaboration' : 'Needs attention'}</strong>
            <span>{auth.user.profileComplete ? 'Your profile is strong enough to attract collaborators.' : 'Complete skills and links to improve visibility.'}</span>
            <Link className="btn btn-primary" to="/profile/edit">Edit Profile</Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon="project" label="My Projects" value={mine.length} hint="Owned or managed projects" trend="+0.0%" />
        <StatCard icon="spark" label="Joined Projects" value={joinedProjects.length} hint="Approved join requests" trend={joinedProjects.length ? 'Member' : '0'} />
        <StatCard icon="request" label="Join Requests" value={requests.incoming?.filter((request) => request.status === 'pending').length ?? 0} hint="Pending approvals" trend="Live" />
        <StatCard icon="bell" label="Notifications" value={unreadNotifications} hint="Unread updates" trend={unreadNotifications ? 'New' : 'Quiet'} />
      </section>

      <section className="dashboard-columns">
        <div className="dashboard-column">
          <SectionTitle title="Joined Projects" action={<Link to="/requests">View requests</Link>} />
          <ProjectList projects={joinedProjects.slice(0, 3)} compact />
        </div>
        <div className="dashboard-column">
          <SectionTitle title="My Projects" action={<Link to="/projects/new">Create project</Link>} />
          <ProjectList projects={mine.slice(0, 3)} compact />
          {mine.length ? <Link className="btn btn-secondary section-button" to="/collaborators">Request collaborators</Link> : null}
        </div>
      </section>

      <section className="dashboard-columns">
        <div className="dashboard-column">
          <SectionTitle title="Pending Requests" action={<Link to="/requests">View all</Link>} />
          <div className="cards compact">
            {(requests.incoming?.filter((request) => request.status === 'pending').slice(0, 3) ?? []).map((request) => (
              <article className="request-card panel" key={`req-${request.id}`}>
                <div className="request-card-head">
                  <UserAvatar user={{ name: request.applicant_name }} size="sm" />
                  <div>
                    <h3>{request.applicant_name}</h3>
                    <p className="muted">{request.project_title}</p>
                  </div>
                  <Badge tone="success">Pending</Badge>
                </div>
                <p>{request.message ?? 'No message supplied.'}</p>
                <TagRow label="Skills" items={request.applicant_skills?.map((skill) => skill.name)} />
                <div className="actions small">
                  <Button variant="secondary" onClick={async () => {
                    await api(`/api/requests/${request.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) });
                    load();
                  }}>Approve</Button>
                  <Button variant="danger" onClick={async () => {
                    await api(`/api/requests/${request.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) });
                    load();
                  }}>Reject</Button>
                </div>
              </article>
            ))}
            {requests.incoming?.filter((request) => request.status === 'pending').length === 0 ? <p className="empty">No pending requests.</p> : null}
          </div>
        </div>
        <div className="dashboard-column">
          <SectionTitle title="Recent Notifications" action={<Link to="/notifications">View all</Link>} />
          <div className="cards compact">
            {notifications.filter((note) => !note.is_read).slice(0, 3).map((note) => (
              <article className="notification-card panel" key={`note-${note.id}`}>
                <div className="notification-card-head">
                  <span className="notification-icon"><Icon name="bell" /></span>
                  <div>
                    <h3>{note.title}</h3>
                    <p className="muted">{getRelativeTime(note.created_at)}</p>
                  </div>
                </div>
                <p>{note.body}</p>
                <Button variant="ghost" onClick={async () => {
                  await api(`/api/notifications/${note.id}/read`, { method: 'PATCH' });
                  load();
                }}>Mark read</Button>
              </article>
            ))}
            {notifications.filter((n) => !n.is_read).length === 0 ? <p className="empty">No unread notifications.</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <article className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action}
    </div>
  );
}

function ProjectList({ projects, compact = false, onRefresh }) {
  if (!projects.length) return <p className="empty">No projects found.</p>;
  return (
    <div className={compact ? 'cards compact' : 'cards'}>
      {projects.map((project) => (
        project.__loading ? <SkeletonCard key={project.id} /> : <ProjectCard key={project.id} project={project} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

function ProjectCard({ project, onRefresh }) {
  const user = getStoredUser();
  const isOwner = user && String(project.owner_id) === String(user.id);
  const [message, setMessage] = useState('');
  const progress = getProjectProgress(project.status);
  const techStack = project.tech_stack ?? [];
  const requiredSkills = project.required_skills ?? [];

  async function join() {
    try {
      await api(`/api/projects/${project.id}/join`, {
        method: 'POST',
        body: JSON.stringify({ message: message || `I would like to collaborate on ${project.title}.` }),
      });
      setMessage('Join request sent.');
      onRefresh?.();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove() {
    if (!confirm(`Delete ${project.title}?`)) return;
    await api(`/api/projects/${project.id}`, { method: 'DELETE' });
    onRefresh?.();
  }

  async function changeStatus(event) {
    const newStatus = event.target.value;
    try {
      await api(`/api/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          category: project.category,
          repositoryUrl: project.repository_url,
          liveUrl: project.live_url,
          techStack: project.tech_stack,
          requiredSkills: project.required_skills,
          teamSize: project.team_size,
          status: newStatus,
          collaborators: project.collaborators || [],
        }),
      });
      onRefresh?.();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <article className="project-card panel">
      <div className="project-card-header">
        <div className="project-card-title">
          <Badge tone="primary">{project.category}</Badge>
          <h3>{project.title}</h3>
          <p className="muted">{project.description}</p>
        </div>
        {project.match_count ? <Badge tone="success">{project.match_count}% match</Badge> : <Badge tone="neutral">{project.status}</Badge>}
      </div>

      <div className="project-progress">
        <div className="project-progress-head">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-bar"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="project-meta-grid">
        <div><span>Owner</span><strong>{project.owner?.name ?? 'Unknown'}</strong></div>
        <div><span>Team size</span><strong>{project.team_size}</strong></div>
        <div><span>Created</span><strong>{formatDate(project.created_at)}</strong></div>
      </div>

      <div className="project-tags">
        <TagRow label="Required" items={requiredSkills} />
        <TagRow label="Tech" items={techStack} />
      </div>

      {project.collaborators && project.collaborators.length > 0 ? (
        <div className="collaborator-strip">
          {project.collaborators.map((c, idx) => (
            <div className="collaborator-pill" key={idx}>
              <span>{c.name}</span>
              {c.github ? <a href={`https://github.com/${c.github}`} target="_blank" rel="noreferrer">GitHub</a> : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="actions small project-actions">
        {user && !isOwner ? <Button variant="secondary" onClick={join}>Request to join</Button> : null}
        {isOwner ? <Link className="btn btn-secondary" to={`/projects/${project.id}/edit`}>Edit</Link> : null}
        {isOwner ? <Button variant="danger" onClick={remove}>Delete</Button> : null}
      </div>

      {message ? <p className={message.includes('sent') ? 'success' : 'error'}>{message}</p> : null}
    </article>
  );
}

function TagRow({ label, items = [] }) {
  return (
    <div className="tags">
      <span>{label}</span>
      {items?.length ? items.map((item) => <b key={item}>{item}</b>) : <em>None listed</em>}
    </div>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ q: '', skill: '', tech: '', category: '', status: '' });

  async function load(nextFilters = filters) {
    const params = new URLSearchParams(Object.entries(nextFilters).filter(([, value]) => value));
    const data = await api(`/api/projects?${params.toString()}`);
    setProjects(data.projects);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  function update(event) {
    const next = { ...filters, [event.target.name]: event.target.value };
    setFilters(next);
    load(next).catch(console.error);
  }

  return (
    <main className="content">
      <SectionTitle title="Available projects" action={<Link to="/projects/new">Create project</Link>} />
      <section className="filters">
        <input name="q" value={filters.q} onChange={update} placeholder="Search projects" />
        <select name="skill" value={filters.skill} onChange={update}>
          <option value="">Any required skill</option>
          {skillOptions.map((skill) => (
            <option value={skill} key={`rs-${skill}`}>{skill}</option>
          ))}
        </select>
        <select name="tech" value={filters.tech} onChange={update}>
          <option value="">Any technology</option>
          {skillOptions.map((tech) => (
            <option value={tech} key={`ts-${tech}`}>{tech}</option>
          ))}
        </select>
        <select name="category" value={filters.category} onChange={update}>
          <option value="">Any category</option>
          {categoryOptions.map((cat) => (
            <option value={cat} key={`cat-${cat}`}>{cat}</option>
          ))}
        </select>
        <select name="status" value={filters.status} onChange={update}>
          <option value="">Any status</option>
          <option value="planning">Planning</option>
          <option value="recruiting">Recruiting</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </section>
      <ProjectList projects={projects} onRefresh={() => load()} />
    </main>
  );
}

function ProjectForm() {
  const navigate = useNavigate();
  const editId = location.pathname.match(/\/projects\/(.+)\/edit/)?.[1];
  const [form, setForm] = useState(emptyProject);
  const [message, setMessage] = useState('');
  const [otherTechStack, setOtherTechStack] = useState('');
  const [otherRequiredSkills, setOtherRequiredSkills] = useState('');
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    if (!editId) return;
    api('/api/projects').then((data) => {
      const found = data.projects.find((project) => String(project.id) === String(editId));
      if (found) {
        const tsArray = found.tech_stack || [];
        const presetTs = tsArray.filter((skill) => skillOptions.includes(skill));
        const customTs = tsArray.filter((skill) => !skillOptions.includes(skill));

        const rsArray = found.required_skills || [];
        const presetRs = rsArray.filter((skill) => skillOptions.includes(skill));
        const customRs = rsArray.filter((skill) => !skillOptions.includes(skill));

        setOtherTechStack(customTs.join(', '));
        setOtherRequiredSkills(customRs.join(', '));
        setCollaborators(found.collaborators || []);

        setForm({
          ...found,
          techStack: asCsv(customTs.length ? [...presetTs, 'Other'] : presetTs),
          requiredSkills: asCsv(customRs.length ? [...presetRs, 'Other'] : presetRs),
          repositoryUrl: found.repository_url ?? '',
          liveUrl: found.live_url ?? '',
          teamSize: found.team_size,
        });
      }
    });
  }, [editId]);

  async function submit(event) {
    event.preventDefault();

    const techStackArray = splitCsv(form.techStack);
    const requiredSkillsArray = splitCsv(form.requiredSkills);

    const finalTechStack = techStackArray
      .filter((s) => s !== 'Other')
      .concat(techStackArray.includes('Other') ? splitCsv(otherTechStack) : []);

    const finalRequiredSkills = requiredSkillsArray
      .filter((s) => s !== 'Other')
      .concat(requiredSkillsArray.includes('Other') ? splitCsv(otherRequiredSkills) : []);

    const payload = {
      ...form,
      techStack: finalTechStack,
      requiredSkills: finalRequiredSkills,
      collaborators,
    };

    try {
      await api(editId ? `/api/projects/${editId}` : '/api/projects', {
        method: editId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      navigate('/projects');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  return (
    <main className="content narrow">
      <form className="panel form" onSubmit={submit}>
        <h1>{editId ? 'Edit project' : 'Create project'}</h1>
        <Field label="Title"><input name="title" value={form.title} onChange={update} required /></Field>
        <Field label="Description"><textarea name="description" value={form.description} onChange={update} rows="4" required /></Field>
        <div className="two-col">
          <Field label="Category">
            <select name="category" value={form.category} onChange={update}>
              <option value="">Choose a category</option>
              {categoryOptions.map((cat) => (
                <option value={cat} key={`form-cat-${cat}`}>{cat}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select name="status" value={form.status} onChange={update}>
              <option value="planning">Planning</option>
              <option value="recruiting">Recruiting</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </Field>
        </div>
        <div className="two-col">
          <Field label="Technology stack">
            <div className="multi-select">
              {skillOptions.map((skill) => {
                const currentStack = form.techStack ? splitCsv(form.techStack) : [];
                return (
                  <label className="check-pill" key={`tech-${skill}`}>
                    <input
                      type="checkbox"
                      checked={currentStack.includes(skill)}
                      onChange={() => {
                        const nextStack = currentStack.includes(skill)
                          ? currentStack.filter((item) => item !== skill)
                          : [...currentStack, skill];
                        update({ target: { name: 'techStack', value: asCsv(nextStack) } });
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                );
              })}
            </div>
            {splitCsv(form.techStack || '').includes('Other') ? (
              <input
                value={otherTechStack}
                onChange={(event) => setOtherTechStack(event.target.value)}
                placeholder="Type other tech stack separated by commas"
              />
            ) : null}
          </Field>
          <Field label="Required skills">
            <div className="multi-select">
              {skillOptions.map((skill) => {
                const currentSkills = form.requiredSkills ? splitCsv(form.requiredSkills) : [];
                return (
                  <label className="check-pill" key={`req-${skill}`}>
                    <input
                      type="checkbox"
                      checked={currentSkills.includes(skill)}
                      onChange={() => {
                        const nextSkills = currentSkills.includes(skill)
                          ? currentSkills.filter((item) => item !== skill)
                          : [...currentSkills, skill];
                        update({ target: { name: 'requiredSkills', value: asCsv(nextSkills) } });
                      }}
                    />
                    <span>{skill}</span>
                  </label>
                );
              })}
            </div>
            {splitCsv(form.requiredSkills || '').includes('Other') ? (
              <input
                value={otherRequiredSkills}
                onChange={(event) => setOtherRequiredSkills(event.target.value)}
                placeholder="Type other skills separated by commas"
              />
            ) : null}
          </Field>
        </div>
        <div className="two-col">
          <Field label="Team size"><input name="teamSize" type="number" min="1" value={form.teamSize} onChange={update} /></Field>
          <Field label="Repository URL"><input name="repositoryUrl" value={form.repositoryUrl} onChange={update} /></Field>
        </div>
        <Field label="Live URL"><input name="liveUrl" value={form.liveUrl} onChange={update} /></Field>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Current Collaborators</h3>
          <p className="muted" style={{ marginBottom: '1rem' }}>
            Add existing collaborators who are already working on this project.
          </p>
          <div className="collaborators-list">
            {collaborators.map((collab, index) => (
              <div key={index} className="two-col" style={{ alignItems: 'end', marginBottom: '1rem' }}>
                <Field label="Collaborator Name">
                  <input
                    value={collab.name}
                    onChange={(e) => {
                      const next = [...collaborators];
                      next[index] = { ...next[index], name: e.target.value };
                      setCollaborators(next);
                    }}
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </Field>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
                  <Field label="GitHub Username" style={{ flexGrow: 1 }}>
                    <input
                      value={collab.github || ''}
                      onChange={(e) => {
                        const next = [...collaborators];
                        next[index] = { ...next[index], github: e.target.value };
                        setCollaborators(next);
                      }}
                      placeholder="e.g. janedoe"
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => {
                      setCollaborators(collaborators.filter((_, i) => i !== index));
                    }}
                    style={{ height: '42px', padding: '0 1rem' }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCollaborators([...collaborators, { name: '', github: '' }])}
            style={{ marginTop: '0.5rem' }}
          >
            + Add Collaborator
          </Button>
        </div>

        {message ? <p className="error">{message}</p> : null}
        <Button>{editId ? 'Save project' : 'Create project'}</Button>
      </form>
    </main>
  );
}

function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({ q: '', skills: [] });
  const [draftFilters, setDraftFilters] = useState({ q: '', skills: [] });

  async function load(nextFilters = filters) {
    const params = new URLSearchParams();
    if (nextFilters.q) params.set('q', nextFilters.q);
    if (nextFilters.skills.length) params.set('skills', nextFilters.skills.join(','));

    const data = await api(`/api/profiles${params.toString() ? `?${params.toString()}` : ''}`);
    setProfiles(data.profiles);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  function updateName(event) {
    setDraftFilters((current) => ({ ...current, q: event.target.value }));
  }

  function toggleSkill(skillName) {
    const nextSkills = draftFilters.skills.includes(skillName)
      ? draftFilters.skills.filter((item) => item !== skillName)
      : [...draftFilters.skills, skillName];
    setDraftFilters((current) => ({ ...current, skills: nextSkills }));
  }

  function submitSearch(event) {
    event.preventDefault();
    setFilters(draftFilters);
    load(draftFilters).catch(console.error);
  }

  return (
    <main className="content page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Developers</p>
          <h1>Discover professional developer profiles</h1>
          <p className="muted">Search by name, title, or multiple skills to find collaborators that match your stack and pace.</p>
        </div>
        <div className="search-summary">
          <strong>{profiles.length}</strong>
          <span>profiles</span>
        </div>
      </div>
      <form className="filters profiles-filters panel" onSubmit={submitSearch}>
        <div className="search-controls">
          <input value={draftFilters.q} onChange={updateName} placeholder="Search by name or title" />
          <Button type="submit">Search developers</Button>
        </div>
        <div className="skill-picker">
          {skillOptions.map((skill) => (
            <label className={`check-pill ${draftFilters.skills.includes(skill) ? 'selected' : ''}`} key={skill}>
              <input
                type="checkbox"
                checked={draftFilters.skills.includes(skill)}
                onChange={() => toggleSkill(skill)}
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </form>
      <div className="cards profile-grid">
        {profiles.map((profile) => {
          const skillNames = profile.skills?.map((item) => item.name) ?? [];
          const matchPercent = calculateMatchPercent(skillNames, filters.skills);
          const experience = getExperienceLevel(skillNames.length);

          return (
            <article className="profile-card panel" key={profile.id}>
              <div className="profile-card-head">
                <UserAvatar user={profile} size="md" />
                <div className="profile-card-copy">
                  <div className="profile-card-topline">
                    <h3>{profile.name}</h3>
                    <Badge tone={profile.profile_complete ? 'success' : 'neutral'}>{profile.profile_complete ? 'Available' : 'Profile building'}</Badge>
                  </div>
                  <p className="muted">{profile.title ?? profile.role}</p>
                </div>
                <div className="profile-match">{matchPercent}%</div>
              </div>
              <p>{profile.bio ?? 'No bio yet.'}</p>
              <div className="profile-details-row">
                <span><Icon name="spark" /> {experience}</span>
                <span><Icon name="users" /> {profile.location ?? 'Remote'}</span>
              </div>
              <TagRow label="Skills" items={skillNames} />
              <div className="link-row profile-link-row">
                {profile.github_url ? <a href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a> : null}
                {profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a> : null}
                {profile.portfolio_url ? <a href={profile.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a> : null}
              </div>
              <Link className="btn btn-secondary profile-view-btn" to={`/profiles/${profile.id}`}>View Profile</Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}

function RequestsPage({ onOpen }) {
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });

  async function load() {
    setRequests(await api('/api/requests'));
  }

  async function review(id, status) {
    await api(`/api/requests/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
  }

  useEffect(() => {
    load().catch(console.error);
    onOpen?.(); // clear the pending badge when the page is opened
  }, []);

  return (
    <main className="content page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Requests</p>
          <h1>Manage incoming and outgoing requests</h1>
          <p className="muted">Review applicants, see matching skills, and track every request in one place.</p>
        </div>
      </div>
      <section className="dashboard-columns">
        <div className="dashboard-column">
          <SectionTitle title="Incoming join requests" />
          <div className="cards single">
            {requests.incoming?.map((request) => (
              <article className={`request-card panel ${request.status !== 'pending' ? 'muted-card' : ''}`} key={request.id}>
                <div className="request-card-head">
                  <UserAvatar user={{ name: request.applicant_name }} size="sm" />
                  <div>
                    <h3>{request.applicant_name}</h3>
                    <p className="muted">{request.applicant_title ?? 'Developer'} · {request.project_title}</p>
                  </div>
                  <Badge tone={request.status === 'pending' ? 'success' : 'neutral'}>{request.status}</Badge>
                </div>
                <p>{request.message ?? 'No message supplied.'}</p>
                <TagRow label="Matching skills" items={request.applicant_skills?.map((skill) => skill.name)} />
                {request.status === 'pending' ? (
                  <div className="actions small">
                    <Button variant="secondary" onClick={() => review(request.id, 'approved')}>Accept</Button>
                    <Button variant="danger" onClick={() => review(request.id, 'rejected')}>Reject</Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
        <div className="dashboard-column">
          <SectionTitle title="My join requests" />
          <div className="cards single">
            {requests.outgoing?.map((request) => (
              <article className="request-card panel" key={request.id}>
                <div className="request-card-head">
                  <UserAvatar user={{ name: request.project_title }} size="sm" />
                  <div>
                    <h3>{request.project_title}</h3>
                    <p className="muted">{request.status}</p>
                  </div>
                </div>
                <p>{request.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CollaboratorsPage({ auth }) {
  const [projects, setProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ projectId: '', recipientId: '', requestedSkills: '', message: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api('/api/projects'), api('/api/profiles')])
      .then(([projectData, profileData]) => {
        const mine = projectData.projects.filter((project) => String(project.owner_id) === String(auth.user.id));
        setProjects(mine);
        setProfiles(profileData.profiles.filter((profile) => String(profile.id) !== String(auth.user.id)));
        setForm((current) => ({ ...current, projectId: mine[0]?.id ?? '' }));
      })
      .catch((error) => setMessage(error.message));
  }, [auth.user.id]);

  const selectedProject = projects.find((project) => String(project.id) === String(form.projectId));
  const candidates = useMemo(() => {
    const required = (selectedProject?.required_skills ?? []).map((skill) => skill.toLowerCase());
    if (!required.length) return profiles;
    return profiles.filter((profile) =>
      profile.skills?.some((skill) => required.includes(String(skill.name).toLowerCase())),
    );
  }, [profiles, selectedProject]);

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api(`/api/projects/${form.projectId}/collaborators`, {
        method: 'POST',
        body: JSON.stringify({
          recipientId: form.recipientId,
          requestedSkills: splitCsv(form.requestedSkills),
          message: form.message,
        }),
      });
      setMessage('Collaboration request sent.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  return (
    <main className="content narrow">
      <form className="panel form" onSubmit={submit}>
        <h1>Request collaborators</h1>
        <Field label="Project">
          <select name="projectId" value={form.projectId} onChange={update} required>
            {projects.map((project) => <option value={project.id} key={project.id}>{project.title}</option>)}
          </select>
        </Field>
        <Field label="Developer">
          <select name="recipientId" value={form.recipientId} onChange={update} required>
            <option value="">Choose a recommended developer</option>
            {candidates.map((profile) => (
              <option value={profile.id} key={profile.id}>
                {profile.name} {profile.skills?.length ? `- ${profile.skills.map((skill) => skill.name).join(', ')}` : ''}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Skills needed">
          <input
            name="requestedSkills"
            value={form.requestedSkills || asCsv(selectedProject?.required_skills)}
            onChange={update}
            placeholder="React, PostgreSQL"
          />
        </Field>
        <Field label="Message">
          <textarea name="message" value={form.message} onChange={update} rows="4" />
        </Field>
        {message ? <p className={message.includes('sent') ? 'success' : 'error'}>{message}</p> : null}
        <Button>Send request</Button>
      </form>
    </main>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  async function load() {
    const data = await api('/api/notifications');
    setNotifications(data.notifications);
  }

  async function markRead(id) {
    await api(`/api/notifications/${id}/read`, { method: 'PATCH' });
    load();
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  return (
    <main className="content page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Notifications</p>
          <h1>Stay on top of activity</h1>
          <p className="muted">Compact updates, timestamps, and quick actions without visual clutter.</p>
        </div>
      </div>
      <div className="cards notification-grid">
        {notifications.map((note) => (
          <article className={`notification-card panel ${note.is_read ? 'is-read' : 'is-unread'}`} key={note.id}>
            <div className="notification-card-head">
              <span className="notification-icon"><Icon name="bell" /></span>
              <div>
                <h3>{note.title}</h3>
                <p className="muted">{getRelativeTime(note.created_at)}</p>
              </div>
            </div>
            <p>{note.body}</p>
            <div className="actions small">
              {!note.is_read ? <Button variant="secondary" onClick={() => markRead(note.id)}>Mark as Read</Button> : <Badge tone="success">Read</Badge>}
              {note.link ? <Link className="btn btn-ghost" to={note.link}>Open</Link> : null}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function AdminPage() {
  const [overview, setOverview] = useState({ users: [], projects: [], joinRequests: [], approvedJoinRequests: [], stats: {} });
  const [message, setMessage] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userForm, setUserForm] = useState({});
  const [projectFilter, setProjectFilter] = useState('');
  const [notificationTarget, setNotificationTarget] = useState('all');
  const [notificationUserFilter, setNotificationUserFilter] = useState('');
  const [notificationForm, setNotificationForm] = useState({ title: '', body: '', link: '' });

  const userMap = useMemo(() => new Map(overview.users.map((user) => [String(user.id), user])), [overview.users]);
  const filteredUsers = useMemo(
    () => overview.users.filter((user) => {
      const haystack = `${user.name ?? ''} ${user.email ?? ''} ${user.role ?? ''}`.toLowerCase();
      return haystack.includes(userFilter.toLowerCase());
    }),
    [overview.users, userFilter],
  );
  const filteredNotificationUsers = useMemo(
    () => overview.users.filter((user) => {
      const haystack = `${user.name ?? ''} ${user.email ?? ''}`.toLowerCase();
      return haystack.includes(notificationUserFilter.toLowerCase());
    }),
    [overview.users, notificationUserFilter],
  );
  const filteredProjects = useMemo(
    () => overview.projects.filter((project) => {
      const haystack = `${project.title ?? ''} ${project.category ?? ''} ${project.status ?? ''}`.toLowerCase();
      return haystack.includes(projectFilter.toLowerCase());
    }),
    [overview.projects, projectFilter],
  );

  async function load() {
    const data = await api('/api/admin/overview');
    setOverview(data);
    setSelectedUserId((current) => current || data.users[0]?.id || '');
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedUserId && overview.users.length) {
      const firstUser = overview.users[0];
      setSelectedUserId(firstUser.id);
      setUserForm({
        name: firstUser.name ?? '',
        email: firstUser.email ?? '',
        role: firstUser.role ?? 'developer',
        title: firstUser.title ?? '',
        bio: firstUser.bio ?? '',
        location: firstUser.location ?? '',
        githubUrl: firstUser.github_url ?? '',
        linkedinUrl: firstUser.linkedin_url ?? '',
        portfolioUrl: firstUser.portfolio_url ?? '',
        profileComplete: Boolean(firstUser.profile_complete),
      });
    }
  }, [overview.users, selectedUserId]);

  useEffect(() => {
    const selectedUser = userMap.get(String(selectedUserId));
    if (!selectedUser) return;

    setUserForm({
      name: selectedUser.name ?? '',
      email: selectedUser.email ?? '',
      role: selectedUser.role ?? 'developer',
      title: selectedUser.title ?? '',
      bio: selectedUser.bio ?? '',
      location: selectedUser.location ?? '',
      githubUrl: selectedUser.github_url ?? '',
      linkedinUrl: selectedUser.linkedin_url ?? '',
      portfolioUrl: selectedUser.portfolio_url ?? '',
      profileComplete: Boolean(selectedUser.profile_complete),
    });
  }, [selectedUserId, userMap]);

  async function updateUser(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api(`/api/admin/users/${selectedUserId}`, {
        method: 'PATCH',
        body: JSON.stringify(userForm),
      });
      await load();
      setMessage('User updated.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteUser(userId) {
    if (!confirm('Delete this user? This cannot be undone.')) return;

    setMessage('');
    try {
      await api(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (String(selectedUserId) === String(userId)) {
        setSelectedUserId('');
      }
      await load();
      setMessage('User deleted.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteProject(projectId) {
    if (!confirm('Delete this project? This cannot be undone.')) return;

    setMessage('');
    try {
      await api(`/api/admin/projects/${projectId}`, { method: 'DELETE' });
      await load();
      setMessage('Project deleted.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function sendNotification(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify({
          target: notificationTarget,
          userId: notificationTarget === 'selected' ? notificationForm.userId : undefined,
          title: notificationForm.title,
          body: notificationForm.body,
          link: notificationForm.link || null,
        }),
      });
      setNotificationForm({ title: '', body: '', link: '' });
      setMessage('Notification sent.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updateUserForm(event) {
    const { name, type, checked, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function updateNotificationForm(event) {
    setNotificationForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <main className="content">
      <div className="admin-header">
        <SectionTitle title="Admin moderation" />
        <nav className="admin-nav" aria-label="Admin section navigation">
          <a href="#admin-stats">Statistics</a>
          <a href="#admin-users">Users</a>
          <a href="#admin-projects">Projects</a>
          <a href="#admin-collaborations">Collaborations</a>
          <a href="#admin-notifications">Notifications</a>
        </nav>
      </div>
      {message ? <p className={message.includes('deleted') || message.includes('updated') || message.includes('sent') ? 'success' : 'error'}>{message}</p> : null}
      <section className="dashboard-grid" id="admin-stats">
        <Stat label="Users" value={overview.stats.user_count ?? overview.users.length} />
        <Stat label="Projects" value={overview.stats.project_count ?? overview.projects.length} />
        <Stat label="Join requests" value={overview.stats.join_request_count ?? overview.joinRequests.length} />
        <Stat label="Approved join requests" value={overview.stats.approved_join_request_count ?? overview.approvedJoinRequests.length} />
        <Stat label="Notifications" value={overview.stats.notification_count ?? 0} />
        <Stat label="Complete profiles" value={overview.stats.complete_profile_count ?? 0} />
      </section>
      <section className="split admin-grid">
        <div id="admin-users">
          <SectionTitle title="Users" />
          <section className="filters admin-searches">
            <input value={userFilter} onChange={(event) => setUserFilter(event.target.value)} placeholder="Search users by name, email, or role" />
          </section>
          <div className="cards single admin-list">
            {filteredUsers.map((user) => (
              <article className={`row-card admin-row ${String(selectedUserId) === String(user.id) ? 'highlight' : ''}`} key={user.id}>
                <button type="button" className="admin-row-main" onClick={() => setSelectedUserId(user.id)}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <b>{user.role}</b>
                </button>
                <div className="admin-row-actions">
                  <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="Edit selected user" />
          {selectedUserId ? (
            <form className="panel form admin-form" onSubmit={updateUser}>
              <div className="two-col">
                <Field label="Name"><input name="name" value={userForm.name ?? ''} onChange={updateUserForm} /></Field>
                <Field label="Email"><input name="email" type="email" value={userForm.email ?? ''} onChange={updateUserForm} /></Field>
              </div>
              <div className="two-col">
                <Field label="Role">
                  <select name="role" value={userForm.role ?? 'developer'} onChange={updateUserForm}>
                    <option value="developer">Developer</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </Field>
                <Field label="Title"><input name="title" value={userForm.title ?? ''} onChange={updateUserForm} /></Field>
              </div>
              <Field label="Bio"><textarea name="bio" rows="4" value={userForm.bio ?? ''} onChange={updateUserForm} /></Field>
              <div className="two-col">
                <Field label="Location"><input name="location" value={userForm.location ?? ''} onChange={updateUserForm} /></Field>
                <Field label="Profile complete">
                  <label className="check-pill admin-check">
                    <input type="checkbox" name="profileComplete" checked={Boolean(userForm.profileComplete)} onChange={updateUserForm} />
                    <span>Mark as complete</span>
                  </label>
                </Field>
              </div>
              <div className="two-col">
                <Field label="GitHub URL"><input name="githubUrl" value={userForm.githubUrl ?? ''} onChange={updateUserForm} /></Field>
                <Field label="LinkedIn URL"><input name="linkedinUrl" value={userForm.linkedinUrl ?? ''} onChange={updateUserForm} /></Field>
              </div>
              <Field label="Portfolio URL"><input name="portfolioUrl" value={userForm.portfolioUrl ?? ''} onChange={updateUserForm} /></Field>
              <div className="form-actions">
                <Button type="submit">Update user</Button>
                {selectedUserId ? <Button type="button" variant="danger" onClick={() => deleteUser(selectedUserId)}>Delete selected user</Button> : null}
              </div>
            </form>
          ) : <p className="empty">Select a user to edit.</p>}
        </div>
      </section>

      <section className="split" style={{ marginTop: '2rem' }}>
        <div id="admin-projects">
          <SectionTitle title="Projects" />
          <section className="filters admin-searches">
            <input value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} placeholder="Search projects by title, category, or status" />
          </section>
          <div className="cards single admin-list">
            {filteredProjects.map((project) => (
              <article className="card admin-project-card" key={project.id}>
                <div className="card-head">
                  <div>
                    <h3>{project.title}</h3>
                    <p className="muted">{project.category} · {project.status}</p>
                  </div>
                  <span className="badge">#{project.id}</span>
                </div>
                <div className="actions small">
                  <Button variant="danger" onClick={() => deleteProject(project.id)}>Delete project</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div id="admin-collaborations">
          <SectionTitle title="Approved join requests" />
          <div className="cards single admin-list">
            {overview.approvedJoinRequests.map((request) => (
              <article className="card" key={request.id}>
                <h3>{request.applicant_name}</h3>
                <p className="muted">
                  {request.project_title} · {request.status}
                </p>
                <p>{request.message ?? 'No message supplied.'}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }} id="admin-notifications">
        <SectionTitle title="Send notification" />
        <form className="panel form admin-notification-form" onSubmit={sendNotification}>
          <div className="two-col">
            <Field label="Target">
              <select value={notificationTarget} onChange={(event) => setNotificationTarget(event.target.value)}>
                <option value="all">All users</option>
                <option value="selected">Selected user</option>
              </select>
            </Field>
            <Field label="Title"><input name="title" value={notificationForm.title} onChange={updateNotificationForm} required /></Field>
          </div>
          <Field label="Message"><textarea name="body" value={notificationForm.body} onChange={updateNotificationForm} rows="4" required /></Field>
          <Field label="Link (optional)"><input name="link" value={notificationForm.link} onChange={updateNotificationForm} placeholder="/notifications" /></Field>
          {notificationTarget === 'selected' ? (
            <Field label="Selected user">
              <input
                value={notificationUserFilter}
                onChange={(event) => setNotificationUserFilter(event.target.value)}
                placeholder="Search by user name"
              />
              <div className="skill-picker admin-user-picker">
                {filteredNotificationUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={`check-pill admin-user-option ${String(notificationForm.userId) === String(user.id) ? 'selected' : ''}`}
                    onClick={() => setNotificationForm((current) => ({ ...current, userId: user.id }))}
                  >
                    <span>{user.name} · {user.email}</span>
                  </button>
                ))}
              </div>
            </Field>
          ) : null}
          <Button type="submit">Send notification</Button>
        </form>
      </section>
    </main>
  );
}

function App() {
  const auth = useAuth();
  const [theme, setTheme] = useTheme();
  const { pendingRequests, clearPending, setPendingRequests } = usePendingRequests(auth.user);

  return (
    <Shell auth={auth} pendingRequests={pendingRequests} theme={theme} setTheme={setTheme}>
      <Routes>
        <Route path="/" element={<Landing auth={auth} />} />
        <Route path="/login" element={<AuthPage mode="login" auth={auth} />} />
        <Route path="/register" element={<AuthPage mode="register" auth={auth} />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/profiles/:id" element={<UserProfilePage />} />
        <Route path="/dashboard" element={<Protected user={auth.user}><Dashboard auth={auth} onNewRequest={() => setPendingRequests((n) => n + 1)} /></Protected>} />
        <Route path="/profile/setup" element={<Protected user={auth.user}><ProfileSetup auth={auth} /></Protected>} />
        <Route path="/profile/edit" element={<Protected user={auth.user}><ProfileEditor auth={auth} /></Protected>} />
        <Route path="/projects/new" element={<Protected user={auth.user}><ProjectForm /></Protected>} />
        <Route path="/projects/:id/edit" element={<Protected user={auth.user}><ProjectForm /></Protected>} />
        <Route path="/requests" element={<Protected user={auth.user}><RequestsPage onOpen={clearPending} /></Protected>} />
        <Route path="/collaborators" element={<Protected user={auth.user}><CollaboratorsPage auth={auth} /></Protected>} />
        <Route path="/notifications" element={<Protected user={auth.user}><NotificationsPage /></Protected>} />
        <Route path="/admin" element={<Protected user={auth.user}><AdminPage /></Protected>} />
      </Routes>
    </Shell>
  );
}

export default App;
