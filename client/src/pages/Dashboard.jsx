import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('devlink_token');
    if (!token) return navigate('/login');

    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('devlink_token');
        localStorage.removeItem('devlink_user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <main className="mx-auto w-full max-w-4xl p-8">
      <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}</h1>
      <p className="mt-2 text-white/75">This is your dashboard. Your email: {user?.email}</p>
    </main>
  );
}
