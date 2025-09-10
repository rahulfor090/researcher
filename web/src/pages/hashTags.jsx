import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Use BASE_API_URL directly for API calls
const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
import { colors, gradients, shadows } from "../theme";

export default function HashTags() {
  const [hashtags, setHashtags] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const loadTags = async () => {
      try {
        // Fetch hashtags with article counts using BASE_API_URL
        const response = await fetch(`${BASE_API_URL}/tag/tags`);
        const data = await response.json();
        setHashtags(data.tags || []);
        setFiltered(data.tags || []);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error("Failed to fetch hashtags:", error);
      }
    };
    loadTags();
  }, []);

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

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: gradients.app,
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Background */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `radial-gradient(circle at 25% 75%, rgba(13, 148, 136, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 75% 25%, rgba(249, 115, 22, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 70%)`,
          animation: "libraryFloat 30s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* Left Navigation Sidebar */}
      <div
        style={{
          width: "280px",
          background: gradients.sidebar,
          color: "white",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          boxShadow: shadows.medium,
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
          position: "relative",
          animation: "slideInLeft 0.6s ease-out",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "16px",
            color: "#e5e7eb",
            animation: "fadeInDown 0.8s ease-out 0.2s both",
          }}
        >
          Research Locker
        </h1>
        <nav style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { label: "Dashboard", icon: "🏠", path: "/" },
              { label: "Library", icon: "📚", path: "/library" },
              { label: "HashTags", icon: "🗂️", path: "/hashtags" },
            ].map(({ label, icon, path }, index) => (
              <li
                key={label}
                style={{
                  padding: "10px 12px",
                  color: "#cbd5e1",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  animation: `fadeInLeft 0.6s ease-out ${
                    0.8 + index * 0.1
                  }s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateX(8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => {
                  if (path) nav(path);
                }}
              >
                <span style={{ width: 20, textAlign: "center" }}>{icon}</span>
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
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
          animation: "fadeInRight 0.6s ease-out 0.3s both",
          overflowY: "auto",
        }}
      >
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

        {/* Search Box */}
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

        {/* Masonry Layout for Hashtags */}
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
                onClick={() => nav(`/hashtags/${tag.id}`)}
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