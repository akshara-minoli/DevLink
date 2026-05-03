import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const designations = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'UI/UX Designer',
  'Project Manager',
  'QA Engineer',
  'Mobile Developer',
  'Cloud Engineer',
  'Site Reliability Engineer',
  'Machine Learning Engineer',
];

const techStack = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'C#/.net',
  'Go',
  'Rust',
  'PHP',
  'Linux',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Git',
  'GraphQL',
  'REST API',
  'HTML/CSS',
  'Tailwind CSS',
];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customTechnology, setCustomTechnology] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    workExperience: '',
    bio: '',
    github: '',
    linkedin: '',
    technologies: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('devlink_token');
    if (!token) return navigate('/login');

    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || '',
          designation: res.data.user.designation || '',
          workExperience: res.data.user.workExperience || '',
          bio: res.data.user.bio || '',
          github: res.data.user.github || '',
          linkedin: res.data.user.linkedin || '',
          technologies: res.data.user.technologies || [],
        });
      } catch (err) {
        localStorage.removeItem('devlink_token');
        localStorage.removeItem('devlink_user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechChange = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const addCustomTechnology = () => {
    const tech = customTechnology.trim();
    if (!tech) return;

    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech) ? prev.technologies : [...prev.technologies, tech],
    }));
    setCustomTechnology('');
  };

  const removeTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((item) => item !== tech),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    const token = localStorage.getItem('devlink_token');

    try {
      await axios.put(`${API_BASE_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <main className="mx-auto w-full max-w-2xl animate-fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-700 sm:mb-3">Profile</p>
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Edit Your Profile</h1>
        </div>
        <Link to="/dashboard" className="text-sm text-cyan-600 transition hover:text-sky-700">
          ← Back
        </Link>
      </div>

      <form className="grid gap-4 sm:gap-6" onSubmit={handleSubmit}>
        {/* Name */}
        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm">
          Full Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="Your full name"
          />
        </label>

        {/* Designation */}
        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm">
          Designation
          <select
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
          >
            <option value="">Select your designation</option>
            {designations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        {/* Work Experience */}
        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm">
          Work Experience
          <textarea
            name="workExperience"
            value={formData.workExperience}
            onChange={handleInputChange}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="Describe your work experience (e.g., 5 years as Senior Developer at Tech Corp)"
            rows={3}
          />
        </label>

        {/* Bio */}
        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm">
          Bio
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="Tell us about yourself"
            rows={3}
          />
        </label>

        {/* GitHub */}
        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm">
          GitHub Profile
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleInputChange}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="https://github.com/yourusername"
          />
        </label>

        {/* LinkedIn */}
        <label className="grid gap-1 text-xs text-slate-700 sm:gap-2 sm:text-sm">
          LinkedIn Profile
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </label>

        {/* Technologies */}
        <label className="grid gap-2 text-xs text-slate-700 sm:gap-3 sm:text-sm">
          Technologies & Languages
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => removeTechnology(tech)}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100 sm:text-sm"
                title="Remove technology"
              >
                {tech}
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTechnology}
              onChange={(e) => setCustomTechnology(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTechnology();
                }
              }}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 sm:rounded-xl sm:px-4 sm:py-3"
              placeholder="Type another technology"
            />
            <button
              type="button"
              onClick={addCustomTechnology}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-700 sm:rounded-xl sm:px-5 sm:py-3"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3 sm:p-4">
            {techStack.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechChange(tech)}
                className={`rounded-lg px-3 py-1.5 text-xs transition sm:px-4 sm:py-2 sm:text-sm ${
                  formData.technologies.includes(tech)
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'border border-slate-300 bg-white text-slate-700 hover:border-sky-400'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </label>

        {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700 sm:p-3 sm:text-sm">{error}</p>}
        {success && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700 sm:p-3 sm:text-sm">{success}</p>}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-2 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-12 sm:rounded-full sm:px-5 sm:py-3"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
}
