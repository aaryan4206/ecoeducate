import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import "./../styles/News.css";

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:4000/api/gemini/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "headlines" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch headlines.");
      }

      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching headlines:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (headline) => {
    if (summaries[headline]) return;

    setSummaryLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/gemini/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "summary", headline }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch summary.");
      }

      setSummaries(prev => ({ ...prev, [headline]: data.summary }));
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummaries(prev => ({ ...prev, [headline]: "Failed to generate summary." }));
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadlines();
    const intervalId = setInterval(fetchHeadlines, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div>No recent environmental news found.</div>;
  }

  return (
    <section className="news-section">
      <h1>Latest Environmental News 🌱</h1>
      <div className="news-container">
        {articles.map(({ title }, index) => (
          <div
            key={index}
            className="news-article"
            onClick={() => fetchSummary(title)}
          >
            <div className="news-content">
              <h3>{title}</h3>
              {summaries[title] ? (
                <p className="summary-text">{summaries[title]}</p>
              ) : summaryLoading ? (
                <p>Generating summary...</p>
              ) : (
                <p className="click-prompt">Click for a quick summary.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default News;