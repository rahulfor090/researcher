import React, { useEffect, useState } from "react";
import { api } from "../api";
import { colors, shadows } from "../theme";
import Layout from "../components/Layout";
import "./hashtags.css";

export default function HashTags() {
  const [hashtags, setHashtags] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTags = async () => {
      try {
        // Updated endpoint: must match your backend route in tag.js!
        const { data } = await api.get("/tag/tags");
        console.log('Fetched tags:', data);
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
      <div className="hashtags-page">
        <div className="hashtags-header">
          <h2 className="hashtags-title">🗂️ All Hashtags</h2>
          <p className="hashtags-subtitle">Search and browse all hashtags found in your research database</p>
        </div>

        <div className="hashtags-search">
          <input
            type="text"
            placeholder="🔍 Search hashtags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="hashtags-input"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="hashtags-clear"
              title="Clear search"
            >
              ✖
            </button>
          )}
        </div>

        <div className={`hashtags-card ${isLoaded ? 'in' : ''}`} style={{ boxShadow: shadows.soft }}>
          <h3 className="hashtags-count">{filtered.length} Hashtag{filtered.length !== 1 ? 's' : ''}</h3>
          <table className="hashtags-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Hashtag</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={2} className="hashtags-empty">No hashtags found.</td>
                </tr>
              ) : (
                filtered.map((tag, idx) => (
                  <tr key={tag.id}>
                    <td className="hashtags-serial">{idx + 1}</td>
                    <td className="hashtags-name">#{tag.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}