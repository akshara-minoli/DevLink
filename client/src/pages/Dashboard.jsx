import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Dashboard({ setIsLoggedIn }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const technologies = user?.technologies || [];

  useEffect(() => {
    const token = localStorage.getItem('devlink_token');
    if (!token) return navigate('/login');

    (async () => {
      try {
        const userRes = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        // Fetch projects
        const projectsRes = await axios.get(`${API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectsRes.data.projects || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('devlink_token');
          localStorage.removeItem('devlink_user');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const profileCompletion = user
    ? Math.round(
        ((user.name ? 12 : 0) +
          (user.email ? 8 : 0) +
          (user.designation ? 12 : 0) +
          (user.workExperience ? 12 : 0) +
          (user.bio ? 14 : 0) +
          (user.github ? 8 : 0) +
          (user.linkedin ? 8 : 0) +
          Math.min(technologies.length * 4, 26)) /
          100 *
          100
      )
    : 0;

  const ownedProjects = projects.filter((p) => p.owner === user?.id);
  const joinedProjects = projects.filter((p) => p.owner !== user?.id && p.members?.includes(user?.id));

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm('Delete your profile permanently? This cannot be undone.');
    if (!confirmed) return;

    const token = localStorage.getItem('devlink_token');

    try {
      await axios.delete(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('devlink_token');
      localStorage.removeItem('devlink_user');
      setIsLoggedIn?.(false);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete profile.';
      window.alert(message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-slate-600">Loading your dashboard...</p>
      </div>
    );

  return (
    <main className="w-full animate-fade-in">
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 overflow-x-auto">
        {['overview', 'projects', 'recommended', 'requests', 'activity', 'notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold transition whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-sky-500 text-sky-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid gap-6">
          {/* Welcome & Profile Section */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 sm:rounded-[2rem] sm:p-8">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-400 p-1 shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-black text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-cyan-700">Welcome back</p>
                  <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">{user?.name}</h1>
                  <p className="text-sm text-slate-600">{user?.designation || 'Developer'}</p>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[2rem]">
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-cyan-700">Profile Completion</p>
              <div className="relative h-24 w-24 mx-auto mb-4">
                <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(profileCompletion / 100) * 283} 283`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{profileCompletion}%</span>
                </div>
              </div>
              <Link
                to="/edit-profile"
                className="block text-center text-xs font-semibold text-sky-600 transition hover:text-sky-700"
              >
                Complete Profile
              </Link>
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="mt-3 block w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-800"
              >
                Delete Profile
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8">
            <p className="mb-4 text-xs font-black uppercase tracking-widest text-cyan-700">Skills Added</p>
            {technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span key={tech} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">No skills added yet. Update your profile to add technologies.</p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Projects Joined', value: joinedProjects.length, icon: '📁', color: 'sky' },
              { label: 'Projects Owned', value: ownedProjects.length, icon: '🏢', color: 'cyan' },
              { label: 'Pending Requests', value: 3, icon: '📬', color: 'emerald' },
              { label: 'Skills Added', value: user?.technologies?.length || 0, icon: '⚡', color: 'amber' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl border border-${stat.color}-200 bg-${stat.color}-50 p-4 sm:rounded-2xl sm:p-6`}>
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className={`text-sm font-semibold text-${stat.color}-700`}>{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8">
            <p className="mb-4 text-xs font-black uppercase tracking-widest text-cyan-700">Quick Actions</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-sky-50">
                Create Project
              </button>
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-sky-50">
                Browse Projects
              </button>
              <Link
                to="/edit-profile"
                className="text-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-sky-50"
              >
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MY PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="grid gap-6">
          {/* Owned Projects */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Projects I Own</h2>
            {ownedProjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ownedProjects.map((project) => (
                  <div key={project._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-sky-200">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{project.title}</h3>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-1 inline-block">
                          Owner
                        </span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        project.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span>👥 {project.members?.length || 1} members</span>
                      <span>🏷️ {project.tags?.length || 0} tags</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">No projects owned yet. Create one to get started!</p>
            )}
          </div>

          {/* Joined Projects */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Projects I Joined</h2>
            {joinedProjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {joinedProjects.map((project) => (
                  <div key={project._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-sky-200">
                    <div className="mb-3">
                      <h3 className="font-bold text-slate-900">{project.title}</h3>
                      <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-full mt-1 inline-block">
                        Member
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span>👥 {project.members?.length || 1} members</span>
                      <span>🏷️ {project.tags?.length || 0} tags</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">No projects joined yet. Explore and join interesting projects!</p>
            )}
          </div>
        </div>
      )}

      {/* RECOMMENDED TAB */}
      {activeTab === 'recommended' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'AI Chat Bot', match: 85, skills: ['JavaScript', 'React', 'Node.js'], members: 4 },
            { title: 'E-commerce Platform', match: 72, skills: ['React', 'MongoDB', 'Express'], members: 6 },
            { title: 'Mobile App', match: 65, skills: ['React Native', 'Node.js'], members: 3 },
          ].map((project, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-sky-200">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{project.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">4 days ago</p>
                </div>
                <div className="relative h-16 w-16">
                  <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#0ea5e9"
                      strokeWidth="6"
                      strokeDasharray={`${(project.match / 100) * 283} 283`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900">
                    {project.match}%
                  </div>
                </div>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:brightness-110">
                Send Join Request
              </button>
            </div>
          ))}
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Join Requests & Invitations</h2>
            {[
              { user: 'Alice Johnson', project: 'AI Chat Bot', type: 'request' },
              { user: 'DevLink Team', project: 'E-commerce Platform', type: 'invitation' },
            ].map((item, idx) => (
              <div key={idx} className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:mb-0">
                <div>
                  <p className="font-semibold text-slate-900">{item.user}</p>
                  <p className="text-sm text-slate-600">
                    {item.type === 'request' ? 'Requested to join' : 'Invited you to'} <span className="font-semibold">{item.project}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                    Accept
                  </button>
                  <button className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Activity Feed</h2>
          <div className="space-y-4">
            {[
              { action: 'Joined project', project: 'E-commerce Platform', time: '2 hours ago', icon: '📝' },
              { action: 'Updated profile', details: 'Added React skills', time: '1 day ago', icon: '✏️' },
              { action: 'Created project', project: 'Mobile App', time: '3 days ago', icon: '🚀' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {activity.action}
                    {activity.project && <span className="text-sky-600"> {activity.project}</span>}
                    {activity.details && <span className="text-slate-600 font-normal"> - {activity.details}</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Notifications</h2>
          <div className="space-y-3">
            {[
              { message: '🎉 Your project "AI Chat Bot" was liked by 5 developers', type: 'success' },
              { message: '📨 New join request from David Lee', type: 'info' },
              { message: '⚠️ Your profile completion is only 60%', type: 'warning' },
            ].map((notif, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-4 border ${
                  notif.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200'
                    : notif.type === 'warning'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-blue-50 border-blue-200'
                }`}
              >
                <p className={`text-sm font-semibold ${
                  notif.type === 'success'
                    ? 'text-emerald-800'
                    : notif.type === 'warning'
                      ? 'text-amber-800'
                      : 'text-blue-800'
                }`}>
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
