import React, { useEffect, useState } from "react";
import { api } from "../api";
import Layout from "../components/Layout";
import { colors, gradients, shadows } from "../theme";
//import "./hashtags.css";
import { useNavigate } from "react-router-dom";
// Use BASE_API_URL directly for API calls
const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


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
    </Layout>
  );
}