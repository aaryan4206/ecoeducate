import React, { useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import "./../styles/News.css";

const FILTERS = [
  { key: "all", label: "All", terms: [] },
  { key: "heat", label: "Heat", terms: ["heat", "hottest", "temperature", "heatwave"] },
  { key: "plastic", label: "Plastic", terms: ["plastic", "microplastic", "polymer"] },
  { key: "deforestation", label: "Deforestation", terms: ["forest", "deforestation", "logging", "amazon"] },
  { key: "ocean", label: "Ocean", terms: ["ocean", "sea", "coral", "marine"] },
  { key: "floods", label: "Floods", terms: ["flood", "rain", "deluge"] },
  { key: "wildfire", label: "Wildfire", terms: ["wildfire", "bushfire", "fire"] },
  { key: "glacier", label: "Glaciers", terms: ["glacier", "ice", "greenland", "arctic"] },
  { key: "air", label: "Air", terms: ["air", "pollution", "smog"] },
];

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summaries, setSummaries] = useState({});
  const [loadingSummaryKey, setLoadingSummaryKey] = useState("");

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [nextRefreshIn, setNextRefreshIn] = useState(30 * 60); // seconds
  const intervalRef = useRef(null);
  const tickRef = useRef(null);

  const endpoint = "https://ecoeducate.vercel.app/api/gemini/content";

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "headlines" }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response from server: ${text}`);
      }
      if (!res.ok) throw new Error(data.error || `Server responded with ${res.status}`);
      setArticles(Array.isArray(data) ? data : []);
      setSummaries({}); // reset cached summaries on refresh
      setNextRefreshIn(30 * 60);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (headline) => {
    if (summaries[headline]) {
      // toggle hide on second click
      setSummaries(prev => {
        const copy = { ...prev };
        delete copy[headline];
        return copy;
      });
      return;
    }
    setLoadingSummaryKey(headline);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "summary", headline }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch summary.");
      setSummaries(prev => ({ ...prev, [headline]: data.summary }));
    } catch (e) {
      setSummaries(prev => ({ ...prev, [headline]: "Failed to generate summary." }));
    } finally {
      setLoadingSummaryKey("");
    }
  };

  // Initial load + 30‑min refresh
  useEffect(() => {
    fetchHeadlines();
    intervalRef.current = setInterval(fetchHeadlines, 30 * 60 * 1000);
    tickRef.current = setInterval(() => setNextRefreshIn(s => Math.max(0, s - 1)), 1000);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(tickRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filter = FILTERS.find(f => f.key === activeFilter) || FILTERS[0];
    return articles.filter(({ title }) => {
      const t = (title || "").toLowerCase();
      const matchQuery = !q || t.includes(q);
      const matchFilter =
        filter.key === "all" || filter.terms.some(term => t.includes(term));
      return matchQuery && matchFilter;
    });
  }, [articles, query, activeFilter]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!articles.length) return <div className="error-message">No news found.</div>;

  return (
    <section className="news-section">
      <header className="news-header">
        <div>
          <h1>Latest Environmental News 🌱</h1>
          <p className="subhead">
            Auto-refresh in {Math.floor(nextRefreshIn / 60)}m {nextRefreshIn % 60}s
          </p>
        </div>
        <div className="actions">
          <div className="search">
            <input
              aria-label="Search headlines"
              placeholder="Search headlines..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="refresh-btn" onClick={fetchHeadlines}>Refresh</button>
        </div>
      </header>

      <div className="filter-row">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`chip ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="news-container">
        {filtered.map(({ title }, i) => {
          const isLoading = loadingSummaryKey === title;
          const hasSummary = !!summaries[title];
          return (
            <article
              key={i}
              className={`news-article ${hasSummary ? "expanded" : ""}`}
              onClick={() => fetchSummary(title)}
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fetchSummary(title)}
              aria-label={`News item: ${title}`}
            >
              <div className="left-accent" />
              <div className="news-content">
                <h3>{title.replace(/^\*\s*/, "")}</h3>
                {!hasSummary && !isLoading && (
                  <p className="click-prompt">Click to generate a quick summary</p>
                )}
                {isLoading && (
                  <div className="shimmer">
                    <div />
                    <div />
                    <div />
                  </div>
                )}
                {hasSummary && <p className="summary-text">{summaries[title]}</p>}
                <div className="badges">
                  <span className="badge">AI</span>
                  <span className="badge secondary">Summary</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default News;
