import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import LoadingSpinner from "./LoadingSpinner";
import "./../styles/Dashboard.css";
import { FaCrown } from "react-icons/fa";

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [ecoPoints, setEcoPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dashboard Leaderboard + News state
  const [topUsers, setTopUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingCards, setLoadingCards] = useState({ lb: true, news: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "eco-points", user.uid);
        const snap = await getDoc(docRef);
        const data = snap.data();
        setUserName(data?.name || user.displayName || user.email || "User");
        setEcoPoints(data?.eco_points ?? 0);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch top users (same source as Leaderboard page)
  useEffect(() => {
    async function fetchTop() {
      try {
        const q = query(collection(db, "eco-points"), orderBy("eco_points", "desc"), limit(5));
        const qs = await getDocs(q);
        const arr = [];
        qs.forEach(d => {
          const v = d.data();
          arr.push({ id: d.id, name: v.name || "Anonymous", ecoPoints: v.eco_points || 0 });
        });
        setTopUsers(arr);
      } catch (e) {
        console.error("Dashboard leaderboard fetch error:", e);
      } finally {
        setLoadingCards(s => ({ ...s, lb: false }));
      }
    }
    fetchTop();
  }, []);

  // Fetch headlines (same endpoint as News page), limit to 5
  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const res = await fetch("http://localhost:4000/api/gemini/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "headlines" }),
        });
        const text = await res.text();
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.error || `Status ${res.status}`);
        const titles = (Array.isArray(data) ? data : []).slice(0, 5).map(x => x.title?.replace(/^\*\s*/, "") || "");
        setNews(titles);
      } catch (e) {
        console.error("Dashboard news fetch error:", e);
        setNews([]);
      } finally {
        setLoadingCards(s => ({ ...s, news: false }));
      }
    }
    fetchHeadlines();
  }, []);

  if (loading) return <LoadingSpinner />;

  const goal = 100;
  const progress = Math.min((ecoPoints / goal) * 100, 100);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card welcome-card">
        <h1>
          Welcome, <span>{userName}</span> 👋
        </h1>
        <p>Let’s make today more eco-friendly 🌱</p>
      </div>

      <div className="dashboard-grid">
        {/* Eco Points */}
        <div className="dashboard-card points-card">
          <h2>Your Eco Points</h2>
          <p className="points">{ecoPoints}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
          <p className="goal-text">Goal: {goal} Points</p>
        </div>

        {/* Leaderboard preview (matches Leaderboard page) */}
        <div className="dashboard-card leaderboard-mini">
          <div className="lb-header">
            <div className="lb-title">
              <FaCrown className="lb-icon" />
              <h2>Leaderboard</h2>
            </div>
            <span className="lb-sub">Top 5</span>
          </div>
          {loadingCards.lb ? (
            <ul className="lb-list skeleton">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i}><span /><span /></li>
              ))}
            </ul>
          ) : (
            <ul className="lb-list">
              {topUsers.map((u, i) => (
                <li key={u.id}>
                  <span className="rank">{i + 1 < 4 ? ["🥇","🥈","🥉"][i] || i + 1 : i + 1}</span>
                  <span className="name">{u.name}</span>
                  <span className="pts">{u.ecoPoints}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Eco News preview (matches News section, limited to 5) */}
        <div className="dashboard-card news-mini">
          <h2>Eco News</h2>
          {loadingCards.news ? (
            <ul className="news-list skeleton">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i}><span /></li>
              ))}
            </ul>
          ) : (
            <ul className="news-list">
              {news.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Challenges (unchanged) */}
        <div className="dashboard-card challenges-card">
          <h2>Upcoming Challenges</h2>
          <ul>
            <li>No-Plastic Week 🛍️</li>
            <li>Bike-to-School Challenge 🚴</li>
            <li>Zero Food Waste Day 🍽️</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
