import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { colors, gradients, shadows } from "../theme";
import Layout from "./Layout";

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
    <Layout>
      <div
        style={{
          flexGrow: 1,
          padding: '0 0 40px 0',
          display: 'flex',
          flexDirection: 'column',
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
    </Layout>
  );
}
