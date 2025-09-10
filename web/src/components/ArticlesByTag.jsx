import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { colors, gradients, shadows } from "../theme";

export default function ArticlesByTag() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const fetchArticlesAndTag = async () => {
      try {
        // Fetch articles for the tag
        const { data } = await api.get(`/tag/${id}/articles`);
        setArticles(data.articles || []);

        // Fetch tag name separately
        const tagsRes = await api.get('/tag/tags');
        const tag = tagsRes.data.tags.find(t => t.id.toString() === id.toString());
        setTagName(tag ? tag.name : `#${id}`);
      } catch (err) {
        console.error("Failed to fetch articles or tag name:", err);
        setTagName(`#${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchArticlesAndTag();
  }, [id]);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: gradients.app,
      fontFamily: "Inter, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle at 25% 75%, rgba(13, 148, 136, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 75% 25%, rgba(249, 115, 22, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 70%)`,
        animation: 'libraryFloat 30s ease-in-out infinite',
        zIndex: 0
      }} />

      {/* Left Navigation Sidebar */}
      <div
        style={{
          width: '280px',
          background: gradients.sidebar,
          color: 'white',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: shadows.medium,
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
          position: 'relative',
          animation: 'slideInLeft 0.6s ease-out'
        }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '16px',
          color: '#e5e7eb',
          animation: 'fadeInDown 0.8s ease-out 0.2s both'
        }}>
          Research Locker
        </h1>
        <nav style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
              { label: 'Library', icon: '📚', path: '/library' },
              { label: 'HashTags', icon: '🗂️', path: '/hashtags' },
            ].map(({ label, icon, path }, index) => (
              <li
                key={label}
                style={{
                  padding: '10px 12px',
                  color: '#cbd5e1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: `fadeInLeft 0.6s ease-out ${0.8 + index * 0.1}s both`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  if (path) nav(path);
                }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        style={{
          flexGrow: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          animation: 'fadeInRight 0.6s ease-out 0.3s both',
          overflowX: 'auto'
        }}
      >
        <div style={{
          marginBottom: '30px',
          animation: 'fadeInDown 0.8s ease-out 0.5s both'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🗂️ Articles tagged with <br></br>#{tagName}
          </h2>
          <p style={{
            color: colors.mutedText,
            fontSize: '1rem',
            margin: 0,
            fontWeight: 400
          }}>
            Browse all articles associated with this hashtag
          </p>
        </div>

        {loading ? (
          <p>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p>No articles found for this hashtag.</p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "#fff",
            borderRadius: '16px',
            boxShadow: shadows.soft,
            overflow: 'hidden'
          }}>
            <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
              <tr>
                <th style={{
                  padding: "12px 16px",
                  borderBottom: `2px solid ${colors.border}`,
                  textAlign: "left",
                  fontWeight: 600,
                  color: colors.primaryText,
                  fontSize: '0.95rem'
                }}>
                  S.No
                </th>
                <th style={{
                  padding: "12px 16px",
                  borderBottom: `2px solid ${colors.border}`,
                  textAlign: "left",
                  fontWeight: 600,
                  color: colors.primaryText,
                  fontSize: '0.95rem'
                }}>
                  Title
                </th>
                <th style={{
                  padding: "12px 16px",
                  borderBottom: `2px solid ${colors.border}`,
                  textAlign: "left",
                  fontWeight: 600,
                  color: colors.primaryText,
                  fontSize: '0.95rem'
                }}>
                  DOI
                </th>
                <th style={{
                  padding: "12px 16px",
                  borderBottom: `2px solid ${colors.border}`,
                  textAlign: "left",
                  fontWeight: 600,
                  color: colors.primaryText,
                  fontSize: '0.95rem'
                }}>
                  Authors
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, idx) => (
                <tr
                  key={article.id}
                  style={{
                    background: idx % 2 === 0 ? '#f8fafc' : 'white',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => nav(`/library/article/${article.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#f8fafc' : 'white'}
                >
                  <td style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    color: colors.highlight,
                    fontSize: "1rem"
                  }}>
                    {idx + 1}
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    color: colors.primaryText,
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: '0.01em'
                  }}>
                    {article.title}
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    color: colors.link,
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: '0.01em'
                  }}>
                    {article.doi ? (
                      <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" style={{ color: colors.link }}>
                        {article.doi}
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td style={{
                    padding: "12px 16px",
                    color: colors.primaryText,
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: '0.01em'
                  }}>
                    {article.authors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>
        {`
          @keyframes libraryFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-25px) rotate(90deg); }
            50% { transform: translateY(20px) rotate(180deg); }
            75% { transform: translateY(-15px) rotate(270deg); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-100px) scale(0.95);}
            to { opacity: 1; transform: translateX(0) scale(1);}
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px) scale(0.95);}
            to { opacity: 1; transform: translateY(0) scale(1);}
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95);}
            to { opacity: 1; transform: translateY(0) scale(1);}
          }
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-30px) scale(0.95);}
            to { opacity: 1; transform: translateX(0) scale(1);}
          }
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(30px) scale(0.95);}
            to { opacity: 1; transform: translateX(0) scale(1);}
          }
        `}
      </style>
    </div>
  );
}
