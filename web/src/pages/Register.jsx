import { useState } from 'react';
import { useAuth } from '../auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth(); 
  const nav = useNavigate();
  const [name,setN]=useState(''); 
  const [email,setE]=useState(''); 
  const [password,setP]=useState('');
  const [err,setErr]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await register(name, email, password); nav('/'); } 
    catch (ex) { 
      setErr(ex?.response?.data?.message || 'Failed'); 
    }
  };
  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Register</h2>
      {err && <div style={{ color:'red' }}>{err}</div>}
      <input placeholder="Name" value={name} onChange={e=>setN(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setE(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
      <button>Create account</button>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
