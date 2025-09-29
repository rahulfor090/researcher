import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { colors, shadows } from "../theme";
import { useNavigate } from "react-router-dom";
const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function HashTags() {
  const [hashtags, setHashtags] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagArticles, setTagArticles] = useState([]);
  const nav = useNavigate();

  const token = localStorage.getItem("token") || "";

  const fetchWithAuth = async (url) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error: ${res.status} - ${text}`);
    }
    return res.json();
  };

  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchWithAuth(`${BASE_API_URL}/v1/tag/tags`);
        const allTags = data.tags || [];
        setHashtags(allTags);
        setFiltered(allTags);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("Failed to fetch hashtags:", error);
      }
    };
    if (token) {
      loadTags();
    }
  }, [token]);

  useEffect(() => {
    if (!search) {
      setFiltered(hashtags);
    } else {
      setFiltered(
        hashtags.filter((tag) =>
          tag.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, hashtags]);

  const handleTagClick = async (tag) => {
    setSelectedTag(tag);
    setTagArticles([]);
    try {
      const data = await fetchWithAuth(`${BASE_API_URL}/v1/tag/tags/${tag.id}/articles`);
      setTagArticles(data.articles || []);
    } catch (error) {
      console.error("Failed to fetch articles for tag:", error);
      setTagArticles([]);
    }
  };

  // Redirect to ArticleDetails page for the article id
  const handleArticleClick = (articleId) => {
    nav(`/articles/${articleId}`);
  };

  return (
    <Layout>
      <div
        style={{
          flexGrow: 1,
          padding: "0 0 40px 0",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {!selectedTag ? (
          <>
            <div
              style={{
                marginBottom: "30px",
                animation: "fadeInDown 0.8s ease-out 0.5s both",
              }}
            >
              <h2
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  color: "#1f2937",
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                  background: "linear-gradient(135deg, #1f2937, #4b5563)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                🗂️ All Hashtags
              </h2>
              <p
                style={{
                  color: colors.mutedText,
                  fontSize: "1rem",
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Search and browse all hashtags found in your research database
              </p>
            </div>
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                animation: "fadeInDown 0.7s ease-out 0.6s both",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Search hashtags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`,
                  fontSize: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                  background: "#f8fafc",
                  color: colors.primaryText,
                  outline: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "border 0.2s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.border = `1.5px solid ${colors.link}`)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.border = `1px solid ${colors.border}`)
                }
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: colors.mutedText,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                  title="Clear search"
                >
                  ✖
                </button>
              )}
            </div>
            <div
              style={{
                columnCount: 3,
                columnGap: "20px",
                animation: "fadeInUp 0.8s ease-out 0.8s both",
                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                opacity: isLoaded ? 1 : 0,
              }}
            >
              {filtered.length === 0 ? (
                <p style={{ color: colors.mutedText, textAlign: "center" }}>
                  No hashtags found.
                </p>
              ) : (
                filtered.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => handleTagClick(tag)}
                    style={{
                      breakInside: "avoid",
                      background: "#fff",
                      borderRadius: "16px",
                      boxShadow: shadows.soft,
                      padding: "20px",
                      marginBottom: "20px",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = shadows.soft;
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: colors.primaryText,
                        marginBottom: "8px",
                        userSelect: "text",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                        hyphens: "auto",
                      }}
                    >
                      #{tag.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: colors.mutedText,
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        userSelect: "text",
                      }}
                    >
                      {tag.articleCount ?? 0} article
                      {tag.articleCount === 1 ? "" : "s"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div style={{ marginTop: "40px", animation: "fadeInDown 0.7s" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "6px",
              width: "100%",
              maxWidth: "1100px"
            }}>
              <div>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#20274a",
                    letterSpacing: "-0.02em",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "linear-gradient(135deg, #16213e, #4b5563)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <span role="img" aria-label="tag" style={{fontSize: "2.3rem"}}>📁</span>
                  Articles tagged with <span style={{fontWeight:"800"}}>#{selectedTag.name}</span>
                </h2>
                <p style={{
                  color: colors.mutedText,
                  fontSize: "1.1rem",
                  margin: "0 0 0 0"
                }}>
                  Browse all articles associated with this hashtag
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setTagArticles([]);
                }}
                style={{
                  background: colors.link,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 22px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
              >
                ← Back to hashtags
              </button>
            </div>
            <div
              style={{
                background: "linear-gradient(90deg, #f8fafc 85%, #fdf6f0 100%)",
                borderRadius: "18px",
                boxShadow: "0 4px 18px 0 rgba(60,60,100,0.07)",
                padding: "12px 0 12px 0",
                marginBottom: "32px",
                marginTop: "8px",
                width: "100%",
                maxWidth: "1100px"
              }}
            >
              <table style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0",
                fontSize: "1.08rem",
                fontWeight: 400,
                background: "transparent"
              }}>
                <thead>
                  <tr style={{
                    background: "transparent",
                    color: "#222",
                    fontWeight: 700
                  }}>
                    <th style={{padding: "10px 22px 10px 20px", textAlign: "left"}}>S.No</th>
                    <th style={{padding: "10px 22px", textAlign: "left"}}>Title</th>
                    <th style={{padding: "10px 22px", textAlign: "left"}}>DOI</th>
                    <th style={{padding: "10px 22px", textAlign: "left"}}>Authors</th>
                  </tr>
                </thead>
                <tbody>
                  {tagArticles.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", color: colors.mutedText }}>
                        No articles found for this hashtag.
                      </td>
                    </tr>
                  ) : (
                    tagArticles.map((article, idx) => (
                      <tr
                        key={article.id}
                        style={{
                          background: idx % 2 === 0 ? "#fff" : "#f8fafc",
                          cursor: "pointer"
                        }}
                        onClick={() => handleArticleClick(article.id)}
                        title="View details"
                      >
                        <td style={{
                          padding: "12px 22px 12px 20px",
                          color: "#2a76ff",
                          fontWeight: 700
                        }}>{idx + 1}</td>
                        <td style={{
                          padding: "12px 22px",
                          color: "#20274a",
                          fontWeight: 500,
                          maxWidth: "380px"
                        }}>
                          {article.title || article.file_name}
                        </td>
                        <td style={{
                          padding: "12px 22px",
                          color: "#14b8a6",
                          fontWeight: 500,
                          wordBreak: "break-word"
                        }}>
                          {article.doi ? (
                            <a href={`https://doi.org/${article.doi}`} style={{color: "#14b8a6"}} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              {article.doi}
                            </a>
                          ) : ''}
                        </td>
                        <td style={{
                          padding: "12px 22px",
                          color: "#222",
                          fontWeight: 400,
                          maxWidth: "500px"
                        }}>
                          {article.authors}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}