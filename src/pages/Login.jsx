import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate('/profile');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <div className="mb-3 p-2 bg-red-50 text-red-700 rounded">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" required value={form.email} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" required value={form.password} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm">Don't have an account? <Link className="text-primary-600" to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
