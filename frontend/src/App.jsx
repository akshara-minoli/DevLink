import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

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

function Shell({ auth, children }) {
  const unread = Number(auth.user?.unread ?? 0);
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app">
      {!isAuthPage ? (
        <header className="topbar">
          <Link className="brand" to="/">
            DevLink
          </Link>
          <nav>
            {isWelcomePage ? (
              <>
                <a href="#about">About Us</a>
                <a href="#contact">Contact Us</a>
                <Link to="/login">Login</Link>
                <Link className="nav-cta" to="/register">Get Started</Link>
              </>
            ) : auth.user ? (
              <>
                <Link to="/projects">Projects</Link>
                <Link to="/profiles">Developers</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/requests">Requests</Link>
                <Link to="/notifications">Notifications{unread ? ` (${unread})` : ''}</Link>
                {auth.user.role === 'admin' ? <Link to="/admin">Admin</Link> : null}
                <Button variant="ghost" onClick={auth.logout}>Log out</Button>
              </>
            ) : (
              <>
                <Link to="/projects">Projects</Link>
                <Link to="/profiles">Developers</Link>
                <Link to="/login">Log in</Link>
                <Link className="nav-cta" to="/register">Get Started</Link>
              </>
            )}
          </nav>
        </header>
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
  const [projects, setProjects] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [notifications, setNotifications] = useState([]);

  async function load() {
    const [allProjects, recs, reqs, notes] = await Promise.all([
      api('/api/projects'),
      api('/api/projects/recommended'),
      api('/api/requests'),
      api('/api/notifications'),
    ]);
    setProjects(allProjects.projects);
    setRecommended(recs.projects);
    setRequests(reqs);
    setNotifications(notes.notifications);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const mine = projects.filter((project) => String(project.owner_id) === String(auth.user.id));

  return (
    <main className="content">
      <section className="notice profile-actions">
        <div>
          <strong>{auth.user.name}</strong>
          <span>{auth.user.title ?? 'Complete your title and skills to improve matching.'}</span>
        </div>
        <Link className="btn btn-secondary" to="/profile/edit">Edit profile</Link>
      </section>
      {!auth.user.profileComplete ? (
        <section className="notice">
          <strong>Finish your profile</strong>
          <span>Complete skills and social links to improve recommendations.</span>
          <Link className="btn btn-secondary" to="/profile/setup">Set up profile</Link>
        </section>
      ) : null}
      <section className="dashboard-grid">
        <Stat label="My projects" value={mine.length} />
        <Stat label="Recommended" value={recommended.length} />
        <Stat label="Incoming requests" value={requests.incoming?.filter((request) => request.status === 'pending').length ?? 0} />
        <Stat label="Unread notifications" value={notifications.filter((note) => !note.is_read).length} />
      </section>
      <section className="split">
        <div>
          <SectionTitle title="Recommended projects" action={<Link to="/projects">Browse all</Link>} />
          <ProjectList projects={recommended.slice(0, 3)} compact />
        </div>
        <div>
          <SectionTitle title="Your projects" action={<Link to="/projects/new">Create project</Link>} />
          <ProjectList projects={mine.slice(0, 3)} compact />
          {mine.length ? <Link className="btn btn-secondary" to="/collaborators" style={{ marginTop: '1rem', display: 'inline-block' }}>Request collaborators</Link> : null}
        </div>
      </section>
      <section className="split" style={{ marginTop: '2rem' }}>
        <div>
          <SectionTitle title="Pending requests" action={<Link to="/requests">View all</Link>} />
          <div className="cards compact">
            {requests.incoming?.filter(r => r.status === 'pending').slice(0, 3).map((request) => (
              <article className="card" key={`req-${request.id}`}>
                <h3>{request.applicant_name}</h3>
                <p className="muted">Wants to join: {request.project_title}</p>
                <div className="actions small" style={{ marginTop: '0.5rem' }}>
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
            {requests.incoming?.filter(r => r.status === 'pending').length === 0 ? <p className="empty">No pending requests.</p> : null}
          </div>
        </div>
        <div>
          <SectionTitle title="Unread notifications" action={<Link to="/notifications">View all</Link>} />
          <div className="cards compact">
            {notifications.filter(n => !n.is_read).slice(0, 3).map((note) => (
              <article className="card" key={`note-${note.id}`}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                <div className="actions small" style={{ marginTop: '0.5rem' }}>
                  <Button variant="ghost" onClick={async () => {
                    await api(`/api/notifications/${note.id}/read`, { method: 'PATCH' });
                    load();
                  }}>Mark read</Button>
                </div>
              </article>
            ))}
            {notifications.filter(n => !n.is_read).length === 0 ? <p className="empty">No unread notifications.</p> : null}
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
        <ProjectCard key={project.id} project={project} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

function ProjectCard({ project, onRefresh }) {
  const user = getStoredUser();
  const isOwner = user && String(project.owner_id) === String(user.id);
  const [message, setMessage] = useState('');

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
    <article className="card">
      <div className="card-head">
        <div>
          <h3>{project.title}</h3>
          <p>
            {project.category} ·{' '}
            {isOwner ? (
              <select value={project.status} onChange={changeStatus} style={{ border: 'none', background: 'none', font: 'inherit', color: 'inherit', padding: 0, cursor: 'pointer', outline: 'none' }}>
                <option value="planning">Planning</option>
                <option value="recruiting">Recruiting</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            ) : (
              project.status
            )}
          </p>
        </div>
        {project.match_count ? <span className="badge">{project.match_count} skill match</span> : null}
      </div>
      <p>{project.description}</p>
      <TagRow label="Stack" items={project.tech_stack} />
      <TagRow label="Needs" items={project.required_skills} />
      {project.collaborators && project.collaborators.length > 0 ? (
        <div className="tags" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span>Collaborators</span>
          {project.collaborators.map((c, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', color: '#334155', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              {c.name}
              {c.github ? (
                <a
                  href={`https://github.com/${c.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: '0.25rem', color: '#059669', textDecoration: 'underline' }}
                >
                  GitHub
                </a>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
      <p className="muted">Owner: {project.owner?.name ?? 'Unknown'} · Team size: {project.team_size}</p>
      <div className="actions small">
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
  const [skill, setSkill] = useState('');

  async function load(nextSkill = skill) {
    const data = await api(`/api/profiles${nextSkill ? `?skill=${encodeURIComponent(nextSkill)}` : ''}`);
    setProfiles(data.profiles);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  return (
    <main className="content">
      <SectionTitle title="Developer profiles" />
      <section className="filters">
        <input value={skill} onChange={(event) => setSkill(event.target.value)} placeholder="Filter by skill" />
        <Button variant="secondary" onClick={() => load()}>Search</Button>
      </section>
      <div className="cards">
        {profiles.map((profile) => (
          <article className="card" key={profile.id}>
            <h3>{profile.name}</h3>
            <p className="muted">{profile.title ?? profile.role}</p>
            <p>{profile.bio ?? 'No bio yet.'}</p>
            <TagRow label="Skills" items={profile.skills?.map((item) => item.name)} />
            <div className="link-row">
              {profile.github_url ? <a href={profile.github_url}>GitHub</a> : null}
              {profile.linkedin_url ? <a href={profile.linkedin_url}>LinkedIn</a> : null}
              {profile.portfolio_url ? <a href={profile.portfolio_url}>Portfolio</a> : null}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function RequestsPage() {
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
  }, []);

  return (
    <main className="content split">
      <section>
        <SectionTitle title="Incoming join requests" />
        <div className="cards single">
          {requests.incoming?.map((request) => (
            <article className="card" key={request.id}>
              <h3>{request.applicant_name}</h3>
              <p className="muted">{request.project_title} · {request.status}</p>
              <p>{request.message ?? 'No message supplied.'}</p>
              <TagRow label="Applicant skills" items={request.applicant_skills?.map((skill) => skill.name)} />
              {request.status === 'pending' ? (
                <div className="actions small">
                  <Button variant="secondary" onClick={() => review(request.id, 'approved')}>Approve</Button>
                  <Button variant="danger" onClick={() => review(request.id, 'rejected')}>Reject</Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title="My join requests" />
        <div className="cards single">
          {requests.outgoing?.map((request) => (
            <article className="card" key={request.id}>
              <h3>{request.project_title}</h3>
              <p className="muted">{request.status}</p>
              <p>{request.message}</p>
            </article>
          ))}
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
    <main className="content narrow">
      <SectionTitle title="Notifications" />
      <div className="cards single">
        {notifications.map((note) => (
          <article className={`card ${note.is_read ? '' : 'highlight'}`} key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <p className="muted">{new Date(note.created_at).toLocaleString()}</p>
            {!note.is_read ? <Button variant="secondary" onClick={() => markRead(note.id)}>Mark read</Button> : null}
          </article>
        ))}
      </div>
    </main>
  );
}

function AdminPage() {
  const [overview, setOverview] = useState({ users: [], projects: [], requests: [] });

  useEffect(() => {
    api('/api/admin/overview').then(setOverview).catch(console.error);
  }, []);

  return (
    <main className="content">
      <SectionTitle title="Admin moderation" />
      <section className="dashboard-grid">
        <Stat label="Users" value={overview.users.length} />
        <Stat label="Projects" value={overview.projects.length} />
        <Stat label="Join requests" value={overview.requests.length} />
      </section>
      <section className="split">
        <div>
          <SectionTitle title="Recent users" />
          <div className="cards single">
            {overview.users.slice(0, 8).map((user) => (
              <article className="row-card" key={user.id}>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <b>{user.role}</b>
              </article>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="Recent projects" />
          <div className="cards single">
            {overview.projects.slice(0, 8).map((project) => (
              <article className="row-card" key={project.id}>
                <strong>{project.title}</strong>
                <span>{project.category}</span>
                <b>{project.status}</b>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  const auth = useAuth();

  return (
    <Shell auth={auth}>
      <Routes>
        <Route path="/" element={<Landing auth={auth} />} />
        <Route path="/login" element={<AuthPage mode="login" auth={auth} />} />
        <Route path="/register" element={<AuthPage mode="register" auth={auth} />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/dashboard" element={<Protected user={auth.user}><Dashboard auth={auth} /></Protected>} />
        <Route path="/profile/setup" element={<Protected user={auth.user}><ProfileSetup auth={auth} /></Protected>} />
        <Route path="/profile/edit" element={<Protected user={auth.user}><ProfileEditor auth={auth} /></Protected>} />
        <Route path="/projects/new" element={<Protected user={auth.user}><ProjectForm /></Protected>} />
        <Route path="/projects/:id/edit" element={<Protected user={auth.user}><ProjectForm /></Protected>} />
        <Route path="/requests" element={<Protected user={auth.user}><RequestsPage /></Protected>} />
        <Route path="/collaborators" element={<Protected user={auth.user}><CollaboratorsPage auth={auth} /></Protected>} />
        <Route path="/notifications" element={<Protected user={auth.user}><NotificationsPage /></Protected>} />
        <Route path="/admin" element={<Protected user={auth.user}><AdminPage /></Protected>} />
      </Routes>
    </Shell>
  );
}

export default App;
