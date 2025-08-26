import { useState } from 'react';
import { useAuth } from '../auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth(); const nav = useNavigate();
  const [email, setE] = useState(''); const [password, setP] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await login(email, password); nav('/'); } catch (ex) { setErr(ex?.response?.data?.message || 'Login failed'); }
  };
  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Login</h2>
      {err && <div style={{ color:'red' }}>{err}</div>}
      <input placeholder="Email" value={email} onChange={e=>setE(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
      <button>Login</button>
      <p>New here? <Link to="/register">Register</Link></p>
    </form>
  );
}
