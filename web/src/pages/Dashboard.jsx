import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const load = async () => {
    const { data } = await api.get('/articles');
    setArticles(data);
  };
  useEffect(() => { load(); }, []);
  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>My Articles</h2>
      <button onClick={logout}>Logout</button>
      <ul>
        {articles.map(a => (
          <li key={a.id}>
            <a href={a.url} target="_blank">{a.title}</a>
            {a.doi ? ` — DOI: ${a.doi}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
